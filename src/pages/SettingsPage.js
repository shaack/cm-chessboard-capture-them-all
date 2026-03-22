export class SettingsPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        const musicOn = this.app.state.musicEnabled
        const soundOn = this.app.state.soundEnabled
        container.innerHTML = `
            <div class="page-background">
                <div class="settings-page">
                    <h1>Settings</h1>
                    <div class="settings-list">
                        <div class="settings-item">
                            <span class="settings-label">Music</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="musicToggle" ${musicOn ? "checked" : ""}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="settings-item">
                            <span class="settings-label">Sound Effects</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="soundToggle" ${soundOn ? "checked" : ""}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="settings-reset">
                        <button class="game-btn game-btn-danger" id="resetProgress">Reset Progress</button>
                    </div>
                    <div class="settings-footer">
                        <a href="#" class="returnButton" id="settingsBack">Back</a>
                    </div>
                </div>
            </div>
        `
        this.musicToggle = document.getElementById("musicToggle")
        this.soundToggle = document.getElementById("soundToggle")
        this.resetButton = document.getElementById("resetProgress")
        this.backLink = document.getElementById("settingsBack")

        this.musicHandler = () => {
            this.app.state.musicEnabled = this.musicToggle.checked
            if (this.musicToggle.checked) {
                this.app.unmuteBgm()
            } else {
                this.app.muteBgm()
            }
        }

        this.soundHandler = () => {
            this.app.state.soundEnabled = this.soundToggle.checked
        }

        this.resetHandler = (e) => {
            e.preventDefault()
            if (this.resetConfirmShown) {
                this.app.state.resetProgress()
                this.resetButton.textContent = "Progress Reset!"
                this.resetButton.disabled = true
                this.resetConfirmShown = false
                setTimeout(() => {
                    this.resetButton.textContent = "Reset Progress"
                    this.resetButton.disabled = false
                }, 1500)
            } else {
                this.resetConfirmShown = true
                this.resetButton.textContent = "Are you sure?"
                this.resetButton.classList.add("game-btn-confirm")
            }
        }

        this.resetBlurHandler = () => {
            setTimeout(() => {
                if (this.resetConfirmShown) {
                    this.resetConfirmShown = false
                    this.resetButton.textContent = "Reset Progress"
                    this.resetButton.classList.remove("game-btn-confirm")
                }
            }, 200)
        }

        this.backHandler = (e) => {
            e.preventDefault()
            const checkpoint = this.app.state.MenuCheckpoint
            this.app.navigate(checkpoint ? checkpoint : "menu")
        }

        this.musicToggle.addEventListener("change", this.musicHandler)
        this.soundToggle.addEventListener("change", this.soundHandler)
        this.resetButton.addEventListener("click", this.resetHandler)
        this.resetButton.addEventListener("blur", this.resetBlurHandler)
        this.backLink.addEventListener("click", this.backHandler)
    }

    hide() {
        if (this.musicToggle) this.musicToggle.removeEventListener("change", this.musicHandler)
        if (this.soundToggle) this.soundToggle.removeEventListener("change", this.soundHandler)
        if (this.resetButton) {
            this.resetButton.removeEventListener("click", this.resetHandler)
            this.resetButton.removeEventListener("blur", this.resetBlurHandler)
        }
        if (this.backLink) this.backLink.removeEventListener("click", this.backHandler)
    }
}
