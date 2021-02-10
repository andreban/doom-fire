/*
 * Copyright 2021 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import './doom-fire.mjs';
import {WakeLockController} from './wake-lock.mjs';
import {FullscreenController} from './fullscreen.mjs';
import {isTrustedWebActivity} from './trusted-web-activity.mjs';
import './service-worker.mjs';

let doomFire;
let wind = 0;
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

document.addEventListener('keydown', (e) => {
  if (doomFire) {
    if (e.key === 'ArrowLeft') {
      wind--;
      doomFire.setWind(wind);
    } else if (e.key == 'ArrowRight') {
      wind++;
      doomFire.setWind(wind);
    }
  }
});

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (e) => {
    const orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    switch (orientation) {
      case 'portrait-primary':
        wind = -Math.round(e.gamma / 10);
        break;
      case 'portrait-secondary':
        wind = Math.round(e.gamma / 10);
        break;
      case 'landscape-primary':
        wind = -Math.round(e.beta / 10);
        break;
      case 'landscape-secondary':
        wind = Math.round(e.beta / 10);
        break;
    }
    doomFire.setWind(wind);
  });
}

customElements.whenDefined('doom-fire')
  .then(() => {
    doomFire = document.querySelector('doom-fire');
  });
