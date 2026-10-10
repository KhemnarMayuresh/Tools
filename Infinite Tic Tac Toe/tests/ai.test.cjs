const test=require('node:test'),a=require('node:assert/strict');
const C=require('../game-core.js'),AI=require('../ai.js');
const config={size:3,winLength:3,moveLimit:200,mode:'computer',difficulty:3};
function fixture(xs=[],os=[],size=3){const r=C.createRound('ai',{...config,size},'O');for(const [mark,cells] of [['X',xs],['O',os]]){r.queues[mark]=cells.map(([row,col])=>({row,col}));for(const c of r.queues[mark])r.board[c.row][c.col]=mark;}return r;}
test('levels win, block and account for rolling eviction',()=>{
 a.deepEqual(AI.chooseMove(fixture([[1,0]],[[0,0],[0,1]]),{level:1}).move,{row:0,col:2});
 a.deepEqual(AI.chooseMove(fixture([[0,0],[0,1]],[[1,0]]),{level:2}).move,{row:0,col:2});
 const r=fixture([[0,0],[0,1],[2,2]],[[1,0],[2,0],[1,2]]),before=JSON.stringify(r);
 const result=AI.chooseMove(r,{level:2,random:()=>0.99});a.deepEqual(result.move,AI.chooseMove(r,{level:0,random:()=>0.99}).move);a.equal(JSON.stringify(r),before);
 a.equal(C.previewPlacement(r,'O',{row:1,col:1}).winningCells.length,0);
});
test('random is reproducible, center on even boards and terminal returns null',()=>{
 const r=fixture();a.deepEqual(AI.chooseMove(r,{level:0,random:()=>0.6}),AI.chooseMove(r,{level:0,random:()=>0.6}));
 const center=AI.chooseMove(fixture([],[],4),{level:3}).move;a.ok([1,2].includes(center.row)&&[1,2].includes(center.col));
 for(const phase of ['paused','won','draw'])a.equal(AI.chooseMove({...r,phase},{level:5}).move,null);
});
test('search is bounded on large grids, preserves input and always returns legal fallback',()=>{
 for(const size of [3,4,10])for(const level of [0,1,2,3,4,5]){const r=fixture([[0,0]],[],size),before=JSON.stringify(r);let clock=0;
 const result=AI.chooseMove(r,{level,maxNodes:10,maxMs:5,now:()=>clock++});a.ok(result.nodes<=10);a.ok(C.getLegalMoves(r).some(c=>c.row===result.move.row&&c.col===result.move.col));a.equal(JSON.stringify(r),before);}
});

test('advanced levels execute distinct depths; node exhaustion keeps a legal decision',()=>{
 const r=fixture();for(const [level,depth]of [[4,2],[5,4]]){const result=AI.chooseMove(r,{level,now:()=>0});a.equal(result.depth,depth);a.ok(result.nodes>0);a.equal(result.stopped,false);}
 const result=AI.chooseMove(r,{level:5,now:()=>0,maxNodes:7});a.equal(result.nodes,7);a.equal(result.stopped,true);a.ok(result.move);
});

test('exhausted search preserves a known block after completing only depth one',()=>{
 let r=C.createRound('block',{...config,size:10,winLength:3,difficulty:5},'X');
 for(const [row,col]of [[0,0],[9,9],[0,1]])r=C.playMove(r,{row,col});
 const before=JSON.stringify(r),expected={row:0,col:2};
 for(const options of [{level:5,maxNodes:12,now:()=>0},{level:4,maxNodes:12,now:()=>0},{level:5,maxDepth:2,maxMs:25,now:(()=>{let clock=0;return()=>clock+=0.15;})()}]){
 const result=AI.chooseMove(r,options);a.deepEqual(result.move,expected);a.equal(JSON.stringify(r),before);
 }
});
