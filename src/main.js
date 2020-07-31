import './doom-fire.mjs';

const keepAwakeButton = document.querySelector('#keep-awake');
const fullscreenButton = document.querySelector('#fullscreen');
let wakeLock;

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

if ('wakeLock' in navigator) {
  console.log('Wake Lock API supported 🎉')
  keepAwakeButton.removeAttribute('disabled');
  keepAwakeButton.classList.remove('hidden');
}

keepAwakeButton.addEventListener('click', async () => {
  try {
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    } else {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock was released.');
      }, {once: true});
      console.log('Screen Wake Lock is active.');
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      console.log('Exiting fullscreen.');
      await document.exitFullscreen();
    } else {
      console.log('Entering fullscreen.');
      await document.body.requestFullscreen();
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);    
  }
});
