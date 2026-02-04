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

    requestAd(type = "midgame") {
        return new Promise((resolve) => {
            if (this.sdk) {
                console.log("CrazyGamesSDK: requestAd", type)
                const callbacks = {
                    adStarted: () => { console.log("CrazyGamesSDK: ad started") },
                    adFinished: () => { console.log("CrazyGamesSDK: ad finished"); resolve() },
                    adError: (error) => { console.log("CrazyGamesSDK: ad error", error); resolve() },
                }
                this.sdk.ad.requestAd(type, callbacks)
            } else {
                console.log("CrazyGamesSDK (no-op): requestAd", type)
                resolve()
            }
        })
    }
}
