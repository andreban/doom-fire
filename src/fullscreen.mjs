const fullscreenButton = document.querySelector('#fullscreen');

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

document.body.addEventListener('fullscreenchange', (e) => {
  if (document.fullscreenElement) {
    fullscreenButton.checked = true;
  } else {
    fullscreenButton.checked = false;
  }
});
