#!/usr/bin/env node

import http from "http"
import fs from "fs"
import path from "path"
import {fileURLToPath} from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PORT = 8081

// --- Level-tool solver (inlined) ---

function fileOf(sq) { return sq.charCodeAt(0) - 97 }
function rankOf(sq) { return parseInt(sq[1]) - 1 }
function toSquare(file, rank) { return String.fromCharCode(file + 97) + (rank + 1) }

function stripLevelText(str) {
    const m = str.match(/^(.*?)\s*\((.+)\)\s*$/)
    return m ? m[1].trim() : str
}

function parseFen(fen) {
    fen = stripLevelText(fen)
    const board = new Map()
    const parts = fen.split(" ")
    const rows = parts[0].split("/")
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

function cloneBoard(board) { return new Map(board) }

function getBlackPiece(board) {
    for (const [sq, piece] of board) {
        if (piece[0] === "b") return {square: sq, type: piece[1]}
    }
    return null
}

function getWhitePieces(board) {
    const pieces = []
    for (const [sq, piece] of board) {
        if (piece[0] === "w") pieces.push({square: sq, type: piece[1]})
    }
    return pieces
}

function isValidRookMove(board, from, to) {
    const ff = fileOf(from), rf = rankOf(from), ft = fileOf(to), rt = rankOf(to)
    if (ff === ft) {
        for (let rank = Math.min(rf, rt) + 1; rank < Math.max(rf, rt); rank++) {
            if (board.has(toSquare(ff, rank))) return false
        }
        return true
    }
    if (rf === rt) {
        for (let file = Math.min(ff, ft) + 1; file < Math.max(ff, ft); file++) {
            if (board.has(toSquare(file, rf))) return false
        }
        return true
    }
    return false
}

function isValidBishopMove(board, from, to) {
    const ff = fileOf(from), rf = rankOf(from), ft = fileOf(to), rt = rankOf(to)
    const fd = ft - ff, rd = rt - rf
    if (Math.abs(fd) !== Math.abs(rd) || fd === 0) return false
    const fs = fd > 0 ? 1 : -1, rs = rd > 0 ? 1 : -1
    for (let i = 1; i < Math.abs(fd); i++) {
        if (board.has(toSquare(ff + i * fs, rf + i * rs))) return false
    }
    return true
}

function isValidKnightMove(_board, from, to) {
    const fd = Math.abs(fileOf(from) - fileOf(to))
    const rd = Math.abs(rankOf(from) - rankOf(to))
    return (fd === 1 && rd === 2) || (fd === 2 && rd === 1)
}

function isValidQueenMove(board, from, to) {
    return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to)
}

const validators = {r: isValidRookMove, b: isValidBishopMove, n: isValidKnightMove, q: isValidQueenMove}

function getValidCaptures(board) {
    const black = getBlackPiece(board)
    if (!black) return []
    const validate = validators[black.type]
    const captures = []
    for (const wp of getWhitePieces(board)) {
        if (validate(board, black.square, wp.square)) captures.push(wp.square)
    }
    return captures
}

function solve(board) {
    if (getWhitePieces(board).length === 0) return [[]]
    const captures = getValidCaptures(board)
    if (captures.length === 0) return []
    const black = getBlackPiece(board)
    const solutions = []
    for (const target of captures) {
        const next = cloneBoard(board)
        const capturedType = next.get(target)[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
        next.delete(black.square)
        for (const sub of solve(next)) {
            solutions.push([target, ...sub])
        }
    }
    return solutions
}

function analyzeTree(board, depth = 0) {
    const piecesLeft = getWhitePieces(board).length
    if (piecesLeft === 0) return {wins: 1, deadEnds: 0, deadEndDepths: [], nodes: 1, maxBranch: 0, branchPoints: []}
    const captures = getValidCaptures(board)
    if (captures.length === 0) return {wins: 0, deadEnds: 1, deadEndDepths: [depth], nodes: 1, maxBranch: 0, branchPoints: []}
    const black = getBlackPiece(board)
    let totalWins = 0, totalDeadEnds = 0, totalNodes = 1, maxBranch = captures.length
    const allDeadEndDepths = [], branchPoints = captures.length > 1 ? [{depth, choices: captures.length}] : []
    for (const target of captures) {
        const next = cloneBoard(board)
        const capturedType = next.get(target)[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
        next.delete(black.square)
        const sub = analyzeTree(next, depth + 1)
        totalWins += sub.wins; totalDeadEnds += sub.deadEnds; totalNodes += sub.nodes
        allDeadEndDepths.push(...sub.deadEndDepths)
        if (sub.maxBranch > maxBranch) maxBranch = sub.maxBranch
        branchPoints.push(...sub.branchPoints)
    }
    return {wins: totalWins, deadEnds: totalDeadEnds, deadEndDepths: allDeadEndDepths, nodes: totalNodes, maxBranch, branchPoints}
}

function computeDifficulty(fen) {
    const board = parseFen(fen)
    const black = getBlackPiece(board)
    const whitePieces = getWhitePieces(board)
    if (!black || whitePieces.length === 0) {
        return {error: "Invalid position: need exactly one black piece and at least one white piece"}
    }
    const tree = analyzeTree(board)
    const trapScore = tree.deadEndDepths.reduce((a, b) => a + b, 0)
    const firstCaptures = getValidCaptures(board)
    let firstMoveTraps = 0
    for (const target of firstCaptures) {
        const next = cloneBoard(board)
        const capturedType = next.get(target)[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
        next.delete(black.square)
        const sub = analyzeTree(next)
        if (sub.wins === 0) firstMoveTraps++
    }
    const decisionDepths = [...new Set(tree.branchPoints.map(b => b.depth))]
    const deadEndRatio = tree.deadEnds / (tree.deadEnds + tree.wins)
    const avgTrapDepth = tree.deadEnds > 0 ? trapScore / tree.deadEnds / whitePieces.length : 0
    const firstTrapRatio = firstCaptures.length > 0 ? firstMoveTraps / firstCaptures.length : 0
    const solutionPenalty = tree.wins > 0 ? 1 / tree.wins : 0
    const complexity = Math.log2(tree.nodes + 1)
    const score = Math.round(
        deadEndRatio * 25 + avgTrapDepth * 25 + firstTrapRatio * 20 +
        solutionPenalty * 15 + complexity * 2 + decisionDepths.length
    )
    const pieceNames = {r: "Rook", b: "Bishop", n: "Knight", q: "Queen", p: "Pawn"}
    const solutions = solve(board)
    return {
        piece: black, pieceName: pieceNames[black.type],
        targets: whitePieces.length,
        whitePieces: whitePieces.map(p => ({...p, name: pieceNames[p.type]})),
        solutions: solutions.length,
        solutionPaths: solutions.map(s => [black.square, ...s].join(" -> ")),
        deadEnds: tree.deadEnds, trapScore,
        firstMoveTraps, firstMoveChoices: firstCaptures.length,
        maxBranching: tree.maxBranch, decisionPoints: decisionDepths.length,
        totalNodes: tree.nodes, score
    }
}

// --- Level set file I/O ---

function getLevelSetPath() {
    const configPath = path.join(ROOT, "src/Config.js")
    const configContent = fs.readFileSync(configPath, "utf-8")
    const match = configContent.match(/import\s*\{LEVELS\}\s*from\s*["'](.+?)["']/)
    if (!match) throw new Error("Cannot find LEVELS import in Config.js")
    return path.resolve(path.join(ROOT, "src"), match[1])
}

async function loadLevels() {
    const filePath = getLevelSetPath()
    // Use a cache-busting query to avoid stale module cache
    const mod = await import("file://" + filePath + "?t=" + Date.now())
    return {filePath, levels: mod.LEVELS}
}

function saveLevelToFile(filePath, section, levelIndex, newFen) {
    const content = fs.readFileSync(filePath, "utf-8")
    const lines = content.split("\n")

    // Find the section
    let sectionStart = -1
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(new RegExp(`"${section}"\\s*:`))) {
            sectionStart = i
            break
        }
    }
    if (sectionStart === -1) throw new Error(`Section "${section}" not found`)

    // Find the level line within the section
    let levelCount = 0
    for (let i = sectionStart + 1; i < lines.length; i++) {
        const line = lines[i].trim()
        // End of section
        if (line.startsWith("],") || line === "],") break
        // Skip comments and empty lines
        if (line.startsWith("//") || line === "" || line === "[") continue
        // Match a FEN string line (starts with quote) or empty string or placeholder
        if (line.startsWith('"') || line === '"",' || line === '"",') {
            if (levelCount === levelIndex) {
                // Replace this line, preserving indentation
                const indent = lines[i].match(/^(\s*)/)[1]
                lines[i] = indent + newFen
                fs.writeFileSync(filePath, lines.join("\n"))
                return true
            }
            levelCount++
        }
    }
    throw new Error(`Level ${levelIndex} not found in section "${section}"`)
}

// --- HTTP Server ---

const MIME = {
    ".html": "text/html", ".js": "application/javascript", ".mjs": "application/javascript",
    ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
    ".json": "application/json", ".woff2": "font/woff2"
}

function serveStatic(res, urlPath) {
    let filePath = path.join(ROOT, urlPath)
    if (!fs.existsSync(filePath)) {
        res.writeHead(404)
        res.end("Not found")
        return
    }
    if (fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html")
    }
    const ext = path.extname(filePath)
    const mime = MIME[ext] || "application/octet-stream"
    res.writeHead(200, {"Content-Type": mime})
    fs.createReadStream(filePath).pipe(res)
}

async function handleApi(req, res, url) {
    res.setHeader("Content-Type", "application/json")

    if (url.pathname === "/api/levels" && req.method === "GET") {
        try {
            const {filePath, levels} = await loadLevels()
            res.end(JSON.stringify({filePath, levels}))
        } catch (e) {
            res.writeHead(500)
            res.end(JSON.stringify({error: e.message}))
        }

    } else if (url.pathname === "/api/analyze" && req.method === "POST") {
        const body = await readBody(req)
        const {fen} = JSON.parse(body)
        try {
            const result = computeDifficulty(fen)
            res.end(JSON.stringify(result))
        } catch (e) {
            res.writeHead(400)
            res.end(JSON.stringify({error: e.message}))
        }

    } else if (url.pathname === "/api/save" && req.method === "POST") {
        const body = await readBody(req)
        const {section, levelIndex, fen} = JSON.parse(body)
        try {
            const filePath = getLevelSetPath()
            saveLevelToFile(filePath, section, levelIndex, fen)
            res.end(JSON.stringify({ok: true}))
        } catch (e) {
            res.writeHead(500)
            res.end(JSON.stringify({error: e.message}))
        }

    } else {
        res.writeHead(404)
        res.end(JSON.stringify({error: "Not found"}))
    }
}

function readBody(req) {
    return new Promise((resolve) => {
        let data = ""
        req.on("data", chunk => data += chunk)
        req.on("end", () => resolve(data))
    })
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url)
    } else {
        serveStatic(res, url.pathname === "/" ? "/tools/level-editor.html" : url.pathname)
    }
})

server.listen(PORT, () => {
    console.log(`Level Editor running at http://localhost:${PORT}`)
})
