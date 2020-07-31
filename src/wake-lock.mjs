const keepAwakeButton = document.querySelector('#keep-awake');
let wakeLock;
if ('wakeLock' in navigator) {
  console.log('Wake Lock API supported 🎉')
  keepAwakeButton.removeAttribute('disabled');
  keepAwakeButton.classList.remove('hidden');
}

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      keepAwakeButton.checked = false;
      console.log('Screen Wake Lock was released.');
    }, {once: true});
    console.log('Screen Wake Lock is active.');
    keepAwakeButton.checked = true;
  } catch(err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

const releaseWakeLock = async() => {
  try {
    wakeLock.release();
    wakeLock = null;
  } catch(err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

keepAwakeButton.addEventListener('click', async () => {
  if (wakeLock) {
    await releaseWakeLock();
  } else {
    await requestWakeLock();
  }
});

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
