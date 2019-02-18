"use strict";

(() => {
  if (localStorage.getItem("version") === "2.2.0") {
    return;
  }

  localStorage.clear();

  const state = {
    version: "2.2.0",
    volume: 30,
    state: "paused",
    stream: "g=tvr&s=kiss_fm_ua"
  };

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
