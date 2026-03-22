#!/usr/bin/env node

import {createRequire} from "module"
import {spawn} from "child_process"
import {LEVELS} from "../src/level-sets/level-set-2-2026-02-15.js"

const require = createRequire("/opt/homebrew/lib/node_modules/")
const puppeteer = require("puppeteer")

// --- Inline solver (from tools/level-tool.js) ---

function fileOf(sq) { return sq.charCodeAt(0) - 97 }
function rankOf(sq) { return parseInt(sq[1]) - 1 }
function toSquare(file, rank) { return String.fromCharCode(file + 97) + (rank + 1) }

function parseFen(fen) {
    const board = new Map()
    const rows = fen.split(" ")[0].split("/")
    for (let r = 0; r < 8; r++) {
        const rank = 7 - r
        let file = 0
        for (const ch of rows[r]) {
            if (ch >= "1" && ch <= "8") { file += parseInt(ch) }
            else {
                const color = ch === ch.toUpperCase() ? "w" : "b"
                board.set(toSquare(file, rank), color + ch.toLowerCase())
                file++
            }
        }
    }
    return board
}

function getBlackPiece(board) {
    for (const [sq, piece] of board) {
        if (piece[0] === "b") return {square: sq, type: piece[1]}
    }
    return null
}

function getWhitePawns(board) {
    const pawns = []
    for (const [sq, piece] of board) { if (piece === "wp") pawns.push(sq) }
    return pawns
}

function isValidRookMove(board, from, to) {
    const ff = fileOf(from), rf = rankOf(from), ft = fileOf(to), rt = rankOf(to)
    if (ff === ft) {
        for (let r = Math.min(rf, rt) + 1; r < Math.max(rf, rt); r++)
            if (board.has(toSquare(ff, r))) return false
        return true
    }
    if (rf === rt) {
        for (let f = Math.min(ff, ft) + 1; f < Math.max(ff, ft); f++)
            if (board.has(toSquare(f, rf))) return false
        return true
    }
    return false
}

function isValidBishopMove(board, from, to) {
    const ff = fileOf(from), rf = rankOf(from), ft = fileOf(to), rt = rankOf(to)
    const fd = ft - ff, rd = rt - rf
    if (Math.abs(fd) !== Math.abs(rd) || fd === 0) return false
    const fs = fd > 0 ? 1 : -1, rs = rd > 0 ? 1 : -1
    for (let i = 1; i < Math.abs(fd); i++)
        if (board.has(toSquare(ff + i * fs, rf + i * rs))) return false
    return true
}

function isValidKnightMove(_board, from, to) {
    const fd = Math.abs(fileOf(from) - fileOf(to)), rd = Math.abs(rankOf(from) - rankOf(to))
    return (fd === 1 && rd === 2) || (fd === 2 && rd === 1)
}

function isValidQueenMove(board, from, to) {
    return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to)
}

const validators = {r: isValidRookMove, b: isValidBishopMove, n: isValidKnightMove, q: isValidQueenMove}

function solve(board) {
    if (getWhitePawns(board).length === 0) return [[]]
    const black = getBlackPiece(board)
    if (!black) return []
    const validate = validators[black.type]
    const captures = []
    for (const sq of getWhitePawns(board))
        if (validate(board, black.square, sq)) captures.push(sq)
    if (captures.length === 0) return []
    const solutions = []
    for (const target of captures) {
        const next = new Map(board)
        next.set(target, next.get(black.square))
        next.delete(black.square)
        for (const sub of solve(next)) solutions.push([target, ...sub])
    }
    return solutions
}

function solveLevel(fen) {
    const board = parseFen(fen)
    const black = getBlackPiece(board)
    return {piece: black, solutions: solve(board)}
}

// --- Test runner ---

const PORT = 8081
const URL = `http://localhost:${PORT}`

function startServer() {
    return new Promise((resolve) => {
        const server = spawn("python3", ["-m", "http.server", String(PORT)], {
            cwd: new globalThis.URL("../", import.meta.url).pathname,
            stdio: ["ignore", "pipe", "pipe"]
        })
        // Wait for server to be ready
        const check = () => {
            fetch(URL).then(() => resolve(server)).catch(() => setTimeout(check, 200))
        }
        setTimeout(check, 500)
    })
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

// --- Helper: solve a level in the browser ---

async function solveInBrowser(page, fen) {
    const result = solveLevel(fen)
    if (result.solutions.length === 0) throw new Error(`No solution for FEN: ${fen}`)
    for (const targetSquare of result.solutions[0]) {
        await delay(100)
        await page.click(`[data-square="${targetSquare}"]`)
    }
}

// --- Test 1: Sequential play through all 40 levels ---

async function testSequential(page) {
    console.log("\nTest 1: Sequential play through all levels")
    console.log("-".repeat(50))

    await page.goto(URL)
    await page.evaluate(() => localStorage.clear())
    await page.reload({waitUntil: "networkidle0"})

    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click('a.level-tile[data-group="Rook"][data-level="0"]')
    await page.waitForSelector(".board")
    await delay(300)

    const groups = Object.keys(LEVELS)
    let totalLevels = 0
    for (const group of groups) {
        for (let lvl = 0; lvl < LEVELS[group].length; lvl++) {
            totalLevels++
            const fen = LEVELS[group][lvl]
            await solveInBrowser(page, fen)

            const isLastLevel = group === groups[groups.length - 1] && lvl === LEVELS[group].length - 1

            if (isLastLevel) {
                await page.waitForSelector(".game-complete-card", {timeout: 10000})
                console.log(`  ${group} Level ${lvl + 1}/${LEVELS[group].length} ✓  — GAME COMPLETE!`)
            } else {
                await page.waitForSelector(".level-solved-overlay", {timeout: 10000})
                const buttons = await page.$$(".level-solved-buttons button")
                await buttons[2].click()
                await delay(300)
                console.log(`  ${group} Level ${lvl + 1}/${LEVELS[group].length} ✓`)
            }
        }
    }
    console.log(`\n✓ Test 1 passed: All ${totalLevels} levels solved sequentially.`)
}

// --- Test 2: Complete last missing level triggers congratulations ---

async function testLastMissingLevel(page) {
    console.log("\nTest 2: Completing last missing level (non-sequential)")
    console.log("-".repeat(50))

    // Pre-set all levels as beaten except the last Rook level
    const beatenLevels = {}
    for (const group of Object.keys(LEVELS)) {
        beatenLevels[group] = LEVELS[group].length
    }
    const lastRookLevel = LEVELS["Rook"].length - 1
    beatenLevels["Rook"] = lastRookLevel // all Rook levels beaten except the last one

    await page.goto(URL)
    await page.evaluate((bl) => {
        localStorage.clear()
        localStorage.setItem("beatenLevels", JSON.stringify(bl))
        localStorage.setItem("levelGroupName", JSON.stringify("Rook"))
        localStorage.setItem("level", JSON.stringify(0))
        localStorage.setItem("MenuCheckpoint", JSON.stringify("game"))
    }, beatenLevels)
    await page.reload({waitUntil: "networkidle0"})

    // Navigate to last Rook level via level select
    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click(`a.level-tile[data-group="Rook"][data-level="${lastRookLevel}"]`)
    await page.waitForSelector(".board")
    await delay(300)

    // Solve the last Rook level (the last missing level overall)
    const fen = LEVELS["Rook"][lastRookLevel]
    console.log(`  Solving Rook Level ${lastRookLevel + 1} (the last missing level)...`)
    await solveInBrowser(page, fen)

    // Should show congratulations, not "Level solved" dialog
    await page.waitForSelector(".game-complete-card", {timeout: 10000})
    const text = await page.$eval(".game-complete-card h1", el => el.textContent)
    if (!text.includes("Congratulations")) {
        throw new Error(`Expected "Congratulations" but got "${text}"`)
    }
    console.log(`  Rook Level ${lastRookLevel + 1} ✓  — GAME COMPLETE!`)
    console.log(`\n✓ Test 2 passed: Congratulations shown after last missing level.`)
}

// --- Test 3: Re-solving a level when all are beaten should NOT show congratulations ---

async function testResolveNoCongratsAgain(page) {
    console.log("\nTest 3: Re-solving a beaten level should not show congratulations")
    console.log("-".repeat(50))

    // Pre-set ALL levels as beaten
    const beatenLevels = {}
    for (const group of Object.keys(LEVELS)) {
        beatenLevels[group] = LEVELS[group].length
    }

    await page.goto(URL)
    await page.evaluate((bl) => {
        localStorage.clear()
        localStorage.setItem("beatenLevels", JSON.stringify(bl))
        localStorage.setItem("levelGroupName", JSON.stringify("Rook"))
        localStorage.setItem("level", JSON.stringify(0))
        localStorage.setItem("MenuCheckpoint", JSON.stringify("game"))
    }, beatenLevels)
    await page.reload({waitUntil: "networkidle0"})

    // Navigate to Rook level 1 (already beaten)
    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click('a.level-tile[data-group="Rook"][data-level="0"]')
    await page.waitForSelector(".board")
    await delay(300)

    // Solve Rook level 1
    const fen = LEVELS["Rook"][0]
    console.log(`  Re-solving Rook Level 1 (already beaten)...`)
    await solveInBrowser(page, fen)

    // Should show "Level solved" dialog, NOT congratulations
    await page.waitForSelector(".level-solved-overlay", {timeout: 10000})
    const hasGameComplete = await page.$(".game-complete-card")
    if (hasGameComplete) {
        throw new Error("Congratulations screen should NOT appear when re-solving a beaten level")
    }
    console.log(`  Rook Level 1 ✓  — "Level solved" dialog shown (correct)`)
    console.log(`\n✓ Test 3 passed: No congratulations on re-solve.`)
}

// --- Main ---

async function run() {
    console.log("Starting HTTP server...")
    const serverProcess = await startServer()

    let browser
    let passed = false
    try {
        console.log("Launching browser...")
        browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()
        await page.evaluateOnNewDocument(() => { window.__testSpeedUp = true })

        await testSequential(page)
        await testLastMissingLevel(page)
        await testResolveNoCongratsAgain(page)

        passed = true
    } catch (err) {
        console.error(`\n✗ Test failed: ${err.message}`)
    } finally {
        if (browser) await browser.close()
        serverProcess.kill()
    }

    process.exit(passed ? 0 : 1)
}

run()
