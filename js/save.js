
(()=>{'use strict';
const exportBtn=document.getElementById('saveExport'),importBtn=document.getElementById('saveImport'),fileInput=document.getElementById('saveFile'),message=document.getElementById('saveMessage');
if(!exportBtn||!importBtn||!fileInput)return;
const KEY=/^(kichiguy[_-]|kichi[_-])/;
const MAX=1024*1024;
function say(msg){message.textContent=msg}
function collect(){const data=Object.create(null);for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&KEY.test(k)){const v=localStorage.getItem(k);if(v!==null)data[k]=v}}return data}
exportBtn.addEventListener('click',()=>{try{
const payload={format:'KiCHiGUY_SAVE',version:1,exportedAt:new Date().toISOString(),origin:location.origin,data:collect()};
const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='KiCHiGUY_SAVE_'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);say('バックアップファイルを作成しました。ファイルアプリなどに保管してください。');
}catch(e){say('書き出しに失敗しました。ブラウザの保存設定をご確認ください。')}});
const resetBtn=document.getElementById('saveReset');
const SEG_KEYS=/^kichiguy_seg_/;
if(resetBtn)resetBtn.addEventListener('click',()=>{
 if(!confirm('本当にリセットしますか？\n\nSEG MISSIONの達成状況・累計回転数・大当たり回数・抽選履歴を初期化します。\nこの操作は取り消せません。'))return;
 const saved=collect();
 try{for(const key of Object.keys(saved))if(SEG_KEYS.test(key))localStorage.removeItem(key);say('SEG MISSIONを初期化しました。画面を更新します。');location.reload()}
 catch(e){try{for(const [key,value] of Object.entries(saved))if(SEG_KEYS.test(key))localStorage.setItem(key,value)}catch(_){}say('リセットに失敗しました。')}
});
const siteReset=document.getElementById('siteFullReset');
if(siteReset)siteReset.addEventListener('click',()=>{
 if(!confirm('すべてのセーブデータを削除しますか？\n\nサイト内に保存されたすべての記録・進行状況を初期化します。\nこの操作は取り消せません。'))return;
 if(!confirm('【最終確認】\n本当にすべてのセーブデータを初期化しますか？\n\nこの操作は取り消せません。'))return;
 const saved=collect();
 try{for(const key of Object.keys(saved))localStorage.removeItem(key);location.reload()}
 catch(e){try{for(const [key,value] of Object.entries(saved))localStorage.setItem(key,value)}catch(_){}document.getElementById('siteResetMessage').textContent='初期化に失敗しました。'}
});
importBtn.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',async()=>{const file=fileInput.files&&fileInput.files[0];fileInput.value='';if(!file)return;
if(file.size>MAX){say('ファイルが大きすぎます。正しいセーブデータを選んでください。');return}
try{const payload=JSON.parse(await file.text());if(!payload||payload.format!=='KiCHiGUY_SAVE'||payload.version!==1||!payload.data||typeof payload.data!=='object'||Array.isArray(payload.data))throw Error('format');
const entries=Object.entries(payload.data);if(entries.length>150||entries.some(([k,v])=>!KEY.test(k)||typeof v!=='string'||k.length>120||v.length>MAX))throw Error('data');
if(!confirm('セーブデータを読み込みます。\n現在の記録・進行状況が上書きされます。\n続けますか？'))return;
const previous=collect();try{for(const k of Object.keys(previous))localStorage.removeItem(k);for(const [k,v]of entries)localStorage.setItem(k,v)}catch(e){for(const k of Object.keys(collect()))localStorage.removeItem(k);for(const [k,v]of Object.entries(previous))localStorage.setItem(k,v);throw e}
say('読み込み完了。画面を更新します。');location.reload();
}catch(e){say('読み込みに失敗しました。KiCHiGUYのセーブデータ（JSON）か確認してください。')}});
})();
