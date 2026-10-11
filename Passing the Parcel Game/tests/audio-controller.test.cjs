const test=require('node:test'),a=require('node:assert/strict'),{createAudioController}=require('../audio-controller.js');
const deferred=()=>{let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j;});return {promise,resolve,reject};};
function harness({denied=false,bad=false,playDeferred=null,resumeDeferred=null}={}){
 const jobs=new Map(),medias=[],revoked=[],status=[],failures=[],nodes=[];let serial=0;
 const context={state:'running',currentTime:0,destination:{},resume:()=>resumeDeferred?resumeDeferred.promise:Promise.resolve(),close:()=>Promise.resolve(),createGain:()=>({gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}),createOscillator:()=>{const node={frequency:{setValueAtTime(){}},connect(){},disconnect(){},start(){nodes.push(node);},stop(){node.stopped=true;}};return node;}};
 const audio=createAudioController({schedule:(fn,ms)=>{jobs.set(++serial,{fn,ms});return serial;},cancel:id=>jobs.delete(id),createContext:()=>{if(denied)throw Error('denied');return context;},createMedia:()=>{
 const events=new Map(),m={readyState:0,currentTime:0,duration:20,volume:1,src:'',loop:false,paused:true,addEventListener(k,fn){if(!events.has(k))events.set(k,new Set());events.get(k).add(fn);},removeEventListener(k,fn){events.get(k)?.delete(fn);},emit(k){for(const fn of [...(events.get(k)||[])])fn();},load(){queueMicrotask(()=>{if(bad)m.emit('error');else{m.readyState=4;m.emit('loadeddata');}});},play(){m.paused=false;return playDeferred?playDeferred.promise:Promise.resolve();},pause(){m.paused=true;},removeAttribute(){m.src='';}};medias.push(m);return m;},createURL:()=>`blob:${++serial}`,revokeURL:url=>revoked.push(url),onStatus:s=>status.push(s),onFailure:f=>failures.push(f)});
 return {audio,jobs,medias,revoked,status,failures,nodes,context};
}
const uploaded={kind:'upload',file:{name:'music.wav',size:100,type:'audio/wav'}};
test('built-in loops require successful audio; pause/cancel own all tones and jobs',async()=>{
 const h=harness();a.equal((await h.audio.prepare({kind:'builtin',track:'party'})).ready,true);a.equal((await h.audio.play({restart:true})).started,true);a.ok(h.nodes.length);h.context.currentTime=1.2;h.audio.pause();a.ok(h.nodes.every(n=>n.stopped));a.equal(h.jobs.size,0);a.equal((await h.audio.play({restart:false})).started,true);h.audio.cancel();a.equal(h.jobs.size,0);
});
test('unsupported, rejected and timed-out context explain unavailable audio',async()=>{
 const denied=harness({denied:true});await denied.audio.prepare({kind:'builtin',track:'gentle'});a.equal((await denied.audio.play({restart:true})).started,false);a.match(denied.status.join(' '),/audio|music/i);
 const d=deferred(),h=harness({resumeDeferred:d});h.context.state='suspended';await h.audio.prepare({kind:'builtin',track:'party'});const pending=h.audio.play({restart:true});d.reject(Error('denied'));a.equal((await pending).started,false);
 const hang=deferred(),t=harness({resumeDeferred:hang});t.context.state='suspended';await t.audio.prepare({kind:'builtin',track:'party'});const timeout=t.audio.play({restart:true});[...t.jobs.values()].find(j=>j.ms===3000).fn();a.equal((await timeout).started,false);hang.resolve();
});
test('cancel before late playback prevents restarted media and leaves no timer',async()=>{
 const d=deferred(),h=harness({playDeferred:d});await h.audio.prepare(uploaded);const pending=h.audio.play({restart:false});h.audio.cancel();d.resolve();a.equal((await pending).started,false);await Promise.resolve();a.equal(h.medias[0].paused,true);a.equal(h.jobs.size,0);h.audio.dispose();a.equal(h.revoked.length,1);
});
test('upload loops, restarts/continues position and revokes replacement resources once',async()=>{
 const h=harness();await h.audio.prepare(uploaded);const m=h.medias[0];a.equal(m.loop,true);await h.audio.play({restart:true});m.currentTime=7;h.audio.pause();await h.audio.play({restart:false});a.equal(m.currentTime,7);h.audio.pause();await h.audio.play({restart:true});a.equal(m.currentTime,0);await h.audio.prepare({kind:'builtin',track:'gentle'});a.equal(h.revoked.length,1);h.audio.dispose();a.equal(h.revoked.length,1);
});
test('invalid/oversized replacements preserve previous source; stalls fail active rounds immediately',async()=>{
 const h=harness();await h.audio.prepare(uploaded);a.equal((await h.audio.prepare({...uploaded,file:{...uploaded.file,size:50*1024*1024+1}})).ready,false);a.equal(h.revoked.length,0);a.equal((await h.audio.play({restart:false})).started,true);h.medias[0].readyState=2;h.medias[0].emit('waiting');a.equal(h.failures.length,1);a.equal(h.medias[0].paused,true);
 const bad=harness({bad:true});await bad.audio.prepare({kind:'builtin',track:'party'});a.equal((await bad.audio.prepare(uploaded)).ready,false);a.equal(bad.revoked.length,1);a.equal((await bad.audio.play({restart:true})).started,true);bad.audio.cancel();
});
test('preview is owned playback, cancelled/replaced by later game playback',async()=>{
 const h=harness();await h.audio.prepare({kind:'builtin',track:'party'});a.equal((await h.audio.preview()).started,true);const n=h.nodes.length;h.audio.cancel();await h.audio.play({restart:true});a.ok(h.nodes.slice(0,n).every(o=>o.stopped));h.audio.dispose();a.equal(h.jobs.size,0);
});


test('normal buffered/seek loop transitions do not cancel music',async()=>{
 const h=harness();await h.audio.prepare(uploaded);await h.audio.play({restart:true});const m=h.medias[0];m.readyState=4;m.emit('waiting');a.equal(h.failures.length,0);m.readyState=1;m.seeking=true;m.emit('waiting');a.equal(h.failures.length,0);m.seeking=false;m.readyState=2;m.emit('waiting');a.equal(h.failures.length,1);h.audio.dispose();
});

test('interrupted built-in context cancels owned playback once',async()=>{
 for(const state of ['suspended','interrupted','closed']){
  const h=harness();await h.audio.prepare({kind:'builtin',track:'party'});await h.audio.play({restart:true});const tick=[...h.jobs.values()].find(j=>j.ms===50).fn;h.context.state=state;tick();a.equal(h.failures.length,1);a.equal(h.jobs.size,0);a.ok(h.nodes.every(n=>n.stopped));tick();a.equal(h.failures.length,1);
 }
});
