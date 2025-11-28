"use strict";

const getStationId = (group, station) => `${group}.${station}`;

const controlPlay = document.getElementById("cnt_play");
const controlVolume = document.getElementById("cnt_volume");
const playList = document.getElementById("play_list");

let currentState = { state: "paused", volume: 30, station: "TVR.KissFM" };

// Initialize popup with current state
async function initializePopup() {
  currentState = await chrome.runtime.sendMessage({ type: 'GET_STATE' });

  controlPlay.setAttribute("class", currentState.state);
  controlVolume.value = currentState.volume;

  playList.innerHTML = window.stationList
    .map(({ name, group, station }) => {
      const stationId = getStationId(group, station);

      return `<li class="${currentState.station === stationId ? "selected" : ""}" data-id="${stationId}">
          <span class="group">${group}</span>
          <span class="name">${name}</span>
        </li>`;
    })
    .join("");

  if (document.querySelector(".selected")) {
    document.querySelector(".selected").scrollIntoView();
  }
}

// Play/Pause control
controlPlay.addEventListener("click", async () => {
  if (currentState.state === "paused") {
    await chrome.runtime.sendMessage({ type: 'PLAY' });
    currentState.state = "played";
  } else {
    await chrome.runtime.sendMessage({ type: 'STOP' });
    currentState.state = "paused";
  }

  controlPlay.setAttribute("class", currentState.state);
});

// Volume control
controlVolume.addEventListener("input", async (event) => {
  const volume = event.target.value;
  currentState.volume = volume;

  await chrome.runtime.sendMessage({
    type: 'SET_VOLUME',
    volume: parseInt(volume)
  });
});

controlVolume.addEventListener("mousewheel", async (e) => {
  const value = +currentState.volume + e.wheelDelta / 24;
  const volume = value < 0 ? 0 : value > 100 ? 100 : value;

  controlVolume.value = volume;
  currentState.volume = volume;

  await chrome.runtime.sendMessage({
    type: 'SET_VOLUME',
    volume: parseInt(volume)
  });
});

// List control
playList.addEventListener("click", async (event) => {
  const element = event.target.closest("li");

  if (!element) return;

  if (document.querySelector(".selected")) {
    document.querySelector(".selected").setAttribute("class", "");
  }

  element.setAttribute("class", "selected");
  controlPlay.setAttribute("class", "played");

  const stationId = element.getAttribute("data-id");
  currentState.station = stationId;
  currentState.state = "played";

  await chrome.runtime.sendMessage({
    type: 'SET_STATION',
    station: stationId
  });

  await chrome.runtime.sendMessage({ type: 'PLAY' });
});

// Initialize on load
initializePopup();
