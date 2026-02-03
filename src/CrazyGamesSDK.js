export class CrazyGamesSDK {
    constructor() {
        this.sdk = null
    }

    async init() {
        if (window.CrazyGames && window.CrazyGames.CrazySDK) {
            this.sdk = window.CrazyGames.CrazySDK.getInstance()
            this.sdk.init()
            console.log("CrazyGamesSDK: initialized")
        } else {
            console.log("CrazyGamesSDK: not available, running in local mode")
        }
    }

    gameplayStart() {
        if (this.sdk) {
            this.sdk.game.gameplayStart()
            console.log("CrazyGamesSDK: gameplayStart")
        } else {
            console.log("CrazyGamesSDK (no-op): gameplayStart")
        }
    }

    gameplayStop() {
        if (this.sdk) {
            this.sdk.game.gameplayStop()
            console.log("CrazyGamesSDK: gameplayStop")
        } else {
            console.log("CrazyGamesSDK (no-op): gameplayStop")
        }
    }

    loadingStart() {
        if (this.sdk) {
            this.sdk.game.sdkGameLoadingStart()
            console.log("CrazyGamesSDK: loadingStart")
        } else {
            console.log("CrazyGamesSDK (no-op): loadingStart")
        }
    }

    loadingStop() {
        if (this.sdk) {
            this.sdk.game.sdkGameLoadingStop()
            console.log("CrazyGamesSDK: loadingStop")
        } else {
            console.log("CrazyGamesSDK (no-op): loadingStop")
        }
    }

    happytime() {
        if (this.sdk) {
            this.sdk.game.happytime()
            console.log("CrazyGamesSDK: happytime")
        } else {
            console.log("CrazyGamesSDK (no-op): happytime")
        }
    }
}
