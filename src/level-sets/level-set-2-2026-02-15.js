/**
 * Author: Stefan Haack, Michael Hinz (7d0.com)
 *
 *   Progression table:
 *   ┌────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
 *   │        │ L1  │ L2  │ L3  │ L4  │ L5  │ L6  │ L7  │ L8  │ L9  │ L10 │
 *   ├────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 *   │ Pawns  │ 3   │ 4   │ 5   │ 6   │ 7   │ 8   │ 9   │ 10  │ 10  │ 10  │
 *   ├────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 *   │ Rook   │ 66  │ 66  │ 68  │ 84  │ 76  │ 79  │ 78  │ 79  │ 80  │ 82  │
 *   ├────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 *   │ Bishop │ 66  │ 60  │ 60  │ 62  │ 75  │ 85  │ 82  │ 80  │ 79  │ 88  │
 *   ├────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 *   │ Knight │ 20  │ 66  │ 66  │ 66  │ 66  │ 75  │ 65  │ 72  │ 75  │ 84  │
 *   ├────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
 *   │ Queen  │ 66  │ 66  │ 67  │ 74  │ 71  │ 72  │ 88  │ 80  │ 78  │ 85  │
 *   └────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
 *
 *    Rook:
 *   ┌───────┬───────┬───────┬───────────┐
 *   │ Level │ Pawns │ Score │ Character │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 1-3   │ 3-5   │ 66-68 │ Easy      │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 4-5   │ 6-7   │ 76-84 │ Medium    │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 6-10  │ 8-10  │ 78-82 │ Hard      │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 11-12 │ 11    │ 82-85 │ Hard+     │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 13-14 │ 12    │ 88-89 │ Very hard │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 15-16 │ 13    │ 89-91 │ Expert    │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 17-18 │ 14    │ 93-95 │ Master    │
 *   ├───────┼───────┼───────┼───────────┤
 *   │ 19-20 │ 15-16 │ 93-99 │ Master+   │
 *   └───────┴───────┴───────┴───────────┘
 */
export const LEVELS = {
    "Rook": [
        "8/8/8/8/2P1rP2/5P2/8/8 b - - 0 1", // 1 (3 Bauern)
        "8/8/4P3/3PP3/3rP3/8/8/8 b - - 0 1", // 2
        "2P5/8/2P4P/2P4r/8/8/7P/8 b - - 0 1", // 3
        "8/8/1P1PP3/8/2PrP3/3P4/8/8 b - - 0 1", // 4
        "P2P4/8/2P2P2/8/2PP4/3P1r2/8/8 b - - 0 1", // 5
        "8/8/8/P1P1P3/8/2P3PP/6r1/2P3P1 b - - 0 1", // 6
        "8/8/8/1P1P1P2/1P1r1P2/8/1P3P2/3PP3 b - - 0 1", // 7
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 b - - 0 1", // 8
        "3P3P/2r2P1P/2PP4/1P3P2/2P2P2/8/8/8 b - - 0 1", // 9 (10 pawns)
        "P1P1P3/r1P2P2/4P3/8/4P2P/2P4P/8/8 b - - 0 1", // 10 (10 pawns)
        "3P4/PP6/1r6/1P6/1P6/P2P3P/P1P4P/8 b - - 0 1", // 11 (11 pawns)
        "5P2/3P1PP1/8/3r1P1P/PP3P2/8/6PP/8 b - - 0 1", // 12 (11 pawns)
        "P5P1/8/2rP4/8/8/3P1P1P/2P1P2P/3P2PP b - - 0 1", // 13 (12 pawns)
        "3P4/8/3P1P2/P5P1/P4PPr/8/8/P3P1PP b - - 0 1", // 14 (12 pawns)
        "8/4P3/1P2r3/4PP2/6P1/1P1P2P1/6P1/P3PPP1 b - - 0 1", // 15 (13 pawns)
        "3PP1PP/4P1PP/8/3r4/8/4P1P1/2PP4/3P3P b - - 0 1", // 16 (13 pawns)
        "8/1P2P2P/4PP1P/2P3P1/2P5/1r3PP1/4P2P/1P6 b - - 0 1", // 17 (14 pawns)
        "3rPP2/2P5/8/1P2PP2/2PPP3/6P1/1PP5/1P4P1 b - - 0 1", // 18 (14 pawns)
        "P2P1PP1/4P2P/5P1P/8/6P1/2rP2P1/5P2/P1P2P2 b - - 0 1", // 19 (15 pawns)
        "P7/P7/2PrP1P1/PP1P4/2PPP3/4P3/3P1P2/P3P3 b - - 0 1", // 20 (16 pawns)
    ],
    "Bishop": [
        "8/5P2/8/7P/8/8/4b3/3P4 b - - 0 1", // 1 (3 Bauern)
        "8/8/4P3/1P1b4/2P5/3P4/8/8 b - - 0 1", // 2
        "8/8/2P3P1/8/P3b3/8/2P3P1/8 b - - 0 1", // 3
        "1P6/6P1/7P/8/5P2/8/1b5P/P7 b - - 0 1", // 4
        "8/3P3P/8/1P3P2/8/3P3P/8/1P3b2 b - - 0 1", // 5
        "7P/P3P3/8/2P3P1/3P4/b3P3/8/2P5 b - - 0 1", // 6
        "7P/P3P3/5P2/2P3P1/3P4/4P3/1P6/2b5 b - - 0 1", // 7
        "8/3P1P2/2P5/5P1P/6P1/3P1P1b/2P5/5P2 b - - 0 1", // 8
        "2b5/1P1P3P/P3P1P1/1P6/4P3/7P/6P1/8 b - - 0 1", // 9 (10 pawns)
        "2P5/1P1P4/b7/1P3P2/P3P3/8/2P1P3/5P2 b - - 0 1", // 10 (10 pawns)
        "4P3/3P1P2/4P3/1P6/2P3P1/3P1P2/P5b1/5P2 b - - 0 1", // 11 (11 pawns)
        "4P3/5P2/2P1P3/1b5P/6P1/1P1P4/4P3/3P1P2 b - - 0 1", // 12 (11 pawns)
        "4P1P1/3P3P/2P1b1P1/5P2/2P5/1P6/P7/1P5P b - - 0 1", // 13 (12 pawns)
        "7P/2P1b3/1P6/P1P1P1P1/3P1P1P/8/1P3P2/8 b - - 0 1", // 14 (12 pawns)
        "4P1P1/3P1P2/4P1P1/3P4/b3P3/1P6/2P3P1/1P3P2 b - - 0 1", // 15 (13 pawns)
        "5P2/2P1P3/3P1P2/b5P1/1P6/P1P5/1P5P/P5P1 b - - 0 1", // 16 (13 pawns)
        "3P1P1P/P3P1P1/1b6/P5P1/1P3P2/4P3/1P3P2/4P3 b - - 0 1", // 17 (14 pawns)
        "6P1/3P3P/P3P3/1P6/2P1P1P1/1P3P1b/4P3/5P1P b - - 0 1", // 18 (14 pawns)
        "6P1/7P/b3P3/1P1P1P1P/2P3P1/5P2/P1P5/1P1P3P b - - 0 1", // 19 (15 pawns)
        "8/P1P3P1/3b3P/6P1/1P5P/P1P3P1/1P1P1P1P/2P3P1 b - - 0 1", // 20 (16 pawns)
    ],
    "Knight": [
        "2P1P3/4n3/3P4/8/8/8/8/8 b - - 0 1", // 1 (3 Bauern)
        "8/4n3/2P3P1/4P3/3P4/8/8/8 b - - 0 1", // 2
        "7P/8/4n1P1/6P1/5P2/7P/8/8 b - - 0 1", // 3
        "8/n3P3/2PP4/1P3P2/1P6/8/8/8 b - - 0 1", // 4
        "8/8/5P2/7P/4nPP1/8/3P3P/5P2 b - - 0 1", // 5
        "3P3P/1n3P2/3P2P1/5P2/4P2P/8/8/8 b - - 0 1", // 6
        "7P/5P2/6P1/4nP2/3P3P/1P3P2/3P4/8 b - - 0 1", // 7
        "8/2PP4/P7/1PP1P3/2n5/PP1P4/8/2P5 b - - 0 1", // 8
        "8/8/5P2/6P1/1n2P1P1/3PPP2/2PP4/4P3 b - - 0 1", // 9 (10 pawns)
        "8/2P1P3/P5P1/3P1n1P/1P1P1P2/8/2P5/8 b - - 0 1", // 10 (10 pawns)
        "8/2P5/3P4/1P1n4/P3P3/2P5/1P1P1P2/1P1P4 b - - 0 1", // 11 (11 pawns)
        "1P1P4/2PP4/2P1P3/1P1PP3/1n1P2P1/8/8/8 b - - 0 1", // 12 (11 pawns)
        "8/2n5/PP3P2/2PP4/1PP1P3/3P4/3P3P/5P2 b - - 0 1", // 13 (12 pawns)
        "4P2P/3P1PP1/3P1Pn1/2P1P2P/P1P5/8/8/8 b - - 0 1", // 14 (12 pawns)
        "4P3/1P1nP1P1/3P1P2/2PP1P2/6P1/1P2P3/3P4/8 b - - 0 1", // 15 (13 pawns)
        "3P4/8/4P2P/3P1P2/1P3PP1/3PP2n/P4P2/2P5 b - - 0 1", // 16 (13 pawns)
        "4P3/1P6/3P1P2/2P1n1P1/4P1P1/5P1P/1P3P1P/3P4 b - - 0 1", // 17 (14 pawns)
        "3P4/8/4P3/8/3PPn2/3PP1PP/1PP2P2/3PPP2 b - - 0 1", // 18 (14 pawns)
        "8/1P6/3P4/1PP5/1PP5/P1PP4/PPPP4/1Pn2P2 b - - 0 1", // 19 (15 pawns)
        "1PP1P2P/P1P1PP2/PnPP4/1P6/2P5/P7/3P4/1P6 b - - 0 1", // 20 (16 pawns)
    ],
    "Queen": [
        "8/8/8/8/P4q1P/8/8/3P4 b - - 0 1", // 1 (3 Bauern)
        "8/P3P3/8/8/P5P1/4q3/8/8 b - - 0 1", // 2
        "4q3/5P2/P4P2/8/P2P4/8/8/8 b - - 0 1", // 3
        "8/P1P5/8/2qP4/3P4/P7/1P6/8 b - - 0 1", // 4
        "8/5P2/P1P5/8/2P1P1P1/8/8/5qP1 b - - 0 1", // 5
        "2P5/3P1P2/8/6P1/4q3/8/4P1P1/2P3P1 b - - 0 1", // 6
        "8/4Pq1P/6PP/P6P/8/8/6P1/P1P5 b - - 0 1", // 7
        "4P3/8/P3P3/8/4P2P/3Pq3/7P/PP1P4 b - - 0 1", // 8
        "3P1P1P/5PP1/2PP4/8/1q6/8/5P2/1PP5 b - - 0 1", // 9 (10 pawns)
        "Pq6/P2P3P/8/3P1P2/5P2/8/4P3/P3P3 b - - 0 1", // 10 (10 pawns)
        "4q1P1/1P2P3/8/5P2/8/7P/PP4P1/P2P3P b - - 0 1", // 11 (11 pawns)
        "P5P1/P5P1/7P/5P2/PP3PP1/8/4P3/3q4 b - - 0 1", // 12 (11 pawns)
        "1P1P4/1P1P4/P7/3P1P2/3q4/4PP2/1P6/2P1P3 b - - 0 1", // 13 (12 pawns)
        "3PP3/1P6/1P1Pq3/8/4P1PP/2PP4/1P6/5P2 b - - 0 1", // 14 (12 pawns)
        "4P3/1P3q1P/5P2/PP6/1P6/1PP5/8/3P1P2 b - - 0 1", // 15 (11 pawns)
        "P2P2q1/3P4/P4P2/8/1P5P/1P4P1/4P3/5P2 b - - 0 1", // 16 (11 pawns)
        "2P5/2P5/4P3/3q4/P3P3/5P2/3PPPPP/2P5 b - - 0 1", // 17 (12 pawns)
        "3P1P2/8/P1Pq3P/5P2/PP5P/6P1/6P1/8 b - - 0 1", // 18 (11 pawns)
        "6P1/1P2P3/P7/P5PP/1P6/3q2P1/7P/P7 b - - 0 1", // 19 (11 pawns)
        "2P5/2P3qP/4P3/3P4/3PPP2/5PP1/3P4/P7 b - - 0 1", // 20 (12 pawns)
    ],
    "Multi": [
        "8/4r1P1/8/5P2/8/6N1/8/8 b - - 0 1", // 1 (2 Pawns + 1 Knight, Rook→Knight, score=20)
        "8/8/8/8/8/3n4/6Q1/4PP2 b - - 0 1", // 2 (2 Pawns + 1 Queen, Knight→Queen, score=20)
        "8/8/8/2P4Q/1P5r/8/8/8 b - - 0 1", // 3 (2 Pawns + 1 Queen, Rook→Queen, score=52)
        "8/8/7P/8/6P1/6Q1/5b1N/8 b - - 0 1", // 4 (2 Pawns + 1 Queen + 1 Knight, Bishop→Queen→Knight, score=47)
        "8/8/6P1/7P/8/8/3r2P1/3Q3B b - - 0 1", // 5 (3 Pawns + 1 Queen + 1 Bishop, Rook→Queen, score=69)
        "8/8/8/3P3N/5P2/3r3P/5P2/7Q b - - 0 1", // 6 (4 Pawns + 1 Knight + 1 Queen, Rook→Knight, score=75)
        "8/P1R5/3P4/B1b5/8/8/7P/6P1 b - - 0 1", // 7 (4 Pawns + 1 Rook + 1 Bishop, Bishop→Rook, score=78)
        "1B6/8/P1P3rP/1Q5P/8/8/8/8 b - - 0 1", // 8 (4 Pawns + 1 Queen + 1 Bishop, Rook→Queen, score=79)
        "BP3Q2/P7/8/2B3r1/8/4P3/7P/6P1 b - - 0 1", // 9 (5 Pawns + 2 Bishops + 1 Queen, Rook→Bishop→Queen, score=80)
        "8/8/1R2PP2/Q7/2n5/1BP5/2P1P3/8 b - - 0 1", // 10 (5 Pawns + 1 Rook + 1 Queen + 1 Bishop, Knight→Queen→Rook, score=83)
        "8/8/P1rPQB2/8/2P5/P7/P7/8 b - - 0 1", // 11 (5 Pawns + 1 Queen + 1 Bishop, Rook→Queen, score=83)
        "8/8/8/8/2P1Q3/1P1P4/P1r1P3/4B3 b - - 0 1", // 12 (5 Pawns + 1 Queen + 1 Bishop, Rook→Queen, score=86)
        "8/8/8/8/5n2/4QP2/2N1P1P1/4P1P1 b - - 0 1", // 13 (5 Pawns + 1 Queen + 1 Knight, Knight→Queen→Knight, score=85)
        "8/2Q5/B2P4/1P1P4/P1P5/2n5/8/8 b - - 0 1", // 14 (5 Pawns + 1 Queen + 1 Bishop, Knight→Queen, score=86)
        "3Q4/2b3P1/1N2R2P/8/2BP1P2/8/8/8 b - - 0 1", // 15 (4 Pawns + 1 Queen + 1 Knight + 1 Rook + 1 Bishop, Bishop→Queen→Bishop→Rook→Knight, score=87)
        "1P2P2Q/8/3b4/1P6/PQ1B4/8/3R4/8 b - - 0 1", // 16 (4 Pawns + 2 Queens + 1 Bishop + 1 Rook, Bishop→Queen→Rook→Bishop→Queen, score=88)
        "8/8/3N3Q/3Q2P1/5P2/4B1r1/6PP/5P2 b - - 0 1", // 17 (5 Pawns + 1 Knight + 2 Queens + 1 Bishop, Rook→Queen→Bishop→Queen→Knight, score=90)
        "4R3/3P1P2/4PP2/R3r2Q/5P2/8/8/4B3 b - - 0 1", // 18 (5 Pawns + 2 Rooks + 1 Queen + 1 Bishop, Rook→Bishop→Rook→Queen→Rook, score=93)
        "8/8/1B6/8/2Q1N3/1R4Q1/1P2PnP1/1P1P4 b - - 0 1", // 19 (5 Pawns + 1 Bishop + 2 Queens + 1 Knight + 1 Rook, Knight→Queen→Knight→Queen→Rook, score=89)
        "8/2QPPQ2/4n1BN/5PP1/5RP1/8/8/8 b - - 0 1", // 20 (5 Pawns + 2 Queens + 1 Bishop + 1 Knight + 1 Rook, Knight→Queen→Knight→Queen→Rook, score=99)
    ],
}