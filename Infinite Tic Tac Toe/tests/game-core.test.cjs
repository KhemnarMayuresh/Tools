const test = require('node:test');
const a = require('node:assert/strict');
const C = require('../game-core.js');
const config = (overrides={}) => ({size:3,winLength:3,moveLimit:200,mode:'local',difficulty:3,...overrides});
const fresh = (overrides={}) => C.createRound('r1',config(overrides),'X');
const move = (r,row,col) => C.playMove(r,{row,col});
const fixture = (xs,os=[],overrides={}) => {const r=fresh(overrides);r.queues={X:xs.map(([row,col])=>({row,col})),O:os.map(([row,col])=>({row,col}))};for(const m of ['X','O'])for(const c of r.queues[m])r.board[c.row][c.col]=m;return r;};
test('validate integer settings and normalized unique Unicode names',()=>{
 for(const size of [3,4,10])a.equal(C.validateConfig(config({size})).valid,true);
 for(const size of [NaN,Infinity,2,11,3.5])a.equal(C.validateConfig(config({size})).valid,false);
 for(const overrides of [{winLength:2},{winLength:4},{moveLimit:19},{moveLimit:1001},{moveLimit:20.1},{mode:'online'},{difficulty:6},{difficulty:1.5}])a.equal(C.validateConfig(config(overrides)).valid,false);
 for(const names of [['','B'],['a'.repeat(41),'B'],[' É ','e\u0301']])a.equal(C.validatePlayers(names.map((name,i)=>({mark:i?'O':'X',name}))).valid,false);
 a.equal(C.validatePlayers([{mark:'X',name:'😀'.repeat(40)},{mark:'O',name:'भारत'}]).valid,true);
});
test('legal moves are immutable; occupied oldest cannot be overwritten',()=>{
 for(const size of [3,4,10]){const r=fresh({size});a.equal(C.getLegalMoves(r).length,size*size);const before=JSON.stringify(r);for(const cell of [{row:-1,col:0},{row:0,col:size},{row:0.5,col:0}])a.equal(C.playMove(r,cell),r);a.equal(JSON.stringify(r),before);}
 const r=fixture([[0,0],[0,1],[2,2]]);a.equal(move(r,0,0),r);const before=JSON.stringify(r),n=move(r,0,2);a.equal(n.board[0][0],null);a.equal(n.phase,'playing');a.deepEqual(n.history[0].removed,{row:0,col:0});a.equal(JSON.stringify(r),before);
});
test('all winning directions, edges, middle and multiple lines',()=>{
 for(const xs of [[[0,0],[0,1]],[[0,2],[1,2]],[[0,0],[1,1]],[[0,2],[1,1]]]){const target=xs[0][1]===2?(xs[1][1]===2?[2,2]:[2,0]):xs[1][0]===0?[0,2]:[2,2];const n=move(fixture(xs),...target);a.equal(n.winner,'X');a.equal(n.winningCells.length,3);}
 a.equal(move(fixture([[2,0],[2,2]],[],{size:4}),2,1).winner,'X');
 a.equal(move(fixture([[0,0],[0,1],[0,2]],[],{size:4,winLength:4}),0,3).winner,'X');
 const n=move(fixture([[2,1],[2,3],[1,2],[3,2]],[],{size:5}),2,2);a.equal(n.winningCells.length,5);
});
test('preview obeys eviction and never mutates input for either actor',()=>{
 const r=fixture([[0,0],[0,1],[2,2]],[[1,0],[1,1],[2,0]]),before=JSON.stringify(r);
 a.equal(C.previewPlacement(r,'X',{row:0,col:2}).winningCells.length,0);
 a.equal(C.previewPlacement(r,'O',{row:1,col:2}).winningCells.length,0);a.equal(JSON.stringify(r),before);
});
test('complete position includes turn and ordered queues; threefold and limit',()=>{
 let r=fixture([[0,0],[1,1]]);const key=C.positionKey(r);r={...r,turn:'O'};a.notEqual(C.positionKey(r),key);r={...r,turn:'X',queues:{...r.queues,X:[...r.queues.X].reverse()}};a.notEqual(C.positionKey(r),key);
 r=fresh();const next=move(r,0,0),nextKey=C.positionKey(next);r.positionKeys.push(nextKey,nextKey);a.equal(move(r,0,0).drawReason,'repetition');
 r=fresh({moveLimit:20});r.moveCount=19;a.equal(move(r,0,0).drawReason,'move-limit');
 r=fixture([[0,0],[0,1]],[],{moveLimit:20});r.moveCount=19;a.equal(move(r,0,2).phase,'won');
 const occupied=move(fresh(),0,0);a.equal(move(occupied,0,0),occupied);a.equal(occupied.moveCount,1);
});
module.exports={config,fresh,move,fixture};

test('full-size and short winning lines work on every grid size',()=>{
 for(let size=3;size<=10;size++)for(const winLength of new Set([3,size])){
 const xs=Array.from({length:winLength-1},(_,col)=>[size-1,col]);a.equal(move(fixture(xs,[],{size,winLength}),size-1,winLength-1).winner,'X');
 const diagonal=Array.from({length:winLength-1},(_,i)=>[i,size-1-i]);a.equal(move(fixture(diagonal,[],{size,winLength}),winLength-1,size-winLength).winner,'X');
 }
});
test('real rolling cycles draw by repetition; undo removes abandoned cycle history',()=>{
 let r=fresh();while(r.phase==='playing'){
 const cell=C.getLegalMoves(r).find(c=>C.playMove(r,c).phase!=='won');a.ok(cell);r=C.playMove(r,cell);
 if(r.moveCount===10){const prior=r.history.at(-1).before;const undone=C.undo(r);a.deepEqual(undone.positionKeys,prior.positionKeys);a.equal(undone.moveCount,9);}
 }
 a.equal(r.phase,'draw');a.equal(r.drawReason,'repetition');a.ok(r.moveCount<200);
});
