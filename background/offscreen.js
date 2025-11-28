"use strict";

const audio = new Audio();

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'AUDIO_PLAY':
      audio.volume = message.volume || 0.3;
      audio.src = message.url;
      audio.play().catch(err => console.error('Audio play error:', err));
      break;

    case 'AUDIO_STOP':
      audio.pause();
      audio.src = '';
      break;

    case 'AUDIO_VOLUME':
      audio.volume = message.volume;
      break;
  }
});
