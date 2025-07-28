// Basic ambient audio system
class AudioSystem {
    constructor() {
        this.audio = new Audio('src/assets/audio/ambient.mp3');
        this.audio.loop = true;
    }

    play() {
        this.audio.volume = gameData.settings.volume || 1;
        this.audio.play().catch(() => {});
    }

    stop() {
        this.audio.pause();
    }
}
window.AudioSystem = AudioSystem;
