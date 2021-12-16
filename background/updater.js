"use strict";

(() => {
  const { version, volume } = localStorage;

  if (version === "2.2.1") {
    return localStorage.setItem("state", "paused");
  }

  const state = {
    version: "2.2.1",
    volume: volume,
    state: "paused",
    stream: "station=ua.mfm"
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
