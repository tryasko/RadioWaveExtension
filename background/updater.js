"use strict";

(() => {
  if (localStorage.getItem("version") === "2.2") {
    return;
  }

  localStorage.clear();

  const state = {
    version: "2.2",
    volume: 30,
    state: "paused",
    stream: "group=ua&station=kissfm"
  };

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
