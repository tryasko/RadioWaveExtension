"use strict";

(() => {
  const { version, volume, station } = localStorage;

  const isCurrentStationPresent = window.stationList.filter(station => station.station === station);

  const state = {
    version: "2.2.5",
    volume: volume || 30,
    state: "paused",
    station: isCurrentStationPresent.length ? station : "tvr.kiss_fm_ua"
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
})();
