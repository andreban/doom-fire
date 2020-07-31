import './doom-fire.mjs';

const keepAwakeButton = document.querySelector('#keepAwake');
const fullscreenButton = document.querySelector('#fullscreen');

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

if ('wakeLock' in navigator) {
  // Screen Wake Lock API supported 🎉
  keepAwakeButton.removeAttribute('disabled');
  keepAwakeButton.classList.remove('hidden');
}

keepAwakeButton.addEventListener('click', () => {});
fullscreenButton.addEventListener('click', () => {});
