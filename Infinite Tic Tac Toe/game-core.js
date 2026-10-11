(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TicCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const marks = ['X', 'O'];
  const other = mark => mark === 'X' ? 'O' : 'X';
  const copy = value => ({...value, board:value.board.map(row=>[...row]), queues:{X:value.queues.X.map(cell=>({...cell})),O:value.queues.O.map(cell=>({...cell}))}, positionKeys:[...value.positionKeys]});
  const normalizeName = name => typeof name === 'string' ? name.trim().normalize('NFC') : '';
  function validateConfig(config) {
    const c = config || {}, errors = [];
    const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
    if (!integer(c.size, 3, 10)) errors.push('Choose a grid size from 3 to 10.');
    if (!integer(c.winLength, 3, c.size)) errors.push('Winning length must be from 3 to the grid size.');
    if (!integer(c.moveLimit, 20, 1000)) errors.push('Move limit must be a whole number from 20 to 1,000.');
    if (!['local', 'computer'].includes(c.mode)) errors.push('Choose two players or computer.');
    if (!integer(c.difficulty, 0, 5)) errors.push('Choose computer difficulty from 0 to 5.');
    return {valid: !errors.length, errors};
  }
  function validatePlayers(players) {
    const errors = [];
    if (!Array.isArray(players) || players.length !== 2 || players[0].mark !== 'X' || players[1].mark !== 'O') {
      return {valid:false, errors:['Provide players X and O.']};
    }
    const names = players.map(p => normalizeName(p.name));
    if (names.some(name => !name || Array.from(name).length > 40)) errors.push('Names must contain 1–40 characters.');
    if (names[0].toLowerCase() === names[1].toLowerCase()) errors.push('Use a different name for each player.');
    return {valid:!errors.length, errors};
  }
  function positionKey(round) {
    return JSON.stringify([round.board, round.queues.X, round.queues.O, round.turn]);
  }
  function createRound(id, config, starter = 'X') {
    const result = validateConfig(config);
    if (!result.valid || !marks.includes(starter)) throw new Error(result.errors.join(' ') || 'Invalid starter.');
    const round = {id, config:{...config}, starter, board:Array.from({length:config.size}, () => Array(config.size).fill(null)),
      queues:{X:[],O:[]}, turn:starter, phase:'playing', moveCount:0, history:[], positionKeys:[],
      winner:null, winningCells:[], drawReason:null};
    round.positionKeys.push(positionKey(round));
    return round;
  }
  function legalCell(round, cell) {
    return cell && Number.isInteger(cell.row) && Number.isInteger(cell.col) && cell.row >= 0 && cell.col >= 0 &&
      cell.row < round.config.size && cell.col < round.config.size && round.board[cell.row][cell.col] === null;
  }
  function getLegalMoves(round) {
    if (round.phase !== 'playing') return [];
    const cells = [];
    round.board.forEach((row,r) => row.forEach((mark,c) => {if (mark === null) cells.push({row:r,col:c});}));
    return cells;
  }
  function winningLine(board, mark, cell, length) {
    const found = new Map();
    for (const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      const line = [{...cell}];
      for (const sign of [-1,1]) {
        let r = cell.row + dr*sign, c = cell.col + dc*sign;
        while (board[r] && board[r][c] === mark) {
          const at = {row:r,col:c};
          if (sign === -1) line.unshift(at); else line.push(at);
          r += dr*sign; c += dc*sign;
        }
      }
      if (line.length >= length) line.forEach(at => found.set(`${at.row},${at.col}`, at));
    }
    return [...found.values()];
  }
  function previewPlacement(round, mark, cell) {
    if (!marks.includes(mark) || !legalCell(round,cell)) return null;
    const board = round.board.map(row => [...row]);
    const queues = {X:round.queues.X.map(c=>({...c})),O:round.queues.O.map(c=>({...c}))};
    const removed = queues[mark].length >= round.config.size ? queues[mark].shift() : null;
    if (removed) board[removed.row][removed.col] = null;
    board[cell.row][cell.col] = mark;
    queues[mark].push({...cell});
    return {board, queues, removed, winningCells:winningLine(board,mark,cell,round.config.winLength)};
  }
  function playMove(round, cell) {
    if (round.phase !== 'playing') return round;
    const placed = previewPlacement(round,round.turn,cell);
    if (!placed) return round;
    const before = copy({board:round.board,queues:round.queues,turn:round.turn,moveCount:round.moveCount,positionKeys:round.positionKeys});
    const next = {...round,...placed,turn:other(round.turn),moveCount:round.moveCount+1,
      history:[...round.history,{before,mark:round.turn,cell:{...cell},removed:placed.removed}],positionKeys:[...round.positionKeys]};
    next.positionKeys.push(positionKey(next));
    if (placed.winningCells.length) {next.phase='won'; next.winner=round.turn;}
    else if (next.positionKeys.filter(key=>key===next.positionKeys.at(-1)).length >= 3) {next.phase='draw';next.drawReason='repetition';}
    else if (next.moveCount >= next.config.moveLimit) {next.phase='draw';next.drawReason='move-limit';}
    return next;
  }
  function setPaused(round, paused) {
    if (!['playing','paused'].includes(round.phase)) return round;
    return {...round,phase:paused ? 'paused' : 'playing'};
  }
  function undo(round) {
    if (!['playing','paused'].includes(round.phase) || !round.history.length) return round;
    let index = round.history.length - 1;
    if (round.config.mode === 'computer') {
      while (index >= 0 && round.history[index].mark !== 'X') index--;
      if (index < 0) return round;
    }
    return {...round,...copy(round.history[index].before),history:round.history.slice(0,index),
      winner:null,winningCells:[],drawReason:null,removed:null};
  }
  return {validateConfig,validatePlayers,normalizeName,createRound,getLegalMoves,previewPlacement,playMove,positionKey,other,setPaused,undo};
});

