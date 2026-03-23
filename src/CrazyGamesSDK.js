export class CrazyGamesSDK {
    constructor() {
        this.sdk = null
        this.muted = false
        this.app = null
    }

    async init() {
        if (window.location.hostname === "shaack.com") {
            console.log("CrazyGamesSDK: skipped on shaack.com")
            return
        }
        await this.waitForSDK()
        if (this.sdk) {
            try {
                await this.sdk.init()
            } catch (e) {
                console.log("CrazyGamesSDK: init failed, running without SDK:", e.message || e)
                this.sdk = null
                return
            }
            this.sdk.game.addSettingsChangeListener((settings) => {
                this.muted = settings.muteAudio
                console.log("CrazyGamesSDK: settingsChange, muteAudio:", this.muted)
                if (window.cmMainGainNode) {
                    window.cmMainGainNode.gain.setValueAtTime(this.muted ? 0 : 1, window.cmAudioContext.currentTime)
                }
                if (this.app) {
                    if (this.muted) {
                        this.app.muteBgm()
                    } else {
                        this.app.unmuteBgm()
                    }
                }
            })
            console.log("CrazyGamesSDK: initialized")
        } else {
            console.log("CrazyGamesSDK: not available, running in local mode")
        }
    }

    waitForSDK(timeout = 5000) {
        return new Promise((resolve) => {
            if (window.CrazyGames && window.CrazyGames.SDK) {
                this.sdk = window.CrazyGames.SDK
                console.log("CrazyGamesSDK: SDK found immediately")
                resolve()
                return
            }
            console.log("CrazyGamesSDK: waiting for SDK to load...")
            const start = Date.now()
            const interval = setInterval(() => {
                if (window.CrazyGames && window.CrazyGames.SDK) {
                    clearInterval(interval)
                    this.sdk = window.CrazyGames.SDK
                    console.log("CrazyGamesSDK: SDK found after", Date.now() - start, "ms")
                    resolve()
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval)
                    console.log("CrazyGamesSDK: SDK not found after", timeout, "ms timeout")
                    resolve()
                }
            }, 50)
        })
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
            this.sdk.game.loadingStart()
            console.log("CrazyGamesSDK: loadingStart")
        } else {
            console.log("CrazyGamesSDK (no-op): loadingStart")
        }
    }

    loadingStop() {
        if (this.sdk) {
            this.sdk.game.loadingStop()
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

    async getItem(key) {
        if (this.sdk) {
            try {
                const value = await this.sdk.data.getItem(key)
                console.log("CrazyGamesSDK: getItem", key, value)
                return value
            } catch (e) {
                console.log("CrazyGamesSDK: getItem error", key, e)
                return null
            }
        } else {
            console.log("CrazyGamesSDK (no-op): getItem", key)
            return null
        }
    }

    async setItem(key, value) {
        if (this.sdk) {
            try {
                await this.sdk.data.setItem(key, value)
                console.log("CrazyGamesSDK: setItem", key, value)
            } catch (e) {
                console.log("CrazyGamesSDK: setItem error", key, e)
            }
        } else {
            console.log("CrazyGamesSDK (no-op): setItem", key, value)
        }
    }

    requestAd(type = "midgame") {
        return new Promise((resolve) => {
            if (this.sdk && this.sdk.environment !== "local") {
                console.log("CrazyGamesSDK: requestAd", type)
                let resolved = false
                const done = () => { if (!resolved) { resolved = true; resolve() } }
                const callbacks = {
                    adStarted: () => { console.log("CrazyGamesSDK: ad started") },
                    adFinished: () => { console.log("CrazyGamesSDK: ad finished"); done() },
                    adError: (error) => { console.log("CrazyGamesSDK: ad error", error); done() },
                }
                this.sdk.ad.requestAd(type, callbacks)
            } else {
                console.log("CrazyGamesSDK (no-op): requestAd", type)
                resolve()
            }
        })
    }
}
