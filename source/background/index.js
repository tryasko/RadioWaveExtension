import updater from "./scripts/updater";
import stations from "./scripts/stations";
import Player from "./scripts/player";

updater(stations);
window.player = new Player();
