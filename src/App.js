import {GameState} from "./GameState.js"
import {CrazyGamesSDK} from "./CrazyGamesSDK.js"
import {MenuPage} from "./pages/MenuPage.js"
import {LevelSelectPage} from "./pages/LevelSelectPage.js"
import {GamePage} from "./pages/GamePage.js"
import {SettingsPage} from "./pages/SettingsPage.js"

export class App {
    constructor(container) {
        this.container = container
        this.state = new GameState()
        this.sdk = new CrazyGamesSDK()
        this.sdk.loadingStart()
        this.currentPage = null
        this.pages = {
            menu: new MenuPage(this),
            levelSelect: new LevelSelectPage(this),
            game: new GamePage(this),
            settings: new SettingsPage(this),
        }
        this.sdk.init().then(() => {
            this.navigate("menu")
            this.sdk.loadingStop()
        })
    }

    navigate(pageName) {
        if (this.currentPage) {
            this.currentPage.hide()
        }
        this.container.innerHTML = ""
        this.currentPage = this.pages[pageName]
        this.currentPage.show(this.container)
    }
}
