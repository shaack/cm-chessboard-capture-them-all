#!/usr/bin/env node

import {createRequire} from "module"
import {spawn} from "child_process"

const require = createRequire("/opt/homebrew/lib/node_modules/")
const puppeteer = require("puppeteer")

const PORT = 8083
const URL = `http://localhost:${PORT}/tools/cover-images.html`

function startServer() {
    return new Promise((resolve) => {
        const server = spawn("python3", ["-m", "http.server", String(PORT)], {
            cwd: new globalThis.URL("../", import.meta.url).pathname,
            stdio: ["ignore", "pipe", "pipe"]
        })
        const check = () => {
            fetch(URL).then(() => resolve(server)).catch(() => setTimeout(check, 200))
        }
        setTimeout(check, 500)
    })
}

const covers = [
    {id: "landscape", file: "cover-landscape-1920x1080.png"},
    {id: "portrait", file: "cover-portrait-800x1200.png"},
    {id: "square", file: "cover-square-800x800.png"},
]

console.log("Starting server...")
const server = await startServer()

try {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    await page.setViewport({width: 2000, height: 5000, deviceScaleFactor: 1})
    await page.goto(URL, {waitUntil: "networkidle0"})

    for (const {id, file} of covers) {
        const el = await page.$(`#${id}`)
        await el.screenshot({path: `assets/${file}`, type: "png"})
        console.log(`Saved assets/${file}`)
    }

    await browser.close()
} finally {
    server.kill()
}
