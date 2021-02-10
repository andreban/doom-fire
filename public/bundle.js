(function () {
  'use strict';

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

  const HTML_COLOR_SCALE = [
    parseColor(0x070707), parseColor(0x1f0707), parseColor(0x2f0f07),
    parseColor(0x470f07), parseColor(0x571707), parseColor(0x671f07),
    parseColor(0x771f07), parseColor(0x8f2707), parseColor(0x9f2f07),
    parseColor(0xaf3f07), parseColor(0xbf4707), parseColor(0xc74707),
    parseColor(0xDF4F07), parseColor(0xDF5707), parseColor(0xDF5707),
    parseColor(0xD75F07), parseColor(0xD7670F), parseColor(0xcf6f0f),
    parseColor(0xcf770f), parseColor(0xcf7f0f), parseColor(0xCF8717),
    parseColor(0xC78717), parseColor(0xC78F17), parseColor(0xC7971F),
    parseColor(0xBF9F1F), parseColor(0xBF9F1F), parseColor(0xBFA727),
    parseColor(0xBFA727), parseColor(0xBFAF2F), parseColor(0xB7AF2F),
    parseColor(0xB7B72F), parseColor(0xB7B737), parseColor(0xCFCF6F),
    parseColor(0xDFDF9F), parseColor(0xEFEFC7), parseColor(0xFFFFFF)   
  ];
  const UPDATE_INTERVAL = 1000 / 27; // DoomFire runs at 27FPS.
  class DoomFireAnimation {
    constructor(parent, canvas) {
      this.canvas = canvas;
      this.parent = parent;
      this.flames = [];
      this.width = 320;
      this.height = 168;
      this.ctx = canvas.getContext('2d');
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);    
      this._init();
      this.lastUpdate = 0;
      this.active = true;
      this.wind = 0;
    }

    posAt(x, y) {
      return y * this.width + x;
    }
      
    setValue(x, y, value) {
      let pos = this.posAt(x, y);
      this.flames[pos] = value; 
    }

    valueAt(x, y) {
      let pos = this.posAt(x, y);
      return this.flames[pos];
    }  

    _init() {
      this._initCanvas();
      this._initFlames();
    }

    _initFlames() {
      // Initialise the flames.
      for (let x = 0; x < this.width; x++) {
        for (let y = 1; y < this.height; y++) {
          this.setValue(x, y, 0);
        }
      }

      for (let x = 0; x < this.width; x++) {
        this.setValue(x, this.height - 1, 35);      
      }
    }

    _initCanvas() {
      // Initialise the canvas with black.
      for (let i = 0; i < this.imageData.data.length; i++) {
        this.imageData.data[i] = 0;
        if (i % 4 == 3) this.imageData.data[i] = 255;
      }
    }

    start() {
      requestAnimationFrame(this._update.bind(this));
    }

    _update() {
      let now = performance.now();
      if (now - this.lastUpdate < UPDATE_INTERVAL) {
        this.parent.requestAnimationFrame(this._update.bind(this));
        return;
      }

      for (let srcY = 0; srcY < this.height; srcY++) {
        const srcRow = srcY * this.width;
        const dstRow = (srcY - 1) * this.width;
        for (let srcX = 0; srcX < this.width; srcX++) {        
          const srcIndex = srcRow + srcX;
          const srcColor = this.flames[srcIndex];

          if (srcY > 0) {
            const rand = Math.floor(Math.random() * 3.0);
            const dstColor = srcColor > 0 ? srcColor - (rand & 1) : 0;
    
            let dstX = srcX + rand - 1 + this.wind;
            if (dstX >= this.width) {
              dstX = dstX - this.width;
            } else if (dstX < 0) {
              dstX = dstX + this.width;
            }
              
            const index = dstRow + dstX;
            this.flames[index] = dstColor; 
          }
    
          const pos = (srcRow + srcX) * 4;  
          if (srcColor > 0) {
            const color = HTML_COLOR_SCALE[srcColor];
            this.imageData.data[pos] = color.r;
            this.imageData.data[pos + 1] = color.g;
            this.imageData.data[pos + 2] = color.b;
            this.imageData.data[pos + 3] = 255;
          } else {
            this.imageData.data[pos] = 0;
            this.imageData.data[pos + 1] = 0;
            this.imageData.data[pos + 2] = 0;
            this.imageData.data[pos + 3] = 255;        
          }
        }
      }
      this.ctx.putImageData(this.imageData, 0, 0);  
      this.lastUpdate = now;
      this.parent.requestAnimationFrame(this._update.bind(this));
    }

    toggle() {
      if (this.active) {
        for (let x = 0; x < this.width; x++) {
          this.setValue(x, this.height - 1, 0);      
        }    
      } else {
        for (let x = 0; x < this.width; x++) {
          this.setValue(x, this.height - 1, 35);      
        }    
      }
      this.active = !this.active;    
    }

    setWind(amount) {
      this.wind = amount;
    }
  }

  function parseColor(color) {
    const b = color & 0xFF;
    const g = color >> 8 & 0xFF;
    const r = color >> 16 & 0xFF;
    return {r, g, b}
  }

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

  class DoomFire extends HTMLElement {
    constructor() {
      super();
      this.active = true;

      // Create a Canvas to draw the flames.
      this.canvas = document.createElement('canvas');
      this.offscreen = false;//'OffscreenCanvas' in window;

      // Set size.
      this.canvas.width = 320;
      this.canvas.height = 168;

      // Make it fill the whole element.
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';

      // Make the rendering pixelated, for a retro effect,
      this.canvas.style.imageRendering = 'pixelated';

      if (this.offscreen) {
        console.log('Rendering with Offscreen Canvas.');
        const offscreenCanvas = this.canvas.transferControlToOffscreen();
        offscreenCanvas.width = 320;
        offscreenCanvas.height = 168;      
        this.worker = new Worker('doom-fire-worker.js');
        this.worker.postMessage({msg: 'init', canvas: offscreenCanvas}, [offscreenCanvas]);
      } else {
        console.log('Rendering with regular Canvas.');
        this.animation = new DoomFireAnimation(window, this.canvas);
      }

      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.canvas);
       
      this.addEventListener('click', () => {
        this.toggle();
      });
    }

    connectedCallback() {
      if (this.offscreen) {
        this.worker.postMessage({msg: 'start'});
      } else {
        this.animation.start();
      }
    }  

    toggle() {
      if (this.offscreen) {
        this.worker.postMessage({msg: 'toggle'});      
      } else {
        this.animation.toggle();
      }    
    }

    setWind(amount) {
      if (this.offscreen) {
        this.worker.postMessage({msg: 'wind', amount: amount});      
      } else {
        this.animation.setWind(amount);
      }
    }
  }

  if (!customElements.get('doom-fire')) {
    customElements.define('doom-fire', DoomFire);
  }

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

  class WakeLockController {
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

      console.log('Wake Lock API supported 🎉');
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

  class FullscreenController {
    static setup(buttonElement, fullscreenElement) {
      if (!fullscreenElement.requestFullscreen) {
        console.log('Fullscreen API is not supported 😞');
        return;
      }
      console.log('Fullscreen API supported 🎉');

      buttonElement.classList.remove('hidden');
      buttonElement.addEventListener('click', async () => {
        try {
          if (document.fullscreenElement) {
            console.log('Exiting fullscreen.');
            await document.exitFullscreen();
          } else {
            console.log('Entering fullscreen.');
            await fullscreenElement.requestFullscreen();
          }
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);    
        }
      });
      
      fullscreenElement.addEventListener('fullscreenchange', (e) => {
        if (document.fullscreenElement) {
          buttonElement.checked = true;
        } else {
          buttonElement.checked = false;
        }
      });
    }
  }

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

  const TWA_PROTOCOL = 'android-app:';
  const KEY_IS_TWA = 'isTrustedWebActivity';

  function isTrustedWebActivity(packageName) {
    const sessionStorageStatus = sessionStorage.getItem(KEY_IS_TWA);
    if (sessionStorageStatus === 'true') {
      return true;
    }

    const referrer = document.referrer.trim();
    if (referrer.length === 0) {
      return false;
    }

    console.log('Referrer: ', referrer);
    const referrerUrl = new URL(referrer);
    if (referrerUrl.protocol === TWA_PROTOCOL
        && referrerUrl.hostname === packageName) {
          sessionStorage.setItem(KEY_IS_TWA, 'true');
      return true;
    }

    return false;
  }

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

  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

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
      wind = -Math.round(e.gamma / 10);
      doomFire.setWind(wind);
    });
  }

  customElements.whenDefined('doom-fire')
    .then(() => {
      doomFire = document.querySelector('doom-fire');
    });

}());
//# sourceMappingURL=bundle.js.map
