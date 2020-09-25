import './doom-fire.mjs';
import {WakeLockController} from './wake-lock.mjs';
import {FullscreenController} from './fullscreen.mjs';
import {isTrustedWebActivity} from './trusted-web-activity.mjs';
import './service-worker.mjs';

const fullscreenButton = document.querySelector('#fullscreen');
FullscreenController.setup(fullscreenButton, document.body);

const keepAwakeButton = document.querySelector('#keep-awake');
WakeLockController.setup(keepAwakeButton);

if (isTrustedWebActivity('com.doom_fire.twa')) {
  console.log('Running in Trusted Web Activity Mode!');
  fullscreenButton.classList.add('hidden');
}
