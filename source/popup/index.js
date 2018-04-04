"use strict";

const db = localStorage;
const player = chrome.extension.getBackgroundPage().player;

cnt_play.addEventListener("click", () => {
  if (db.state === "stopped") {
    cnt_play.setAttribute("class", "played");
    db.setItem("state", "played");
    player.setPlay();
  } else {
    cnt_play.setAttribute("class", "stopped");
    db.setItem("state", "stopped");
    player.setStop();
  }
});

play_list.addEventListener("click", e => {
  const element = e.target.closest("li");

  document.querySelector("#play_list .selected").setAttribute("class", "");

  element.setAttribute("class", "selected");
  cnt_play.setAttribute("class", "played");

  db.state = "played";
  db.stream = element.getAttribute("data-id");

  player.setPlay();
});

cnt_volume.addEventListener("input", e => {
  db.volume = e.target.value;

  player.setVolume();
});

cnt_volume.addEventListener("mousewheel", e => {
  const value = +db.volume + e.wheelDelta / 24;
  const volume = value < 0 ? 0 : value > 100 ? 100 : value;

  cnt_volume.value = volume;
  db.volume = volume;

  player.setVolume();
});

//
// render station list
(() => {
  cnt_play.setAttribute("class", db.state);
  cnt_volume.value = db.volume;

  play_list.innerHTML = JSON.parse(localStorage.stations)
    .filter(station => station.favorite)
    .map(({ name, group, stream }) => {
      return `<li class="${db.stream === stream ? "selected" : ""}" data-id="${stream}">
          <span class="group">${group}</span>
          <span class="name">${name}</span>
        </li>`;
    })
    .join("");

  const active = document.querySelector(".selected");

  if (active) {
    active.scrollIntoView();
  }
})();
