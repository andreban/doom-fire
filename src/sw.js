// These JavaScript module imports need to be bundled:
import {precacheAndRoute} from 'workbox-precaching';

// Use the imported Workbox libraries to implement caching,
// routing, and other logic:
precacheAndRoute(self.__WB_MANIFEST);
