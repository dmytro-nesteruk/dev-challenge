var h=Object.defineProperty;var u=(s,e,n)=>e in s?h(s,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[e]=n;var t=(s,e,n)=>(u(s,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const c of i)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const c={};return i.integrity&&(c.integrity=i.integrity),i.referrerpolicy&&(c.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?c.credentials="include":i.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(i){if(i.ep)return;i.ep=!0;const c=n(i);fetch(i.href,c)}})();var o=(s=>(s.airplane="airplane",s.helicopter="helicopter",s.rocket="rocket",s.drone="drone",s.explosion="explosion",s))(o||{});const g="/dev-challenge/assets/rocket-white.f0779ea1.svg",p="/dev-challenge/assets/drone-white.db8501a6.svg",m="/dev-challenge/assets/airplane-white.58eb1318.svg",b="/dev-challenge/assets/helicopter-white.53fa16e7.svg",v="/dev-challenge/assets/explosion-white.5bbc322b.svg";class f{constructor({defaultDanger:e=o.rocket,emitt:n}){t(this,"buttons");t(this,"emitt");t(this,"availableDangers");t(this,"element");t(this,"selectedDanger");t(this,"handleClick",e=>{const r=e.target.closest("button");if(!r)return;const c=r.id.split("-").at(-1),a=this.availableDangers.find(d=>d===c);a&&a!==this.selectedDanger&&(this.selectedDanger=a,this.emitt("DANGER_TYPE_CHANGED",this.selectedDanger),this.update(this.selectedDanger))});t(this,"init",()=>{this.element.classList.add("danger-picker"),this.buttons=[this.createBtn(g,o.rocket,this.selectedDanger===o.rocket),this.createBtn(p,o.drone,this.selectedDanger===o.drone),this.createBtn(m,o.airplane,this.selectedDanger===o.airplane),this.createBtn(b,o.helicopter,this.selectedDanger===o.helicopter),this.createBtn(v,o.explosion,this.selectedDanger===o.explosion)],this.element.addEventListener("click",this.handleClick),this.buttons.forEach(e=>{this.element.append(e)})});t(this,"update",e=>{const n=this.buttons.find(i=>i.id.includes(e));if(!n)return;const r=this.buttons.find(i=>i.classList.contains("active"));r&&r.classList.remove("active"),n.classList.add("active")});t(this,"createBtn",(e,n,r=!1)=>{const i=document.createElement("button"),c=this.createIcon(e),a=this.createLabel(n.toUpperCase());return i.id=`danger-picker-button-${n}`,i.classList.add("danger-picker-button"),r&&i.classList.add("active"),i.append(c),i.append(a),i});t(this,"createIcon",e=>{const n=document.createElement("img");return n.src=e,n.classList.add("danger-picker-button__icon"),n.height=24,n.width=24,n});t(this,"createLabel",e=>{const n=document.createElement("span");return n.classList.add("danger-picker-button__label"),n.innerText=e,n});this.selectedDanger=e,this.emitt=n,this.availableDangers=Object.values(o),this.element=document.createElement("div"),this.buttons=[],this.init()}}const l="/src/assets/icons/";class E{constructor({defaultDanger:e,eventEmitter:n}){t(this,"selectedDanger");t(this,"container");t(this,"button");t(this,"icon");t(this,"emitter");t(this,"init",()=>{this.emitter.subscribe({event:"DANGER_TYPE_CHANGED",callback:e=>{this.update(e)}}),this.container.classList.add("selected-danger"),this.button.append(this.icon),this.button.addEventListener("click",this.handleClick),this.container.append(this.button)});t(this,"createBtn",()=>{const e=document.createElement("button");return e.classList.add("selected-danger-button"),e});t(this,"createIcon",e=>{const n=document.createElement("img");return n.src=e,n.height=128,n.width=128,n});t(this,"handleClick",()=>{this.emitter.notifySubscribers("DANGER_SUBMIT_CLICK",this.selectedDanger)});t(this,"update",e=>{this.selectedDanger=e,this.icon.src=`${l}/${e}.svg`});this.selectedDanger=e,this.emitter=n,this.container=document.createElement("div"),this.button=this.createBtn(),this.icon=this.createIcon(`${l}/${this.selectedDanger}.svg`),this.init()}get element(){return this.container}}class D{constructor({eventEmitter:e}){t(this,"eventEmitter");t(this,"container");t(this,"btn");t(this,"init",()=>{this.eventEmitter.notifySubscribers("DANGER_TYPE_CHANGED","sd"),DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission=="function"?(DeviceMotionEvent.requestPermission(),window.addEventListener("devicemotion",this.update)):console.log("Not supported")});t(this,"update",e=>{var n,r,i,c,a;console.log("updated"),console.log((n=e.acceleration)==null?void 0:n.x),console.log((r=e.acceleration)==null?void 0:r.y),console.log((i=e.acceleration)==null?void 0:i.z),this.container.innerText=(a=(c=e.acceleration)==null?void 0:c.x)==null?void 0:a.toString()});this.eventEmitter=e,this.container=document.createElement("div"),this.btn=document.createElement("button"),this.btn.innerText="click",this.btn.addEventListener("click",this.init),this.container.append(this.btn)}get element(){return this.container}}class k{constructor(){t(this,"subscribers");t(this,"subscribe",e=>{this.subscribers.push(e)});t(this,"notifySubscribers",(e,n)=>{this.subscribers.length&&this.subscribers.forEach(r=>{r.event===e&&r.callback(n)})});t(this,"unsubscribe",e=>{this.subscribers.length&&this.subscribers.filter(({event:n,callback:r})=>n!==e.event&&r!==e.callback)});this.subscribers=[]}}class L{constructor(){t(this,"id");t(this,"geoposition");t(this,"init",()=>{if(!navigator.geolocation||!navigator.geolocation.watchPosition)throw new Error("Geoposition API not supported in your browser.");this.id=navigator.geolocation.watchPosition(e=>{this.geoposition=e.coords,console.log(e)},e=>{console.log(e)},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})});t(this,"getPosition",()=>this.geoposition);t(this,"clear",()=>{this.id&&navigator.geolocation.clearWatch(this.id)});this.id=null,this.geoposition=null,this.init()}}class w{constructor(){t(this,"app");t(this,"selectedDanger");t(this,"accelerometer");t(this,"eventEmitter");t(this,"geolocation");t(this,"submitDanger");t(this,"dangerPicker");t(this,"children");this.app=document.createElement("div"),this.selectedDanger=o.helicopter,this.eventEmitter=new k,this.accelerometer=new D({eventEmitter:this.eventEmitter}),this.geolocation=new L,this.submitDanger=new E({defaultDanger:this.selectedDanger,eventEmitter:this.eventEmitter}),this.dangerPicker=new f({defaultDanger:this.selectedDanger,emitt:this.eventEmitter.notifySubscribers}),this.children=[this.accelerometer.element,this.submitDanger.element,this.dangerPicker.element],this.eventEmitter.subscribe({event:"DANGER_TYPE_CHANGED",callback:e=>{this.selectedDanger=e}}),this.eventEmitter.subscribe({event:"DANGER_SUBMIT_CLICK",callback:e=>{console.log(e)}})}render(e){this.children.forEach(n=>{this.app.append(n)}),e.append(this.app)}}const A=document.querySelector("#app"),y=new w;y.render(A);
