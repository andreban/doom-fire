import DoomFireAnimation from './doom-fire-animation.mjs';

let canvas;
let doomFireAnimation;

function update() {
  doomFireAnimation.update();
  self.requestAnimationFrame(update);
}

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    canvas = ev.data.canvas;
    let ctx = canvas.getContext('2d');
    doomFireAnimation = new DoomFireAnimation(ctx);
  }

  if (ev.data.msg === 'start') {
    update();
  }

  if (ev.data.msg === 'toggle') {
    doomFireAnimation.toggle();
  }  
}
