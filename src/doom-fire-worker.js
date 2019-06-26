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
const flames = [];
const width = 320;
const height = 200;

let canvas;
let ctx;
let imageData;

function parseColor(color) {
  const b = color & 0xFF;
  const g = color >> 8 & 0xFF;
  const r = color >> 16 & 0xFF;
  return {r, g, b}
}

function posAt(x, y) {
  return y * width + x;
}

function setValue(x, y, value) {
  let pos = posAt(x, y);
  flames[pos] = value; 
}

function valueAt(x, y) {
  let pos = posAt(x, y);
  return flames[pos];
}

function init() {
    // Initialise the flames.
    for (let x = 0; x < width; x++) {
      for (let y = 1; y < height; y++) {
        setValue(x, y, 0);
      }
    }

    for (let x = 0; x < width; x++) {
      setValue(x, 0, 35);      
    }
}

function update() {
  for (let srcX = 0; srcX < width; srcX++) {
    for (let srcY = 0; srcY < height - 1; srcY++) {
      let rand = Math.round(Math.random() * 3.0) & 3;

      let srcColor = valueAt(srcX, srcY);
      let dstColor = srcColor - (rand & 1);

      let dstX = srcX + rand - 2;
      let dstY = srcY + 1;

      setValue(dstX, dstY, dstColor);

      let pos = ((height - srcY) * width + srcX) * 4;  
      if (srcColor > 0) {
        let color = HTML_COLOR_SCALE[srcColor];
        imageData.data[pos] = color.r;
        imageData.data[pos + 1] = color.g;
        imageData.data[pos + 2] = color.b;
        imageData.data[pos + 3] = 255;
      } else {
        imageData.data[pos] = 0;
        imageData.data[pos + 1] = 0;
        imageData.data[pos + 2] = 0;
        imageData.data[pos + 3] = 255;        
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);  
  self.requestAnimationFrame(update);
}

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    canvas = ev.data.canvas;
    ctx = canvas.getContext('2d');
    init();
  }

  if (ev.data.msg === 'start') {
    console.log('start');
    imageData = ctx.getImageData(0, 0, width, height);    
    // Initialise the canvas with black.
    for (let i = 0; i < imageData.data.length; i++) {
      imageData.data[i] = 128;
      if (i % 4 == 3) imageData.data[i] = 255;
    }
    update();
  }
}