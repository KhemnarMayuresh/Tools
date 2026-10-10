const test=require('node:test'),a=require('node:assert/strict');
const C=require('../game-core.js'),M=require('../match-core.js');
const config={size:3,winLength:3,moveLimit:200,mode:'local',difficulty:3};
const fresh=(mode='local',starter='X')=>C.createRound('r1',{...config,mode},starter);
const move=(r,row,col)=>C.playMove(r,{row,col});
const players=[{mark:'X',name:' Player X '},{mark:'O',name:'Player O'}];
test('pause blocks placement, resumes same turn, terminal stays terminal',()=>{
 const r=move(fresh(),0,0),p=C.setPaused(r,true);a.equal(p.phase,'paused');a.equal(move(p,1,1),p);a.equal(C.setPaused(p,false).turn,'O');
 a.equal(C.setPaused({...r,phase:'won'},false).phase,'won');
});
test('local undo restores evicted mark, queue, count and retained repetition history',()=>{
 let r=fresh();for(const [row,col] of [[0,0],[1,0],[0,1],[1,1],[2,2],[2,0],[0,2]])r=move(r,row,col);
 const last=r.history.at(-1).before;a.equal(r.board[0][0],null);const u=C.undo(C.setPaused(r,true));a.equal(u.phase,'paused');
 for(const key of ['board','queues','moveCount','positionKeys','turn'])a.deepEqual(u[key],last[key]);a.equal(u.history.length,6);a.equal(r.history.length,7);
 a.equal(C.undo({...r,phase:'won'}).phase,'won');
});
test('computer undo removes latest X and response, preserves opening O and pause',()=>{
 const open=move(fresh('computer','O'),1,1);a.equal(C.undo(open),open);
 const pending=move(open,0,0);a.deepEqual(C.undo(pending).board,open.board);
 const replied=move(pending,0,2);const u=C.undo(C.setPaused(replied,true));a.deepEqual(u.board,open.board);a.equal(u.phase,'paused');a.equal(u.turn,'X');
});
test('completed results deduplicate round IDs, alternate starters and snapshot outcomes',()=>{
 let m=M.createMatch(config,players),r=fresh();a.equal(m.players[0].name,'Player X');a.equal(M.recordOutcome(m,r),m);
 for(const [row,col] of [[0,0],[1,0],[0,1],[1,1],[0,2]])r=move(r,row,col);
 m=M.recordOutcome(m,r);a.equal(M.recordOutcome(m,r),m);a.deepEqual(M.getScores(m),{XWins:1,OWins:0,draws:0,completedRounds:1});a.deepEqual(M.nextRoundInfo(m),{roundNumber:2,starter:'O'});
 const draw={...fresh(),id:'r2',phase:'draw',drawReason:'move-limit'};m=M.recordOutcome(m,draw);draw.board[0][0]='O';a.equal(m.outcomes[1].board[0][0],null);a.equal(M.getScores(m).draws,1);a.equal(M.nextRoundInfo(m).starter,'X');
 a.equal(M.getScores(M.createMatch(config,players)).completedRounds,0);
});
