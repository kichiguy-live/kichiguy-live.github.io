
(()=>{
'use strict';
const el=document.getElementById('secretSeg'),svg=el.querySelector('svg'),open=document.getElementById('secretSegOpen');
const rollBtn=el.querySelector('.seg-roll'),closeBtn=el.querySelector('.seg-close');
el.dataset.build='7.9';window.KICHI_SEG_BUILD='7.9';
const RESULT_STORE='kichiguy_seg_result_v34',VIS_STORE='kichiguy_seg_visible_v34',STATS='kichiguy_seg_stats_v1',MISSIONS='kichiguy_seg_missions_v1';
const winners=['114','364','514','810','893','931'];
const bits={'0':[0,1,2,3,4,5],'1':[1,2],'2':[0,1,6,4,3],'3':[0,1,6,2,3],'4':[5,6,1,2],'5':[0,5,6,2,3],'6':[0,5,6,2,3,4],'7':[0,1,2],'8':[0,1,2,3,4,5,6],'9':[0,1,2,3,5,6],'-':[6]};
const shapes=['4,1 17,1 14,4 7,4','19,3 22,6 22,12 19,14 17,12 17,6','19,16 22,18 22,24 19,27 17,24 17,18','4,26 17,26 14,29 7,29','2,16 5,18 5,24 2,27 0,24 0,18','2,3 5,6 5,12 2,14 0,12 0,6','4,13 17,13 14,16 7,16'];
const defs=[
['normal','はじめの一歩','通常回転を発生させる'],['white','白き閃光','白発光を発生させる'],['red','赤き警告','赤発光を発生させる'],['gold','黄金の輝き','金発光を発生させる'],['rainbow','七色の奇跡','レインボー発光を発生させる'],['long','長き鼓動','ロング変動を発生させる'],['tenpai','運命の一拍','テンパイ待機を発生させる'],['instant','最後の一撃','非テンパイから一撃でゾロ目を揃える'],['irregular','変則の美学','変則停止を発生させる'],['middle','真ん中の審判','中リール最後停止を発生させる'],['flash','揺れる期待','テンパイ数字点滅を発生させる'],['silent','静寂の予兆','無発光スタートを発生させる'],['blackout','闇の一瞬','全消灯フリーズを発生させる'],['dash','原点回帰','---停止からゾロ目を揃える'],['word','大当たり宣言','「あたり」表示を発生させる'],['count3','運命の刻・参','カウントダウンで -3- を表示'],['count2','運命の刻・弐','カウントダウンで -2- を表示'],['count1','運命の刻・壱','カウントダウンで -1- を表示'],['huge','視界ジャック','巨大化プレミアを発生させる'],['tiny','消えたセグ','極小化プレミアを発生させる'],['seven','七の約束','7テンパイを発生させる'],
...[100,500,1000,5000,10000].map(n=>['spin'+n,'回転の軌跡 '+n,'累計'+n.toLocaleString()+'G到達']),...[1,10,50,100,500].map(n=>['win'+n,'勝利の記録 '+n,'累計大当たり'+n+'回到達']),
...[0,1,2,3,4,5,6,7,8,9].map(n=>['triple'+n,'数字の支配者 '+n,n+'のゾロ目を揃える']),['alltriples','十の奇跡','0〜9のゾロ目をすべて揃える'],['count0','運命の刻・零','-0- を表示する'],['reverse','逆行する運命','カウントダウンが逆行する'],['skip','刻を飛び越えて','カウントダウンが数字を飛ばす'],['mega','超クソ巨大化','ミッション画面で超巨大化を発生させる'],...['fire','ice','lightning','wind'].map((e,i)=>['element'+e,['灼熱の炎','氷結の刻','雷鳴の衝撃','疾風の予兆'][i],['炎','氷','雷','風'][i]+'の演出を発生させる']),['elementcombo','元素の共鳴','2種類以上の元素が共鳴する'],['invisible','姿なき数字','回転中に数字が消失する'],...Array.from({length:18},(_,i)=>['mel'+i,'ドットメル '+String(i+1).padStart(2,'0'),'ドットメル「'+(window.kichiMel?.names[i]||String(i+1))+'」を獲得']),['melall','メルのすべて','ドットメル18体をコンプリートする'],['ceiling200','訳の解らぬ天井','200Gハマリの天井演出をみる'],['onegame','1G連','ゾロ目当選の次の1Gでもゾロ目を揃える'],['superonegame','超1G連','奇数ゾロ目当選の次の1Gで奇数ゾロ目を揃える'],['extremeonegame','極1G連','777当選の次の1Gで777を揃える'],['inmuone','やりますねぇ','赤セグで隠された数字を発見する'],['inmuall','🫱👩🫲お前やりますねぇスギ','赤セグで隠された6種類の数字をすべて発見する']];
function load(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
let stats=load(STATS,{spins:0,wins:0}),done=load(MISSIONS,{}),result=load(RESULT_STORE,{value:'---',source:'normal',at:0});
const CEILING_PENDING_KEY='kichiguy_seg_ceiling_pending_v1';
const INMU_FOUND_KEY='kichiguy_red_inmu_found_v83';
let inmuFound=load(INMU_FOUND_KEY,[]);if(!Array.isArray(inmuFound))inmuFound=[];
function recordRedInmu(v){if(!winners.includes(v)||inmuFound.includes(v))return;inmuFound.push(v);save(INMU_FOUND_KEY,inmuFound);mission('inmuone');if(winners.every(n=>inmuFound.includes(n)))mission('inmuall');}
const STREAK_KEY='kichiguy_seg_streak_v1';let streakState=load(STREAK_KEY,{misses:0,lastHitSpin:-1,lastHitDigit:''});if(!streakState||typeof streakState!=='object')streakState={misses:0,lastHitSpin:-1,lastHitDigit:''};function saveStreak(){save(STREAK_KEY,streakState)} function syncMelMissions(){const owned=window.kichiMel?.getCollected()||[];let changed=false;for(let i=0;i<18;i++){if(owned.includes(i)&&!done['mel'+i]){done['mel'+i]=true;changed=true}}if(owned.length===18&&!done.melall){done.melall=true;changed=true}if(changed)try{localStorage.setItem(MISSIONS,JSON.stringify(done))}catch(e){}}syncMelMissions();
if(!result||!/^([0-9]{3}|---)$/.test(result.value))result={value:'---',source:'normal',at:0};
if(!result.at||Date.now()-result.at>=3600000)result={value:'---',source:'normal',at:0};
let token=0,rolling=false,blinkTimer=null,blinkEnd=null,toastTimer=null,display='---';
const word=document.createElement('div');word.className='seg-word';word.textContent='あたり';el.querySelector('.seg-face').append(word);
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function renderMission(){const summary=document.getElementById('missionSummary'),grid=document.getElementById('missionGrid');if(!summary||!grid)return;const n=defs.filter(d=>done[d[0]]).length;summary.innerHTML='<div class="mission-progress-top"><span>MISSION PROGRESS</span><strong>'+n+' <em>/ '+defs.length+'</em></strong></div><div class="mission-progress-track"><div class="mission-progress-fill" style="width:'+(defs.length?100*n/defs.length:0)+'%"></div></div><div class="mission-stats"><div class="mission-stat"><span>累計大当たり</span><strong>'+stats.wins.toLocaleString()+' <small>回</small></strong></div><div class="mission-stat"><span>総ゲーム数</span><strong>'+stats.spins.toLocaleString()+' <small>G</small></strong></div><div class="mission-stat"><span>現在のゲーム数</span><strong>'+streakState.misses.toLocaleString()+' <small>G</small></strong></div></div>';grid.innerHTML=defs.map((d,i)=>'<div class="mission-card '+(done[d[0]]?'cleared':'locked')+'"><div class="mission-no">NO.<strong>'+String(i+1).padStart(3,'0')+'</strong></div><div class="mission-info"><strong>'+(done[d[0]]?d[1]:'？？？')+'</strong><small>'+(done[d[0]]?d[2]:'？？？')+'</small></div><div class="mission-mark">'+(done[d[0]]?'CLEAR':'<span aria-label="未解放">🔒</span>')+'</div></div>').join('');}
let pendingMissionPopups=[];let missionPopupsLocked=false;
function getMissionPopupStack(){let stack=document.getElementById('kichi-mission-popup-stack');if(!stack){stack=document.createElement('div');stack.id='kichi-mission-popup-stack';document.body.append(stack)}return stack;}
function showMissionPopup(id){const def=defs.find(d=>d[0]===id);if(!def)return;const toast=document.createElement('div');toast.className='mission-toast';toast.textContent='MISSION CLEAR！　'+def[1];getMissionPopupStack().append(toast);setTimeout(()=>toast.remove(),3500);}
function flushMissionPopups(){const items=[...new Set(pendingMissionPopups.splice(0))];if(!items.length)return;setTimeout(()=>{items.forEach(showMissionPopup)},220);}
function mission(id){if(done[id])return;done[id]=true;save(MISSIONS,done);window.dispatchEvent(new CustomEvent('kichi-seg-mission-complete',{detail:{id}}));renderMission();if(missionPopupsLocked||rolling)pendingMissionPopups.push(id);else showMissionPopup(id);}
function notify(state,won=false){window.dispatchEvent(new CustomEvent('kichi-seg-state',{detail:{state,won}}));}
const melOverlay=document.createElement('div');melOverlay.className='seg-mel-reel';el.querySelector('.seg-face').append(melOverlay);let invisibleStops=[false,false,false],melStops=[false,false,false];function paintMel(n,stops){const sprites=window.kichiMel?.sprites||[];melStops=[...stops];melOverlay.innerHTML=[0,1,2].map(i=>stops[i]&&sprites[n]?'<img src="'+sprites[n]+'" alt="ドットメル">':'<span></span>').join('');}function clearMel(){melStops=[false,false,false];melOverlay.replaceChildren();}function paint(value){display=value;svg.setAttribute('aria-label',value);svg.innerHTML=[...value].map((d,i)=>'<g style="opacity:'+(melStops[i]||(el.classList.contains('seg-invisible')&&!invisibleStops[i])?0:1)+'" transform="translate('+(i*26)+',0)">'+shapes.map((p,j)=>'<polygon class="'+((bits[d]||[]).includes(j)?'on':'off')+'" points="'+p+'"/>').join('')+'</g>').join('');}
function triple(v){return /^[0-9]{3}$/.test(v)&&v[0]===v[1]&&v[1]===v[2]}
function clearBlink(){clearInterval(blinkTimer);clearTimeout(blinkEnd);blinkTimer=blinkEnd=null;el.classList.remove('seg-blink')}
function colors(source,fx=''){el.classList.remove('seg-blue','seg-horror','seg-white','seg-red','seg-gold','seg-rainbow','seg-blackout','seg-word-mode');if(source==='secret')el.classList.add('seg-blue');else if(fx)el.classList.add('seg-'+fx)}
function blink(value,after){if(!triple(value))return after&&after();let i=0;blinkTimer=setInterval(()=>el.classList.toggle('seg-blink',++i%2===1),500);blinkEnd=setTimeout(()=>{clearBlink();after&&after()},5000)}
function setResult(value,source,fx=''){result={value,source,at:Date.now(),fx};save(RESULT_STORE,result);colors(source,fx);paint(value);clearBlink();blink(value)}
function showVisible(v){el.hidden=!v;open.hidden=v;try{localStorage.setItem(VIS_STORE,v?'1':'0')}catch(e){}}
const originalParent=el.parentElement,missionDock=document.getElementById('missionSegDock');function syncMode(){const active=document.getElementById('mission')?.classList.contains('active');document.body.classList.toggle('kichi-mission-mode',!!active);if(active){missionDock.append(el);el.hidden=false;open.hidden=true}else{originalParent.insertBefore(el,open);showVisible(localStorage.getItem(VIS_STORE)!=='0')}}const observer=new MutationObserver(syncMode);observer.observe(document.getElementById('mission'),{attributes:true,attributeFilter:['class']});document.getElementById('missionSegLink').addEventListener('click',e=>{e.preventDefault();document.querySelector('[data-go="mission"]')?.click()});
closeBtn.addEventListener('click',()=>{if(document.body.classList.contains('kichi-mission-mode'))document.querySelector('[data-go="home"]')?.click();else showVisible(false)});open.addEventListener('click',()=>showVisible(true));showVisible(localStorage.getItem(VIS_STORE)!=='0');syncMode();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// A separate, ten-second red-SEG ceiling sequence; never relocates the SEG container.
// Render independent seven-segment bars, allowing unreadable glyphs rather than fake "888" text.
function ceilingGlyphs(){
 const normal=Object.values(bits).filter(v=>Array.isArray(v));
 const glyph=()=>{let mask=0;do{mask=Math.floor(Math.random()*128)}while(normal.some(a=>a.reduce((m,n)=>m|(1<<n),0)===mask)||mask===0);return mask};
 const masks=[glyph(),glyph(),glyph()];
 if(Math.random()<.125){const at=Math.floor(Math.random()*3);const digit=String(Math.floor(Math.random()*10));masks[at]=bits[digit].reduce((m,n)=>m|(1<<n),0)}
 svg.setAttribute('aria-label','異常点灯');
 svg.innerHTML=masks.map((mask,i)=>'<g transform="translate('+(i*26)+',0)">'+shapes.map((p,j)=>'<polygon class="'+(mask&(1<<j)?'on':'off')+'" points="'+p+'"/>').join('')+'</g>').join('');
}
async function ceilingSequence(){
 rolling=true;missionPopupsLocked=true;rollBtn.disabled=true;const t=++token;clearBlink();clearMel();colors('normal');el.dataset.phase='ceiling';el.dataset.glow='none';
 const face=el.querySelector('.seg-face');const overlay=document.createElement('div');overlay.className='kichi-ceiling-overlay';overlay.setAttribute('aria-hidden','true');face.append(overlay);
 const start=performance.now();let lastTick=-1;
 try{
  while(performance.now()-start<10000){if(t!==token)return;const elapsed=performance.now()-start;
   if(elapsed<9000){
    const tick=Math.floor(elapsed/125);
    if(tick!==lastTick){lastTick=tick;if(Math.random()<.11){svg.style.opacity='0';}else{svg.style.opacity='1';ceilingGlyphs()}}
    el.style.filter=tick%3===0?'brightness(1.9) saturate(1.5)':tick%3===1?'brightness(.6)':'hue-rotate(22deg)';
    svg.style.transform='skew('+Math.round(Math.sin(elapsed/90)*13)+'deg) scale('+(1.05+Math.abs(Math.sin(elapsed/150))*.20)+')';
   }else{overlay.textContent='';svg.style.opacity='1';svg.style.transform='';el.style.filter='';paint('---')}
   await sleep(48);
  }
 }finally{overlay.remove();svg.style.opacity='';svg.style.transform='';el.style.filter='';el.dataset.phase='idle';el.dataset.glow='none';colors('normal');paint('---');result={value:'---',source:'normal',at:Date.now()};save(RESULT_STORE,result);streakState.misses=0;streakState.lastHitSpin=-1;streakState.lastHitDigit='';saveStreak();try{localStorage.removeItem(CEILING_PENDING_KEY)}catch(e){}rolling=false;rollBtn.disabled=false;missionPopupsLocked=false;renderMission();mission('ceiling200');flushMissionPopups();notify('restore',false);}
}

async function horror(step){const t=++token;rolling=false;el.dataset.phase='horror';el.dataset.glow='none';missionPopupsLocked=false;pendingMissionPopups.length=0;rollBtn.disabled=true;clearBlink();notify('horror');colors('normal');el.classList.add('seg-horror');const v=['---','4--','40-','404'][step]||'---';if(step===0){stop();return}const pos=step-1;for(let n=0;n<8;n++){if(t!==token)return;const a=v.split('');a[pos]=String(Math.floor(Math.random()*10));paint(a.join(''));await sleep(40)}if(t===token)paint(v)}
function stop(){clearMel();el.classList.remove('seg-mega','seg-invisible','seg-element-fire','seg-element-ice','seg-element-lightning','seg-element-wind');token++;rolling=false;el.dataset.phase='idle';el.dataset.glow='none';missionPopupsLocked=false;pendingMissionPopups.length=0;rollBtn.disabled=false;el.classList.remove('seg-huge','seg-tiny','seg-blackout','seg-word-mode');colors(result.source);paint(result.value);if(result.source==='normal'&&result.fx==='word')el.classList.add('seg-word-mode');clearBlink();blink(result.value);notify('restore',result.source==='secret'&&winners.includes(result.value))}
function randomDigit(){return String(Math.floor(Math.random()*10))}
// The jackpot draw stays at 4.5%; effect frequencies are weighted by outcome.
// Bayes calibration gives approximate standalone effect reliability.
const BASE_WIN=.045;
function chanceEffect(win,winRate,target){
 const loseRate=winRate*BASE_WIN*(1-target)/(target*(1-BASE_WIN));
 return Math.random()<(win?winRate:loseRate);
}
function weightedDigit(win){
 // 7 tenpai and full blackout freeze are always wins. 3 is the strongest non-guaranteed digit.
 const weights=win?[.07,.09,.07,.22,.07,.09,.07,.13,.07,.12]:[.125,.085,.125,.065,.125,.085,.125,0,.125,.14];
 let r=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<10;i++){r-=weights[i];if(r<=0)return String(i)}return '9';
}
function pickOutcome(){
 const win=Math.random()<BASE_WIN;
 const digit=win?weightedDigit(true):null;
 let value=win?digit.repeat(3):String(Math.floor(Math.random()*1000)).padStart(3,'0');
 if(!win){while(triple(value)||[...value].filter(d=>d==='7').length>=2)value=String(Math.floor(Math.random()*1000)).padStart(3,'0')}
 return {win,value};
}
function pickMainEffect(win){
 // Exclusive main glow/premium. Standalone target: white 10%, red 35%, gold 80%.
 // Rainbow and all premiums are guaranteed; blackout freeze is jackpot-only.
 const pool=win?[['huge',.005],['tiny',.005],['rainbow',.015],['gold',.04],['word',.05],['dash',.055],['red',.17],['white',.20]]
 :[['red',.17*BASE_WIN*(1-.35)/(.35*(1-BASE_WIN))],['gold',.04*BASE_WIN*(1-.80)/(.80*(1-BASE_WIN))],['white',.20*BASE_WIN*(1-.10)/(.10*(1-BASE_WIN))]];
 let r=Math.random();for(const [name,p] of pool){r-=p;if(r<0)return name}return '';
}
async function roll(won=false,source='secret'){
 if(rolling)return false;invisibleStops=[false,false,false];clearMel();el.classList.remove('seg-mega','seg-invisible','seg-element-fire','seg-element-ice','seg-element-lightning','seg-element-wind');rolling=true;missionPopupsLocked=true;el.dataset.phase='rolling';rollBtn.disabled=true;const t=++token;clearBlink();el.classList.remove('seg-huge','seg-tiny','seg-word-mode');colors(source);notify('rolling');
 const normal=source==='normal';let value,win=false,reachedCeiling=false;const uncollected=normal?Array.from({length:18},(_,i)=>i).filter(i=>!(window.kichiMel?.getCollected()||[]).includes(i)):[];const baseOutcome=normal?pickOutcome():null;const melHit=normal&&uncollected.length>0&&!baseOutcome.win&&Math.random()<((1/30)/(1-BASE_WIN));const melIndex=melHit?uncollected[Math.floor(Math.random()*uncollected.length)]:-1;if(normal){const o=melHit?{win:true,value:String(Math.floor(Math.random()*10)).repeat(3)}:baseOutcome;value=o.value;win=o.win;stats.spins++;if(win)stats.wins++;
 // Commit the entire game's counter state at button press, not after animation.
 // Dot Mel is a win for cumulative wins but does not reset the no-triple streak.
 const realHit=baseOutcome.win&&!melHit;
 if(realHit){
   if(streakState.lastHitSpin===stats.spins-1){
     mission('onegame');
     if('13579'.includes(streakState.lastHitDigit)&&'13579'.includes(value[0]))mission('superonegame');
     if(streakState.lastHitDigit==='7'&&value==='777')mission('extremeonegame');
   }
   streakState.lastHitSpin=stats.spins;streakState.lastHitDigit=value[0];streakState.misses=0;
 }else{
   streakState.misses=(Number(streakState.misses)||0)+1;
   reachedCeiling=streakState.misses>=200;
   if(reachedCeiling)try{localStorage.setItem(CEILING_PENDING_KEY,'1')}catch(e){}
 }
 save(STATS,stats);saveStreak();renderMission();mission('normal');for(const n of [100,500,1000,5000,10000])if(stats.spins>=n)mission('spin'+n);for(const n of [1,10,50,100,500])if(stats.wins>=n)mission('win'+n)}else if(won){value=localStorage.getItem('kichiguy_phantom_discovered_v1')?.includes('phantom')&&Math.random()<.25?String(1+Math.floor(Math.random()*9)).repeat(3):winners[Math.floor(Math.random()*winners.length)];win=true}else{do{value=String(Math.floor(Math.random()*1000)).padStart(3,'0')}while(winners.includes(value))}
 let fx=normal&&!melHit?pickMainEffect(win):'';const isMission=normal&&document.body.classList.contains('kichi-mission-mode');const mega=isMission&&!melHit&&win&&Math.random()<.025;const invisible=normal&&!melHit&&win&&Math.random()<.03;let elements=[];if(normal&&!melHit){for(const e of ['fire','ice','lightning','wind'])if(Math.random()<(win?.085:.023))elements.push(e);if(!win&&elements.length>1)elements=elements.slice(0,1);
 // An elemental cue is a full chance-up: no other chance-up may accompany it on a miss.
 if(!win&&elements.length)fx='';
 if(elements.length>1){mission('elementcombo')}elements.forEach(e=>{el.classList.add('seg-element-'+e);mission('element'+e)})}if(mega){el.classList.add('seg-mega');mission('mega')}if(invisible){el.classList.add('seg-invisible');mission('invisible')}
 // White/red glow is a start-of-spin cue, not a post-stop announcement.
 if(normal&&['white','red','gold','rainbow'].includes(fx)){colors(source,fx);el.dataset.glow=fx;}else{el.dataset.glow='none';}
 if(normal&&fx==='rainbow')mission('rainbow');if(normal&&fx==='gold')mission('gold');if(normal&&fx==='white')mission('white');if(normal&&fx==='red')mission('red');
 // Two or more distinct chance-ups guarantee a jackpot. Losing draws
 // therefore select at most ONE effect, including glow, stop order and flash.
 let rare=false,middle=false,irregular=false,long=false,silent=false,blackout=false,count=false,countStart=0;
 const instant=normal&&win&&!['huge','tiny','rainbow','gold','word','dash'].includes(fx)&&Math.random()<.08;
 if(normal&&win){
   rare=chanceEffect(true,.13,.20);
   middle=chanceEffect(true,.10,.20);
   irregular=middle||chanceEffect(true,.12,.10);
   long=chanceEffect(true,.18,.15);
   silent=chanceEffect(true,.12,.15);
   blackout=chanceEffect(true,.12,.30);
   count=chanceEffect(true,.15,.20);
   countStart=count?(Math.random()<.12?2:Math.random()<.24?1:0):0;
 }else if(normal&&!fx&&!elements.length){
   // Conditional miss-side weights; no chance-up combinations on a miss.
   const choices=[['rare',.13,.20],['middle',.10,.20],['irregular',.12,.10],['long',.18,.15],['silent',.12,.15],['count',.15,.20]];
   const weights=choices.map(([,w,t])=>w*BASE_WIN*(1-t)/(t*(1-BASE_WIN)));
   let r=Math.random();
   for(let i=0;i<choices.length;i++){r-=weights[i];if(r<0){
     const kind=choices[i][0];
     if(kind==='rare')rare=true;
     if(kind==='middle'){middle=true;irregular=true}
     if(kind==='irregular')irregular=true;
     if(kind==='long')long=true;
     if(kind==='silent')silent=true;
     if(kind==='count')count=true;
     break;
   }}
   if(count)countStart=Math.random()<.12?2:Math.random()<.24?1:0;
 }
 // The flashing-tenpai effect is also a chance-up.
 // Every miss-side chance-up must actually stop on a tenpai.
 // Any normal-segment chance-up must reach a genuine two-digit tenpai,
 // even if the outcome is a miss. Preserve 7-tenpai as jackpot-only.
 const chanceUp=normal&&(!!fx||elements.length>0||rare||irregular||long||silent||blackout||count);
 if(chanceUp&&!win){
   const lead=weightedDigit(false); // 7-tenpai is jackpot-only
   const other=String((Number(lead)+1+Math.floor(Math.random()*8))%10);
   value=lead+lead+other; // Reassigned to actual first-two stop positions below.
 }
 if(normal&&long)mission('long');if(normal&&irregular)mission('irregular');if(normal&&middle)mission('middle');if(normal&&instant)mission('instant');if(normal&&silent)mission('silent');if(normal&&blackout)mission('blackout');
 if(normal&&fx==='huge'){el.classList.add('seg-huge');mission('huge')}if(normal&&fx==='tiny'){el.classList.add('seg-tiny');mission('tiny')}
 if(silent){el.classList.add('seg-blackout');await sleep(500);el.classList.remove('seg-blackout')}
 if(blackout){paint('---');el.classList.add('seg-blackout');await sleep(750);el.classList.remove('seg-blackout')}
 if(count){const start=countStart;const first=3-start;let sequence=[];if(win){if(first===1)sequence=[1,0];else if(Math.random()<.12){sequence=first===3?[3,2,1]:[2,3];mission('reverse')}else if(Math.random()<.18){sequence=first===3?(Math.random()<.5?[3,1]:[3,2,0]):[2,0];mission('skip')}else sequence=first===3?[3,2,1,0]:[2,1,0];}else{sequence=first===3?(Math.random()<.5?[3,2]:[3,2,1]):[2,1]}for(const n of sequence){if(t!==token)return false;paint('-'+n+'-');mission('count'+n);await sleep(n===0?320:450)}}
 if(t!==token)return false;
 if(fx==='dash'){paint('---');await sleep(750);mission('dash')}
 if(fx==='word'){/* Word jackpot is shown in the digit area when the result settles. */}
 const order=middle?[0,2,1]:irregular?([[2,1,0],[1,0,2],[0,2,1]][Math.floor(Math.random()*3)]):[0,1,2];
 // For a losing chance-up, the first TWO reels to stop must match,
 // regardless of whether reels stop left-first, right-first or middle-last.
 if(chanceUp&&!win){
   const lead=value[0],other=value[2];
   const digits=['','',''];
   digits[order[0]]=lead;
   digits[order[1]]=lead;
   digits[order[2]]=other;
   value=digits.join('');
 }

 let frames=long?30:14;let fixed=[false,false,false];let isSeven=normal&&win&&value==='777'&&!instant;
 // Avoid accidental 7-tenpai during losing spins or other winning values.
 for(let k=0;k<3;k++){
   const idx=order[k];const duration=k===2?(long?850:560):(long?680:360);
   for(let elapsed=0;elapsed<duration;elapsed+=65){if(t!==token)return false;let a=[0,1,2].map(i=>fixed[i]?value[i]:randomDigit());if(instant&&k===2)a=[randomDigit(),randomDigit(),randomDigit()];paint(a.join(''));if(melHit){paintMel(melIndex,fixed);paint(a.join(''));}await sleep(65)}
   if(instant&&k===2){paint(value);break}
   fixed[idx]=true;invisibleStops[idx]=true;paint([0,1,2].map(i=>fixed[i]?value[i]:'-').join(''));if(melHit)paintMel(melIndex,fixed);
   if(k===1&&normal){const a=order.slice(0,2);const tens=value[a[0]]===value[a[1]];if(tens){mission('tenpai');if(value[a[0]]==='7')mission('seven');if(rare){mission('flash');for(let z=0;z<3;z++){if(t!==token)return false;el.classList.toggle('seg-blink');await sleep(120)}el.classList.remove('seg-blink')}await sleep(650)}}
 }
 if(t!==token)return false;
 // Counters and streaks were committed on button press; never double-count at settlement.
 rolling=false;if(melHit){window.kichiMel?.unlock(melIndex);mission('mel'+melIndex);if(window.kichiMel?.getCollected().length===18)mission('melall');paintMel(melIndex,[true,true,true]);paint(value);}if(normal&&triple(value)&&!melHit){mission('triple'+value[0]);if(Array.from({length:10},(_,i)=>i).every(i=>done['triple'+i]))mission('alltriples');}el.dataset.phase='settled';el.dataset.glow='none';rollBtn.disabled=false;result={value,source,at:Date.now(),fx};save(RESULT_STORE,result);colors(source);paint(value);clearBlink();if(normal&&win&&fx==='word'){el.classList.add('seg-word-mode');mission('word');}
 if(win&&normal&&fx==='tiny')el.classList.remove('seg-tiny');
 if(triple(value)){blink(value,()=>{el.classList.remove('seg-huge','seg-tiny','seg-mega')})}else el.classList.remove('seg-huge','seg-tiny','seg-mega');el.classList.remove('seg-invisible','seg-element-fire','seg-element-ice','seg-element-lightning','seg-element-wind');paint(value);
 if(normal)recordRedInmu(value);notify('settled',source==='secret'&&winners.includes(value));if(reachedCeiling){await ceilingSequence();return true;}missionPopupsLocked=false;flushMissionPopups();return true;
}
rollBtn.addEventListener('click',()=>roll(false,'normal'));window.kichiSeg={horror,stop,roll,adminSet(all){done=all?Object.fromEntries(defs.map(d=>[d[0],true])):{};inmuFound=all?[...winners]:[];save(INMU_FOUND_KEY,inmuFound);syncMelMissions();save(MISSIONS,done);renderMission()},missionCount:()=>defs.length};colors(result.source);paint(result.value);if(result.source==='normal'&&result.fx==='word')el.classList.add('seg-word-mode');renderMission();if(triple(result.value))blink(result.value);
if(localStorage.getItem(CEILING_PENDING_KEY)==='1')ceilingSequence();
setInterval(()=>{if(!rolling&&result.at&&Date.now()-result.at>=3600000){result={value:'---',source:'normal',at:0};save(RESULT_STORE,result);colors('normal');clearBlink();paint('---')}},30000);
})();
