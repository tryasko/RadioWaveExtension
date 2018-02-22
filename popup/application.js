"use strict";

var down_on_volume = false;
var db = localStorage;
var player = chrome.extension.getBackgroundPage().player;

(() => {
  play_list.innerHTML = window.stationList
    .map(({ name, stream }) => {
      return `<li class="${db.stream === stream ? "selected" : ""}" data-id="${stream}">${name}</li>`;
    })
    .join("");

  document.querySelector(".selected").scrollIntoView();

  cnt_play.setAttribute("class", db.state);
  cnt_volume_bar.style.width = db.volume + "%";
})();

var clearSelected = function() {
  const list = play_list.getElementsByTagName("li");

  for (var l = list.length, i = 0; i < l; i += 1) {
    list[i].setAttribute("class", "");
  }
};

var getVolume = function(e) {
  var x = e.clientX - 71;

  if (x < 0) x = 0;
  if (x > 140) x = 140;

  var val = Math.round(100 * x / 140);

  cnt_volume_bar.style.width = val + "%";
  db.volume = val;

  player.setVolume();

  e.preventDefault();
};

cnt_play.addEventListener("click", function(e) {
  if (db.state === "stopped") {
    cnt_play.setAttribute("class", "played");
    db.state = "played";
    player.setPlay();
  } else {
    cnt_play.setAttribute("class", "stopped");
    db.state = "stopped";
    player.setStop();
  }

  e.preventDefault();
});

cnt_volume.addEventListener("mousedown", function(e) {
  down_on_volume = true;
  getVolume(e);

  e.preventDefault();
});

document.body.addEventListener("mousemove", function(e) {
  if (down_on_volume && e.which === 1) {
    getVolume(e);
  }
  e.preventDefault();
});

document.body.addEventListener("mouseup", function(e) {
  down_on_volume = false;
  e.preventDefault();
});

cnt_volume.addEventListener("mousewheel", function(e) {
  var val = +db.volume + e.wheelDelta / 24;
  if (val < 0) val = 0;
  if (val > 100) val = 100;

  cnt_volume_bar.style.width = val + "%";
  db.volume = val;
  player.setVolume();

  e.preventDefault();
});

play_list.addEventListener("click", (e) => {
  clearSelected();

  e.target.setAttribute("class", "selected");
  cnt_play.setAttribute("class", "played");

  db.state = "played";
  db.stream = e.target.getAttribute("data-id");

  player.setPlay();

  e.preventDefault();
});
