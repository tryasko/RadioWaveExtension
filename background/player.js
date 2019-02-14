"use strict";

const STREAM_API_URL = "http://radiowave.in.ua/api_v1/stream";

window.player = new class BackgroundPlayer {
  audio = new Audio();
  storage = localStorage;

  setPlay() {
    this.updateVolume();
    this.audio.src = `${STREAM_API_URL}?${this.storage.stream}`;
    this.audio.play();
  }

  setStop() {
    this.audio.pause();
    this.audio.src = "";
  }

  updateVolume() {
    this.audio.volume = this.storage.volume / 100;
  }
}();
