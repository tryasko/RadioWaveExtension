"use strict";

window.statistician = new class Statistician {
  DELAY = 1000 * 60 * 10; // 10 min;
  API_URL = "http://radiowave.in.ua/api/2.0/stats";

  constructor() {
    this.sendStat();
  }

  start() {
    this.timerId = setTimeout(this.sendStat, this.DELAY);
  }

  restart() {
    clearTimeout(this.timerId);

    this.start();
  }

  async sendStat() {
    const { stream, state, volume, version } = localStorage;

    try {
      await fetch(`${this.API_URL}?${stream}&state=${state}&volume=${volume}&version=${version}`);
    } catch (error) {
      console.warn(error);
    }

    this.restart();
  }
}();
