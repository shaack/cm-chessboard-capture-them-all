import {Confetti} from "../Confetti.js"
import {Audio} from "../../node_modules/cm-web-modules/src/audio/Audio.js"
import {Sample} from "../../node_modules/cm-web-modules/src/audio/Sample.js"

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
            if (this.congratsSound) {
                const now = Audio.context().currentTime
                this.congratsSound.gainNode.gain.setValueAtTime(this.congratsSound.gainNode.gain.value, now)
                this.congratsSound.gainNode.gain.linearRampToValueAtTime(0, now + 2)
                setTimeout(() => { this.congratsSound.stop() }, 2100)
            }
            this.card.classList.add("game-complete-card-exit")
            this.card.addEventListener("animationend", () => {
                setTimeout(() => {
                    this.app.navigate("menu")
                }, 2000)
            }, {once: true})
        }
        this.okButton.addEventListener("click", this.okHandler)
        this.confettiAnimationId = Confetti.firework(10000)
        if (!Audio.context()) {
            Audio.createContext()
        }
        this.congratsSound = new Sample("./assets/congratulations.mp3", {loop: true, gain: 0.8})
        this.congratsSound.play()
    }

    hide() {
        if (this.okButton) {
            this.okButton.removeEventListener("click", this.okHandler)
        }
        if (this.congratsSound) {
            this.congratsSound.stop()
        }
        Confetti.stopFirework(this.confettiAnimationId)
        this.confettiAnimationId = null
    }
}
