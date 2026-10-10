(function (root,factory) {
  if (typeof module === 'object' && module.exports) module.exports=factory(require('./game-core.js'),require('./ai.js'));
  else root.TicAIController=factory(root.TicCore,root.TicAI);
})(typeof globalThis !== 'undefined' ? globalThis : this,function (Core,AI) {
  'use strict';
  function createAIController({schedule=setTimeout,cancel=clearTimeout,now=()=>performance.now(),
    createWorker=()=>new Worker('ai-worker.js'),onMove,onStatus=()=>{}}) {
    let generation=0,delay=null,watchdog=null,worker=null;
    function clear() {
      if (delay!==null) cancel(delay);
      if (watchdog!==null) cancel(watchdog);
      if (worker) {worker.terminate();worker=null;}
      delay=watchdog=null;
    }
    function invalidate() {generation++;clear();}
    function request(input,requestId) {
      invalidate();
      if (input.phase!=='playing' || input.turn!=='O' || input.config.mode!=='computer') return;
      const round=JSON.parse(JSON.stringify({...input,history:[]})), token=generation;
      let delivered=false;
      const current=()=>token===generation&&!delivered;
      const legal=move=>Core.getLegalMoves(round).some(c=>move&&c.row===move.row&&c.col===move.col);
      function emit(move) {
        if (!current()) return;
        delivered=true;clear();onMove(requestId,round.id,move);
      }
      function fallback() {
        if (!current()) return;
        clear();onStatus('Computer fallback: background worker unavailable; using a bounded local decision.');
        let move;
        try {move=AI.chooseMove(round,{level:round.config.difficulty,maxDepth:2,maxNodes:1500,maxMs:25,now}).move;}
        catch (_) {move=null;}
        emit(legal(move)?move:Core.getLegalMoves(round)[0]||null);
      }
      onStatus('Computer thinking…');
      const level=round.config.difficulty;
      delay=schedule(()=>{
        if (!current()) return;delay=null;
        try {
          worker=createWorker();
          worker.onmessage=event=>{
            if (!current()) return;
            const data=event.data||{};
            if (data.requestId!==requestId||data.roundId!==round.id) return;
            if (data.error||!legal(data.move)) fallback();else emit(data.move);
          };
          worker.onerror=event=>{if(event.preventDefault)event.preventDefault();fallback();};
          watchdog=schedule(fallback,1500);
          worker.postMessage({round,requestId});
        } catch (_) {fallback();}
      },level<2?80:level<4?180:280);
    }
    return {request,cancel:invalidate};
  }
  return {createAIController};
});

