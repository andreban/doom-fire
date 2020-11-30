import './doom-fire.mjs';
import {WakeLockController} from './wake-lock.mjs';
import {FullscreenController} from './fullscreen.mjs';
import {isTrustedWebActivity} from './trusted-web-activity.mjs';
import './service-worker.mjs';

const audioElement = document.querySelector('#audio');
const fullscreenButton = document.querySelector('#fullscreen');
FullscreenController.setup(fullscreenButton, document.body);

const keepAwakeButton = document.querySelector('#keep-awake');
WakeLockController.setup(keepAwakeButton);

const soundButton = document.querySelector('#sound');
soundButton.addEventListener('click', () => {
  if (soundButton.checked) {
    console.log('pause');
    audioElement.pause();
  } else {
    console.log('play');
    audioElement.play();
  }
});

if (isTrustedWebActivity('com.doom_fire.twa')) {
  console.log('Running in Trusted Web Activity Mode!');
  fullscreenButton.classList.add('hidden');
}
