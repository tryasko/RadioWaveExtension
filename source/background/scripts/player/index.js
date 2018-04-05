//
// background player
export default class Player {
  setPlay() {
    this.audio = this.audio || new Audio();
    this.audio.src = localStorage.stream;
    this.audio.play();

    this.setVolume();
  }

  setStop() {
    this.audio.pause();
    this.audio.src = "";

    this.audio = null;
  }

  setVolume() {
    this.audio.volume = localStorage.volume / 100;
  }
}
