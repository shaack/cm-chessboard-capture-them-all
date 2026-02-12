/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */

export class Confetti {
    static shoot() {
        var count = 200;
        var defaults = {
            origin: { y: 0.9 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }

    static firework(durationMs) {
        const end = Date.now() + durationMs
        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval)
                return
            }
            confetti({
                particleCount: 80,
                spread: 100,
                startVelocity: 40 + Math.random() * 30,
                origin: {
                    x: 0.2 + Math.random() * 0.6,
                    y: 0.2 + Math.random() * 0.4
                },
                colors: ['#e96c0e', '#ff9f43', '#ffd700', '#ff6b6b', '#fff', '#48dbfb']
            })
        }, 300)
        return interval
    }
}