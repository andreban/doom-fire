!function(){"use strict";const e=[a(460551),a(2033415),a(3084039),a(4656903),a(5707527),a(6758151),a(7806727),a(9381639),a(10432263),a(11484935),a(12535559),a(13059847),a(14634759),a(14636807),a(14636807),a(14114567),a(14116623),a(13594383),a(13596431),a(13598479),a(13600535),a(13076247),a(13078295),a(13080351),a(12558111),a(12558111),a(12560167),a(12560167),a(12562223),a(12037935),a(12039983),a(12039991),a(13619055),a(14671775),a(15724487),a(16777215)],t=1e3/27;class s{constructor(e,t){this.canvas=t,this.parent=e,this.flames=[],this.width=320,this.height=168,this.ctx=t.getContext("2d"),this.imageData=this.ctx.getImageData(0,0,this.width,this.height),this._init(),this.lastUpdate=0,this.active=!0}posAt(e,t){return t*this.width+e}setValue(e,t,s){let a=this.posAt(e,t);this.flames[a]=s}valueAt(e,t){let s=this.posAt(e,t);return this.flames[s]}_init(){this._initCanvas(),this._initFlames()}_initFlames(){for(let e=0;e<this.width;e++)for(let t=1;t<this.height;t++)this.setValue(e,t,0);for(let e=0;e<this.width;e++)this.setValue(e,0,35)}_initCanvas(){for(let e=0;e<this.imageData.data.length;e++)this.imageData.data[e]=0,e%4==3&&(this.imageData.data[e]=255)}start(){requestAnimationFrame(this._update.bind(this))}_update(){let s=performance.now();if(s-this.lastUpdate<t)this.parent.requestAnimationFrame(this._update.bind(this));else{for(let t=0;t<this.height;t++){const s=t*this.width,a=(t+1)*this.width,i=(this.height-t)*this.width;for(let t=0;t<this.width;t++){const n=Math.round(3*Math.random()),o=s+t,r=this.flames[o],c=r-(1&n),h=a+(t+n-1);this.flames[h]=c;const l=4*(i+t);if(r>0){const t=e[r];this.imageData.data[l]=t.r,this.imageData.data[l+1]=t.g,this.imageData.data[l+2]=t.b,this.imageData.data[l+3]=255}else this.imageData.data[l]=0,this.imageData.data[l+1]=0,this.imageData.data[l+2]=0,this.imageData.data[l+3]=255}}this.ctx.putImageData(this.imageData,0,0),this.lastUpdate=s,this.parent.requestAnimationFrame(this._update.bind(this))}}toggle(){if(this.active)for(let e=0;e<this.width;e++)this.setValue(e,0,0);else for(let e=0;e<this.width;e++)this.setValue(e,0,35);this.active=!this.active}}function a(e){return{r:e>>16&255,g:e>>8&255,b:255&e}}class i extends HTMLElement{constructor(){if(super(),this.active=!0,this.canvas=document.createElement("canvas"),this.offscreen="OffscreenCanvas"in window,this.canvas.width=320,this.canvas.height=168,this.canvas.style.width="100%",this.canvas.style.height="100%",this.canvas.style.imageRendering="pixelated",this.offscreen){console.log("Rendering with Offscreen Canvas.");const e=this.canvas.transferControlToOffscreen();e.width=320,e.height=168,this.worker=new Worker("doom-fire-worker.js"),this.worker.postMessage({msg:"init",canvas:e},[e])}else console.log("Rendering with regular Canvas."),this.animation=new s(window,this.canvas);this.attachShadow({mode:"open"}).appendChild(this.canvas),this.addEventListener("click",()=>{this.toggle()})}connectedCallback(){this.offscreen?this.worker.postMessage({msg:"start"}):this.animation.start()}toggle(){this.offscreen?this.worker.postMessage({msg:"toggle"}):this.animation.toggle()}}customElements.get("doom-fire")||customElements.define("doom-fire",i);class n{constructor(e){this.wakeLock=null,this.keepAwakeButton=e}async requestWakeLock(){try{this.wakeLock=await navigator.wakeLock.request("screen"),this.wakeLock.addEventListener("release",()=>{this.keepAwakeButton.checked=!1,console.log("Screen Wake Lock was released.")},{once:!0}),console.log("Screen Wake Lock is active."),this.keepAwakeButton.checked=!0}catch(e){console.error(`${e.name}, ${e.message}`)}}async releaseWakeLock(){try{this.wakeLock.release(),this.wakeLock=null}catch(e){console.error(`${e.name}, ${e.message}`)}}static setup(e){if(!1 in navigator)return void console.log("Wake Lock API is not supported 😞");console.log("Wake Lock API supported 🎉"),e.removeAttribute("disabled"),e.classList.remove("hidden");const t=new n(e);e.addEventListener("click",async()=>{t.wakeLock?await t.releaseWakeLock():await t.requestWakeLock()});document.addEventListener("visibilitychange",()=>{null!==t.wakeLock&&"visible"===document.visibilityState&&t.requestWakeLock()})}}const o="android-app:",r="isTrustedWebActivity";"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")});const c=document.querySelector("#audio"),h=document.querySelector("#fullscreen");(class{static setup(e,t){t.requestFullscreen?(console.log("Fullscreen API supported 🎉"),e.classList.remove("hidden"),e.addEventListener("click",async()=>{try{document.fullscreenElement?(console.log("Exiting fullscreen."),await document.exitFullscreen()):(console.log("Entering fullscreen."),await t.requestFullscreen())}catch(e){console.error(`${e.name}, ${e.message}`)}}),t.addEventListener("fullscreenchange",t=>{document.fullscreenElement?e.checked=!0:e.checked=!1})):console.log("Fullscreen API is not supported 😞")}}).setup(h,document.body);const l=document.querySelector("#keep-awake");n.setup(l);const d=document.querySelector("#sound");d.addEventListener("click",()=>{d.checked?(console.log("pause"),c.pause()):(console.log("play"),c.play())}),function(e){if("true"===sessionStorage.getItem(r))return!0;const t=document.referrer.trim();if(0===t.length)return!1;console.log("Referrer: ",t);const s=new URL(t);return s.protocol===o&&s.hostname===e&&(sessionStorage.setItem(r,"true"),!0)}("com.doom_fire.twa")&&(console.log("Running in Trusted Web Activity Mode!"),h.classList.add("hidden"))}();
//# sourceMappingURL=bundle.js.map
