
export default class DoomFire extends HTMLElement {
  constructor() {
    super();
    this.active = true;

    // Create a Canvas to draw the flames.
    this.canvas = document.createElement('canvas');

    // Set size.
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Make it fill the whole element.
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    const offscreenCanvas = this.canvas.transferControlToOffscreen();
    offscreenCanvas.width = 320;
    offscreenCanvas.height = 200;

    this.worker = new Worker('doom-fire-worker.js');
    this.worker.postMessage({msg: 'init', canvas: offscreenCanvas}, [offscreenCanvas]);

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(this.canvas);
     
    this.addEventListener('click', () => {
      this.toggle();
    });
  }

  connectedCallback() {
    // window.requestAnimationFrame(this.update.bind(this));    
    this.worker.postMessage({msg: 'start'});
  }  

  update() {
    for (let srcX = 0; srcX < this.width; srcX++) {
      for (let srcY = 0; srcY < this.height - 1; srcY++) {
        let rand = Math.round(Math.random() * 3.0) & 3;
  
        let srcColor = this.valueAt(srcX, srcY);
        let dstColor = srcColor - (rand & 1);
  
        let dstX = srcX + rand - 2;
        let dstY = srcY + 1;
  
        this.setValue(dstX, dstY, dstColor);
  
        let pos = ((this.height - srcY) * this.width + srcX) * 4;  
        if (srcColor > 0) {
          let color = HTML_COLOR_SCALE[srcColor];
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
    window.requestAnimationFrame(this.update.bind(this));
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

if (!customElements.get('doom-fire')) {
  customElements.define('doom-fire', DoomFire);
}

