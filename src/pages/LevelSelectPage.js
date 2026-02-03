import {LEVELS} from "../Game.js"

export class LevelSelectPage {
    constructor(app) {
        this.app = app
        this.listeners = []
    }

    show(container) {
        let html = `<div class="page-background"><div class="level-select">`
        for (const levelGroupName in LEVELS) {
            const levels = LEVELS[levelGroupName]
            html += `<div class="level-group">`
            html += `<h2 class="level-group-title"><a href="#" data-group="${levelGroupName}" data-marathon="true">${levelGroupName}</a></h2>`
            html += `<div class="level-grid">`
            let i = 0
            for (const levelFen of levels) {
                html += `<a href="#" class="level-tile" data-group="${levelGroupName}" data-level="${i}">${i + 1}</a>`
                i++
            }
            html += `</div></div>`
        }
        html += `</div><a href="#" class="returnButton" id="levelSelectBack">Back</a></div>`
        container.innerHTML = html

        const beatenLevels = this.app.state.beatenLevels
        const links = container.querySelectorAll(".level-select a")
        for (const link of links) {
            const group = link.getAttribute("data-group")
            const level = link.getAttribute("data-level")
            const isMarathon = link.getAttribute("data-marathon")

            if (!isMarathon && level !== null) {
                const levelNum = parseInt(level)
                if (levelNum > (beatenLevels[group] || 0)) {
                    link.classList.add("deactivatelinks")
                }
            }

            const handler = (e) => {
                e.preventDefault()
                if (link.classList.contains("deactivatelinks")) return
                if (isMarathon) {
                    this.app.state.levelGroupName = group
                    this.app.state.level = 0
                    this.app.state.marathonMode = true
                } else {
                    this.app.state.levelGroupName = group
                    this.app.state.level = parseInt(level)
                    this.app.state.marathonMode = false
                }
                this.app.navigate("game")
            }
            link.addEventListener("click", handler)
            this.listeners.push({element: link, handler})
        }

        this.backLink = document.getElementById("levelSelectBack")
        this.backHandler = (e) => {
            e.preventDefault()
            const checkpoint = this.app.state.MenuCheckpoint
            this.app.navigate(checkpoint ? checkpoint : "menu")
        }
        this.backLink.addEventListener("click", this.backHandler)
        this.listeners.push({element: this.backLink, handler: this.backHandler})
    }

    hide() {
        for (const {element, handler} of this.listeners) {
            element.removeEventListener("click", handler)
        }
        this.listeners = []
    }
}
