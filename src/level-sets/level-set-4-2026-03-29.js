/**
 * Author: Stefan Haack, Michael Hinz (7d0.com)
 *
 * ALL Levels should have score > 60
 */
export const LEVELS = {
    "Intro": [ // Section Introduction (4 Rook, 4 Bishop, 4 Knight, 4 Queen, 4 Multi)
        // Rook
        "8/8/8/8/2P1rP2/5P2/8/8 b - - 0 1 (What's up?)", // 1 (3 targets, Rook, score=66)
        "8/8/4P3/3PP3/3rP3/8/8/8 b - - 0 1 (They're all huddled together. Easy pickings!)", // 2 (4 targets, Rook, score=58)
        "2P5/8/2P4P/2P4r/8/8/7P/8 b - - 0 1 (Better get the order right here...)", // 3 (5 targets, Rook, score=68)
        "8/8/1P1PP3/8/2PrP3/3P4/8/8 b - - 0 1 (Who should I choose first?)", // 4 (6 targets, Rook, score=84)
        // Bishop
        "8/8/4P3/1P1b4/2P5/3P4/8/8 b - - 0 1 (Nice to meet you!)", // 5 (4 targets, Bishop, score=60)
        "8/8/4P3/8/6P1/5P2/6b1/3P3P b - - 0 1 (Gotta plan ahead!)", // 6 (5 targets, Bishop, score=75)
        "8/8/2P3P1/8/P3b3/8/2P3P1/8 b - - 0 1 (Time to zigzag!)", // 7 (5 targets, Bishop, score=60)
        "1P6/6P1/7P/8/5P2/8/1b5P/P7 b - - 0 1 (They're hiding in the corners.)", // 8 (6 targets, Bishop, score=62)
        // Knight
        "8/8/8/4P3/6P1/3P1n2/7P/8 b - - 0 1 (Nobody jumps like me!)", // 9 (4 targets, Knight, score=66)
        "8/8/2n2P2/4P3/3P2P1/5P2/8/8 b - - 0 1 (Let's dance!)", // 10 (5 targets, Knight, score=66)
        "2P5/P2Pn3/1PP5/8/8/8/8/8 b - - 0 1 (Think two hops ahead.)", // 11 (5 targets, Knight, score=66)
        "5n2/4P3/4P1P1/3PP3/5P2/8/8/8 b - - 0 1 (Crowded in here! Pick my hops carefully.)", // 12 (6 targets, Knight, score=75)
        // Queen
        "P7/8/2q5/1P1P4/8/8/8/5P2 b - - 0 1 (Beware of bringing the queen into play.)", // 13 (4 targets, Queen, score=74)
        "8/8/5P2/q5P1/8/8/P1PP4/8 b - - 0 1 (With great power come tricky choices.)", // 14 (5 targets, Queen, score=74)
        "8/8/8/P2qP3/P7/8/7P/P7 b - - 0 1 (Am I on the right track?)", // 15 (5 targets, Queen, score=74)
        "8/2P5/8/3P4/8/4PP2/5P2/2Pq4 b - - 0 1 (Hello, my little ones.)", // 16 (6 targets, Queen, score=81)
        // Multi
        "8/4r1P1/8/5P2/8/6N1/8/8 b - - 0 1 (If I capture a piece, I become that piece!)", // 17 (3 targets, Multi, score=20)
        "1PQ5/1rN5/1P6/8/8/8/8/8 b - - 0 1 (Transformation is a journey without a final destination.)", // 18 (4 targets, Multi, score=69)
        "5B1P/6P1/5P1r/8/8/8/5Q2/8 b - - 0 1 (I need to plan ahead.)", // 19 (5 targets, Multi, score=71)
        "8/8/1Q3P2/8/6P1/4b3/5N1P/5P2 b - - 0 1 (This will be the last challenge of the introduction.)", // 20 (6 targets, Multi, score=74)
    ],
    "Rook": [ // Section Rook
        // 4x6 targets
        "8/P2P4/2PP4/P3r1P1/8/8/8/8 b - - 0 1 (Steady aim. Pick them off.)", // 1 (6 targets, score=66)
        "8/PP6/P7/8/8/1P2rP2/8/P7 b - - 0 1 (Lined up like dominoes!)", // 2 (6 targets, score=66)
        "8/8/8/3P4/8/1PrP4/5P2/3P1P2 b - - 0 1 (Surrounded! But I like a challenge.)", // 3 (6 targets, score=75)
        "8/8/P7/8/P2P3r/P3P2P/8/8 b - - 0 1 (Not a problem.)", // 4 (6 targets, score=77)

        // 4x7 targets
        "8/2P3P1/8/8/r5P1/P4PP1/2P5/8 b - - 0 1 (Classic.)", // 5 (7 targets, score=73)
        "8/8/P5P1/2P5/P5rP/8/2P4P/8 b - - 0 1 (They think distance will save them.)", // 6 (7 targets, score=74)
        "P2P4/8/2P2P2/8/2PP4/3P1r2/8/8 b - - 0 1 (Getting crowded in here.)", // 7 (7 targets, score=76)
        "2PrPP1P/8/8/2P5/8/3P3P/8/8 b - - 0 1 (Right in the thick of it!)", // 8 (7 targets, score=81)

        // 4x8 targets
        "8/r6P/8/8/8/P1P5/2P4P/3PP2P b - - 0 1 (They are hiding in the corners.)", // 9 (8 targets, score=76)
        "1P6/1P1P3P/8/1r4P1/8/8/8/2P3PP b - - 0 1 (Top and bottom. I cover it all.)", // 10 (8 targets, score=76)
        "8/8/8/P1P1P3/8/2P3PP/6r1/2P3P1 b - - 0 1 (Smart... but not smart enough.)", // 11 (8 targets, score=79)
        "r5PP/6P1/2P4P/8/P1P4P/8/8/8 b - - 0 1 (Corner to corner. Let us go!)", // 12 (8 targets, score=82)

        // 4x9 targets
        "8/8/8/1P1P1P2/1P1r1P2/8/1P3P2/3PP3 b - - 0 1 (Right in the middle of trouble.)", // 7 (9 targets, score=78)
        "?",
        "?",
        "?",

        // 2x10 targets
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 b - - 0 1 (This is getting serious.)", // 8 (10 targets, score=79)
        "P1P1P3/r1P2P2/4P3/8/4P2P/2P4P/8/8 b - - 0 1 (Tight squeeze.)", // 10 (10 targets, score=82)

        // 1x11 targets
        "3P4/PP6/1r6/1P6/1P6/P2P3P/P1P4P/8 b - - 0 1 (All hiding down below. Here I come!)", // 11 (11 targets, score=82)

        // 1x12 targets
        "3P4/8/3P1P2/P5P1/P4PPr/8/8/P3P1PP b - - 0 1 (They filled the bottom rows. Rude.)", // 14 (12 targets, score=89)
    ],
    "Bishop": [ // Section Bishop
        // 4x6 targets
        "4P3/8/2P3P1/5b2/4P3/3P4/8/7P b - - 0 1 (All bunched up on one side. Diagonal time!)", // 1 (6 targets, score=52)
        "4P3/8/6P1/8/P1P5/3P4/P7/1b6 b - - 0 1 (Spread across the board. Classic.)", // 2 (6 targets, score=49)
        "8/8/8/5P2/4P3/3P1P1P/2P5/3b4 b - - 0 1 (A long diagonal journey awaits.)", // 3 (6 targets, score=46)
        "8/2P1P3/3P4/2b3P1/5P2/4P3/8/8 b - - 0 1 (Tucked in the corner. Tricky!)", // 4 (6 targets, score=57)
        "8/3P3P/8/1P3P2/8/3P3P/8/1P3b2 b - - 0 1 (All on my color. Delicious.)", // 5 (7 targets, score=75)
        "7P/P3P3/8/2P3P1/3P4/b3P3/8/2P5 b - - 0 1 (I eat diagonals for breakfast.)", // 6 (8 targets, score=85)
        "7P/P3P3/5P2/2P3P1/3P4/4P3/1P6/2b5 b - - 0 1 (Long diagonals ahead!)", // 7 (9 targets, score=82)
        "8/3P1P2/2P5/5P1P/6P1/3P1P1b/2P5/5P2 b - - 0 1 (Stay focused!)", // 8 (10 targets, score=80)
        "2b5/1P1P3P/P3P1P1/1P6/4P3/7P/6P1/8 b - - 0 1 (Pawns everywhere. My kind of party.)", // 9 (10 targets, score=79)
        "2P5/1P1P4/b7/1P3P2/P3P3/8/2P1P3/5P2 b - - 0 1 (They lined up nicely for me.)", // 10 (10 targets, score=88)
        "4P3/3P1P2/4P3/1P6/2P3P1/3P1P2/P5b1/5P2 b - - 0 1 (Time for some fancy footwork!)", // 11 (11 targets, score=83)
        "4P3/5P2/2P1P3/1b5P/6P1/1P1P4/4P3/3P1P2 b - - 0 1 (Trapped in the middle? I think not!)", // 12 (11 targets, score=84)
        "4P1P1/3P3P/2P1b1P1/5P2/2P5/1P6/P7/1P5P b - - 0 1 (I love a full board.)", // 13 (12 targets, score=88)
        "7P/2P1b3/1P6/P1P1P1P1/3P1P1P/8/1P3P2/8 b - - 0 1 (A sea of pawns! Where do I start?)", // 14 (12 targets, score=88)
        "4P1P1/3P1P2/4P1P1/3P4/b3P3/1P6/2P3P1/1P3P2 b - - 0 1 (Every diagonal counts now.)", // 15 (13 targets, score=90)
        "5P2/2P1P3/3P1P2/b5P1/1P6/P1P5/1P5P/P5P1 b - - 0 1 (They filled the edges. Bold move.)", // 16 (13 targets, score=90)
        "3P1P1P/P3P1P1/1b6/P5P1/1P3P2/4P3/1P3P2/4P3 b - - 0 1 (My diagonal skills will be tested!)", // 17 (14 targets, score=93)
        "6P1/3P3P/P3P3/1P6/2P1P1P1/1P3P1b/4P3/5P1P b - - 0 1 (Almost no empty squares on my color!)", // 18 (14 targets, score=92)
        "6P1/7P/b3P3/1P1P1P1P/2P3P1/5P2/P1P5/1P1P3P b - - 0 1 (The board is almost full!)", // 19 (15 targets, score=92)
        "8/P1P3P1/3b3P/6P1/1P5P/P1P3P1/1P1P1P1P/2P3P1 b - - 0 1 (The ultimate diagonal maze!)" // 20 (16 targets, score=99)
    ],
    "Knight": [ // Section Knight
        "P7/2P5/1P6/3P4/PP6/2n5/8/8 b - - 0 1 (Time to hop out!)", // 1 (6 targets, score=75)
        "4P3/5P2/3P4/1n2P3/3P4/5P2/8/8 b - - 0 1 (I want some oats.)", // 2 (6 targets, score=66)
        "8/8/8/8/5P2/5P1n/4P2P/5PP1 b - - 0 1 (All up in the corner.)", // 3 (6 targets, score=66)
        "3P4/1P6/4P3/n1P5/8/1P6/3P4/8 b - - 0 1 (Tricky layout. I like it!)", // 4 (6 targets, score=74)
        "8/8/P7/2P5/1n2P3/3P2P1/4PP2/8 b - - 0 1 (A horse is a horse, of cause, of cause.)", // 5 (7 targets, score=77)
        "3P1P1P/5P1P/2P1P1n1/6P1/8/8/8/8 b - - 0 1 (I like it.)", // 6 (8 targets, score=83)
        "8/8/P7/2n5/PP6/2PP4/1P3P2/3P3P b - - 0 1 (Time to dive in!)", // 7 (9 targets, score=87)
        "5P2/2n5/4P3/1P1P4/1P3P2/P3P3/2P3P1/8 b - - 0 1 (Gonna need my best jumps.)", // 8 (10 targets, score=88)
        "8/6P1/5n2/7P/2P1PP2/3P2P1/1P1P4/5P2 b - - 0 1 (They scattered! Good luck catching me.)", // 9 (10 targets, score=86)
        "6PP/4PP2/2P3P1/4P1P1/8/5P1n/8/6P1 b - - 0 1 (A wall of pawns. I jump walls.)", // 10 (10 targets, score=88)
        "3PP3/2P1PP2/2PP3P/1P1n1P2/8/P7/8/8 b - - 0 1 (The board is getting crowded!)", // 11 (11 targets, score=88)
        "2P3P1/4P3/1P3P1P/3PPn2/4P1P1/8/5P2/8 b - - 0 1 (They blocked the middle. Cute.)", // 12 (11 targets, score=90)
        "3PPP1P/1P1P1PP1/1P2PPP1/2n5/8/8/8/8 b - - 0 1 (Challenge accepted!)", // 13 (12 targets, score=89)
        "7P/8/6P1/3PP3/5nPP/4PP2/6PP/4PP2 b - - 0 1 (A pawn fortress! But I jump.)", // 14 (12 targets, score=98)
        "2P5/PP6/1P1P4/1PPP4/PPn5/P2P4/8/4P3 b - - 0 1 (This is a knight marathon!)", // 15 (13 targets, score=94)
        "8/8/3P4/3P1PP1/4PP2/3P2nP/1P3PP1/3PP3 b - - 0 1 (Dense formation. Every hop matters.)", // 16 (13 targets, score=92)
        "3P1P2/1P3P1P/8/2P1P1P1/3P1n2/1P1P1P1P/8/6P1 b - - 0 1 (Zigzag through the chaos!)", // 17 (14 targets, score=94)
        "8/5P2/2P4P/P1P1P3/PP4P1/1PPn4/P4P2/7P b - - 0 1 (They covered the whole board!)", // 18 (14 targets, score=95)
        "8/3P4/1P3P2/3PP2P/8/P1P1P1P1/2PPn3/1P1P1P2 b - - 0 1 (Almost impossible... almost.)", // 19 (15 targets, score=97)
        "8/8/5PP1/5PPP/4PP1P/2PP1PP1/n3P3/1PP3P1 b - - 0 1 (The ultimate knight tour!)" // 20 (16 targets, score=100)
    ],
    "Queen": [ // Section Queen
        "7P/8/4P3/3q2P1/7P/4P3/8/4P3 b - - 0 1 (Watch me work.)", // 1 (6 targets, score=81)
        "8/2PP4/1P6/8/2Pq4/8/3P4/2P5 b - - 0 1 (They boxed me in. How adorable.)", // 2 (6 targets, score=58)
        "P5P1/8/8/8/q6P/5P1P/8/7P b - - 0 1 (Lined up for me. Too kind!)", // 3 (6 targets, score=41)
        "P1q1P1P1/1P6/8/3P4/1P6/8/8/8 b - - 0 1 (I reach everywhere.)", // 4 (6 targets, score=58)
        "8/5P2/P1P5/8/2P1P1P1/8/8/5qP1 b - - 0 1 (Still warming up.)", // 5 (7 targets, score=71)
        "2P5/3P1P2/8/6P1/4q3/8/4P1P1/2P3P1 b - - 0 1 (All directions — my specialty!)", // 6 (8 targets, score=72)
        "8/4Pq1P/6PP/P6P/8/8/6P1/P1P5 b - - 0 1 (Even queens need to plan.)", // 7 (9 targets, score=88)
        "4P3/8/P3P3/8/4P2P/3Pq3/7P/PP1P4 b - - 0 1 (Strategy time!)", // 8 (10 targets, score=80)
        "3P1P1P/5PP1/2PP4/8/1q6/8/5P2/1PP5 b - - 0 1 (Top half is packed. Let me at them!)", // 9 (10 targets, score=78)
        "Pq6/P2P3P/8/3P1P2/5P2/8/4P3/P3P3 b - - 0 1 (Corner start. Long road ahead.)", // 10 (10 targets, score=85)
        "4q1P1/1P2P3/8/5P2/8/7P/PP4P1/P2P3P b - - 0 1 (Now we are talking!)", // 11 (11 targets, score=86)
        "P5P1/P5P1/7P/5P2/PP3PP1/8/4P3/3q4 b - - 0 1 (They filled the edges. Bring it!)", // 12 (11 targets, score=85)
        "1P1P4/1P1P4/P7/3P1P2/3q4/4PP2/1P6/2P1P3 b - - 0 1 (Time to show who rules.)", // 13 (12 targets, score=92)
        "3PP3/1P6/1P1Pq3/8/4P1PP/2PP4/1P6/5P2 b - - 0 1 (Complicated? I am the queen!)", // 14 (12 targets, score=91)
        "4P3/1P3q1P/5P2/PP6/1P6/1PP5/8/3P1P2 b - - 0 1 (This board is my kingdom.)", // 15 (11 targets, score=93)
        "P2P2q1/3P4/P4P2/8/1P5P/1P4P1/4P3/5P2 b - - 0 1 (They dare challenge the queen?)", // 16 (11 targets, score=91)
        "2P5/2P5/4P3/3q4/P3P3/5P2/3PPPPP/2P5 b - - 0 1 (A pawn army. How cute.)", // 17 (12 targets, score=96)
        "3P1P2/8/P1Pq3P/5P2/PP5P/6P1/6P1/8 b - - 0 1 (Scattered far. I go everywhere.)", // 18 (11 targets, score=94)
        "6P1/1P2P3/P7/P5PP/1P6/3q2P1/7P/P7 b - - 0 1 (Easy for royalty.)", // 19 (11 targets, score=94)
        "2P5/2P3qP/4P3/3P4/3PPP2/5PP1/3P4/P7 b - - 0 1 (My greatest conquest!)" // 20 (12 targets, score=100)
    ],
    "Multi": [ // Section Multi
        "5P2/3P4/4N1P1/3rQ3/5P2/8/8/8 b - - 0 1 (Grab that knight, then clean up.)", // 2 (6 targets, score=70)
        "3P4/2Q3rP/2B4P/8/7P/8/8/8 b - - 0 1 (So many options... love it!)", // 3 (6 targets, score=75)
        "8/8/6rP/8/4N1RP/4P2P/8/8 b - - 0 1 (Time to get creative!)", // 1 (6 targets, score=?
        "4P3/8/8/8/PB6/1Q6/Pr2P3/8 b - - 0 1 (All around the World.)", // 4 (6 targets, score=60)
        "8/8/8/4PPQ1/3P4/3PrPN1/8/8 b - - 0 1 (Transform wisely!)", // 5 (7 targets, score=85)
        "3P4/1nR5/Q3P3/1PN5/3P4/8/8/8 b - - 0 1 (Three piece types to juggle!)", // 6 (7 targets, score=74)
        "4N3/2QP2N1/4P3/2r1P3/3P4/5P2/8/8 b - - 0 1 (What a lineup! Let me shift around.)", // 7 (8 targets, score=86)
        "4P1P1/3PQ3/8/8/4B3/P6P/6b1/7Q b - - 0 1 (Shape-shifting is my superpower.)", // 8 (8 targets, score=89)
        "8/NP2R3/2Q1N3/2P5/1r6/1P6/P7/2P5 b - - 0 1 (Pick the right form!)", // 9 (9 targets, score=82)
        "8/8/8/8/3n4/1PNP4/2PNR3/P1P2Q2 b - - 0 1 (So many pieces, so many forms!)", // 10 (9 targets, score=90)
        "P2P1R2/8/1N1B1rB1/5PP1/8/3Q4/6P1/8 b - - 0 1 (The transformations get wild!)", // 11 (10 targets, score=91)
        "8/8/2N5/1Q1P4/P1b1P3/6N1/2P2B2/3P3B b - - 0 1 (A whole zoo of pieces out there.)", // 12 (10 targets, score=87)
        "1B2B3/2Q5/1R6/4P3/8/4Q3/2n4P/2P1P2P b - - 0 1 (Bishops, queens, rooks — I want them all!)", // 13 (10 targets, score=92)
        "2N5/8/1B3P2/8/1P1r2B1/2P1P3/3P4/Q5N1 b - - 0 1 (Every capture changes who I am.)", // 14 (10 targets, score=87)
        "P2NR3/8/1Q1Q1N2/P1P5/N3P2b/8/5P2/8 b - - 0 1 (Plan every shift!)", // 15 (11 targets, score=90)
        "8/5BNr/3RNP1R/6PP/5PN1/7P/8/8 b - - 0 1 (Three rooks, three knights... let me in!)", // 16 (11 targets, score=89)
        "B7/1NN5/1P1RQ3/8/PQ3B2/3n4/1P3P2/3P4 b - - 0 1 (My identity crisis begins!)", // 17 (12 targets, score=95)
        "1R2P1Q1/2Q2P2/1P6/1r1B3P/8/8/5PN1/1N2Q3 b - - 0 1 (So many queens on the board? Bold.)", // 18 (12 targets, score=97)
        "1Q6/bP2P1P1/R7/4P3/Q7/2Q5/1N2N3/3N2P1 b - - 0 1 (A royal mess. I love it!)", // 19 (12 targets, score=94)
        "5B2/8/4N3/3n1P2/3Q1P2/4PPPB/8/3N1RR1 b - - 0 1 (The ultimate shapeshifter challenge!)" // 20 (12 targets, score=96)
    ],
}
