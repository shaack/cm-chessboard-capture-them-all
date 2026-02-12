import {Confetti} from "../Confetti.js"

export class GameCompletePage {
    constructor(app) {
        this.app = app
        this.confettiAnimationId = null
    }

    show(container) {
        container.innerHTML = `
            <div class="menu-background">
                <div class="menu-card game-complete-card">
                    <h1 class="menu-title">Congratulations!</h1>
                    <p class="menu-description">You solved all levels… more coming soon.</p>
                    <p class="menu-description">Capture Them All, a game by <a href="http://7d0.com" target="_blank">7d0</a>.</p>
                    <div class="Menu">
                        <button class="play-button" id="okButton">OK</button>
                    </div>
                </div>
            </div>
        `
        this.okButton = document.getElementById("okButton")
        this.card = container.querySelector(".game-complete-card")
        this.okHandler = () => {
            Confetti.stopFirework(this.confettiAnimationId)
            this.confettiAnimationId = null
            this.card.classList.add("game-complete-card-exit")
            this.card.addEventListener("animationend", () => {
                setTimeout(() => {
                    this.app.navigate("menu")
                }, 2000)
            }, {once: true})
        }
        this.okButton.addEventListener("click", this.okHandler)
        this.confettiAnimationId = Confetti.firework(10000)
    }

    hide() {
        if (this.okButton) {
            this.okButton.removeEventListener("click", this.okHandler)
        }
        Confetti.stopFirework(this.confettiAnimationId)
        this.confettiAnimationId = null
    }
}
