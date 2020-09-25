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
