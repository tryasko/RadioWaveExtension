"use strict";

// update localStorage, use new data structure
(() => {
  const newState = { state: "stopped", volume: 30, stream: "http://online-kissfm.tavrmedia.ua/KissFM" };
  const oldState = JSON.parse(JSON.stringify(localStorage));

  const state = {
    state: newState.state,
    volume: oldState.volume || newState.volume,
    stream: oldState.url || newState.stream
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();

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
    this.audio.src = "";
  }

  setVolume() {
    this.audio.volume = this.storage.volume / 100;
  }
}();
