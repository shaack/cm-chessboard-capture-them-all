/**
 * Author: https://7d0.com
 * Date: 2026-02-15
 */

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
            html += `<div class="level-group" data-group="${levelGroupName}">`
            html += `<h2 class="level-group-title">${levelGroupName}</h2>`
            html += `<div class="level-grid">`
            let i = 0
            for (const levelFen of levels) {
                html += `<a href="#" class="level-tile" data-group="${levelGroupName}" data-level="${i}">${i + 1}</a>`
                i++
            }
            html += `</div></div>`
        }
        html += `</div><div class="level-select-footer"><button class="btn-secondary" id="levelSelectBack">Exit</button></div></div>`
        container.innerHTML = html

        const beatenLevels = this.app.state.beatenLevels
        const links = container.querySelectorAll(".level-select a")
        for (const link of links) {
            const group = link.getAttribute("data-group")
            const level = link.getAttribute("data-level")

            if (level !== null) {
                const levelNum = parseInt(level)
                if (!this.app.debugMode) {
                    if (!this.app.state.tutorialCompleted) {
                        // Before tutorial, only Rook level 1 is playable
                        if (!(group === "Introduction" && levelNum === 0)) {
                            link.classList.add("deactivatelinks")
                        }
                    } else if (levelNum > (beatenLevels[group] || 0)) {
                        link.classList.add("deactivatelinks")
                    }
                }
            }

            const handler = (e) => {
                e.preventDefault()
                if (link.classList.contains("deactivatelinks")) return
                this.app.state.levelGroupName = group
                this.app.state.level = parseInt(level)
                this.app.navigate("game")
            }
            link.addEventListener("click", handler)
            this.listeners.push({element: link, handler})
        }

        this.backLink = document.getElementById("levelSelectBack")
        this.backHandler = (e) => {
            e.preventDefault()
            this.app.navigate("menu")
        }
        this.backLink.addEventListener("click", this.backHandler)
        this.listeners.push({element: this.backLink, handler: this.backHandler})

        const lastGroup = this.app.state.levelGroupName
        if (lastGroup) {
            const groupEl = container.querySelector(`.level-group[data-group="${lastGroup}"]`)
            if (groupEl) {
                requestAnimationFrame(() => {
                    groupEl.scrollIntoView({behavior: "smooth", block: "start"})
                })
            }
        }
    }

    hide() {
        for (const {element, handler} of this.listeners) {
            element.removeEventListener("click", handler)
        }
        this.listeners = []
    }
}
