"use strict";

//
// background player
window.player = new class {
  constructor() {
    this.audio = new Audio();
    this.storage = localStorage;
  }

  setPlay() {
    this.setVolume();
    this.audio.src = this.storage.stream;
    this.audio.play();
  }

  setStop() {
    this.audio.pause();
    this.audio.src = "";
  }

  setVolume() {
    this.audio.volume = this.storage.volume / 100;
  }
}();
