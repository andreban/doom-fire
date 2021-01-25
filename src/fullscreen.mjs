/*
 * Copyright 2021 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
