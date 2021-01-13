import DoomFireAnimation from './doom-fire-animation.mjs';

let doomFireAnimation;

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    doomFireAnimation = new DoomFireAnimation(self, ev.data.canvas);
  }

  if (ev.data.msg === 'start') {
    doomFireAnimation.start();
  }

  if (ev.data.msg === 'toggle') {
    doomFireAnimation.toggle();
  }  
}
