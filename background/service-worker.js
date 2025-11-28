"use strict";

// Import stations list
importScripts('../shared/stations.js');

const STREAM_API_URL = "https://europe-southwest1-radio--wave.cloudfunctions.net/getstream-v2";
const CLIENT = "client=chrome-extension";
const currentVersion = "3.0.0";

// Initialize storage on install
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(['version', 'volume', 'station', 'state']);

  if (!data.version || data.version !== currentVersion) {
    const isCurrentStationExist = self.stationList && self.stationList.some(
      item => data.station === `${item.group}.${item.station}`
    );

    await chrome.storage.local.set({
      version: currentVersion,
      volume: data.volume || 30,
      state: "paused",
      station: isCurrentStationExist ? data.station : "TVR.KissFM"
    });
  }
});

// Create offscreen document for audio playback
async function setupOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
  });

  if (existingContexts.length > 0) {
    return;
  }

  await chrome.offscreen.createDocument({
    url: 'background/offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Play radio audio stream',
  });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case 'PLAY':
        await setupOffscreenDocument();
        const playData = await chrome.storage.local.get(['station', 'volume', 'version']);
        const playUrl = `${STREAM_API_URL}?station=${playData.station}&${CLIENT}&version=${playData.version}`;

        chrome.runtime.sendMessage({
          type: 'AUDIO_PLAY',
          url: playUrl,
          volume: playData.volume / 100
        });

        await chrome.storage.local.set({ state: 'played' });
        sendResponse({ success: true });
        break;

      case 'STOP':
        chrome.runtime.sendMessage({ type: 'AUDIO_STOP' });
        await chrome.storage.local.set({ state: 'paused' });
        sendResponse({ success: true });
        break;

      case 'SET_VOLUME':
        chrome.runtime.sendMessage({ type: 'AUDIO_VOLUME', volume: message.volume / 100 });
        await chrome.storage.local.set({ volume: message.volume });
        sendResponse({ success: true });
        break;

      case 'SET_STATION':
        await chrome.storage.local.set({ station: message.station });
        sendResponse({ success: true });
        break;

      case 'GET_STATE':
        const state = await chrome.storage.local.get(['state', 'volume', 'station']);
        sendResponse(state);
        break;
    }
  })();

  return true; // Keep message channel open for async response
});
