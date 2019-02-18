"use strict";

const STREAM_API_URL = "http://radiowave.in.ua/api_v2.2/stream";

window.backgroundPlayer = new class BackgroundPlayer {
  audio = new Audio();

  play() {
    this.volume();
    this.audio.src = `${STREAM_API_URL}?${localStorage.stream}`;
    this.audio.play();
    localStorage.setItem("state", "played");
  }

  stop() {
    this.audio.pause();
    this.audio.src = null;
    localStorage.setItem("state", "paused");
  }

  volume() {
    this.audio.volume = localStorage.volume / 100;
  }
}();
