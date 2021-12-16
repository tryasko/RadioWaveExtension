"use strict";

const STREAM_API_URL = "https://europe-central2-radio--wave.cloudfunctions.net/getstream";
const VERSION = `version=${localStorage.version}`;
const CLIENT = "client=chrome-extension";

window.backgroundPlayer = new class BackgroundPlayer {
  audio = new Audio();

  play() {
    this.volume();
    this.audio.src = `${STREAM_API_URL}?${localStorage.stream}&${CLIENT}&${VERSION}`;
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
