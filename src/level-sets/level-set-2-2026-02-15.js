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
        "P7/8/2q5/1P1P4/8/8/8/5P2 b - - 0 1", // 2
        "8/8/8/P2qP3/P7/8/7P/P7 b - - 0 1", // 3
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
        "8/4r1P1/8/5P2/8/6N1/8/8 b - - 0 1", // 1: 3 targets (2 Pawns + 1 Knight, score=20)
        "1PQ5/1rN5/1P6/8/8/8/8/8 b - - 0 1", // 2: 4 targets (2 Pawns + 1 Queen + 1 Knight, score=69)
        "5B1P/6P1/5P1r/8/8/8/5Q2/8 b - - 0 1", // 3: 5 targets (3 Pawns + 1 Bishop + 1 Queen, score=71)
        "8/8/1Q3P2/8/6P1/4b3/5N1P/5P2 b - - 0 1", // 4: 6 targets (4 Pawns + 1 Queen + 1 Knight, score=74)
        "8/8/4B2P/8/1P4P1/7r/4Q3/4P2P b - - 0 1", // 5: 7 targets (5 Pawns + 1 Bishop + 1 Queen, score=82)
        "3P4/1nR5/Q3P3/1PN5/3P4/8/8/8 b - - 0 1", // 6: 7 targets (4 Pawns + 1 Rook + 1 Queen + 1 Knight, score=74)
        "4N3/2QP2N1/4P3/2r1P3/3P4/5P2/8/8 b - - 0 1", // 7: 8 targets (5 Pawns + 2 Knights + 1 Queen, score=86)
        "4P1P1/3PQ3/8/8/4B3/P6P/6b1/7Q b - - 0 1", // 8: 8 targets (5 Pawns + 2 Queens + 1 Bishop, score=89)
        "8/NP2R3/2Q1N3/2P5/1r6/1P6/P7/2P5 b - - 0 1", // 9: 9 targets (5 Pawns + 2 Knights + 1 Rook + 1 Queen, score=82)
        "8/8/8/8/3n4/1PNP4/2PNR3/P1P2Q2 b - - 0 1", // 10: 9 targets (5 Pawns + 2 Knights + 1 Rook + 1 Queen, score=90)
        "8/8/8/1P6/2PRB1Q1/2P1P3/1r6/1N1P2Q1 b - - 0 1", // 11: 10 targets (5 Pawns + 1 Rook + 1 Bishop + 2 Queens + 1 Knight, score=83)
        "8/8/2N5/1Q1P4/P1b1P3/6N1/2P2B2/3P3B b - - 0 1", // 12: 10 targets (5 Pawns + 2 Knights + 1 Queen + 2 Bishops, score=87)
        "1B2B3/2Q5/1R6/4P3/8/4Q3/2n4P/2P1P2P b - - 0 1", // 13: 10 targets (5 Pawns + 2 Bishops + 2 Queens + 1 Rook, score=92)
        "2N5/8/1B3P2/8/1P1r2B1/2P1P3/3P4/Q5N1 b - - 0 1", // 14: 10 targets (5 Pawns + 2 Knights + 2 Bishops + 1 Queen, score=87)
        "P2NR3/8/1Q1Q1N2/P1P5/N3P2b/8/5P2/8 b - - 0 1", // 15: 11 targets (5 Pawns + 3 Knights + 1 Rook + 2 Queens, score=90)
        "8/5BNr/3RNP1R/6PP/5PN1/7P/8/8 b - - 0 1", // 16: 11 targets (5 Pawns + 1 Bishop + 3 Knights + 2 Rooks, score=89)
        "B7/1NN5/1P1RQ3/8/PQ3B2/3n4/1P3P2/3P4 b - - 0 1", // 17: 12 targets (5 Pawns + 2 Bishops + 2 Knights + 1 Rook + 2 Queens, score=95)
        "1R2P1Q1/2Q2P2/1P6/1r1B3P/8/8/5PN1/1N2Q3 b - - 0 1", // 18: 12 targets (5 Pawns + 1 Rook + 3 Queens + 1 Bishop + 2 Knights, score=97)
        "1Q6/bP2P1P1/R7/4P3/Q7/2Q5/1N2N3/3N2P1 b - - 0 1", // 19: 12 targets (5 Pawns + 3 Queens + 1 Rook + 3 Knights, score=94)
        "5B2/8/4N3/3n1P2/3Q1P2/4PPPB/8/3N1RR1 b - - 0 1" // 20: 12 targets (5 Pawns + 2 Bishops + 2 Knights + 1 Queen + 2 Rooks, score=96)
     ],
}
