import './doom-fire.mjs';
import {WakeLockController} from './wake-lock.mjs';
import {FullscreenController} from './fullscreen.mjs';
import './service-worker.mjs';

const fullscreenButton = document.querySelector('#fullscreen');
FullscreenController.setup(fullscreenButton, document.body);

const keepAwakeButton = document.querySelector('#keep-awake');
WakeLockController.setup(keepAwakeButton);
