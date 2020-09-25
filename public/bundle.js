(function () {
  'use strict';

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
  const BLE = 1000 / 27; // DoomFire runs at 27FPS.
  class DoomFireAnimation {
    constructor(ctx) {
      this.flames = [];
      this.width = 320;
      this.height = 200;
      this.ctx = ctx;
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);    
      this._init();
      this.lastUpdate = 0;
      this.active = true;
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
        this.setValue(x, 0, 35);      
      }
    }
    _initCanvas() {
      // Initialise the canvas with black.
      for (let i = 0; i < this.imageData.data.length; i++) {
        this.imageData.data[i] = 0;
        if (i % 4 == 3) this.imageData.data[i] = 255;
      }
    }

    update() {
      let now = performance.now();
      if (now - this.lastUpdate < BLE) {
        return;
      }

      performance.mark('start');
      for (let srcY = 0; srcY < this.height; srcY++) {
        const srcRow = srcY * this.width;
        const dstRow = (srcY + 1) * this.width;
        const imageRow = (this.height - srcY) * this.width;
        for (let srcX = 0; srcX < this.width; srcX++) {      
          const rand = Math.round(Math.random() * 3.0) & 3;
    
          const srcIndex = srcRow + srcX;
          const srcColor = this.flames[srcIndex];
          const dstColor = srcColor - (rand & 1);
    
          const dstX = srcX + rand - 1;
            
          const index = dstRow + dstX;
          this.flames[index] = dstColor; 
    
          const pos = (imageRow + srcX) * 4;  
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
      performance.mark('end');
      performance.measure('elapsed', 'start', 'end');
    }

    toggle() {
      if (this.active) {
        for (let x = 0; x < this.width; x++) {
          this.setValue(x, 0, 0);      
        }    
      } else {
        for (let x = 0; x < this.width; x++) {
          this.setValue(x, 0, 35);      
        }    
      }
      this.active = !this.active;    
    }  
  }

  function parseColor(color) {
    const b = color & 0xFF;
    const g = color >> 8 & 0xFF;
    const r = color >> 16 & 0xFF;
    return {r, g, b}
  }

  class DoomFire extends HTMLElement {
    constructor() {
      super();
      this.active = true;

      // Create a Canvas to draw the flames.
      this.canvas = document.createElement('canvas');
      this.offscreen = typeof(this.canvas.transferControlToOffscreen) != 'undefined';

      // Set size.
      this.canvas.width = 320;
      this.canvas.height = 200;

      // Make it fill the whole element.
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';

      // Make the rendering pixelated, for a retro effect,
      this.canvas.style.imageRendering = 'pixelated';

      if (this.offscreen) {
        console.log('Rendering with Offscreen Canvas.');
        const offscreenCanvas = this.canvas.transferControlToOffscreen();
        offscreenCanvas.width = 320;
        offscreenCanvas.height = 200;      
        this.worker = new Worker('doom-fire-worker.js');
        this.worker.postMessage({msg: 'init', canvas: offscreenCanvas}, [offscreenCanvas]);
      } else {
        console.log('Rendering with regular Canvas.');
        let ctx = this.canvas.getContext('2d');
        this.animation = new DoomFireAnimation(ctx);
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
        this.update();
      }
    }  

    toggle() {
      if (this.offscreen) {
        this.worker.postMessage({msg: 'toggle'});      
      } else {
        this.animation.toggle();
      }    
    }

    update() {
      this.animation.update();
      window.requestAnimationFrame(this.update.bind(this));
    }
  }

  if (!customElements.get('doom-fire')) {
    customElements.define('doom-fire', DoomFire);
  }

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

  class FullscreenController {
    static setup(buttonElement, fullscreenElement) {
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

  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  const fullscreenButton = document.querySelector('#fullscreen');
  FullscreenController.setup(fullscreenButton, document.body);

  const keepAwakeButton = document.querySelector('#keep-awake');
  WakeLockController.setup(keepAwakeButton);

  if (isTrustedWebActivity('com.doom_fire.twa')) {
    console.log('Running in Trusted Web Activity Mode!');
    fullscreenButton.classList.add('hidden');
  }

}());
//# sourceMappingURL=bundle.js.map
