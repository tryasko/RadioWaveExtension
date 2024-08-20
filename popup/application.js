"use strict";

const backgroundPlayer = chrome.extension.getBackgroundPage().backgroundPlayer;

const controlPlay = document.getElementById("cnt_play");
const controlVolume = document.getElementById("cnt_volume");
const playList = document.getElementById("play_list");

// Play/Pause control
controlPlay.addEventListener("click", () => {
  if (localStorage.state === "paused") {
    backgroundPlayer.play();
  } else {
    backgroundPlayer.stop();
  }

  controlPlay.setAttribute("class", localStorage.state);
});

// Volume control
controlVolume.addEventListener("input", event => {
  localStorage.volume = event.target.value;

  backgroundPlayer.volume();
});

controlVolume.addEventListener("mousewheel", e => {
  const value = +localStorage.volume + e.wheelDelta / 24;
  const volume = value < 0 ? 0 : value > 100 ? 100 : value;

  controlVolume.value = volume;
  localStorage.volume = volume;

  backgroundPlayer.volume();
});

// List control
playList.addEventListener("click", event => {
  const element = event.target.closest("li");

  if (document.querySelector(".selected")) {
    document.querySelector(".selected").setAttribute("class", "");
  }

  element.setAttribute("class", "selected");
  controlPlay.setAttribute("class", "played");

  localStorage.station = element.getAttribute("data-id");

  backgroundPlayer.play();
});

// Render station list
(() => {
  controlPlay.setAttribute("class", localStorage.state);
  controlVolume.value = localStorage.volume;

  playList.innerHTML = window.stationList
    .map(({ name, group, station }) => {
      return `<li class="${localStorage.station === station ? "selected" : ""}" data-id="${station}">
          <span class="group">${group}</span>
          <span class="name">${name}</span>
        </li>`;
    })
    .join("");

  if (document.querySelector(".selected")) {
    document.querySelector(".selected").scrollIntoView();
  }
})();
