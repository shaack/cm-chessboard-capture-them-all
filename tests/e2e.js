#!/usr/bin/env node

import {createRequire} from "module"
import {spawn} from "child_process"
import {LEVELS} from "../src/level-sets/level-set-3-2026-03-28.js"

const require = createRequire("/opt/homebrew/lib/node_modules/")
const puppeteer = require("puppeteer")

// --- Inline solver (from tools/level-tool.js) ---

function fileOf(sq) { return sq.charCodeAt(0) - 97 }
function rankOf(sq) { return parseInt(sq[1]) - 1 }
function toSquare(file, rank) { return String.fromCharCode(file + 97) + (rank + 1) }

function parseFen(fen) {
    const m = fen.match(/^(.*?)\s*\((.+)\)\s*$/)
    if (m) fen = m[1].trim()
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

function getWhitePieces(board) {
    const pieces = []
    for (const [sq, piece] of board) { if (piece[0] === "w") pieces.push(sq) }
    return pieces
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
    if (getWhitePieces(board).length === 0) return [[]]
    const black = getBlackPiece(board)
    if (!black) return []
    const validate = validators[black.type]
    const captures = []
    for (const sq of getWhitePieces(board))
        if (validate(board, black.square, sq)) captures.push(sq)
    if (captures.length === 0) return []
    const solutions = []
    for (const target of captures) {
        const next = new Map(board)
        const capturedType = next.get(target)[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
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
    const moves = result.solutions[0]
    // Wait for the board position to be set (first target must have a white piece on the piece layer)
    for (let i = 0; i < 50; i++) {
        const found = await page.evaluate(sq => {
            const el = document.querySelector(`g[data-square="${sq}"][data-piece]`)
            return el ? el.getAttribute("data-piece") : null
        }, moves[0])
        if (found && found.startsWith("w")) break
        await delay(100)
    }
    // Wait for the black piece to be auto-selected (initial)
    await delay(300)
    for (let i = 0; i < moves.length; i++) {
        const targetSquare = moves[i]
        await page.click(`[data-square="${targetSquare}"]`)
        if (i < moves.length - 1) {
            // Wait for the black piece to arrive at the captured square (animation complete)
            for (let j = 0; j < 50; j++) {
                const arrived = await page.evaluate(sq => {
                    const el = document.querySelector(`g[data-square="${sq}"][data-piece]`)
                    return el ? el.getAttribute("data-piece") : null
                }, targetSquare)
                if (arrived && arrived.startsWith("b")) break
                await delay(50)
            }
            // Wait for autoSelectBlackPiece to complete
            await delay(200)
        }
    }
}

// --- Test 1: Sequential play through all 40 levels ---

async function testSequential(page) {
    console.log("\nTest 1: Sequential play through all levels")
    console.log("-".repeat(50))

    await page.goto(URL)
    await page.evaluate(() => {
        localStorage.clear()
        localStorage.setItem("tutorialCompleted", "true")
    })
    await page.reload({waitUntil: "networkidle0"})

    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click('a.level-tile[data-group="Introduction"][data-level="0"]')
    await page.waitForSelector("[data-square]")
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
                await delay(500)
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
    const lastIntroLevel = LEVELS["Introduction"].length - 1
    beatenLevels["Introduction"] = lastIntroLevel // all Introduction levels beaten except the last one

    await page.goto(URL)
    await page.evaluate((bl) => {
        localStorage.clear()
        localStorage.setItem("beatenLevels", JSON.stringify(bl))
        localStorage.setItem("levelGroupName", JSON.stringify("Introduction"))
        localStorage.setItem("level", JSON.stringify(0))
        localStorage.setItem("MenuCheckpoint", JSON.stringify("game"))
        localStorage.setItem("tutorialCompleted", "true")
    }, beatenLevels)
    await page.reload({waitUntil: "networkidle0"})

    // Navigate to last Introduction level via level select
    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click(`a.level-tile[data-group="Introduction"][data-level="${lastIntroLevel}"]`)
    await page.waitForSelector("[data-square]")
    await delay(300)

    // Solve the last Introduction level (the last missing level overall)
    const fen = LEVELS["Introduction"][lastIntroLevel]
    console.log(`  Solving Introduction Level ${lastIntroLevel + 1} (the last missing level)...`)
    await solveInBrowser(page, fen)

    // Should show congratulations, not "Level solved" dialog
    await page.waitForSelector(".game-complete-card", {timeout: 10000})
    const text = await page.$eval(".game-complete-card h1", el => el.textContent)
    if (!text.includes("Congratulations")) {
        throw new Error(`Expected "Congratulations" but got "${text}"`)
    }
    console.log(`  Introduction Level ${lastIntroLevel + 1} ✓  — GAME COMPLETE!`)
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
        localStorage.setItem("levelGroupName", JSON.stringify("Introduction"))
        localStorage.setItem("level", JSON.stringify(0))
        localStorage.setItem("MenuCheckpoint", JSON.stringify("game"))
        localStorage.setItem("tutorialCompleted", "true")
    }, beatenLevels)
    await page.reload({waitUntil: "networkidle0"})

    // Navigate to Introduction level 1 (already beaten)
    await page.waitForSelector("#menuLevelSelect")
    await page.click("#menuLevelSelect")
    await page.waitForSelector(".level-tile")
    await delay(300)
    await page.click('a.level-tile[data-group="Introduction"][data-level="0"]')
    await page.waitForSelector("[data-square]")
    await delay(300)

    // Solve Introduction level 1
    const fen = LEVELS["Introduction"][0]
    console.log(`  Re-solving Introduction Level 1 (already beaten)...`)
    await solveInBrowser(page, fen)

    // Should show "Level solved" dialog, NOT congratulations
    await page.waitForSelector(".level-solved-overlay", {timeout: 10000})
    const hasGameComplete = await page.$(".game-complete-card")
    if (hasGameComplete) {
        throw new Error("Congratulations screen should NOT appear when re-solving a beaten level")
    }
    console.log(`  Introduction Level 1 ✓  — "Level solved" dialog shown (correct)`)
    console.log(`\n✓ Test 3 passed: No congratulations on re-solve.`)
}

// --- Test 4: Quick smoke test (2 levels per piece type) ---

async function testQuick(page) {
    console.log("\nTest 4: Quick smoke test (12 levels)")
    console.log("-".repeat(50))

    await page.goto(URL)
    await page.evaluate(() => {
        localStorage.clear()
        localStorage.setItem("tutorialCompleted", "true")
        // Unlock all levels for direct access
        localStorage.setItem("beatenLevels", JSON.stringify({
            Introduction: 999, Rook: 999, Bishop: 999, Knight: 999, Queen: 999, Multi: 999
        }))
    })
    await page.reload({waitUntil: "networkidle0"})

    const groups = Object.keys(LEVELS)
    let solved = 0
    for (const group of groups) {
        const testLevels = [0, LEVELS[group].length - 1] // first and last
        for (const lvl of testLevels) {
            await page.waitForSelector("#menuLevelSelect")
            await page.click("#menuLevelSelect")
            await page.waitForSelector(".level-tile")
            await delay(300)
            await page.click(`a.level-tile[data-group="${group}"][data-level="${lvl}"]`)
            await page.waitForSelector("[data-square]")
            await delay(300)

            const fen = LEVELS[group][lvl]
            await solveInBrowser(page, fen)
            await page.waitForSelector(".level-solved-overlay", {timeout: 10000})
            console.log(`  ${group} Level ${lvl + 1}/${LEVELS[group].length} ✓`)
            solved++

            // Go back to level select via Exit
            const buttons = await page.$$(".level-solved-buttons button")
            await buttons[1].click() // Exit button
            await delay(300)

            // Navigate back to menu for next iteration
            await page.waitForSelector("#levelSelectBack")
            await page.click("#levelSelectBack")
            await delay(300)
        }
    }
    console.log(`\n✓ Test 4 passed: ${solved} levels solved.`)
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

        const testArg = process.argv[2]
        if (testArg === "--quick") {
            await testQuick(page)
        } else {
            await testSequential(page)
            await testLastMissingLevel(page)
            await testResolveNoCongratsAgain(page)
        }

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
