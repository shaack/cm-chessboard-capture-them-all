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

function getWhitePieces(board) {
    const pieces = []
    for (const [sq, piece] of board) {
        if (piece[0] === "w") pieces.push({ square: sq, type: piece[1] })
    }
    return pieces
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
    for (const wp of getWhitePieces(board)) {
        if (validate(board, black.square, wp.square)) captures.push(wp.square)
    }
    return captures
}

// --- Solver (DFS backtracking) ---
// Handles piece transformation: capturing a non-pawn white piece changes the black piece type

function solve(board) {
    if (getWhitePieces(board).length === 0) return [[]]
    const captures = getValidCaptures(board)
    if (captures.length === 0) return []
    const black = getBlackPiece(board)
    const solutions = []
    for (const target of captures) {
        const next = cloneBoard(board)
        const capturedPiece = next.get(target)
        const capturedType = capturedPiece[1]
        // Transform: if captured piece is not a pawn, black piece becomes that type
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
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
    const whitePieces = getWhitePieces(board)
    const solutions = solve(board)
    return { piece: black, pawns: whitePieces.map(p => p.square), whitePieces, solutions }
}

// --- Difficulty analysis ---

// Explores the full game tree and collects metrics
function analyzeTree(board, depth = 0) {
    const piecesLeft = getWhitePieces(board).length
    if (piecesLeft === 0) {
        return { wins: 1, deadEnds: 0, deadEndDepths: [], nodes: 1, maxBranch: 0, branchPoints: [] }
    }
    const captures = getValidCaptures(board)
    if (captures.length === 0) {
        return { wins: 0, deadEnds: 1, deadEndDepths: [depth], nodes: 1, maxBranch: 0, branchPoints: [] }
    }
    const black = getBlackPiece(board)
    let totalWins = 0, totalDeadEnds = 0, totalNodes = 1, maxBranch = captures.length
    const allDeadEndDepths = []
    const branchPoints = captures.length > 1 ? [{ depth, choices: captures.length }] : []

    for (const target of captures) {
        const next = cloneBoard(board)
        const capturedPiece = next.get(target)
        const capturedType = capturedPiece[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
        next.delete(black.square)
        const sub = analyzeTree(next, depth + 1)
        totalWins += sub.wins
        totalDeadEnds += sub.deadEnds
        totalNodes += sub.nodes
        allDeadEndDepths.push(...sub.deadEndDepths)
        if (sub.maxBranch > maxBranch) maxBranch = sub.maxBranch
        branchPoints.push(...sub.branchPoints)
    }
    return { wins: totalWins, deadEnds: totalDeadEnds, deadEndDepths: allDeadEndDepths, nodes: totalNodes, maxBranch, branchPoints }
}

function computeDifficulty(fen) {
    const board = parseFen(fen)
    const black = getBlackPiece(board)
    const whitePieces = getWhitePieces(board)
    const tree = analyzeTree(board)

    // Trap score: sum of depths at which dead ends occur
    const trapScore = tree.deadEndDepths.reduce((a, b) => a + b, 0)

    // First-move analysis
    const firstCaptures = getValidCaptures(board)
    let firstMoveTraps = 0
    for (const target of firstCaptures) {
        const next = cloneBoard(board)
        const capturedPiece = next.get(target)
        const capturedType = capturedPiece[1]
        const newType = capturedType !== "p" ? capturedType : black.type
        next.set(target, "b" + newType)
        next.delete(black.square)
        const sub = analyzeTree(next)
        if (sub.wins === 0) firstMoveTraps++
    }

    // Decision points: steps where player has >1 choice
    const decisionPoints = tree.branchPoints.filter(
        (bp, i, arr) => i === arr.findIndex(b => b.depth === bp.depth && b.choices === bp.choices)
    )
    const decisionDepths = [...new Set(tree.branchPoints.map(b => b.depth))]

    // Combined difficulty score (ratio-based, no artificial cap)
    const deadEndRatio = tree.deadEnds / (tree.deadEnds + tree.wins)
    const avgTrapDepth = tree.deadEnds > 0 ? trapScore / tree.deadEnds / whitePieces.length : 0
    const firstTrapRatio = firstCaptures.length > 0 ? firstMoveTraps / firstCaptures.length : 0
    const solutionPenalty = 1 / tree.wins
    const complexity = Math.log2(tree.nodes + 1)

    const score = Math.round(
        deadEndRatio * 25 +
        avgTrapDepth * 25 +
        firstTrapRatio * 20 +
        solutionPenalty * 15 +
        complexity * 2 +
        decisionDepths.length
    )

    return {
        piece: black, pawns: whitePieces.map(p => p.square), whitePieces,
        solutions: tree.wins,
        deadEnds: tree.deadEnds, trapScore, firstMoveTraps,
        firstMoveChoices: firstCaptures.length,
        maxBranching: tree.maxBranch,
        decisionPoints: decisionDepths.length,
        totalNodes: tree.nodes,
        score
    }
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

// Generate a level with only pawns (classic mode)
function generateLevel(pieceType, pawnCount, maxSolutions, minScore = 0, maxScore = 100) {
    return generateMultiLevel(pieceType, pawnCount, 0, maxSolutions, minScore, maxScore)
}

// Generate a level with pawns and optional white pieces (multi mode)
// whitePieceCount: how many of the targets should be non-pawn pieces
function generateMultiLevel(startPiece, totalCount, whitePieceCount, maxSolutions, minScore = 0, maxScore = 100) {
    const pieceCode = { rook: "r", bishop: "b", knight: "n", queen: "q" }[startPiece] || startPiece
    const pieceTypes = ["r", "b", "n", "q"]
    const pawnCount = totalCount - whitePieceCount

    for (let attempt = 0; attempt < 20000; attempt++) {
        const board = new Map()
        const startFile = Math.floor(Math.random() * 8)
        const startRank = Math.floor(Math.random() * 8)
        let currentType = pieceCode
        let current = toSquare(startFile, startRank)
        let ok = true

        // Place pieces along a solvable path (walk backward from end position)
        // Each step: place a white piece at current, move to a reachable empty square
        for (let i = 0; i < totalCount; i++) {
            const reachable = getReachableEmpty(board, current, currentType)
            if (reachable.length === 0) { ok = false; break }
            const next = reachable[Math.floor(Math.random() * reachable.length)]

            if (i < whitePieceCount) {
                // Place a white piece (not a pawn) — must differ from current type so transformation is meaningful
                const candidates = pieceTypes.filter(t => t !== currentType)
                const wpType = candidates[Math.floor(Math.random() * candidates.length)]
                board.set(current, "w" + wpType)
                // After capturing this piece, the black piece becomes this type
                currentType = wpType
            } else {
                board.set(current, "wp")
                // Capturing a pawn doesn't change the piece type
            }
            current = next
        }
        if (!ok) continue
        board.set(current, "b" + pieceCode)

        const solutions = solve(board)
        if (solutions.length < 1 || solutions.length > maxSolutions) continue

        const fen = boardToFen(board)
        const diff = computeDifficulty(fen)
        if (diff.score >= minScore && diff.score <= maxScore) {
            return { fen, solutions, startSquare: current, difficulty: diff }
        }
    }
    return null
}

// --- CLI ---

const pieceNames = { r: "Rook", b: "Bishop", n: "Knight", q: "Queen", p: "Pawn" }

function describeWhitePieces(whitePieces) {
    const counts = {}
    for (const p of whitePieces) {
        const name = pieceNames[p.type] || p.type
        counts[name] = (counts[name] || 0) + 1
    }
    return Object.entries(counts).map(([name, count]) => `${count} ${name}${count > 1 ? "s" : ""}`).join(", ")
}

function printResult(fen, result) {
    console.log(`FEN: ${fen}`)
    console.log(`Piece: ${pieceNames[result.piece.type]} on ${result.piece.square}`)
    console.log(`Targets: ${result.whitePieces ? describeWhitePieces(result.whitePieces) : result.pawns.length + " Pawns"}`)
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
            const pieceInfo = describeWhitePieces(result.whitePieces)
            console.log(`  Level ${String(i + 1).padStart(2)} (${pieceInfo}): ${result.solutions.length} solution(s)${tag}`)
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
    } else if (cmd === "analyze") {
        if (args[1] === "--file") {
            const path = await import("path")
            const abs = path.default.resolve(process.cwd(), args[2])
            const mod = await import("file://" + abs)
            const LEVELS = mod.LEVELS
            for (const [group, fens] of Object.entries(LEVELS)) {
                console.log(`\n${"=".repeat(70)}`)
                console.log(`${group}`)
                console.log(`${"=".repeat(70)}`)
                console.log(`${"Lvl".padStart(3)}  ${"Pcs".padStart(3)}  ${"Sol".padStart(3)}  ${"Dead".padStart(4)}  ${"Trap".padStart(4)}  ${"1st".padStart(3)}  ${"Brnch".padStart(5)}  ${"DecPt".padStart(5)}  ${"Nodes".padStart(6)}  ${"Score".padStart(5)}`)
                console.log(`${"-".repeat(70)}`)
                for (let i = 0; i < fens.length; i++) {
                    const fen = fens[i]
                    if (!fen) { console.log(`${String(i+1).padStart(3)}  — EMPTY`); continue }
                    const d = computeDifficulty(fen)
                    const firstInfo = `${d.firstMoveTraps}/${d.firstMoveChoices}`
                    console.log(
                        `${String(i+1).padStart(3)}  ` +
                        `${String(d.whitePieces.length).padStart(3)}  ` +
                        `${String(d.solutions).padStart(3)}  ` +
                        `${String(d.deadEnds).padStart(4)}  ` +
                        `${String(d.trapScore).padStart(4)}  ` +
                        `${firstInfo.padStart(3)}  ` +
                        `${String(d.maxBranching).padStart(5)}  ` +
                        `${String(d.decisionPoints).padStart(5)}  ` +
                        `${String(d.totalNodes).padStart(6)}  ` +
                        `${String(d.score).padStart(5)}`
                    )
                }
            }
            console.log(`\nLegend:`)
            console.log(`  Lvl   = Level number`)
            console.log(`  Pcs   = White piece count (pawns + pieces)`)
            console.log(`  Sol   = Number of solutions`)
            console.log(`  Dead  = Dead-end leaves in game tree`)
            console.log(`  Trap  = Trap score (sum of dead-end depths — deeper traps = harder)`)
            console.log(`  1st   = First-move traps / first-move choices`)
            console.log(`  Brnch = Max branching factor (most choices at any step)`)
            console.log(`  DecPt = Decision points (steps where player must choose)`)
            console.log(`  Nodes = Total game tree nodes explored`)
            console.log(`  Score = Combined difficulty (0-100)`)
        } else {
            const fen = args.slice(1).join(" ")
            const d = computeDifficulty(fen)
            console.log(`FEN: ${fen}`)
            console.log(`Piece: ${pieceNames[d.piece.type]} on ${d.piece.square}`)
            console.log(`Targets: ${describeWhitePieces(d.whitePieces)}`)
            console.log(`Solutions: ${d.solutions}`)
            console.log(`Dead ends: ${d.deadEnds}`)
            console.log(`Trap score: ${d.trapScore} (sum of dead-end depths)`)
            console.log(`First move: ${d.firstMoveChoices} choices, ${d.firstMoveTraps} trap(s)`)
            console.log(`Max branching: ${d.maxBranching}`)
            console.log(`Decision points: ${d.decisionPoints}`)
            console.log(`Total tree nodes: ${d.totalNodes}`)
            console.log(`Difficulty score: ${d.score}/100`)
        }
    } else if (cmd === "generate") {
        let piece = "bishop", pawns = 5, maxSol = 4, count = 1, minScore = 0, maxScoreVal = 100, whitePieces = 0
        for (let i = 1; i < args.length; i++) {
            if (args[i] === "--piece") piece = args[++i]
            else if (args[i] === "--pawns") pawns = parseInt(args[++i])
            else if (args[i] === "--white-pieces") whitePieces = parseInt(args[++i])
            else if (args[i] === "--max-solutions") maxSol = parseInt(args[++i])
            else if (args[i] === "--count") count = parseInt(args[++i])
            else if (args[i] === "--min-score") minScore = parseInt(args[++i])
            else if (args[i] === "--max-score") maxScoreVal = parseInt(args[++i])
        }
        const totalCount = pawns + whitePieces
        for (let c = 0; c < count; c++) {
            const result = generateMultiLevel(piece, totalCount, whitePieces, maxSol, minScore, maxScoreVal)
            if (result) {
                const d = result.difficulty
                const pieceInfo = describeWhitePieces(d.whitePieces)
                console.log(`"${result.fen}",`)
                console.log(`  // ${pieceInfo}, ${d.solutions} sol, score=${d.score}, dead=${d.deadEnds}, trap=${d.trapScore}, 1st=${d.firstMoveTraps}/${d.firstMoveChoices}`)
            } else {
                console.log(`// Failed to generate ${piece} with ${pawns} pawns + ${whitePieces} pieces, score ${minScore}-${maxScoreVal}`)
            }
        }
    } else {
        console.log("Usage:")
        console.log('  node tools/level-tool.js solve "FEN_STRING"')
        console.log("  node tools/level-tool.js solve --file path/to/level-set.js")
        console.log("  node tools/level-tool.js analyze --file path/to/level-set.js")
        console.log("  node tools/level-tool.js generate --piece rook --pawns 5 --max-solutions 1 --count 3")
        console.log("  node tools/level-tool.js generate --piece rook --pawns 5 --white-pieces 2 --max-solutions 2 --count 3")
        console.log("                           (multi: 5 pawns + 2 white pieces = 7 targets, piece transforms on capture)")
        process.exit(1)
    }
}

main().catch(e => { console.error(e); process.exit(1) })
