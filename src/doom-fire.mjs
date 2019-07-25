
import DoomFireAnimation from './doom-fire-animation.mjs';

export default class DoomFire extends HTMLElement {
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

    if (this.offscreen) {
      const offscreenCanvas = this.canvas.transferControlToOffscreen();
      offscreenCanvas.width = 320;
      offscreenCanvas.height = 200;      
      this.worker = new Worker('doom-fire-worker.js');
      this.worker.postMessage({msg: 'init', canvas: offscreenCanvas}, [offscreenCanvas]);
    } else {
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
