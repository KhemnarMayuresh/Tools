(function (root,factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./game-core.js'));
  else root.TicAI = factory(root.TicCore);
})(typeof globalThis !== 'undefined' ? globalThis : this,function (Core) {
  'use strict';
  function chooseMove(input, options = {}) {
    // Search needs position/draw state, not the player's undo snapshots.
    const round = {...input,history:[]};
    const level = Math.max(0,Math.min(5,options.level ?? round.config.difficulty));
    const legal = Core.getLegalMoves(round);
    if (!legal.length) return {move:null,nodes:0,depth:0,stopped:false};
    const random = options.random || Math.random;
    const now = options.now || (()=>performance.now());
    const started = now(), maxMs = options.maxMs ?? 50;
    const maxNodes = Math.max(0,options.maxNodes ?? (level === 5 ? 15000 : 5000));
    const maxDepth = Math.min(options.maxDepth ?? (level === 5 ? 4 : 2),level === 5 ? 4 : 2);
    let nodes = 0, stopped = false, completedDepth = 0;
    const expired = () => {if (now()-started >= maxMs || nodes >= maxNodes) stopped = true;return stopped;};
    const selectedRandom = legal[Math.min(legal.length-1,Math.max(0,Math.floor(random()*legal.length)))];
    const actor = round.turn;
    function positional(state,cell) {
      const center = (state.config.size-1)/2;
      let value = -(Math.abs(cell.row-center)+Math.abs(cell.col-center));
      for (const adjacent of state.queues[state.turn]) {
        if (Math.abs(cell.row-adjacent.row)<=1 && Math.abs(cell.col-adjacent.col)<=1) value += 0.35;
      }
      return value;
    }
    const geometric = (state,cells) => [...cells].sort((a,b)=>positional(state,b)-positional(state,a));
    let best = level >= 3 ? geometric(round,legal)[0] : selectedRandom;
    if (level === 0) return {move:best,nodes,depth:0,stopped};
    function tactics(state,cells) {
      const wins=[],blocks=[];
      for (const cell of cells) {
        if (expired()) break;
        if (Core.previewPlacement(state,state.turn,cell).winningCells.length) wins.push(cell);
        if (Core.previewPlacement(state,Core.other(state.turn),cell).winningCells.length) blocks.push(cell);
      }
      return {wins,blocks};
    }
    const initial = tactics(round,legal);
    if (initial.wins.length) return {move:initial.wins[0],nodes,depth:0,stopped};
    if (level >= 2 && initial.blocks.length) best=initial.blocks[0];
    if (level < 4 || stopped) return {move:best,nodes,depth:0,stopped};
    function candidates(state) {
      const cells=Core.getLegalMoves(state), tactical=tactics(state,cells);
      const seen=new Set(), result=[];
      for (const cell of [...tactical.wins,...tactical.blocks,...geometric(state,cells)]) {
        const key=`${cell.row},${cell.col}`;
        if (!seen.has(key)) {seen.add(key);result.push(cell);}
        if (result.length===12) break;
      }
      return result;
    }
    function heuristic(state) {
      let score=0;
      const n=state.config.size,k=state.config.winLength;
      for (let row=0;row<n;row++) for(let col=0;col<n;col++) for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
        const endRow=row+(k-1)*dr,endCol=col+(k-1)*dc;
        if (endRow<0||endRow>=n||endCol<0||endCol>=n) continue;
        let own=0,opponent=0;
        for(let i=0;i<k;i++){const mark=state.board[row+i*dr][col+i*dc];if(mark===actor)own++;else if(mark)opponent++;}
        if (!opponent) score+=own*own;
        if (!own) score-=opponent*opponent;
      }
      return score;
    }
    function search(state,depth,alpha,beta) {
      if (state.phase==='won') return state.winner===actor ? 100000+depth : -100000-depth;
      if (state.phase==='draw') return 0;
      if (!depth || expired()) return heuristic(state);
      const maximizing=state.turn===actor;
      let value=maximizing ? -Infinity : Infinity;
      for (const cell of candidates(state)) {
        if (expired()) break;
        nodes++;
        const score=search(Core.playMove(state,cell),depth-1,alpha,beta);
        value=maximizing?Math.max(value,score):Math.min(value,score);
        if (maximizing) alpha=Math.max(alpha,value);else beta=Math.min(beta,value);
        if (beta<=alpha || stopped) break;
      }
      return Number.isFinite(value)?value:heuristic(state);
    }
    const rootCandidates=candidates(round);
    // Complete an entire depth before replacing the last safe decision.
    for (let depth=1;depth<=maxDepth;depth++) {
      let candidate=best,value=-Infinity;
      for (const cell of rootCandidates) {
        if (expired()) break;
        nodes++;
        const score=search(Core.playMove(round,cell),depth-1,-Infinity,Infinity);
        if (score>value){value=score;candidate=cell;}
      }
      if (stopped) break;
      // A one-ply heuristic cannot disprove an immediate opponent win.
      if (!initial.blocks.length || depth >= 2) best=candidate;
      completedDepth=depth;
    }
    return {move:best,nodes,depth:completedDepth,stopped};
  }
  return {chooseMove};
});


