(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ParcelRound=api;})(globalThis,function(){
  'use strict';
  function createRoundController({now=()=>performance.now(),schedule=setTimeout,cancel=clearTimeout,onStop,onTick=()=>{}}){
    let generation=0,deadline=null,tick=null,state=null,running=false,baseElapsed=0,startedAt=0;
    function clear(){if(deadline!==null)cancel(deadline);if(tick!==null)cancel(tick);deadline=tick=null;}
    function snapshot(){
      if(!state)return null;
      const elapsedMs=Math.min(state.durationMs,baseElapsed+(running?Math.max(0,now()-startedAt):0));
      const index=state.activeIds.indexOf(state.startPlayerId);
      const holderId=state.playStyle==='screen'?state.activeIds[(index+Math.floor(elapsedMs/state.passIntervalMs))%state.activeIds.length]:null;
      return {roundId:state.roundId,elapsedMs,remainingMs:Math.max(0,state.durationMs-elapsedMs),holderId};
    }
    function finish(reason){
      if(!state||state.stopped)return;
      const result=snapshot();
      if(reason==='random'||result.remainingMs===0){baseElapsed=state.durationMs;reason='random';}else baseElapsed=result.elapsedMs;
      running=false;state.stopped=true;generation++;clear();onStop({...snapshot(),reason});
    }
    function arm(){
      const token=generation;
      deadline=schedule(()=>{if(token!==generation||!running)return;finish('random');},snapshot().remainingMs);
      const update=()=>{if(token!==generation||!running)return;onTick(snapshot());if(token===generation&&running)tick=schedule(update,250);};
      onTick(snapshot());if(token===generation&&running)tick=schedule(update,250);
    }
    function cancelRound(){generation++;clear();state=null;running=false;baseElapsed=0;}
    function start(config){
      cancelRound();if(!Number.isFinite(config.durationMs)||config.durationMs<=0||!config.activeIds.length||!config.activeIds.includes(config.startPlayerId))throw Error('Invalid round timer.');
      state={...config,activeIds:[...config.activeIds],stopped:false};startedAt=now();running=true;arm();
    }
    function pause(){if(!running)return;if(snapshot().remainingMs===0){finish('random');return;}baseElapsed=snapshot().elapsedMs;running=false;generation++;clear();}
    function resume(){if(!state||state.stopped||running)return;startedAt=now();running=true;generation++;arm();}
    return {start,pause,resume,stopManual:()=>finish('manual'),cancel:cancelRound,snapshot};
  }
  return {createRoundController};
});
