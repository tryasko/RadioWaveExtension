var down_on_volume = false;
var db = localStorage;
var player = chrome.extension.getBackgroundPage().player;

var data_list = [
  {
    name: "KissFM UA",
    stream: "http://online-kissfm.tavrmedia.ua/KissFM"
  },

  {
    name: "Radio ROKS",
    stream: "http://online-radioroks.tavrmedia.ua/RadioROKS"
  },

  {
    name: "Radio Feel",
    stream: "http://62.80.190.246:8000/Feel"
  },

  {
    name: "Pirate Station",
    stream: "http://air2.radiorecord.ru:805/ps_128"
  },

  {
    name: "Radio Record",
    stream: "http://air2.radiorecord.ru:805/rr_128"
  },

  {
    name: "NRJ Ru",
    stream: "http://ic4.101.ru:8000/v1_1"
  },

  {
    name: "Maximum",
    stream: "http://icecast.radiomaximum.cdnvideo.ru/maximum.mp3"
  },

  {
    name: "GarageFM",
    stream: "http://91.213.196.100:8000/garagefm-192"
  },

  {
    name: "TOP 100",
    stream: "http://91.213.196.100:8000/top100-192"
  },

  {
    name: "Old-School",
    stream: "http://91.213.196.100:8000/oldschool-192"
  },

  {
    name: "Channel 5",
    stream: "http://91.213.196.100:8000/channel5-192"
  },

  {
    name: "Too Deep",
    stream: "http://91.213.196.100:8000/toodeep-192"
  },

  {
    name: "Klubb",
    stream: "http://91.213.196.100:8000/klubb-192"
  },

  {
    name: "Dubstep",
    stream: "http://91.213.196.100:8000/dubstep-192"
  },

  {
    name: "Nu",
    stream: "http://91.213.196.100:8000/nu-192"
  },

  {
    name: "Too Nu",
    stream: "http://91.213.196.100:8000/toonu-192"
  },

  {
    name: "Yo",
    stream: "http://91.213.196.100:8000/yo-192"
  },

  {
    name: "Full Moon",
    stream: "http://91.213.196.100:8000/fullmoon-192"
  },

  {
    name: "Vata",
    stream: "http://91.213.196.100:8000/vata-192"
  },

  {
    name: "300kmh",
    stream: "http://91.213.196.100:8000/300kmh-192"
  },

  {
    name: "186mph",
    stream: "http://91.213.196.100:8000/186mph-192"
  },

  {
    name: "Deep",
    stream: "http://91.213.196.100:8000/deep-192"
  },

  {
    name: "Too Deep",
    stream: "http://91.213.196.100:8000/toodeep-192"
  },

  {
    name: "Mini",
    stream: "http://91.213.196.100:8000/mini-192"
  },

  {
    name: "Pop",
    stream: "http://91.213.196.100:8000/pop-192"
  },

  {
    name: "Strange",
    stream: "http://91.213.196.100:8000/strange-192"
  },

  {
    name: "Brainfck",
    stream: "http://91.213.196.100:8000/brainfck-192"
  },

  {
    name: "Pioneer DJ Radio",
    stream: "http://91.213.196.100:8000/pioneerdj-192"
  },

  {
    name: "Bobina",
    stream: "http://91.213.196.100:8000/bobina-192"
  },

  {
    name: "DJ GROOVE",
    stream: "http://91.213.196.100:8000/groove-192"
  },

  {
    name: "Mixadance FM",
    stream: "http://91.213.196.100:8000/mixadancefm-192"
  }
];

(function() {
  let list,
    elems = "";

  data_list.forEach(function(val, key) {
    elems += `<li data-id="${key}">${val.name}</li>`;
  });

  play_list.innerHTML = elems;
  list = play_list.getElementsByTagName("li");

  if (db.selected !== undefined) {
    for (var l = list.length, i = 0; i < l; i += 1) {
      if (+list[i].getAttribute("data-id") === +db.selected) {
        list[i].setAttribute("class", "selected");
      }
    }
  }

  cnt_play.setAttribute("class", db.state);
  cnt_volume_bar.style.width = db.volume + "%";
})();

var clearSelected = function() {
  const list = play_list.getElementsByTagName("li");

  for (var l = list.length, i = 0; i < l; i += 1) {
    list[i].setAttribute("class", "");
  }
};

var focusSelected = function() {
  document.querySelector(".selected").scrollIntoView();
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

play_list.addEventListener("click", function(e) {
  var id = +e.target.getAttribute("data-id");

  clearSelected();
  e.target.setAttribute("class", "selected");
  cnt_play.setAttribute("class", "played");

  db.selected = id;
  db.state = "played";
  db.url = data_list[id].stream;

  player.setPlay();

  e.preventDefault();
});

play_list.addEventListener("transitionend", focusSelected);

open_list.addEventListener("click", function(e) {
  play_list.classList.toggle("show");
  e.preventDefault();
});

focusSelected();
