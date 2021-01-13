
import DoomFireAnimation from './doom-fire-animation.mjs';

export default class DoomFire extends HTMLElement {
  constructor() {
    super();
    this.active = true;

    // Create a Canvas to draw the flames.
    this.canvas = document.createElement('canvas');
    this.offscreen = "OffscreenCanvas" in window;

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
}

if (!customElements.get('doom-fire')) {
  customElements.define('doom-fire', DoomFire);
}
