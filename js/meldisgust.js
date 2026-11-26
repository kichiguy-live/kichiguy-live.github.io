
(()=>{'use strict';
const popup=document.getElementById('meldisgustPopup');const banner=document.querySelector('#home>.official-home-banner');if(!popup||!banner)return;
const KEY='kichiguy_meldisgust_sets_v107';
const line=popup.querySelector('.md-line'),punch=popup.querySelector('.md-punch'),close=popup.querySelector('.md-close');
const originalLine=line.textContent,originalPunch=punch.textContent;
let taps=0,last=0,goTimer=null,prevFocus=null,typeTimer=null;
const collected18=()=>{try{return (window.kichiMel?.getCollected?.().length||0)>=18}catch{return false}};
const getSets=()=>{try{return Math.max(0,Number(localStorage.getItem(KEY))||0)}catch{return 0}};
const setSets=n=>{try{localStorage.setItem(KEY,String(n))}catch{}};
function stopTyping(){if(typeTimer){clearTimeout(typeTimer);typeTimer=null}}
const hide=()=>{stopTyping();popup.hidden=true;document.body.style.removeProperty('overflow');prevFocus?.focus?.()};
close.addEventListener('click',hide);
popup.addEventListener('click',e=>{if(e.target===popup)hide()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden)hide()});
function reveal(special){
 stopTyping();prevFocus=document.activeElement;popup.hidden=false;document.body.style.overflow='hidden';
 popup.classList.toggle('md-special',special);close.hidden=Boolean(special);
 if(!special){line.textContent=originalLine;punch.textContent=originalPunch;close.focus();return}
 line.textContent='';punch.textContent='';
 const segments=[{el:line,text:'……まだ触ってくるの？\n気持ち悪いって言ってるの、理解できない？\nほんっと無理。視界から消えて。'},{el:punch,text:'吐きそう。'}];
 let si=0,ci=0;
 const tick=()=>{
  if(popup.hidden)return;
  if(si>=segments.length){close.hidden=false;close.focus();return}
  const seg=segments[si];const ch=Array.from(seg.text)[ci++];
  if(ch!==undefined){seg.el.textContent+=ch;typeTimer=setTimeout(tick,ch==='。'||ch==='？'?370:ch==='…'?175:80)}
  else{si++;ci=0;typeTimer=setTimeout(tick,si===1?550:120)}
 };
 typeTimer=setTimeout(tick,350);
}
banner.style.cursor='pointer';banner.style.touchAction='manipulation';banner.setAttribute('aria-label','KiCHiGUY LIVE メルの公式バナー');
banner.addEventListener('click',e=>{
 e.preventDefault();e.stopImmediatePropagation();
 const now=performance.now();taps=(now-last>3000)?1:taps+1;last=now;
 if(goTimer)clearTimeout(goTimer);
 if(taps>=30){
  taps=0;last=0;
  const eligible=collected18();const sets=eligible?getSets()+1:0;
  if(eligible)setSets(sets);
  reveal(eligible&&sets>=10);
  if(eligible&&sets>=10){
   try{const found=JSON.parse(localStorage.getItem('kichiguy_phantom_discovered_v1')||'[]');if(Array.isArray(found)&&found.includes('phantom')&&!found.includes('meldisgust')){
    const ready=JSON.parse(localStorage.getItem('kichiguy_ph76_ready_v1')||'{}');ready.meldisgust=true;localStorage.setItem('kichiguy_ph76_ready_v1',JSON.stringify(ready));
    window.dispatchEvent(new Event('kichiguy-meldisgust-ready'));
   }}catch(err){console.warn('MEL DISGUST unlock not saved',err)}
  }
 }else{
  goTimer=setTimeout(()=>{if(taps===1){document.querySelector('[data-go="mel"]')?.click()}taps=0;last=0;},3000);
 }
},true);
window.addEventListener('pageshow',()=>{taps=0;last=0});
})();
