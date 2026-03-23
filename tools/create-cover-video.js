#!/usr/bin/env node

import {createRequire} from "module"
import {spawn} from "child_process"
import {LEVELS} from "../src/level-sets/level-set-2-2026-02-15.js"

const require = createRequire("/opt/homebrew/lib/node_modules/")
const puppeteer = require("puppeteer")

const PORT = 8084
const URL = `http://localhost:${PORT}`

const portrait = process.argv.includes("--portrait")
const OUTPUT = portrait ? "marketing/cover-video-portrait.mp4" : "marketing/cover-video-landscape.mp4"
const VIEWPORT = portrait ? {width: 606, height: 1080} : {width: 1920, height: 1080}

// --- Inline solver (from tests/e2e.js) ---

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
    return solve(board)
}

// --- Helpers ---

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

async function solveAndRecord(page, fen) {
    const solutions = solveLevel(fen)
    if (solutions.length === 0) throw new Error(`No solution for FEN: ${fen}`)
    const moves = solutions[0]

    // Wait for board to be ready
    for (let i = 0; i < 50; i++) {
        const found = await page.evaluate(sq => {
            const el = document.querySelector(`g[data-square="${sq}"][data-piece]`)
            return el ? el.getAttribute("data-piece") : null
        }, moves[0])
        if (found && found.startsWith("w")) break
        await delay(100)
    }
    await delay(300)

    // Show the board for a moment
    await delay(1200)

    for (let i = 0; i < moves.length; i++) {
        const targetSquare = moves[i]

        // Wait for auto-select
        for (let j = 0; j < 50; j++) {
            const arrived = i === 0 ? true : await page.evaluate(sq => {
                const el = document.querySelector(`g[data-square="${sq}"][data-piece]`)
                return el ? el.getAttribute("data-piece") : null
            }, moves[i - 1])
            if (i === 0 || (arrived && arrived.startsWith("b"))) break
            await delay(50)
        }
        if (i > 0) await delay(200)

        // Pause before capture — like a player thinking
        await delay(500)

        // Click the target
        await page.click(`[data-square="${targetSquare}"]`)

        // Let the move animation play
        await delay(600)
    }

    // Let confetti + win celebration play
    await delay(2000)
}

// --- Server ---

function startServer() {
    return new Promise((resolve) => {
        const server = spawn("python3", ["-m", "http.server", String(PORT)], {
            cwd: new globalThis.URL("../", import.meta.url).pathname,
            stdio: ["ignore", "pipe", "pipe"]
        })
        const check = () => {
            fetch(`${URL}/index.html`).then(() => resolve(server)).catch(() => setTimeout(check, 200))
        }
        setTimeout(check, 500)
    })
}

// --- Main ---

async function run() {
    console.log("Starting server...")
    const server = await startServer()

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
            ]
        })
        const page = await browser.newPage()
        await page.setViewport({...VIEWPORT, deviceScaleFactor: 1})
        console.log(`Mode: ${portrait ? "portrait" : "landscape"} (${VIEWPORT.width}x${VIEWPORT.height})`)

        // Set up game state
        await page.goto(URL)
        await page.evaluate(() => {
            localStorage.clear()
            localStorage.setItem("tutorialCompleted", "true")
            localStorage.setItem("soundEnabled", "false")
            localStorage.setItem("musicEnabled", "false")
            localStorage.setItem("beatenLevels", JSON.stringify({
                Rook: 999, Bishop: 999, Knight: 999, Queen: 999, Multi: 999
            }))
        })
        await page.reload({waitUntil: "networkidle0"})

        // Navigate to Rook level 3
        console.log("Recording Rook Level 3 with wrong moves...")
        await page.waitForSelector("#menuLevelSelect")
        await page.click("#menuLevelSelect")
        await page.waitForSelector(".level-tile")
        await delay(500)
        await page.click('a.level-tile[data-group="Rook"][data-level="2"]')
        await page.waitForSelector("[data-square]")
        // Wait for board to fully settle (pieces rendered, animations done)
        await delay(1500)

        // Start screen recording after everything is stable
        console.log("Starting screen recording...")
        const recorder = await page.screencast({
            path: OUTPUT,
            format: "mp4",
            fps: 30,
        })

        // Rook at h5, pawns at c5, c6, c8, h6, h2

        // --- Attempt 1: h5→c5, c5→c6, c6→c8 (stuck, can't reach h6, h2) ---
        await delay(2000)

        await page.click('[data-square="c5"]')
        await delay(1800)

        await page.click('[data-square="c6"]')
        await delay(1500)

        await page.click('[data-square="c8"]')
        await delay(3000)

        // Stuck — restart

        await page.click("#restartButton")
        await delay(1500)

        // --- Attempt 2: h5→h6, h6→c6, c6→c8, c8→c5 (stuck, can't reach h2) ---
        await page.click('[data-square="h6"]')
        await delay(1400)

        await page.click('[data-square="c6"]')
        await delay(1200)

        await page.click('[data-square="c8"]')
        await delay(1700)

        await page.click('[data-square="c5"]')
        await delay(2000)

        // Stuck again

        // Stop recording
        await recorder.stop()
        await browser.close()

        // Re-encode from VP9 to H.264 for compatibility
        const TEMP = OUTPUT + ".tmp.mp4"
        const {execSync} = await import("child_process")
        const {renameSync, unlinkSync} = await import("fs")
        renameSync(OUTPUT, TEMP)
        console.log("Re-encoding to H.264...")
        execSync([
            "ffmpeg", "-y", "-i", TEMP,
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-crf", "16", "-an",
            OUTPUT
        ].join(" "), {stdio: "inherit"})
        unlinkSync(TEMP)
        console.log(`\nSaved ${OUTPUT}`)
        execSync(`ffprobe -v quiet -show_entries format=duration,size -of default=noprint_wrappers=1 ${OUTPUT}`, {stdio: "inherit"})
    } finally {
        server.kill()
    }
}

run().catch(err => {
    console.error("Error:", err.message)
    process.exit(1)
})
