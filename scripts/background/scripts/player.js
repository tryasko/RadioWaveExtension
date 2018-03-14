"use strict";

//
// background player
export default class Player {
  //constructor() {
  //  this.audio = new Audio();
  //}

  setPlay() {
    this.audio = this.audio || new Audio();

    this.setVolume();
    this.audio.src = localStorage.stream;
    this.audio.play();
  }

  setStop() {
    this.audio.pause();
    this.audio.src = "";

    this.audio = null;
  }

  setVolume() {
    this.audio.volume = localStorage.volume / 100;
  }
}
