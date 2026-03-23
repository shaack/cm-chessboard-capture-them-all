#!/usr/bin/env node

import {createRequire} from "module"
import {spawn, execSync} from "child_process"
import {mkdirSync, rmSync, readdirSync} from "fs"
import {LEVELS} from "../src/level-sets/level-set-2-2026-02-15.js"

const require = createRequire("/opt/homebrew/lib/node_modules/")
const puppeteer = require("puppeteer")

const PORT = 8084
const URL = `http://localhost:${PORT}`
const FRAME_DIR = "/tmp/cover-video-frames"
const FPS = 30
const OUTPUT = "assets/cover-video-landscape.mp4"

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

// --- Frame capture ---

let frameCount = 0

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

const FRAME_INTERVAL = 1000 / FPS // ~33ms per frame

async function captureWithDelay(page, ms) {
    const frames = Math.round((ms / 1000) * FPS)
    for (let i = 0; i < frames; i++) {
        const start = Date.now()
        const path = `${FRAME_DIR}/frame_${String(frameCount).padStart(5, "0")}.png`
        await page.screenshot({path, type: "png"})
        frameCount++
        // Wait remaining time so each frame spans ~33ms of real time
        const elapsed = Date.now() - start
        const remaining = FRAME_INTERVAL - elapsed
        if (remaining > 0) await delay(remaining)
    }
}

// --- Solve a level while capturing frames ---

async function solveAndCapture(page, fen) {
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
        await delay(50)
    }
    // Initial auto-select delay
    await delay(300)

    // Capture the initial board state — let viewers see the puzzle
    await captureWithDelay(page, 1200)

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

        // Pause before each capture — like a player thinking
        await captureWithDelay(page, 400)

        // Click the target
        await page.click(`[data-square="${targetSquare}"]`)

        // Capture the move animation
        await captureWithDelay(page, 500)
    }

    // Capture the win celebration (confetti)
    await captureWithDelay(page, 1800)
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
    // Clean up and create frame directory
    rmSync(FRAME_DIR, {recursive: true, force: true})
    mkdirSync(FRAME_DIR, {recursive: true})

    console.log("Starting server...")
    const server = await startServer()

    try {
        const browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1})
        // No __testSpeedUp — let animations play at normal speed

        // Set up game state: tutorial done, sound off, all levels unlocked
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

        // Pick visually interesting levels (moderate piece counts, different piece types)
        const levelsToPlay = [
            {group: "Rook", level: 4},
            {group: "Knight", level: 3},
        ]

        for (let li = 0; li < levelsToPlay.length; li++) {
            const {group, level} = levelsToPlay[li]
            const fen = LEVELS[group][level]
            console.log(`Recording ${group} Level ${level + 1}...`)

            // Navigate: Menu → Level Select → Pick level
            await page.waitForSelector("#menuLevelSelect")
            await page.click("#menuLevelSelect")
            await page.waitForSelector(".level-tile")
            await delay(500)

            await page.click(`a.level-tile[data-group="${group}"][data-level="${level}"]`)
            await page.waitForSelector("[data-square]")
            await delay(500)

            await solveAndCapture(page, fen)

            // Wait for level solved dialog
            await page.waitForSelector(".level-solved-overlay", {timeout: 10000})
            await captureWithDelay(page, 500)

            // Click Exit to go back to level select, then back to menu
            const buttons = await page.$$(".level-solved-buttons button")
            await buttons[1].click() // Exit
            await delay(300)
            await page.waitForSelector("#levelSelectBack")
            await page.click("#levelSelectBack")
            await delay(300)

            if (li === levelsToPlay.length - 1) {
                // Extra frames at end
                await captureWithDelay(page, 500)
            }
        }

        await browser.close()

        // Combine frames into video with ffmpeg
        const totalFrames = readdirSync(FRAME_DIR).filter(f => f.endsWith(".png")).length
        const duration = (totalFrames / FPS).toFixed(1)
        console.log(`\nCaptured ${totalFrames} frames (${duration}s at ${FPS}fps)`)
        console.log("Encoding video...")

        execSync([
            "ffmpeg", "-y",
            "-framerate", String(FPS),
            "-i", `${FRAME_DIR}/frame_%05d.png`,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-crf", "18",
            "-an",
            OUTPUT
        ].join(" "), {stdio: "inherit"})

        console.log(`\nSaved ${OUTPUT}`)

        // Show file info
        execSync(`ffprobe -v quiet -show_entries format=duration,size -of default=noprint_wrappers=1 ${OUTPUT}`, {stdio: "inherit"})

    } finally {
        server.kill()
        rmSync(FRAME_DIR, {recursive: true, force: true})
    }
}

run().catch(err => {
    console.error("Error:", err.message)
    process.exit(1)
})
