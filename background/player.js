"use strict";

const STREAM_API_URL = "http://radiowave.in.ua/api/2.0/stream";

window.backgroundPlayer = new class BackgroundPlayer {
  audio = new Audio();

  play() {
    this.volume();
    this.audio.src = `${STREAM_API_URL}?${localStorage.stream}`;
    this.audio.play();

    localStorage.setItem("state", "played");
    this._sendStat();
  }

  stop() {
    this.audio.pause();
    this.audio.src = "";

    localStorage.setItem("state", "paused");
    this._sendStat();
  }

  volume() {
    this.audio.volume = localStorage.volume / 100;
  }

  _sendStat() {
    if (window.statistician) {
      window.statistician.sendStat();
    }
  }
}();
