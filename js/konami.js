
(()=>{'use strict';
const banner=document.querySelector('#home>.official-home-banner');if(!banner)return;
const logo=document.createElement('button');logo.id='kichiLogoHotspot';logo.type='button';logo.setAttribute('aria-label','KiCHiGUY LIVE ロゴ');logo.title='KiCHiGUY LIVE';banner.appendChild(logo);
const pad=document.createElement('div');pad.id='kichiKonamiPad';pad.hidden=true;
pad.innerHTML='<div class="kk-padbox" role="dialog" aria-modal="true" aria-label="隠しコマンド入力"><h2>SECRET INPUT</h2><p>コマンドを入力してください</p><p class="kk-dots" aria-live="polite">□□□□□□□□□□</p><div class="kk-padgrid"><span></span><button data-kk="U">↑</button><span></span><button data-kk="L">←</button><button data-kk="D">↓</button><button data-kk="R">→</button><span></span><button data-kk="B">B</button><button data-kk="A">A</button></div><button class="kk-close">閉じる</button></div>';
const show=document.createElement('div');show.id='kichiKonamiShow';show.hidden=true;
show.innerHTML='<div class="kk-rainbow"></div><div class="kk-burst"></div><div class="kk-orbit kk-orbit-a"></div><div class="kk-orbit kk-orbit-b"></div><div class="kk-lightning kk-lightning-a"></div><div class="kk-lightning kk-lightning-b"></div><div class="kk-lightning kk-lightning-c"></div><div class="kk-sparks"></div><div class="kk-impact"></div><div class="kk-puchun"><div class="kk-puchun-core"></div><div class="kk-puchun-line"></div></div><div class="kk-result">なにもおこりませんでした</div><button class="kk-skip">スキップ</button>';
const popup=document.createElement('div');popup.id='kichiNothingPopup';popup.hidden=true;
popup.innerHTML='<div class="kk-padbox" role="dialog" aria-modal="true"><h2>本当に…？</h2><button class="kk-close">閉じる</button></div>';
const reveal=document.createElement('div');reveal.id='kichiNothingReveal';reveal.hidden=true;reveal.innerHTML='<div class="kk-decode">譁�縺�？？？</div>';
document.body.append(pad,show,popup,reveal);
const seq='UUDDLRLRBA',KEY='kichi_nothing_konami_success_v1';let count=0;try{count=Math.min(10,Math.max(0,Number(localStorage.getItem(KEY))||0))}catch(e){}
let progress=0,hold=null,timers=[],active=false,ten=false,held=false,origin=null;
const later=(fn,ms)=>{timers.push(setTimeout(fn,ms))};const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
const resetPad=()=>{progress=0;pad.querySelector('.kk-dots').textContent='□□□□□□□□□□'};
const closePad=()=>{pad.hidden=true;resetPad()};
const closeShow=()=>{clearTimers();show.hidden=true;show.classList.remove('kk-black','kk-result-on','kk-puchun-active');active=false;if(ten){ten=false;popup.hidden=false;popup.querySelector('button').focus()}else origin?.focus?.()};
const success=()=>{closePad();clearTimers();active=true;show.hidden=false;show.classList.remove('kk-black','kk-result-on','kk-puchun-active');ten=false;
 const unlocked=(()=>{try{return JSON.parse(localStorage.getItem('kichiguy_phantom_discovered_v1')||'[]').includes('nothing')}catch(e){return false}})();
 // Do not increment after discovery. The one-time question appears only on success number ten.
 if(!unlocked&&count<10){count++;try{localStorage.setItem(KEY,String(count))}catch(e){}if(count===10)ten=true}
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce){show.classList.add('kk-black','kk-result-on')}else{later(()=>show.classList.add('kk-puchun-active'),2700);later(()=>show.classList.add('kk-black'),3130);later(()=>show.classList.add('kk-result-on'),3670)}
 show.querySelector('.kk-skip').focus();
};
const feed=k=>{progress=k===seq[progress]?progress+1:(k===seq[0]?1:0);pad.querySelector('.kk-dots').textContent='●'.repeat(progress)+'□'.repeat(seq.length-progress);if(progress===seq.length)success()};
pad.querySelectorAll('[data-kk]').forEach(b=>b.addEventListener('click',()=>feed(b.dataset.kk)));
pad.querySelector('.kk-close').addEventListener('click',closePad);
pad.addEventListener('click',e=>{if(e.target===pad)closePad()});
show.querySelector('.kk-skip').addEventListener('click',()=>{if(!show.classList.contains('kk-result-on')){clearTimers();show.classList.add('kk-black','kk-result-on')}else closeShow()});
show.addEventListener('click',e=>{if(e.target===show&&show.classList.contains('kk-result-on'))closeShow()});
const openPad=()=>{if(active||!popup.hidden||!reveal.hidden)return;origin=document.activeElement;pad.hidden=false;resetPad();pad.querySelector('[data-kk]').focus()};
// The logo is part of the banner image. Overlay an invisible hotspot on its left portion only.
logo.addEventListener('pointerdown',e=>{if(e.button!==0)return;held=false;clearTimeout(hold);hold=setTimeout(()=>{held=true;openPad()},2000)});
['pointerup','pointerleave','pointercancel'].forEach(type=>logo.addEventListener(type,()=>{clearTimeout(hold);hold=null}));
logo.addEventListener('click',e=>{e.stopPropagation();if(held){e.preventDefault();held=false}});
logo.addEventListener('contextmenu',e=>{e.preventDefault()});
logo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPad()}});
popup.querySelector('button').addEventListener('click',()=>{popup.hidden=true;reveal.hidden=false;const el=reveal.querySelector('.kk-decode');let n=0;const glyph=['譁�縺�？？？','N▓T▒I▒G','N◈TH◈NG','NOTHING'];const run=()=>{el.textContent=glyph[Math.min(n,glyph.length-1)];n++;if(n<glyph.length){later(run,450)}else{el.classList.add('done');later(()=>{reveal.hidden=true;el.classList.remove('done');if(typeof window.kichiUnlockNothing==='function')window.kichiUnlockNothing()},1000)}};run()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!pad.hidden)closePad();else if(!show.hidden&&show.classList.contains('kk-result-on'))closeShow();return}if(pad.hidden||e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;const map={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'};const key=map[e.key]||(/^[ab]$/i.test(e.key)?e.key.toUpperCase():null);if(key){e.preventDefault();feed(key)}});
})();
