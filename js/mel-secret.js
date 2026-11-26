(()=>{
const error=document.getElementById('melErrorOverlay'),secret=document.getElementById('melSecretOverlay');
const blood=document.getElementById('melBloodWash'),zoom=document.getElementById('melZoomFrame');
const main=document.getElementById('pixelMelImage'),caption=document.getElementById('pixelMelCaption');
const horrorSprite='images/ui/f10470a8e775e504.webp';
const tiltedSprite='images/ui/5c863bde228bddd0.webp';
const horrorFace='images/ui/7603bc1463a02623.webp';
const seq=[0,8,2,6],hintSeq=[0,8],phantomSeq=[0,6,0,2];let hintProgress=0,phantomProgress=0,progress=0,stageTwoArmed=false,oldOverflow='',timers=[],running=false,originalMain='',originalCaption='',originalThumbs=[];
const schedule=(fn,ms)=>timers.push(setTimeout(fn,ms));
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function clearHints(){document.body.classList.remove('mel-hint-1','mel-hint-2','mel-hint-3')}
function resetImages(){if(originalMain){main.src=originalMain;caption.textContent=originalCaption;originalMain=''};document.querySelectorAll('#pixelMelThumbs button img').forEach((im,i)=>{if(originalThumbs[i])im.src=originalThumbs[i];im.style.filter=''});originalThumbs=[]}
function closeAll(){if(!window.__kichiHorrorPreview)window.kichiSeg?.stop();clearTimers();running=false;progress=0;hintProgress=0;phantomProgress=0;stageTwoArmed=false;clearHints();resetImages();blood.hidden=true;blood.replaceChildren();zoom.hidden=true;zoom.classList.remove('go');error.hidden=true;secret.hidden=true;secret.classList.remove('pop-reveal');document.body.style.overflow=oldOverflow}
function openError(){zoom.hidden=true;blood.hidden=true;resetImages();error.hidden=false;document.getElementById('melErrorExit').focus({preventScroll:true})}
function begin(){
 if(running)return false;
 const thumbs=[...document.querySelectorAll('#pixelMelThumbs button img')].slice(0,18);
 // This animation indexes all 18 sprites; abort safely if the gallery is incomplete.
 if(!main||!caption||thumbs.length!==18||!tiltedSprite)return false;
 // Verify every gallery slot has an image URL before the animation mutates the page.
 if(thumbs.some(img=>!img.getAttribute('src')&&!img.currentSrc))return false;
 running=true;clearHints();oldOverflow=document.body.style.overflow;
 originalMain=main.src;originalCaption=caption.textContent;originalThumbs=thumbs.map(im=>im.src);
 // Keep the existing large sprite's position and dimensions unchanged.
 main.src=tiltedSprite;caption.textContent='……だれ？';
 blood.hidden=false;blood.replaceChildren();
 [0,5,11,17,23,29,35,41,47,53,59,65,71,77,83,89,95].forEach((x,i)=>{const drip=document.createElement('i');drip.className=i%3===0?'blood-stain':'blood-drip';drip.style.setProperty('--x',x+'%');drip.style.setProperty('--w',(16+i%5*12)+'px');drip.style.setProperty('--h',(100+(i*47)%230)+'px');drip.style.setProperty('--delay',(i%6*.11)+'s');blood.append(drip)});
 const order=Array.from({length:18},(_,i)=>i);for(let i=17;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 order.forEach((idx,n)=>schedule(()=>{if(!running)return;thumbs[idx].src=horrorSprite;thumbs[idx].style.filter='drop-shadow(0 0 4px #9d0b23)'},350+n*175+(n>14?(n-14)*100:0)));
 const finish=350+17*175+3*100;
 schedule(()=>{if(!running)return;const idx=order[Math.floor(Math.random()*18)];const source=thumbs[idx];const r=source.getBoundingClientRect();
 zoom.hidden=false;zoom.classList.remove('go');const z=zoom.querySelector('.zoom-image');z.src=horrorSprite;z.style.left=r.left+'px';z.style.top=r.top+'px';z.style.width=r.width+'px';z.style.height=r.height+'px';z.style.setProperty('--dx',(innerWidth/2-r.left-r.width/2)+'px');z.style.setProperty('--dy',(innerHeight/2-r.top-r.height/2)+'px');zoom.querySelector('.zoom-face').src=horrorFace;
 requestAnimationFrame(()=>requestAnimationFrame(()=>zoom.classList.add('go')));
 },finish+400);
 schedule(()=>{if(running)openError()},finish+3550);
 return true;
}
let horrorTestSnapshot=null;
window.kichiHorrorTest={
 isBusy(){return running&&!window.__kichiHorrorPreview},
 play(){
  // Never cancel a genuine horror sequence just to start a test.
  if(running&&!window.__kichiHorrorPreview)return false;
  // Keep the original hidden-sequence progress intact across a preview.
  horrorTestSnapshot={
   hintProgress,phantomProgress,progress,stageTwoArmed,
   overflow:document.body.style.overflow,
   oldOverflow
  };
  window.__kichiHorrorPreview=true;
  try{
   if(!begin()){
    this.stop();
    return false;
   }
   return true;
  }catch(e){
   console.error('Horror preview start:',e);
   this.stop();
   return false;
  }
 },
 stop(){
  // closeAll must always see preview=true: otherwise it stops the live SEG.
  window.__kichiHorrorPreview=true;
  try{
   closeAll();
  }finally{
   if(horrorTestSnapshot){
    hintProgress=horrorTestSnapshot.hintProgress;
    phantomProgress=horrorTestSnapshot.phantomProgress;
    progress=horrorTestSnapshot.progress;
    stageTwoArmed=horrorTestSnapshot.stageTwoArmed;
    oldOverflow=horrorTestSnapshot.oldOverflow;
    document.body.style.overflow=horrorTestSnapshot.overflow;
   }
   horrorTestSnapshot=null;
   window.__kichiHorrorPreview=false;
  }
 }
};
window.melSecretTap=(i)=>{if((window.kichiMel?.getCollected().length||0)!==18)return;if(running||!error.hidden||!secret.hidden)return;
  // First-stage anomaly requires exactly 0 -> 8; pressing 0 alone is silent.
  // Full horror requires the exact uninterrupted 0 -> 8 -> 2 -> 6 sequence.
  const completedHint=hintProgress===1&&i===8;
  const completedStageTwo=stageTwoArmed&&i===2;
  stageTwoArmed=false;
  hintProgress=i===hintSeq[hintProgress]?hintProgress+1:(i===0?1:0);
  phantomProgress=i===phantomSeq[phantomProgress]?phantomProgress+1:(i===phantomSeq[0]?1:0);
  progress=i===seq[progress]?progress+1:(i===seq[0]?1:0);
  // A completed secret sequence must take precedence over resetting clues.
  // In particular, the final 6 of 0→8→2→6 must not call kichiSeg.stop().
  if(progress===seq.length){progress=0;hintProgress=0;phantomProgress=0;stageTwoArmed=false;window.kichiSeg?.horror(3);begin();return;}
  if(phantomProgress===phantomSeq.length){phantomProgress=0;window.dispatchEvent(new Event('kichi-phantom-command'));return;}
  if(completedHint){
    hintProgress=0;
    stageTwoArmed=true;
    clearHints();
    // 0 -> 8 is stage ONE only: SIGNAL 01 and SEG 4--.
    document.body.classList.add('mel-hint-1');
    window.kichiSeg?.horror(1);
  }else if(completedStageTwo){
    // Stage TWO requires the uninterrupted 0 -> 8 -> 2 prefix.
    clearHints();
    document.body.classList.add('mel-hint-2');
    window.kichiSeg?.horror(2);
  }else{
    // Any tap that does not advance a visible horror stage clears its anomaly,
    // including 0 -> 8 -> 2 -> 8 (the last 8 starts a NEW sequence).
    // The command progress trackers above still preserve valid new prefixes.
    clearHints();
    window.kichiSeg?.stop();
  }
};
document.getElementById('melErrorLogo').addEventListener('click',()=>{error.hidden=true;secret.hidden=false;secret.classList.add('pop-reveal');if(!window.__kichiHorrorPreview){try{localStorage.setItem('kichiguy_horror_completed_v37','1')}catch(e){};window.dispatchEvent(new Event('kichi-horror-unlocked'));}const conf=document.createElement('div');conf.className='pop-confetti';for(let i=0;i<28;i++){const e=document.createElement('span');e.textContent=['♥','✦','★','◆'][i%4];e.style.setProperty('--x',((i*37)%97)+'%');e.style.setProperty('--c',['#fff39a','#fff','#a4f8ff','#ff75c4'][i%4]);e.style.setProperty('--size',(15+i%4*7)+'px');e.style.setProperty('--duration',(2+i%5*.3)+'s');e.style.setProperty('--delay',(i%7*.08)+'s');conf.append(e)}secret.append(conf);schedule(()=>conf.remove(),4400)});
for(const id of ['melErrorExit','melSecretExit'])document.getElementById(id).addEventListener('click',()=>{
 if(window.__kichiHorrorPreview){
   document.getElementById('kichiHorrorTestBack')?.click();
 }else closeAll();
});
document.addEventListener('keydown',e=>{
 if(e.key!=='Escape'||!(running||!error.hidden||!secret.hidden))return;
 if(window.__kichiHorrorPreview){
   e.preventDefault();
   document.getElementById('kichiHorrorTestBack')?.click();
 }else closeAll();
});
})();