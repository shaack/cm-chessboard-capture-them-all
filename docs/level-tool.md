# Level Tool

CLI tool for solving, analyzing, and generating puzzle levels. Requires Node.js.

## Usage

```bash
node tools/level-tool.js <command> [options]
```

## Commands

### solve

Validate levels by finding all solutions.

**Solve a single FEN:**

```bash
node tools/level-tool.js solve "8/5P2/8/7P/8/8/4b3/3P4 b - - 0 1"
```

Output:

```
FEN: 8/5P2/8/7P/8/8/4b3/3P4 b - - 0 1
Piece: Bishop on e2
Pawns: 3 (f7, h5, d1)
Solutions: 1
  1. e2->d1->h5->f7
```

**Solve all levels in a level set:**

```bash
node tools/level-tool.js solve --file src/level-sets/level-set-2-2026-02-15.js
```

Output shows each level with pawn count, solution count, and tags for unique or unsolvable levels.

### analyze

Measure difficulty of levels by exploring the full game tree.

**Analyze a single FEN:**

```bash
node tools/level-tool.js analyze "8/5P2/8/7P/8/8/4b3/3P4 b - - 0 1"
```

**Analyze all levels in a level set:**

```bash
node tools/level-tool.js analyze --file src/level-sets/level-set-2-2026-02-15.js
```

Output columns:

| Column | Description |
|--------|-------------|
| Lvl | Level number |
| Pwn | Pawn count |
| Sol | Number of valid solutions |
| Dead | Dead-end leaves in the game tree (wrong paths that get stuck) |
| Trap | Trap score — sum of dead-end depths. Higher = harder, because wrong paths go deeper before failing |
| 1st | First-move traps / first-move choices. E.g. `2/3` means 3 first moves are possible, 2 lead to dead ends |
| Brnch | Max branching factor (most choices available at any single step) |
| DecPt | Decision points (number of steps where the player must choose between multiple captures) |
| Nodes | Total game tree nodes explored |
| Score | Combined difficulty score (0–100) |

**Difficulty score formula:**

```
score = min(100, trapScore * 2 + deadEnds * 3 + firstMoveTraps * 10 + decisionPoints * 2)
```

A score of 0 means the puzzle is completely linear with no wrong choices. A score of 100 means the puzzle has significant traps and branching.

### generate

Generate random solvable levels with difficulty constraints.

```bash
node tools/level-tool.js generate [options]
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--piece <type>` | bishop | Piece type: rook, bishop, knight, queen |
| `--pawns <n>` | 5 | Number of white pawns |
| `--max-solutions <n>` | 4 | Maximum number of solutions allowed |
| `--min-score <n>` | 0 | Minimum difficulty score |
| `--max-score <n>` | 100 | Maximum difficulty score |
| `--count <n>` | 1 | Number of levels to generate |

**Examples:**

```bash
# Generate a unique-solution bishop level with 7 pawns
node tools/level-tool.js generate --piece bishop --pawns 7 --max-solutions 1

# Generate 5 knight levels with 10 pawns and at least moderate difficulty
node tools/level-tool.js generate --piece knight --pawns 10 --min-score 30 --count 5

# Generate easy queen levels (few traps)
node tools/level-tool.js generate --piece queen --pawns 6 --max-score 50
```

Output includes the FEN string and difficulty metrics:

```
"8/4n3/2P3P1/4P3/3P4/8/8/8 b - - 0 1",
  // 1 sol, score=30, dead=2, trap=5, 1st=1/2
```

**How generation works:**

The generator uses a forward-walk algorithm:

1. Place the piece at a random square
2. Walk to a random reachable empty square, placing a pawn where the piece was
3. Repeat until all pawns are placed
4. The piece ends up at the final position of the walk

This guarantees at least one solution exists by construction. The generator then verifies solvability, counts solutions, and computes difficulty. If the level doesn't meet the constraints, it retries (up to 20,000 attempts).

## Level Design Guidelines

**Pawn count formula:** `pawns = level_number + 2` (level 1 = 3 pawns, level 10 = 12 pawns)

**Target difficulty by level:**

| Levels | Target Score | Description |
|--------|-------------|-------------|
| 1–2 | 20–40 | Introductory — one or two traps |
| 3–5 | 40–100 | Moderate — multiple decision points |
| 6–10 | 80–100 | Hard — deep traps, non-obvious first moves |

**Bishop constraint:** All pawns must be on the same color square as the bishop.

**What makes a good puzzle:**

- At least one first-move trap (`1st` column shows traps > 0)
- Dead ends that go deep before failing (high trap score relative to dead-end count)
- A non-obvious solution path (the "natural" first capture is a trap)
- Few solutions (1–4), so the player must find the specific path
