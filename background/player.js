"use strict";

const ENGINE = "engine=chrome-extension";
const VERSION = `version=${localStorage.version}`;
const STREAM_API_URL = "https://europe-central2-radio--wave.cloudfunctions.net/getStationURL";

window.backgroundPlayer = new class BackgroundPlayer {
  audio = new Audio();

  play() {
    this.volume();
    this.audio.src = `${STREAM_API_URL}?${localStorage.stream}&${ENGINE}&${VERSION}`;
    this.audio.play();

    localStorage.setItem("state", "played");
  }

  stop() {
    this.audio.pause();
    this.audio.src = "";

    localStorage.setItem("state", "paused");
  }

  volume() {
    this.audio.volume = localStorage.volume / 100;
  }
}();
