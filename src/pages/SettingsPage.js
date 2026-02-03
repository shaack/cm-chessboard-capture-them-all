export class SettingsPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        container.innerHTML = `
            <h1>Settings</h1>
            <a href="#" class="saveButton" id="settingsBack">Save and return</a>
        `
        this.backLink = document.getElementById("settingsBack")
        this.backHandler = (e) => {
            e.preventDefault()
            const checkpoint = this.app.state.MenuCheckpoint
            this.app.navigate(checkpoint ? checkpoint : "menu")
        }
        this.backLink.addEventListener("click", this.backHandler)
    }

    hide() {
        if (this.backLink) {
            this.backLink.removeEventListener("click", this.backHandler)
        }
    }
}
