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
        const colors = ['#e96c0e', '#ff9f43', '#ffd700', '#ffffff']
        let animationId
        function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: {x: 0},
                colors: colors
            })
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: {x: 1},
                colors: colors
            })
            if (Date.now() < end) {
                animationId = requestAnimationFrame(frame)
            }
        }
        frame()
        return animationId
    }

    static stopFirework(animationId) {
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
    }
}