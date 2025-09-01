/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */

export class Confetti {
    static shoot() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
    }
}