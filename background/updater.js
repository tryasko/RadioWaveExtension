"use strict";

(() => {
  const { version, volume, stream } = localStorage;

  if (version === "2.2.2") {
    return localStorage.setItem("state", "paused");
  }

  const isCurrentStreamPresent = window.stationList.filter(station => station.stream === stream);

  const state = {
    version: "2.2.2",
    volume: volume || 30,
    state: "paused",
    stream: isCurrentStreamPresent.length ? stream : "station=ua.mfm"
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
