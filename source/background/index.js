import Analyst from "./scripts/analyst/";
import Player from "./scripts/player/";

window.player = new Player();
window.analyst = new Analyst();

window.chrome.runtime.onInstalled.addListener(({ reason, id, previousVersion }) => {
  if (reason === "install") {
    window.analyst.register();
  }

  if (reason === "update") {
    window.analyst.state();
  }
});

//
// need refactor
import updater from "./scripts/updater/";
import stations from "./scripts/stations/";
updater(stations);
