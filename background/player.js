"use strict";

import { stateReady } from "./updater.js";
import stationList from "../shared/stations.json" with { type: "json" };

const STREAM_API_URL = "https://europe-southwest1-radio--wave.cloudfunctions.net/getstream-v2";
const CLIENT = "client=chrome-extension";
const CROSSFADE_DURATION_MS = 250;
const MEDIA_SESSION_HANDOFF_MS = 350;
const FADE_STEP_MS = 25;
const MEDIA_ARTWORK_SIZES = [256];

const readBlobAsDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.addEventListener("load", () => resolve(reader.result), { once: true });
  reader.addEventListener("error", () => reject(reader.error), { once: true });
  reader.readAsDataURL(blob);
});

const mediaArtworkReady = Promise.all(MEDIA_ARTWORK_SIZES.map(async size => {
  const response = await fetch(chrome.runtime.getURL(`icons/${size}.png`));
  const blob = await response.blob();

  return {
    src: await readBlobAsDataUrl(blob),
    sizes: `${size}x${size}`,
    type: blob.type || "image/png"
  };
})).catch(() => []);

const getStationId = ({ group, station }) => `${group}.${station}`;
const hasMediaSession = "mediaSession" in navigator && "MediaMetadata" in globalThis;
let mediaMetadata;

const wait = (duration) => new Promise(resolve => setTimeout(resolve, duration));
const notifyPlaybackState = (status, station) => {
  chrome.runtime.sendMessage({
    target: "playbackState",
    status,
    station
  }).catch(() => {
    // The popup is normally closed while playback continues.
  });
};

const waitUntilCanPlay = (audio) => new Promise((resolve, reject) => {
  let isSettled = false;

  const cleanup = () => {
    audio.removeEventListener("canplay", handleCanPlay);
    audio.removeEventListener("error", handleError);
    audio.removeEventListener("abort", handleAbort);
  };

  const settle = (callback, value) => {
    if (isSettled) {
      return;
    }

    isSettled = true;
    cleanup();
    callback(value);
  };

  const handleCanPlay = () => settle(resolve);
  const handleError = () => settle(
    reject,
    new Error(`Audio stream error${audio.error?.code ? ` (${audio.error.code})` : ""}`)
  );
  const handleAbort = () => settle(
    reject,
    new DOMException("Audio loading was cancelled", "AbortError")
  );

  audio.addEventListener("canplay", handleCanPlay);
  audio.addEventListener("error", handleError);
  audio.addEventListener("abort", handleAbort);

  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    settle(resolve);
  }
});

const playWhenReady = (audio) => new Promise((resolve, reject) => {
  let isSettled = false;

  const cleanup = () => {
    audio.removeEventListener("playing", handlePlaying);
    audio.removeEventListener("error", handleError);
    audio.removeEventListener("abort", handleAbort);
  };

  const settle = (callback, value) => {
    if (isSettled) {
      return;
    }

    isSettled = true;
    cleanup();
    callback(value);
  };

  const handlePlaying = () => settle(resolve);
  const handleError = () => settle(
    reject,
    new Error(`Audio stream error${audio.error?.code ? ` (${audio.error.code})` : ""}`)
  );
  const handleAbort = () => settle(
    reject,
    new DOMException("Audio playback was cancelled", "AbortError")
  );

  audio.addEventListener("playing", handlePlaying);
  audio.addEventListener("error", handleError);
  audio.addEventListener("abort", handleAbort);

  try {
    Promise.resolve(audio.play()).catch(error => settle(reject, error));
  } catch (error) {
    settle(reject, error);
  }
});

const resetAudio = (audio) => {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
};

const backgroundPlayer = new class BackgroundPlayer {
  audios = [new Audio(), new Audio()];
  activeAudio = this.audios[0];
  transitionId = 0;
  isTransitioning = false;
  selectedStation = localStorage.station;
  metadataStatus = "playing";

  constructor() {
    this.audios.forEach(audio => {
      audio.preload = "auto";

      audio.addEventListener("playing", () => {
        this.updateMediaSessionState("playing");
      });

      ["pause", "ended", "error"].forEach(eventName => {
        audio.addEventListener(eventName, () => {
          setTimeout(() => this.syncMediaSessionState(), 0);
        });
      });
    });
  }

  get targetVolume() {
    return Math.max(0, Math.min(1, Number(localStorage.volume) / 100 || 0));
  }

  async play(station = localStorage.station) {
    await stateReady;

    const isActiveAudioPlaying = !this.activeAudio.paused && !this.activeAudio.ended;
    const canResumeActiveAudio = (
      station === this.selectedStation
      && this.activeAudio.paused
      && !this.activeAudio.ended
      && Boolean(this.activeAudio.currentSrc || this.activeAudio.src)
    );

    if (canResumeActiveAudio) {
      return this.resume();
    }

    if (station === this.selectedStation && (this.isTransitioning || isActiveAudioPlaying)) {
      return { station, unchanged: true };
    }

    this.selectedStation = station;

    const transitionId = ++this.transitionId;
    const outgoingAudio = this.activeAudio;
    const incomingAudio = this.audios.find(audio => audio !== outgoingAudio);

    this.isTransitioning = true;
    notifyPlaybackState("switching", station);
    this.updateMediaMetadata(station, "switching").catch(error => {
      console.error("Unable to update Media Session metadata", error);
    });
    resetAudio(incomingAudio);
    incomingAudio.volume = 0;
    this.updateMediaSessionState("playing");
    incomingAudio.src = `${STREAM_API_URL}?station=${station}&${CLIENT}&version=${localStorage.version}`;
    incomingAudio.load();

    try {
      await waitUntilCanPlay(incomingAudio);

      if (transitionId !== this.transitionId) {
        return { cancelled: true };
      }

      await playWhenReady(incomingAudio);
    } catch (error) {
      if (transitionId !== this.transitionId) {
        return { cancelled: true };
      }

      this.stop();
      throw error;
    }

    if (transitionId !== this.transitionId) {
      return { cancelled: true };
    }

    this.activeAudio = incomingAudio;
    localStorage.setItem("station", station);
    localStorage.setItem("state", "played");
    this.updateMediaMetadata(station, "playing").catch(error => {
      console.error("Unable to update Media Session metadata", error);
    });
    this.updateMediaSessionState("playing");

    if (!await this.crossfade(
      outgoingAudio,
      incomingAudio,
      this.targetVolume,
      CROSSFADE_DURATION_MS,
      transitionId
    )) {
      return { cancelled: true };
    }

    incomingAudio.volume = this.targetVolume;
    outgoingAudio.volume = 0;

    await wait(MEDIA_SESSION_HANDOFF_MS);

    if (transitionId !== this.transitionId) {
      return { cancelled: true };
    }

    resetAudio(outgoingAudio);
    this.isTransitioning = false;
    notifyPlaybackState("played", station);

    return { station };
  }

  async crossfade(outgoingAudio, incomingAudio, targetVolume, duration, transitionId) {
    const outgoingInitialVolume = outgoingAudio.paused ? 0 : outgoingAudio.volume;
    const startedAt = performance.now();
    let progress = 0;

    while (progress < 1) {
      if (transitionId !== this.transitionId) {
        return false;
      }

      progress = Math.min(1, (performance.now() - startedAt) / duration);
      outgoingAudio.volume = outgoingInitialVolume * (1 - progress);
      incomingAudio.volume = targetVolume * progress;

      if (progress < 1) {
        await wait(FADE_STEP_MS);
      }
    }

    return true;
  }

  pause() {
    this.transitionId += 1;
    this.isTransitioning = false;

    this.audios.forEach(audio => {
      if (audio === this.activeAudio) {
        audio.pause();
      } else {
        resetAudio(audio);
      }
    });

    localStorage.setItem("state", "paused");
    this.updateMediaSessionState("paused");
    notifyPlaybackState("paused", this.selectedStation || localStorage.station);
  }

  async resume() {
    await stateReady;

    if (!this.activeAudio.currentSrc && !this.activeAudio.src) {
      return this.play(this.selectedStation || localStorage.station);
    }

    this.transitionId += 1;
    this.isTransitioning = false;
    this.activeAudio.volume = this.targetVolume;
    await playWhenReady(this.activeAudio);

    localStorage.setItem("state", "played");
    this.updateMediaMetadata(this.selectedStation || localStorage.station, "playing").catch(() => {});
    this.updateMediaSessionState("playing");
    notifyPlaybackState("played", this.selectedStation || localStorage.station);

    return { station: this.selectedStation || localStorage.station, resumed: true };
  }

  stop() {
    this.transitionId += 1;
    this.isTransitioning = false;
    this.audios.forEach(resetAudio);

    localStorage.setItem("state", "paused");
    this.updateMediaSessionState("paused");
    notifyPlaybackState("paused", this.selectedStation || localStorage.station);
  }

  volume() {
    if (!this.isTransitioning) {
      this.activeAudio.volume = this.targetVolume;
    }
  }

  status() {
    return {
      playing: this.isTransitioning || this.audios.some(audio => !audio.paused && !audio.ended),
      switching: this.isTransitioning,
      station: this.selectedStation || localStorage.station
    };
  }

  playAdjacentStation(offset) {
    const currentIndex = stationList.findIndex(station => (
      getStationId(station) === (this.selectedStation || localStorage.station)
    ));
    const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = (normalizedIndex + offset + stationList.length) % stationList.length;

    this.play(getStationId(stationList[nextIndex])).catch(() => {});
  }

  async updateMediaMetadata(stationId, status = "playing") {
    if (!hasMediaSession) {
      return;
    }

    this.metadataStatus = status;

    const station = stationList.find(item => getStationId(item) === stationId);

    if (!station) {
      return;
    }

    const staticLabel = `${station.group} • ${station.name}`;
    const tuningLabel = `Tuning to: ${staticLabel}`

    if (!mediaMetadata) {
      const artwork = await mediaArtworkReady;

      if (this.selectedStation !== stationId || this.metadataStatus !== status) {
        return;
      }

      mediaMetadata = new MediaMetadata({
        title: "Radio Wave",
        artist: status === "switching" ? tuningLabel : staticLabel,
        artwork
      });
      navigator.mediaSession.metadata = mediaMetadata;
    } else {
      mediaMetadata.title = "Radio Wave";
      mediaMetadata.artist = status === "switching" ? tuningLabel : staticLabel;

      if (navigator.mediaSession.metadata !== mediaMetadata) {
        navigator.mediaSession.metadata = mediaMetadata;
      }
    }

    try {
      navigator.mediaSession.setPositionState();
    } catch {
      // Position is intentionally unavailable for live streams.
    }
  }

  updateMediaSessionState(state) {
    if (hasMediaSession) {
      navigator.mediaSession.playbackState = state;
    }
  }

  syncMediaSessionState() {
    const isPlaying = this.isTransitioning || this.status().playing;

    this.updateMediaSessionState(isPlaying ? "playing" : "paused");

    if (!isPlaying) {
      notifyPlaybackState("paused", this.selectedStation || localStorage.station);
    }
  }

  initializeMediaSession() {
    if (!hasMediaSession) {
      return;
    }

    const handlers = {
      play: () => this.resume().catch(() => {}),
      pause: () => this.pause(),
      stop: () => this.stop(),
      previoustrack: () => this.playAdjacentStation(-1),
      nexttrack: () => this.playAdjacentStation(1),
      seekbackward: null,
      seekforward: null,
      seekto: null
    };

    Object.entries(handlers).forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some platforms expose only a subset of Media Session actions.
      }
    });
  }
}();

backgroundPlayer.initializeMediaSession();

const playerCommands = {
  play: message => backgroundPlayer.play(message.station),
  pause: () => backgroundPlayer.pause(),
  stop: () => backgroundPlayer.stop(),
  volume: () => backgroundPlayer.volume(),
  status: () => backgroundPlayer.status()
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== "offscreenPlayer") {
    return false;
  }

  const command = playerCommands[message.command];

  if (!command) {
    sendResponse({ ok: false, error: "Unknown player command" });
    return false;
  }

  Promise.resolve()
    .then(() => command(message))
    .then(result => sendResponse({ ok: true, ...result }))
    .catch(error => sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }));

  return true;
});
