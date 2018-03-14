import updater from "./scripts/updater";
import stations from "./scripts/stations";
import Player from "./scripts/player";

updater();
localStorage.setItem("stations", JSON.stringify(stations));
window.player = new Player();
