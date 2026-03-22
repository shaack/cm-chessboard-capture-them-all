/**
 * Author: https://7d0.com
 * Date: 2026-03-22
 */
export class Fanfare {
    static play() {
        const ctx = window.cmAudioContext
        if (!ctx || ctx.state !== "running") return
        const dest = window.cmMainGainNode
        const now = ctx.currentTime

        // Ascending victory fanfare: C5 E5 G5 → C6 (major chord arpeggio + octave)
        const notes = [
            {freq: 523.25, start: 0.0, dur: 0.15},  // C5
            {freq: 659.25, start: 0.15, dur: 0.15}, // E5
            {freq: 783.99, start: 0.3, dur: 0.15},  // G5
            {freq: 1046.5, start: 0.5, dur: 0.6},   // C6 (held)
        ]

        for (const note of notes) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = "triangle"
            osc.frequency.value = note.freq
            gain.gain.setValueAtTime(0, now + note.start)
            gain.gain.linearRampToValueAtTime(0.25, now + note.start + 0.03)
            gain.gain.linearRampToValueAtTime(0, now + note.start + note.dur)
            osc.connect(gain)
            gain.connect(dest)
            osc.start(now + note.start)
            osc.stop(now + note.start + note.dur + 0.05)
        }

        // Add a soft chord on the final note for richness
        const chordFreqs = [1046.5, 1318.5, 1568.0] // C6 E6 G6
        for (const freq of chordFreqs) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = "sine"
            osc.frequency.value = freq
            gain.gain.setValueAtTime(0, now + 0.5)
            gain.gain.linearRampToValueAtTime(0.12, now + 0.55)
            gain.gain.linearRampToValueAtTime(0, now + 1.3)
            osc.connect(gain)
            gain.connect(dest)
            osc.start(now + 0.5)
            osc.stop(now + 1.4)
        }
    }
}
