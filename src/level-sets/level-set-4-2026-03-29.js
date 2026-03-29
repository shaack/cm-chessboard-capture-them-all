/**
 * Author: Stefan Haack, Michael Hinz (7d0.com)
 *
 * ALL Levels should have score > 60
 */
export const LEVELS = {
    "Intro": [ // Section Introduction (4 Rook, 4 Bishop, 4 Knight, 4 Queen, 4 Multi)
        // Rook
        "8/8/8/8/2P1rP2/5P2/8/8 b - - 0 1 (What's up?)", // 1 (3 targets, score=66)
        "8/8/8/2PPP3/3Pr3/8/8/8 b - - 0 1 (They're all huddled together. Easy pickings!)", // 2 (4 targets, score=58)
        "8/2P5/8/2PP4/2Pr4/8/3P4/8 b - - 0 1 (Better get the order right here...)", // 3 (5 targets, score=68)
        "8/1P1PP3/8/8/2PrP3/3P4/8/8 b - - 0 1 (It's a trap!)", // 4 (6 targets, score=84)
        // Bishop
        "8/8/5P2/2P1b3/3P4/4P3/8/8 b - - 0 1 (Nice to meet you!)", // 5 (4 targets, score=60)
        "8/8/4P3/8/6P1/5P2/6b1/3P3P b - - 0 1 (Gotta get out of this corner.)", // 6 (5 targets, score=75)
        "8/8/2P3P1/8/P3b3/8/2P3P1/8 b - - 0 1 (Time to zigzag!)", // 7 (5 targets, Bishop, score=60)
        "1P6/6P1/7P/8/5P2/8/1b5P/P7 b - - 0 1 (They're hiding in the corners.)", // 8 (6 targets, score=62)
        // Knight
        "8/8/3P4/5P2/2P1n3/6P1/8/8 b - - 0 1 (Nobody jumps like me!)", // 9 (4 targets, score=66)
        "8/8/2n2P2/4P3/3P2P1/5P2/8/8 b - - 0 1 (Let's dance!)", // 10 (5 targets, Knight, score=66)
        "8/8/4P3/2P2Pn1/3PP3/8/8/8 b - - 0 1 (Think two hops ahead.)", // 11 (5 targets, score=66)
        "8/4n3/3P4/3P1P2/2PP4/4P3/8/8 b - - 0 1 (Crowded in here! Pick my hops carefully.)", // 12 (6 targets, score=75)
        // Queen
        "1P6/8/8/4q3/3P1P2/8/8/6P1 b - - 0 1 (Beware of bringing the queen into play.)", // 13 (4 targets, score=74)
        "8/8/5P2/q5P1/8/8/P2P4/2P5 b - - 0 1 (With great power come tricky choices.)", // 14 (5 targets, score=79)
        "8/8/8/P2qP3/P7/8/7P/P7 b - - 0 1 (Am I on the right track?)", // 15 (5 targets, Queen, score=74)
        "8/2P5/8/3P4/8/4PP2/5P2/2Pq4 b - - 0 1 (Hello, my little ones.)", // 16 (6 targets, Queen, score=81)
        // Multi
        "8/4r1Q1/8/5B2/4P3/6N1/8/8 b - - 0 1 (If I capture a piece, I become that piece!)", // 17 (4 targets, score=62)
        "8/8/3QR3/3rN3/8/8/3P4/8 b - - 0 1 (Transformation is a journey without a final destination.)", // 18 (4 targets, score=73)
        "8/5Q2/8/8/3r1P2/4P3/3P1B2/8 b - - 0 1 (I need to plan ahead.)", // 19 (5 targets, score=71)
        "8/1Q3P2/8/6P1/4b3/5N1P/5P2/8 b - - 0 1 (Lost in transformation.)", // 20 (6 targets, score=74)
    ],
    "Rook": [ // Section Rook
        // 4x6 targets
        "8/8/2P1P3/3PP3/2P2rP1/8/8/8 b - - 0 1 (Steady aim. Pick 'em off.)", // 1 (6 targets, score=66)
        "2P1PP2/3P1P2/8/8/8/3r4/3P4/8 b - - 0 1 (Better catch up!)", // 2 (6 targets, score=66)
        "8/8/2PP4/2P5/3PrP2/3P4/8/8 b - - 0 1 (Surrounded! But I like a challenge.)", // 3 (6 targets, score=75)
        "8/8/1P6/8/1P1P2r1/1P2P1P1/8/8 b - - 0 1 (It's not a problem for me...)", // 4 (6 targets, score=77)

        // 4x7 targets
        "8/8/8/4P1P1/3r2P1/3P1PP1/4P3/8 b - - 0 1 (Classic.)", // 5 (7 targets, score=73)
        "P5P1/8/8/2P5/P5rP/8/8/2P4P b - - 0 1 (They think distance will save them.)", // 6 (7 targets, score=74)
        "8/8/2P1P3/3P1P2/3PP3/4Pr2/8/8 b - - 0 1 (Getting crowded in here.)", // 7 (7 targets, score=76)
        "8/2PrPPP1/8/2P5/8/8/8/3P2P1 b - - 0 1 (Lined up like dominoes.)", // 8 (7 targets, score=81)

        // 4x8 targets
        "8/r6P/8/8/8/P1P5/2P4P/3PP2P b - - 0 1 (Come to daddy...)", // 9 (8 targets, score=76)
        "3P1P2/3P2P1/8/3r4/8/8/3PP3/4PP2 b - - 0 1 (Top and bottom. I cover it all.)", // 10 (8 targets, score=78)
        "8/P6P/7P/5PPP/8/r5P1/P7/8 b - - 0 1 (Smart... but not smart enough.)", // 11 (8 targets, score=84)
        "r5PP/6P1/2P4P/8/8/8/8/P1P4P b - - 0 1 (Corner to corner. Let us go!)", // 12 (8 targets, score=82)

        // 4x9 targets
        "PP6/8/P7/P1P5/2Pr1P2/2P5/8/1P6 b - - 0 1 (A wall of pawns.)", // 13 (9 targets, score=75)
        "8/8/8/2PP1P2/2Pr1P2/2P2P2/3PP3/8 b - - 0 1 (Right in the middle of trouble.)", // 14 (9 targets, score=78)
        "5PPP/8/8/8/P7/P2r4/P5P1/3P1P2 b - - 0 1 (They scattered everywhere!)", // 15 (9 targets, score=82)
        "8/3P3P/P7/7P/8/8/P4rP1/P4P1P b - - 0 1 (Long roads ahead.)", // 16 (9 targets, score=82)

        // 2x10 targets
        "8/1P5P/P3P3/1P1P1P2/P6P/1P1r4/8/8 b - - 0 1 (This is getting serious.)", // 17 (10 targets, score=79)
        "4rP2/8/1P2PP2/8/2PP1P2/4P3/8/1PP5 b - - 0 1 (Tight squeeze.)", // 18 (10 targets, score=82)

        // 1x11 targets and 1x12 targets
        "8/8/8/2P5/2rP4/1P1P4/P2PP3/1PP1P1P1 b - - 0 1 (All hiding down below. Here I come!)", // 19 (11 targets, score=85)
        "8/1PPP1P2/2PP4/1Pr2PP1/8/8/2P4P/1P6 b - - 0 1 (This is going to be tough.)", // 20 (12 targets, score=100)
    ],
    "Bishop": [ // Section Bishop
        // 4x6 targets
        "4P3/8/2P3P1/5b2/4P3/3P4/8/7P b - - 0 1 (Diagonal time!)", // 1 (6 targets, score=71)
        "4P3/8/6P1/8/P1P5/3P4/P7/1b6 b - - 0 1 (Spread across the board.)", // 2 (6 targets, score=66)
        "8/4P3/3P4/2P1P1P1/1P6/2b5/8/8 b - - 0 1 (That's all you got?)", // 3 (6 targets, score=79)
        "8/2P1P3/3P4/2b3P1/5P2/4P3/8/8 b - - 0 1 (This looks nice...)", // 4 (6 targets, score=62)
        // 4x7 targets
        "3P1P2/4P3/1P5P/8/8/b7/3P4/2P5 b - - 0 1 (Diagonal highway ahead.)", // 5 (7 targets, score=66)
        "8/3P3P/8/1P3P2/8/3P3P/8/1P3b2 b - - 0 1 (I like geometry.)", // 6 (7 targets, score=75)
        "3P4/4P3/8/8/7P/P1P3P1/1P6/4b3 b - - 0 1 (Three groups – I will catch them all.)", // 7 (7 targets, score=77)
        "8/8/2P1P3/3b4/P3P3/5P1P/6P1/8 b - - 0 1 (Surrounded by snacks!)", // 8 (7 targets, score=81)
        // 4x8 targets
        "7P/6P1/3b1P1P/2P5/7P/4P3/3P4/8 b - - 0 1 (Zigzag through the ranks.)", // 9 (8 targets, score=70)
        "2P3P1/1P5P/P7/5P2/8/8/P5b1/5P2 b - - 0 1 (One after another...)", // 10 (8 targets, score=73)
        "4P3/3P1P2/2P3P1/3b4/P7/8/4P3/3P4 b - - 0 1 (Looks like migratory birds.)", // 11 (8 targets, score=78)
        "8/8/b7/5P2/4P1P1/3P3P/2P1P3/1P6 b - - 0 1 (Come on over, if you dare.)", // 12 (8 targets, score=75)
        // 4x9 targets
        "3P4/8/8/P1b1P3/1P6/8/1P1P3P/2P3P1 b - - 0 1 (Far-flung pawns. Time to roam.)", // 13 (9 targets, score=73)
        "8/6P1/1P1P1P1P/2P1b3/3P4/4P3/5P2/8 b - - 0 1 (They lined up on - my - diagonals.)", // 14 (9 targets, score=83)
        "P3P3/5P2/2b1P3/1P6/4P1P1/3P4/8/5P2 b - - 0 1 (Nine targets, one bishop. Let's go!)", // 15 (9 targets, score=83)
        "6P1/5P1P/4P3/5P2/P3P3/1P5b/6P1/8 b - - 0 1 (Every diagonal counts now.)", // 16 (9 targets, score=86)
        // 2x10 targets
        "3P4/4P3/1P1P4/8/1b1P4/2P1P3/1P6/P5P1 b - - 0 1 (Ten out of ten.)", // 17 (10 targets, score=85)
        "8/8/6P1/1P5P/2P3P1/3b1P2/2P1P1P1/3P4 b - - 0 1 (They lined up nicely for me.)", // 18 (10 targets, score=93)
        // 1x11 targets and 1x12 targets
        "4P3/3P1P2/4P3/1P6/2P3P1/3P1P2/P5b1/5P2 b - - 0 1 (Time for some fancy footwork!)", // 19 (11 targets, score=83)
        "8/2b5/1P1P1P2/P1P3P1/8/4P3/3P1P2/2P1P1P1 b - - 0 1 (Ah, the pyramids!)", // 20 (12 targets, score=94)
    ],
    "Knight": [ // Section Knight
        "8/2P5/4P3/3P4/5P2/2PP4/4n3/8 b - - 0 1 (Time to hop out!)", // 1 (6 targets, score=75)
        "8/4P3/5P2/3P4/1n2P3/3P4/5P2/8 b - - 0 1 (I want some oats.)", // 2 (6 targets, score=66)
        "8/8/8/8/5P2/5P1n/4P2P/5PP1 b - - 0 1 (All up in the corner.)", // 3 (6 targets, score=66)
        "3P4/1P6/4P3/n1P5/8/1P6/3P4/8 b - - 0 1 (Tricky layout. I like it!)", // 4 (6 targets, score=74)
        "8/8/P7/2P5/1n2P3/3P2P1/4PP2/8 b - - 0 1 (A horse is a horse, of cause, of cause.)", // 5 (7 targets, score=77)
        "8/8/3nP3/5P2/2PP4/4PP2/3P4/8 b - - 0 1 (I like it.)", // 6 (7 targets, score=78)
        "8/8/4n3/2P2P2/3P4/1P2P1P1/2P5/8 b - - 0 1 (Time to dive in!)", // 7 (7 targets, score=76)
        "8/5P2/3P4/1P2PP2/3P4/P4n2/8/8 b - - 0 1 (Gonna need my best jumps.)", // 8 (7 targets, score=78)
        "8/2P5/8/3P1P2/3n4/2P1P1P1/2P1P3/8 b - - 0 1 (Good luck catching me.)", // 9 (8 targets, score=85)
        "8/5P2/2PPP3/1P4P1/3Pn3/2P5/8/8 b - - 0 1 (Jump - jump, another higher.)", // 10 (8 targets, score=85)
        "8/8/5P2/3n4/4P3/2P1PP2/3P4/3P1P2 b - - 0 1 (Yay!)", // 11 (8 targets, score=85)
        "8/8/2P1P1P1/1PP1P3/3P1P2/3n4/8/8 b - - 0 1 (They blocked the middle.)", // 12 (8 targets, score=85)
        "8/2P5/4P3/3P4/3PPn2/2P1P3/2P1P3/8 b - - 0 1 (Challenge accepted!)", // 13 (9 targets, score=90)
        "8/8/P4P2/2PP2P1/4PP2/3P3P/5n2/8 b - - 0 1 (A pawn fortress!)", // 14 (9 targets, score=90)
        "5P2/8/4P3/2P5/3PP3/1nP2P2/3PP3/8 b - - 0 1 (This is a knight marathon!)", // 15 (9 targets, score=90)
        "8/6P1/8/1P3P2/3PP3/2P2PP1/3Pn3/8 b - - 0 1 (Every hop matters.)", // 16 (9 targets, score=90)
        "8/P7/2PP4/1P2P3/3nP2P/1P3P2/3P4/8 b - - 0 1 (Zigzag through the chaos!)", // 17 (10 targets, score=90)
        "8/3P4/5PP1/2PPP3/P3n1P1/2P5/5P2/8 b - - 0 1 (They covered the whole board!)", // 18 (10 targets, score=93)
        "8/3P4/1P1PP1P1/2n1P1P1/2P1P3/5P2/3P4/8 b - - 0 1 (Almost impossible... almost.)", // 19 (11 targets, score=95)
        "8/4P3/4P3/3P1P2/3P1P2/2PPn3/4P3/2PPP3 b - - 0 1 (The ultimate knight tour!)", // 20 (12 targets, score=96)
    ],
    "Queen": [ // Section Queen
        "7P/8/4P3/3q2P1/7P/4P3/8/4P3 b - - 0 1 (Watch me work.)", // 1 (6 targets, score=81)
        "8/3PP3/2P5/8/3Pq3/8/4P3/3P4 b - - 0 1 (How adorable.)", // 2 (6 targets, score=62)
        "P5P1/8/8/8/q6P/5P1P/8/7P b - - 0 1 (I reach everywhere.)", // 3 (6 targets, score=69)
        "8/8/1P1q1P1P/2P5/8/4P3/2P5/8 b - - 0 1 (Too kind!)", // 4 (6 targets, score=71)
        "5P2/P1P5/8/2P1P1P1/8/8/5qP1/8 b - - 0 1 (Still warming up.)", // 5 (7 targets, score=71)
        "1P6/2P5/8/8/2P2P2/2q2P2/3P3P/8 b - - 0 1 (All directions — my specialty!)", // 6 (7 targets, score=90)
        "3P4/8/8/2P5/8/3q1P2/5P2/1P1P2P1 b - - 0 1 (Even queens need to plan.)", // 7 (7 targets, score=90)
        "8/8/1P2P2P/7P/2q2P2/7P/4P3/8 b - - 0 1 (Strategy time!)", // 8 (7 targets, score=90)
        "1P1P3P/8/PP4P1/6P1/3q4/8/8/3P4 b - - 0 1 (Top half is packed. Let me at them!)", // 9 (8 targets, score=92)
        "8/P1P5/8/1PP5/3P4/8/P2P4/q4P2 b - - 0 1 (Corner start. Long road ahead.)", // 10 (8 targets, score=67)
        "3P4/1P6/4P3/P7/8/1P1P4/8/Pq5P b - - 0 1 (Now we are talking!)", // 11 (8 targets, score=90)
        "8/8/8/7P/P1P5/8/1P4qP/2P3PP b - - 0 1 (Bring it!)", // 12 (8 targets, score=92)
        "8/PP6/8/1P6/5P2/P1P5/P2q2P1/5P2 b - - 0 1 (Time to show who rules.)", // 13 (9 targets, score=95)
        "P4P2/1P5q/8/8/6P1/5P2/8/PP2P2P b - - 0 1 (Complicated? I am the queen!)", // 14 (9 targets, score=97)
        "3P1PP1/8/1P6/8/8/PP2P3/2P2q2/4P3 b - - 0 1 (This board is my kingdom.)", // 15 (9 targets, score=96)
        "8/2P2P2/P2P4/8/1q1P4/1PP5/5P1P/8 b - - 0 1 (They dare challenge the queen?)", // 16 (9 targets, score=99)
        "4P3/P3P3/4PP2/4P1P1/4P1q1/1P6/8/P7 b - - 0 1 (A pawn army. How cute.)", // 17 (10 targets, score=99)
        "3P4/1P4P1/8/8/P4P1P/6P1/2P3qP/6P1 b - - 0 1 (I go everywhere.)", // 18 (10 targets, score=99)
        "3P3P/4P3/P2P4/8/8/1P3PP1/6Pq/1P2P3 b - - 0 1 (Easy for royalty.)", // 19 (11 targets, score=96)
        "2P5/2P3qP/4P3/3P4/3PPP2/5PP1/3P4/P7 b - - 0 1 (My greatest conquest!)", // 20 (12 targets, score=100)
    ],
    "Multi": [ // Section Multi
        "8/4P3/2P5/3N1P2/2rQ4/4P3/8/8 b - - 0 1 (Grab that knight, then clean up.)", // 1 (6 targets, score=70)
        "8/8/2B2R2/1N6/2QP4/1P3q2/8/8 b - - 0 1 (So many options... love it!)", // 2 (6 targets, score=81)
        "8/8/3n4/5P2/2RNN3/4R1P1/8/8 b - - 0 1 (Time to get creative!)", // 3 (6 targets, score=80)
        "6P1/8/8/8/2PB4/3Q4/2Pr2P1/8 b - - 0 1 (All around the World.)", // 4 (6 targets, score=80)
        "8/4PR2/2PN4/4P3/2r2Q2/5B2/8/8 b - - 0 1 (Transform wisely!)", // 5 (7 targets, score=80)
        "8/8/5P2/3nR3/2Q3P1/3PN3/5P2/8 b - - 0 1 (Three piece types to juggle!)", // 6 (7 targets, score=74)
        "Q7/8/8/3N4/2B2rB1/4NB2/6P1/8 b - - 0 1 (What a lineup! Let me shift around.)", // 7 (7 targets, score=74)
        "8/8/3BP3/1P4N1/3P1b2/6R1/3Q4/8 b - - 0 1 (Shape-shifting is my superpower.)", // 8 (7 targets, score=83)
        "8/8/2BPQ3/4PNn1/1RP1P3/8/8/8 b - - 0 1 (Pick the right form!)", // 9 (8 targets, score=85)
        "5QP1/4Nr1P/5P1P/8/8/8/8/5B1R b - - 0 1 (So many pieces, so many forms!)", // 10 (8 targets, score=90)
        "8/8/1BrQ3B/P1Q5/3N4/1P6/3N4/8 b - - 0 1 (The transformations get wild!)", // 11 (8 targets, score=92)
        "8/8/2BR4/2B1Nn2/3QR3/4Q1N1/8/8 b - - 0 1 (A whole zoo of pieces out there.)", // 12 (8 targets, score=95)
        "8/8/1n3P2/1R1P2N1/2P1P3/2B1Q3/3P4/8 b - - 0 1 (Bishops, queens, rooks — I want them all!)", // 13 (9 targets, score=90)
        "8/8/B4B2/3n4/5QR1/2N1NQ2/4QR2/8 b - - 0 1 (Every capture changes who I am... or does it?)", // 14 (9 targets, score=95)
        "8/8/7R/4B3/B2BRb1R/4R1BR/8/8 b - - 0 1 (Bishops vs Rooks.)", // 15 (9 targets, score=95)
        "8/8/3N1N2/4b3/1RR1NR2/2RP4/5N2/8 b - - 0 1 (Four rooks, four knights... let me in!)", // 16 (9 targets, score=96)
        "8/5B2/4q1B1/3R2PB/2N1P3/3Q1B2/8/1B6 b - - 0 1 (My identity crisis begins!)", // 17 (10 targets, score=100)
        "2PP2P1/P3PB2/2P4n/4R1N1/8/5Q1Q/4Q2Q/5QQ1 b - - 0 1 (Six queens for tea?)", // 18 (15 targets, score=99)
        "8/5P2/8/B2Bq1P1/2Q1P3/R1RQN3/5N2/8 b - - 0 1 (A royal mess. I love it!)", // 19 (11 targets, score=100)
        "4RQ1B/8/N4Q1Q/4RRB1/2N4B/4N3/2q5/8 b - - 0 1 (The ultimate shapeshifter challenge!)", // 20 (12 targets, score=100)
    ],
}
