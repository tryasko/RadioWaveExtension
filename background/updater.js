"use strict";

(() => {
  if (localStorage.getItem("version") === "2.2.0") {
    return localStorage.setItem("state", "paused");
  }

  const state = {
    version: "2.2.0",
    volume: 30,
    state: "paused",
    stream: "station=tvr.kiss_fm_ua"
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
