import {Extension} from "cm-chessboard/src/model/Extension.js"
import {INPUT_EVENT_TYPE} from "cm-chessboard"

/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class CaptureThemAll extends Extension {
    constructor(chessboard, props = {}) {
        super(chessboard)
        chessboard.enableMoveInput((event) => {
            console.log(event)
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveInputStarted:
                    return true
                case INPUT_EVENT_TYPE.moveInputCanceled:
                    return true
                case INPUT_EVENT_TYPE.validateMoveInput:
                    return true
            }
        })
    }
    startPuzzle(position) {

    }
}
