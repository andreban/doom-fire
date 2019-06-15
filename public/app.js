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

class DoomFire extends HTMLElement {
  constructor() {
    super();
    this.flames = [];
    this.width = 320;
    this.height = 200;
    this.active = true;

    // Create a Canvas to draw the flames.
    this.canvas = document.createElement('canvas');

    // Set size.
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Make it fill the whole element.
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Initialise the flames.
    for (let x = 0; x < this.width; x++) {
      for (let y = 1; y < this.height; y++) {
        this.setValue(x, y, 0);
      }
    }

    for (let x = 0; x < this.width; x++) {
      this.setValue(x, 0, 35);      
    }        

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');    
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);

    // Initialise the canvas with black.
    for (let i = 0; i < this.imageData.data.length; i++) {
      this.imageData.data[i] = 0;
      if (i % 4 == 3) this.imageData.data[i] = 255;
    }
     
    this.addEventListener('click', () => {
      this.toggle();
    });
  }

  _postAt(x, y) {
    return y * this.width + x;
  }

  setValue(x, y, value) {
    let pos = this._postAt(x, y);
    this.flames[pos] = value; 
  }

  valueAt(x, y) {
    let pos = this._postAt(x, y);
    return this.flames[pos];
  }

  connectedCallback() {
    window.requestAnimationFrame(this.update.bind(this));    
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

function parseColor(color) {
  const b = color & 0xFF;
  const g = color >> 8 & 0xFF;
  const r = color >> 16 & 0xFF;
  return {r, g, b}
}