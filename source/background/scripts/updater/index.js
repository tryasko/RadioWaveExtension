import selected from "./selected";

//
// update localStorage, use new data structure
export default function updater(stations) {
  const newState = { state: "stopped", volume: 30, stream: "http://online-kissfm.tavrmedia.ua/KissFM" };
  const oldState = JSON.parse(JSON.stringify(localStorage));

  const state = {
    state: newState.state,
    volume: oldState.volume || newState.volume,
    stream: oldState.stream || newState.stream,
    stations: JSON.stringify(stations.map(station => Object.assign(station, { favorite: selected.includes(station.stream) })))
  };

  localStorage.clear();

  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
}
