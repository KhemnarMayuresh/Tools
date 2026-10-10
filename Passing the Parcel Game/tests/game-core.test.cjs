const test=require('node:test'),a=require('node:assert/strict'),C=require('../game-core.js');
const config={minSeconds:10,maxSeconds:30,mode:'forfeit',playStyle:'physical',passIntervalMs:1000,musicPosition:'continue',forfeits:true};
const ready=(mode='forfeit',names=['A','B','C'])=>C.createGame({...config,mode},names);
function stopped(g,id='r1',holderId=null){g=C.beginRound(g,id,g.activeIds[0]);g=C.markPlaying(g,id);return C.markStopped(g,id,{reason:'random',elapsedMs:10000,holderId});}
const confirm=(g,id='r1',player=g.activeIds[0])=>C.confirmHolder(stopped(g,id),id,player,'Tell a joke.');
test('rejects invalid settings and duplicate normalized names',()=>{
 for(const patch of [{minSeconds:NaN},{maxSeconds:Infinity},{minSeconds:4},{maxSeconds:121},{minSeconds:10.5},{minSeconds:31},{passIntervalMs:499},{passIntervalMs:3001},{mode:'other'},{playStyle:'real'},{musicPosition:'bad'},{forfeits:1}])a.equal(C.validateConfig({...config,...patch}).valid,false);
 a.equal(C.validateConfig({...config,minSeconds:5,maxSeconds:5}).valid,true);a.equal(C.validateConfig({...config,minSeconds:120,maxSeconds:120}).valid,true);
 for(const names of [['A'],Array(21).fill('A'),[' É ','e\u0301'],[' ','B'],['😀'.repeat(41),'B']])a.equal(C.validateRoster(names).valid,false);
 a.deepEqual(C.validateRoster([' A ','भारत']).names,['A','भारत']);a.equal(C.validateRoster(['😀'.repeat(40),'B']).valid,true);
});
test('confirm records one catch per round with stable IDs and immutable snapshots',()=>{
 const initial=ready(),before=JSON.stringify(initial),s=stopped(initial);a.equal(C.beginRound(s,'r2','player-1'),s);a.equal(C.confirmHolder(s,'old','player-1',null),s);a.equal(C.confirmHolder(s,'r1','missing',null),s);
 const g=C.confirmHolder(s,'r1','player-1','Tell a joke.');a.equal(g.phase,'resolved');a.equal(C.confirmHolder(g,'r1','player-2',null),g);a.equal(C.getStats(g)[0].catches,1);a.equal(g.history[0].holderName,'A');a.equal(JSON.stringify(initial),before);a.deepEqual(g.activeIds,initial.activeIds);a.equal(C.beginRound(g,'r1','player-1'),g);
});
test('elimination skips removed IDs and finishes with one survivor',()=>{
 let g=confirm(ready('elimination'));a.deepEqual(g.activeIds,['player-2','player-3']);a.equal(g.winnerId,null);const s=stopped(g,'r2');a.equal(C.confirmHolder(s,'r2','player-1',null),s);g=C.confirmHolder(s,'r2','player-2',null);a.equal(g.phase,'finished');a.equal(g.winnerId,'player-3');a.equal(C.beginRound(g,'r3','player-3'),g);a.equal(g.history[0].forfeit,null);
 const two=confirm(ready('elimination',['A','B']));a.equal(two.winnerId,'player-2');a.equal(two.history.length,1);
});
test('cancel preserves roster/history; stale, paused and starting events are guarded',()=>{
 const g=confirm(ready()),s=C.beginRound(g,'r2','player-2');a.equal(C.markStopped(s,'r2',{reason:'manual',elapsedMs:0,holderId:null}),s);a.equal(C.markPlaying(s,'r1'),s);const p=C.markPaused(C.markPlaying(s,'r2'),'r2',true);a.equal(p.phase,'paused');a.equal(C.markPaused(p,'r2',false).phase,'playing');const n=C.cancelRound(p,'r2');a.equal(n.phase,'ready');a.deepEqual(n.history,g.history);a.deepEqual(n.activeIds,g.activeIds);a.equal(C.cancelRound(n,'r2'),n);
});
test('early finish never invents a champion; forfeit catches are not wins',()=>{
 const initial=ready();a.equal(C.finishGame(initial),initial);const g=C.finishGame(confirm(initial));a.equal(g.phase,'finished');a.equal(g.winnerId,null);a.equal(g.endedEarly,false);
 const e=C.finishGame(confirm(ready('elimination')));a.equal(e.endedEarly,true);a.equal(e.winnerId,null);a.equal(e.activeIds.length,2);a.equal(C.FORFEITS.length,15);
});
module.exports={config};
