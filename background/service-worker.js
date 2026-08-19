"use strict";

const OFFSCREEN_DOCUMENT_PATH = "background/index.html";
const OFFSCREEN_IDLE_ALARM = "close-idle-offscreen-document";
const OFFSCREEN_IDLE_DELAY_MINUTES = 1;
const PLAYER_COMMANDS = new Set(["play", "pause", "stop", "status", "volume"]);
const LIFECYCLE_COMMANDS = new Set(["prepare", "closeIfIdle"]);

let creatingOffscreenDocument;
let activePlayCommands = 0;

const cancelIdleClose = () => chrome.alarms.clear(OFFSCREEN_IDLE_ALARM);
const scheduleIdleClose = () => chrome.alarms.create(OFFSCREEN_IDLE_ALARM, {
  delayInMinutes: OFFSCREEN_IDLE_DELAY_MINUTES,
  persistAcrossSessions: false
});

const ensureOffscreenDocument = async () => {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play the selected radio station after the popup is closed."
    });
  }

  try {
    await creatingOffscreenDocument;
  } finally {
    creatingOffscreenDocument = undefined;
  }
};

const routePlayerCommand = async (message) => {
  if (!PLAYER_COMMANDS.has(message.command)) {
    return { ok: false, error: "Unknown player command" };
  }

  const hasOffscreenDocument = await chrome.offscreen.hasDocument();

  if (message.command !== "play" && !hasOffscreenDocument) {
    return message.command === "status"
      ? { ok: true, playing: false, switching: false }
      : { ok: true };
  }

  if (!hasOffscreenDocument) {
    await ensureOffscreenDocument();
  }

  if (message.command === "play") {
    await cancelIdleClose();
    activePlayCommands += 1;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      ...message,
      target: "offscreenPlayer"
    });

    if (message.command === "pause" || message.command === "stop") {
      await scheduleIdleClose();
    }

    return response;
  } finally {
    if (message.command === "play") {
      activePlayCommands -= 1;
    }
  }
};

const closeOffscreenDocumentIfIdle = async () => {
  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
  }

  if (activePlayCommands > 0 || !await chrome.offscreen.hasDocument()) {
    return { ok: true, closed: false };
  }

  const status = await chrome.runtime.sendMessage({
    target: "offscreenPlayer",
    command: "status"
  });

  if (!status?.ok || status.playing) {
    return { ok: true, closed: false };
  }

  await chrome.offscreen.closeDocument();
  return { ok: true, closed: true };
};

const routeLifecycleCommand = async (message) => {
  if (message.command === "prepare") {
    await ensureOffscreenDocument();
    await scheduleIdleClose();
    return { ok: true };
  }

  await scheduleIdleClose();
  return { ok: true, scheduled: true };
};

const handlePlaybackState = async (status) => {
  if (status === "played" || status === "switching") {
    await cancelIdleClose();
  } else if (status === "paused") {
    await scheduleIdleClose();
  }

  return { ok: true };
};

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === OFFSCREEN_IDLE_ALARM) {
    closeOffscreenDocumentIfIdle().catch(error => {
      console.error("Unable to close idle offscreen document", error);
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target === "playbackState") {
    handlePlaybackState(message.status)
      .then(sendResponse)
      .catch(error => sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      }));

    return true;
  }

  if (message.target !== "backgroundPlayer") {
    return false;
  }

  const routeCommand = LIFECYCLE_COMMANDS.has(message.command)
    ? routeLifecycleCommand
    : routePlayerCommand;

  routeCommand(message)
    .then(sendResponse)
    .catch(error => sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }));

  return true;
});
