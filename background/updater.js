"use strict";

import stationList from "../shared/stations.json" with { type: "json" };

const currentVersion = "2.2.9";

export const stateReady = (async () => {
  const { volume, station, version } = localStorage;

  if (!version || version !== currentVersion) {
    const isCurrentStationExist = stationList.some(item => station === `${item.group}.${item.station}`);

    const state = {
      version: currentVersion,
      volume: volume || 30,
      state: "paused",
      station: isCurrentStationExist ? station : "TVR.KissFM"
    };

    localStorage.clear();

    Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
  }
})();
