#!/usr/bin/env node

// --- Board helpers ---

function fileOf(sq) { return sq.charCodeAt(0) - 97 }
function rankOf(sq) { return parseInt(sq[1]) - 1 }
function toSquare(file, rank) { return String.fromCharCode(file + 97) + (rank + 1) }

function parseFen(fen) {
    const board = new Map()
    const parts = fen.split(" ")
    const rows = parts[0].split("/")
    for (let r = 0; r < 8; r++) {
        const rank = 7 - r // FEN starts at rank 8
        let file = 0
        for (const ch of rows[r]) {
            if (ch >= "1" && ch <= "8") {
                file += parseInt(ch)
            } else {
                const color = ch === ch.toUpperCase() ? "w" : "b"
                const type = ch.toLowerCase()
                board.set(toSquare(file, rank), color + type)
                file++
            }
        }
    }
    return board
}

function cloneBoard(board) { return new Map(board) }

function getBlackPiece(board) {
    for (const [sq, piece] of board) {
        if (piece[0] === "b") return { square: sq, type: piece[1] }
    }
    return null
}

function getWhitePawns(board) {
    const pawns = []
    for (const [sq, piece] of board) {
        if (piece === "wp") pawns.push(sq)
    }
    return pawns
}

// --- Move validation (port of Level.js) ---

function isValidRookMove(board, from, to) {
    const ff = fileOf(from), rf = rankOf(from)
    const ft = fileOf(to), rt = rankOf(to)
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
    const ff = fileOf(from), rf = rankOf(from)
    const ft = fileOf(to), rt = rankOf(to)
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

const validators = { r: isValidRookMove, b: isValidBishopMove, n: isValidKnightMove, q: isValidQueenMove }

function getValidCaptures(board) {
    const black = getBlackPiece(board)
    if (!black) return []
    const validate = validators[black.type]
    const captures = []
    for (const sq of getWhitePawns(board)) {
        if (validate(board, black.square, sq)) captures.push(sq)
    }
    return captures
}

// --- Solver (DFS backtracking) ---

function solve(board) {
    if (getWhitePawns(board).length === 0) return [[]]
    const captures = getValidCaptures(board)
    if (captures.length === 0) return []
    const black = getBlackPiece(board)
    const solutions = []
    for (const target of captures) {
        const next = cloneBoard(board)
        next.set(target, next.get(black.square))
        next.delete(black.square)
        for (const sub of solve(next)) {
            solutions.push([target, ...sub])
        }
    }
    return solutions
}

function solveLevel(fen) {
    const board = parseFen(fen)
    const black = getBlackPiece(board)
    const pawns = getWhitePawns(board)
    const solutions = solve(board)
    return { piece: black, pawns, solutions }
}

// --- Generator ---

function boardToFen(board) {
    let fen = ""
    for (let rank = 7; rank >= 0; rank--) {
        let empty = 0
        for (let file = 0; file < 8; file++) {
            const piece = board.get(toSquare(file, rank))
            if (piece) {
                if (empty > 0) { fen += empty; empty = 0 }
                const ch = piece[1]
                fen += piece[0] === "w" ? ch.toUpperCase() : ch
            } else {
                empty++
            }
        }
        if (empty > 0) fen += empty
        if (rank > 0) fen += "/"
    }
    return fen + " b - - 0 1"
}

function getReachableEmpty(board, from, pieceType) {
    const squares = []
    const ff = fileOf(from), rf = rankOf(from)
    if (pieceType === "r" || pieceType === "q") {
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
        for (const [df, dr] of dirs) {
            for (let i = 1; i < 8; i++) {
                const f = ff + df * i, r = rf + dr * i
                if (f < 0 || f > 7 || r < 0 || r > 7) break
                const sq = toSquare(f, r)
                if (board.has(sq)) break
                squares.push(sq)
            }
        }
    }
    if (pieceType === "b" || pieceType === "q") {
        const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
        for (const [df, dr] of dirs) {
            for (let i = 1; i < 8; i++) {
                const f = ff + df * i, r = rf + dr * i
                if (f < 0 || f > 7 || r < 0 || r > 7) break
                const sq = toSquare(f, r)
                if (board.has(sq)) break
                squares.push(sq)
            }
        }
    }
    if (pieceType === "n") {
        const jumps = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]
        for (const [df, dr] of jumps) {
            const f = ff + df, r = rf + dr
            if (f < 0 || f > 7 || r < 0 || r > 7) continue
            const sq = toSquare(f, r)
            if (!board.has(sq)) squares.push(sq)
        }
    }
    return squares
}

function generateLevel(pieceType, pawnCount, maxSolutions) {
    const pieceCode = { rook: "r", bishop: "b", knight: "n", queen: "q" }[pieceType] || pieceType
    for (let attempt = 0; attempt < 10000; attempt++) {
        const board = new Map()
        // Pick random start, walk placing pawns, then place piece at end of walk
        // The walk is done in REVERSE: the last pawn placed is captured first
        const startFile = Math.floor(Math.random() * 8)
        const startRank = Math.floor(Math.random() * 8)
        let current = toSquare(startFile, startRank)
        const path = [current]
        let ok = true
        for (let i = 0; i < pawnCount; i++) {
            // Find empty reachable squares (nothing on board yet except previously placed pawns)
            const reachable = getReachableEmpty(board, current, pieceCode)
            if (reachable.length === 0) { ok = false; break }
            const next = reachable[Math.floor(Math.random() * reachable.length)]
            board.set(current, "wp") // place pawn where we were
            current = next
            path.push(next)
        }
        if (!ok) continue
        // Place the black piece at the final position (the "end" of the walk)
        board.set(current, "b" + pieceCode)

        const fen = boardToFen(board)
        const solutions = solve(board)
        if (solutions.length >= 1 && solutions.length <= maxSolutions) {
            return { fen, solutions, startSquare: current }
        }
    }
    return null
}

// --- CLI ---

const pieceNames = { r: "Rook", b: "Bishop", n: "Knight", q: "Queen" }

function printResult(fen, result) {
    console.log(`FEN: ${fen}`)
    console.log(`Piece: ${pieceNames[result.piece.type]} on ${result.piece.square}`)
    console.log(`Pawns: ${result.pawns.length} (${result.pawns.join(", ")})`)
    console.log(`Solutions: ${result.solutions.length}`)
    for (let i = 0; i < result.solutions.length; i++) {
        console.log(`  ${i + 1}. ${result.piece.square}→${result.solutions[i].join("→")}`)
    }
    console.log()
}

async function solveFile(filePath) {
    const path = await import("path")
    const abs = path.default.resolve(process.cwd(), filePath)
    const mod = await import("file://" + abs)
    const LEVELS = mod.LEVELS

    for (const [group, fens] of Object.entries(LEVELS)) {
        console.log(`${group}:`)
        for (let i = 0; i < fens.length; i++) {
            const fen = fens[i]
            if (!fen) {
                console.log(`  Level ${String(i + 1).padStart(2)} — EMPTY`)
                continue
            }
            const result = solveLevel(fen)
            const tag = result.solutions.length === 1 ? " [unique]" :
                        result.solutions.length === 0 ? " [UNSOLVABLE!]" : ""
            console.log(`  Level ${String(i + 1).padStart(2)} (${String(result.pawns.length).padStart(2)} pawns): ${result.solutions.length} solution(s)${tag}`)
        }
        console.log()
    }
}

async function main() {
    const args = process.argv.slice(2)
    const cmd = args[0]

    if (cmd === "solve") {
        if (args[1] === "--file") {
            await solveFile(args[2])
        } else {
            const fen = args.slice(1).join(" ")
            const result = solveLevel(fen)
            printResult(fen, result)
        }
    } else if (cmd === "generate") {
        let piece = "bishop", pawns = 5, maxSol = 1, count = 1
        for (let i = 1; i < args.length; i++) {
            if (args[i] === "--piece") piece = args[++i]
            else if (args[i] === "--pawns") pawns = parseInt(args[++i])
            else if (args[i] === "--max-solutions") maxSol = parseInt(args[++i])
            else if (args[i] === "--count") count = parseInt(args[++i])
        }
        for (let c = 0; c < count; c++) {
            const result = generateLevel(piece, pawns, maxSol)
            if (result) {
                console.log(`"${result.fen}",`)
                console.log(`  // ${result.solutions.length} solution(s): ${result.startSquare}→${result.solutions[0].join("→")}`)
            } else {
                console.log(`// Failed to generate ${piece} level with ${pawns} pawns and max ${maxSol} solutions`)
            }
        }
    } else {
        console.log("Usage:")
        console.log('  node tools/level-tool.js solve "FEN_STRING"')
        console.log("  node tools/level-tool.js solve --file path/to/level-set.js")
        console.log("  node tools/level-tool.js generate --piece bishop --pawns 5 --max-solutions 1 --count 3")
        process.exit(1)
    }
}

main().catch(e => { console.error(e); process.exit(1) })
