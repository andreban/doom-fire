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

const TWA_PROTOCOL = 'android-app:';
const KEY_IS_TWA = 'isTrustedWebActivity';

export function isTrustedWebActivity(packageName) {
  const sessionStorageStatus = sessionStorage.getItem(KEY_IS_TWA);
  if (sessionStorageStatus === 'true') {
    return true;
  }

  const referrer = document.referrer.trim();
  if (referrer.length === 0) {
    return false;
  }

  console.log('Referrer: ', referrer);
  const referrerUrl = new URL(referrer);
  if (referrerUrl.protocol === TWA_PROTOCOL
      && referrerUrl.hostname === packageName) {
        sessionStorage.setItem(KEY_IS_TWA, 'true');
    return true;
  }

  return false;
}
