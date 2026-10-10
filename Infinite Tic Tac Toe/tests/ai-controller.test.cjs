const test=require('node:test'),a=require('node:assert/strict');
const {createAIController}=require('../ai-controller.js');
const Core=require('../game-core.js');
function harness(workerMode='ok'){
 let next=0;const jobs=new Map(),workers=[],moves=[],statuses=[];
 const controller=createAIController({schedule:(fn,ms)=>{jobs.set(++next,{fn,ms});return next;},cancel:id=>jobs.delete(id),now:()=>0,
 createWorker:()=>{if(workerMode==='unavailable')throw Error('blocked');const w={postMessage:data=>w.data=data,terminate:()=>w.terminated=true};workers.push(w);return w;},
 onMove:(...args)=>moves.push(args),onStatus:s=>statuses.push(s)});
 const round=Core.createRound('r1',{size:3,winLength:3,moveLimit:200,mode:'computer',difficulty:3},'O');
 const run=()=>{const [id,job]=jobs.entries().next().value;jobs.delete(id);job.fn();};
 return {controller,jobs,workers,moves,statuses,round,run};
}
test('cancelled delay cannot emit; replacement and duplicate responses are guarded',()=>{
 const h=harness();h.controller.request(h.round,1);const stale=[...h.jobs.values()][0].fn;h.controller.cancel();stale();a.equal(h.workers.length,0);a.equal(h.moves.length,0);
 h.controller.request(h.round,2);h.run();const old=h.workers[0],late=old.onmessage;h.controller.request({...h.round,id:'r2'},3);a.equal(old.terminated,true);late({data:{requestId:2,roundId:'r1',move:{row:0,col:0}}});a.equal(h.moves.length,0);
 h.run();const w=h.workers[1],reply=w.onmessage;reply({data:{requestId:3,roundId:'r2',move:{row:1,col:1}}});reply({data:{requestId:3,roundId:'r2',move:{row:1,col:1}}});a.equal(h.moves.length,1);a.equal(h.jobs.size,0);a.equal(w.terminated,true);
});
test('worker unavailable/error/watchdog returns one legal fallback',()=>{
 for(const mode of ['unavailable','error','timeout','badmove']){const h=harness(mode);h.controller.request(h.round,1);h.run();
 if(mode==='error')h.workers[0].onerror({preventDefault(){}});if(mode==='timeout')h.run();if(mode==='badmove')h.workers[0].onmessage({data:{requestId:1,roundId:'r1',move:{row:90,col:90}}});
 a.equal(h.moves.length,1);a.ok(Core.getLegalMoves(h.round).some(c=>JSON.stringify(c)===JSON.stringify(h.moves[0][2])));a.match(h.statuses.join(' '),/fallback/i);a.equal(h.jobs.size,0);}
});
test('paused request does not schedule; cancel/resume creates only one action',()=>{
 const h=harness();h.controller.request({...h.round,phase:'paused'},1);a.equal(h.jobs.size,0);h.controller.request(h.round,2);h.run();const stale=h.workers[0].onmessage;h.controller.cancel();h.controller.request(h.round,3);h.run();stale({data:{requestId:2,roundId:'r1',move:{row:0,col:0}}});h.workers[1].onmessage({data:{requestId:3,roundId:'r1',move:{row:0,col:0}}});a.equal(h.moves.length,1);
});

test('long-round worker snapshots omit undo history while preserving draw state',()=>{
 const h=harness();let r=Core.createRound('long',{size:10,winLength:10,moveLimit:1000,mode:'computer',difficulty:5},'X'),seed=7;
 for(let i=0;i<81;i++){seed=(seed*1664525+1013904223)>>>0;const legal=Core.getLegalMoves(r);r=Core.playMove(r,legal[seed%legal.length]);}
 a.equal(r.turn,'O');const before=JSON.stringify(r);h.controller.request(r,1);h.run();const snapshot=h.workers[0].data.round;
 a.equal(snapshot.history.length,0);a.deepEqual(snapshot.board,r.board);a.deepEqual(snapshot.queues,r.queues);a.deepEqual(snapshot.positionKeys,r.positionKeys);a.equal(JSON.stringify(r),before);
 a.ok(JSON.stringify(snapshot).length<200000);h.controller.cancel();
});

test('obsolete delay cannot disown the replacement timer',()=>{
 const h=harness();h.controller.request(h.round,1);const old=[...h.jobs.values()][0].fn;h.controller.request(h.round,2);old();h.controller.cancel();a.equal(h.jobs.size,0);a.equal(h.moves.length,0);
});
