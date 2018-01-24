"use strict";

window.player = new class {
  constructor() {
    this.audio = new Audio();
    this.storage = localStorage;

    this.initialize();
  }

  initialize() {
    this.storage.setItem("state", "stopped");
    this.storage.setItem("volume", this.storage.volume || 30);
  }

  setPlay() {
    this.setVolume();
    this.audio.src = this.storage.url;
    this.audio.play();
  }

  setStop() {
    this.audio.src = "";
  }

  setVolume() {
    this.audio.volume = this.storage.volume / 100;
  }
}();
