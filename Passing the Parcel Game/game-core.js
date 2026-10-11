(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ParcelCore=api;})(globalThis,function(){
  'use strict';
  const DEFAULT_CONFIG=Object.freeze({minSeconds:10,maxSeconds:30,mode:'forfeit',playStyle:'physical',passIntervalMs:1000,musicPosition:'continue',forfeits:true});
  const FORFEITS=Object.freeze(['Name three fruits.','Tell a short joke.','Sing one line of a song.','Make a funny pose.','Name three animals.','Say the alphabet backwards from E to A.','Pretend to be a robot.','Give someone a compliment.','Make your best animal sound.','Name three things in a kitchen.','Share a happy memory.','Do a silly dance for five seconds.','Say a tongue twister.','Pretend to stir a giant pot.','Name three colours.']);
  const normalize=name=>typeof name==='string'?name.trim().normalize('NFC'):'';
  function validateConfig(c={}){
    const errors=[],integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
    if(!integer(c.minSeconds,5,120)||!integer(c.maxSeconds,5,120)||c.minSeconds>c.maxSeconds)errors.push('Use whole seconds from 5 to 120; minimum must not exceed maximum.');
    if(!integer(c.passIntervalMs,500,3000))errors.push('On-screen pass interval must be 500–3,000 milliseconds.');
    if(!['forfeit','elimination'].includes(c.mode))errors.push('Choose Forfeit or Elimination.');
    if(!['physical','screen'].includes(c.playStyle))errors.push('Choose physical party or on-screen simulation.');
    if(!['restart','continue'].includes(c.musicPosition))errors.push('Choose restart or continue music.');
    if(typeof c.forfeits!=='boolean')errors.push('Forfeit suggestions must be on or off.');
    return {valid:!errors.length,errors};
  }
  function validateRoster(input){
    const errors=[],names=Array.isArray(input)?input.map(normalize):[];
    if(names.length<2||names.length>20)errors.push('Enter 2–20 players, one name per line.');
    if(names.some(name=>!name||Array.from(name).length>40))errors.push('Each name must contain 1–40 characters.');
    if(new Set(names.map(name=>name.toLowerCase())).size!==names.length)errors.push('Use a different name for each player.');
    return {valid:!errors.length,names,errors};
  }
  function createGame(config,names){
    const checked=validateRoster(names),errors=[...validateConfig(config).errors,...checked.errors];
    if(errors.length)throw Error(errors.join(' '));
    const players=checked.names.map((name,i)=>({id:`player-${i+1}`,name}));
    return {config:{...config},players,activeIds:players.map(p=>p.id),phase:'ready',round:null,history:[],winnerId:null,endedEarly:false};
  }
  const isRound=(g,id)=>g.round&&g.round.id===id;
  function beginRound(g,id,startPlayerId){
    if(!['ready','resolved'].includes(g.phase)||g.activeIds.length<2||!g.activeIds.includes(startPlayerId)||g.history.some(o=>o.roundId===id))return g;
    return {...g,phase:'starting',round:{id,startPlayerId,holderId:null,elapsedMs:0,stopReason:null}};
  }
  function markPlaying(g,id){return isRound(g,id)&&g.phase==='starting'?{...g,phase:'playing'}:g;}
  function markPaused(g,id,paused){
    if(!isRound(g,id)||!['playing','paused'].includes(g.phase))return g;
    return {...g,phase:paused?'paused':'playing'};
  }
  function markStopped(g,id,{reason,elapsedMs,holderId}){
    if(!isRound(g,id)||!['playing','paused'].includes(g.phase)||!['random','manual'].includes(reason)||!Number.isFinite(elapsedMs)||elapsedMs<0)return g;
    if(g.config.playStyle==='screen'&&!g.activeIds.includes(holderId))return g;
    return {...g,phase:'awaiting-holder',round:{...g.round,stopReason:reason,elapsedMs,holderId:g.config.playStyle==='screen'?holderId:null}};
  }
  function confirmHolder(g,id,playerId,forfeit=null){
    if(!isRound(g,id)||g.phase!=='awaiting-holder'||!g.activeIds.includes(playerId)||g.history.some(o=>o.roundId===id))return g;
    if(g.config.playStyle==='screen'&&playerId!==g.round.holderId)return g;
    const eliminated=g.config.mode==='elimination',activeIds=eliminated?g.activeIds.filter(p=>p!==playerId):[...g.activeIds];
    const outcome={roundId:id,roundNumber:g.history.length+1,holderId:playerId,holderName:g.players.find(p=>p.id===playerId).name,
      stopReason:g.round.stopReason,elapsedMs:g.round.elapsedMs,eliminated,mode:g.config.mode,
      forfeit:!eliminated&&g.config.forfeits&&typeof forfeit==='string'?forfeit:null};
    const won=eliminated&&activeIds.length===1;
    return {...g,activeIds,phase:won?'finished':'resolved',winnerId:won?activeIds[0]:null,round:{...g.round,holderId:playerId},history:[...g.history,outcome]};
  }
  function cancelRound(g,id){
    return isRound(g,id)&&['starting','playing','paused','awaiting-holder'].includes(g.phase)?{...g,phase:'ready',round:null}:g;
  }
  function finishGame(g){
    if(!['ready','resolved'].includes(g.phase)||!g.history.length)return g;
    return {...g,phase:'finished',endedEarly:g.config.mode==='elimination',winnerId:null};
  }
  function getStats(g){return g.players.map(p=>({playerId:p.id,name:p.name,catches:g.history.filter(o=>o.holderId===p.id).length,active:g.activeIds.includes(p.id)}));}
  function randomInteger(size,crypto=globalThis.crypto){
    if(!Number.isInteger(size)||size<1||size>4294967296)throw Error('Invalid random range.');
    if(size===1)return 0;
    if(crypto?.getRandomValues){const values=new Uint32Array(1),limit=Math.floor(4294967296/size)*size;let value;do{crypto.getRandomValues(values);value=values[0];}while(value>=limit);return value%size;}
    return Math.floor(Math.random()*size);
  }
  function sampleDuration(config,random,crypto=globalThis.crypto){
    const min=config.minSeconds*1000,max=config.maxSeconds*1000;
    return min+(random?Math.min(max-min,Math.max(0,Math.floor(random()*(max-min+1)))):randomInteger(max-min+1,crypto));
  }
  return {DEFAULT_CONFIG,FORFEITS,validateConfig,validateRoster,createGame,beginRound,markPlaying,markPaused,markStopped,confirmHolder,cancelRound,finishGame,getStats,sampleDuration,randomInteger};
});
