"use strict";

// need to rewrite Updater

//
// update localStorage, use new data structure
//(() => {
//  const newState = { state: "stopped", volume: 30, stream: "group=ua&station=kissfm" };
//  const oldState = JSON.parse(JSON.stringify(localStorage));
//
//  const state = {
//    state: newState.state,
//    volume: oldState.volume || newState.volume,
//    stream: newState.stream
//  };
//
//  localStorage.clear();
//
//  Object.keys(state).forEach(key => localStorage.setItem(key, state[key]));
//})();
