(function (root,factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./game-core.js'));
  else root.TicMatch = factory(root.TicCore);
})(typeof globalThis !== 'undefined' ? globalThis : this,function (Core) {
  'use strict';
  function createMatch(config,players) {
    const errors = [...Core.validateConfig(config).errors,...Core.validatePlayers(players).errors];
    if (errors.length) throw new Error(errors.join(' '));
    return {config:{...config},players:players.map(p=>({mark:p.mark,name:Core.normalizeName(p.name)})),outcomes:[]};
  }
  function recordOutcome(match,round) {
    if (!['won','draw'].includes(round.phase) || match.outcomes.some(o=>o.id===round.id)) return match;
    const outcome = {id:round.id,roundNumber:match.outcomes.length+1,starter:round.starter,winner:round.winner,
      drawReason:round.drawReason,moveCount:round.moveCount,board:round.board.map(row=>[...row]),
      winningCells:round.winningCells.map(cell=>({...cell}))};
    return {...match,outcomes:[...match.outcomes,outcome]};
  }
  function getScores(match) {
    return {XWins:match.outcomes.filter(o=>o.winner==='X').length,OWins:match.outcomes.filter(o=>o.winner==='O').length,
      draws:match.outcomes.filter(o=>!o.winner).length,completedRounds:match.outcomes.length};
  }
  function nextRoundInfo(match) {
    return {roundNumber:match.outcomes.length+1,starter:match.outcomes.length % 2 ? 'O' : 'X'};
  }
  return {createMatch,recordOutcome,getScores,nextRoundInfo};
});
