"use strict";

import stationList from "../shared/stations.json" with { type: "json" };

const getStationId = (group, station) => `${group}.${station}`;

const DEFAULT_STATE = {
  state: "paused",
  station: "TVR.KissFM",
  volume: "30"
};

Object.entries(DEFAULT_STATE).forEach(([key, value]) => {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, value);
  }
});

const controlPlay = document.getElementById("cnt_play");
const controlVolume = document.getElementById("cnt_volume");
const currentStationName = document.getElementById("current_station_name");
const currentStationGroup = document.getElementById("current_station_group");
const playbackStatusText = document.getElementById("playback_status_text");
const playList = document.getElementById("play_list");

let latestPlaybackCommand = 0;
let switchingStationId;

const sendPlayerCommand = async (command, details = {}) => {
  if (!globalThis.chrome?.runtime?.sendMessage) {
    return { ok: true };
  }

  try {
    return await chrome.runtime.sendMessage({
      target: "backgroundPlayer",
      command,
      ...details
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

const playerReady = sendPlayerCommand("prepare");

window.addEventListener("pagehide", () => {
  sendPlayerCommand("closeIfIdle");
}, { once: true });

const renderPlaybackState = () => {
  const isPlaying = localStorage.state === "played";

  if (switchingStationId) {
    document.body.dataset.playback = "switching";
    controlPlay.dataset.state = "played";
    controlPlay.setAttribute("aria-label", "Зупинити перемикання");
    playbackStatusText.textContent = "TUNING";
    return;
  }

  document.body.dataset.playback = isPlaying ? "played" : "paused";
  controlPlay.dataset.state = isPlaying ? "played" : "paused";
  controlPlay.setAttribute("aria-label", isPlaying ? "Призупинити" : "Відтворити");
  playbackStatusText.textContent = isPlaying ? "LIVE" : "PAUSED";
};

const renderVolume = (volume) => {
  const clampedVolume = Math.max(0, Math.min(100, Number(volume) || 0));
  const normalizedVolume = Math.round(clampedVolume * 100) / 100;

  controlVolume.value = normalizedVolume;
  controlVolume.style.setProperty("--volume", `${normalizedVolume}%`);
  localStorage.volume = normalizedVolume;
};

const renderCurrentStation = (stationId = localStorage.station) => {
  const station = stationList.find(({ group, station: stationCode }) => (
    getStationId(group, stationCode) === stationId
  ));

  if (!station) {
    return;
  }

  currentStationName.textContent = station.name;
  currentStationGroup.textContent = station.group;
};

const selectStation = (stationId) => {
  document.querySelector(".station-list .selected")?.classList.remove("selected");
  playList.querySelector(`[data-id="${stationId}"]`)?.classList.add("selected");
  localStorage.station = stationId;
  renderCurrentStation(stationId);
};

const showSwitchingState = (stationId) => {
  switchingStationId = stationId;
  selectStation(stationId);
  playList.querySelectorAll("li").forEach(item => {
    item.classList.toggle("switching", item.dataset.id === stationId);
  });
  localStorage.state = "played";
  renderPlaybackState();
};

const showSettledState = (status, stationId) => {
  switchingStationId = undefined;
  playList.querySelector(".switching")?.classList.remove("switching");

  if (stationId) {
    selectStation(stationId);
  }

  localStorage.state = status === "played" ? "played" : "paused";
  renderPlaybackState();
};

const startPlayback = async (station = localStorage.station) => {
  const commandId = ++latestPlaybackCommand;

  showSwitchingState(station);

  const response = await sendPlayerCommand("play", { station });

  if (commandId !== latestPlaybackCommand) {
    return;
  }

  showSettledState(response?.ok ? "played" : "paused", station);
};

const stopPlayback = async () => {
  latestPlaybackCommand += 1;
  showSettledState("paused", localStorage.station);
  await sendPlayerCommand("pause");
};

chrome.runtime.onMessage.addListener(message => {
  if (message.target !== "playbackState") {
    return;
  }

  if (message.status === "switching") {
    showSwitchingState(message.station);
    return;
  }

  if (message.status === "played" || message.status === "paused") {
    showSettledState(message.status, message.station);
  }
});

const syncActualPlaybackState = async () => {
  const commandId = latestPlaybackCommand;

  await playerReady;
  const status = await sendPlayerCommand("status");

  if (commandId !== latestPlaybackCommand || !status?.ok) {
    return;
  }

  if (status.switching) {
    showSwitchingState(status.station || localStorage.station);
  } else {
    showSettledState(status.playing ? "played" : "paused", status.station || localStorage.station);
  }
};

controlPlay.addEventListener("click", () => {
  if (localStorage.state === "played") {
    stopPlayback();
  } else {
    startPlayback();
  }
});

controlVolume.addEventListener("input", event => {
  renderVolume(event.target.value);
  sendPlayerCommand("volume");
});

controlVolume.addEventListener("wheel", event => {
  event.preventDefault();

  const wheelDelta = Number.isFinite(event.wheelDelta)
    ? event.wheelDelta
    : -event.deltaY;
  const volume = Number(localStorage.volume) + wheelDelta / 24;

  renderVolume(volume);
  sendPlayerCommand("volume");
}, { passive: false });

playList.addEventListener("click", event => {
  const item = event.target.closest("li");

  if (!item) {
    return;
  }

  selectStation(item.dataset.id);
  startPlayback(item.dataset.id);
});

(() => {
  const selectedStationExists = stationList.some(({ group, station }) => (
    localStorage.station === getStationId(group, station)
  ));

  if (!selectedStationExists) {
    localStorage.station = getStationId(stationList[0].group, stationList[0].station);
  }

  stationList.forEach(({ name, group, station }) => {
    const stationId = getStationId(group, station);
    const item = document.createElement("li");
    const button = document.createElement("button");
    const groupElement = document.createElement("span");
    const nameElement = document.createElement("span");
    const actionElement = document.createElement("span");
    const miniWave = document.createElement("span");

    item.dataset.id = stationId;
    item.classList.toggle("selected", localStorage.station === stationId);

    button.className = "station-row";
    button.type = "button";
    button.setAttribute("aria-label", `Відтворити ${name}`);

    groupElement.className = "group-badge";
    groupElement.textContent = group;

    nameElement.className = "list-station-name";
    nameElement.textContent = name;

    actionElement.className = "station-action";
    actionElement.setAttribute("aria-hidden", "true");

    miniWave.className = "mini-wave";
    miniWave.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
    actionElement.append(miniWave);

    button.append(groupElement, nameElement, actionElement);
    item.append(button);
    playList.append(item);
  });

  renderCurrentStation();
  renderPlaybackState();
  renderVolume(localStorage.volume);
  document.querySelector(".station-list .selected")?.scrollIntoView({ block: "nearest" });
  syncActualPlaybackState();
})();
