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

export class WakeLockController {
  constructor(keepAwakeButton) {
    this.wakeLock = null;
    this.keepAwakeButton = keepAwakeButton;
  }

  async requestWakeLock() {
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.keepAwakeButton.checked = false;
        console.log('Screen Wake Lock was released.');
      }, {once: true});
      console.log('Screen Wake Lock is active.');
      this.keepAwakeButton.checked = true;
    } catch(err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }

  async releaseWakeLock() {
    try {
      this.wakeLock.release();
      this.wakeLock = null;
    } catch(err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }

  static setup(keepAwakeButton) {
    if (!'wakeLock' in navigator) {
      console.log('Wake Lock API is not supported 😞');
      return;
    }

    console.log('Wake Lock API supported 🎉')
    keepAwakeButton.removeAttribute('disabled');
    keepAwakeButton.classList.remove('hidden');
    const wakeLockController = new WakeLockController(keepAwakeButton);
    keepAwakeButton.addEventListener('click', async () => {
      if (wakeLockController.wakeLock) {
        await wakeLockController.releaseWakeLock();
      } else {
        await wakeLockController.requestWakeLock();
      }
    });

    const handleVisibilityChange = () => {
      if (wakeLockController.wakeLock !== null && document.visibilityState === 'visible') {
        wakeLockController.requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange); 
  }
}
