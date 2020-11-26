export class FullscreenController {
  static setup(buttonElement, fullscreenElement) {
    if (!fullscreenElement.requestFullscreen) {
      console.log('Fullscreen API is not supported 😞');
      return;
    }
    console.log('Fullscreen API supported 🎉')

    buttonElement.classList.remove('hidden');
    buttonElement.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          console.log('Exiting fullscreen.');
          await document.exitFullscreen();
        } else {
          console.log('Entering fullscreen.');
          await fullscreenElement.requestFullscreen();
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);    
      }
    });
    
    fullscreenElement.addEventListener('fullscreenchange', (e) => {
      if (document.fullscreenElement) {
        buttonElement.checked = true;
      } else {
        buttonElement.checked = false;
      }
    });
  }
}
