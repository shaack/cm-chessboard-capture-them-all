# E2E-Tests

1. Test 1 (Sequential): Plays through all 100 levels in order (Rook → Bishop → Knight → Queen → Multi), verifies .game-complete-card appears after the last level
2. Test 2 (Last missing level): Sets all levels beaten except the last Rook level, solves it, verifies congratulations screen appears
3. Test 3 (Re-solve no congrats): With all levels already beaten, re-solves one — verifies the "Level solved" dialog appears instead of congratulations
4. Test 4 (Quick smoke): Tests first and last level of each category (10 levels total)   