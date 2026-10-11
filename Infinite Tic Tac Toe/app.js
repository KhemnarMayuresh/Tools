(function () {
  'use strict';
  const Core = window.TicCore, Match = window.TicMatch;
  const $ = id => document.getElementById(id);
  const sound = window.TicAudio.createAudio();
  const themeKey = 'tic-tac-toe-theme', soundKey = 'tic-tac-toe-sound';
  let match = null, round = null, serial = 0, requestSerial = 0, activeRequest = null;
  let confirmation = null, returnFocus = null, lastTerminalCue = null, localOName = 'Player O';
  let focusCell = {row:0,col:0};
  function read(key) {try {return localStorage.getItem(key);} catch (_) {return null;}}
  function save(key,value) {try {localStorage.setItem(key,value);} catch (_) {message('Preferences could not be saved. You can still play.');}}
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = read(themeKey);
  if (!['light','dark','system'].includes(theme)) theme = 'system';
  function applyTheme() {
    document.documentElement.dataset.theme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
    document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.themeChoice === theme)));
  }
  if (media.addEventListener) media.addEventListener('change',applyTheme);
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click',()=>{theme=button.dataset.themeChoice;applyTheme();save(themeKey,theme);}));
  applyTheme();
  try {
    const stored = JSON.parse(read(soundKey));
    if (stored && typeof stored.enabled === 'boolean' && Number.isFinite(stored.volume) && stored.volume >= 0 && stored.volume <= 1) {
      $('sound').checked = stored.enabled; $('volume').value = stored.volume;
    }
  } catch (_) {}
  function applySound(persist=false) {
    const preferences = {enabled:$('sound').checked,volume:Number($('volume').value)};
    sound.setPreferences(preferences);
    if (persist) save(soundKey,JSON.stringify(preferences));
  }
  applySound();
  $('sound').addEventListener('change',()=>{applySound(true);sound.unlock();});
  $('volume').addEventListener('input',()=>applySound(true));
  document.addEventListener('pointerdown',()=>sound.unlock());
  document.addEventListener('keydown',()=>sound.unlock());
  function configFromInputs() {
    return {size:Number($('size').value),winLength:Number($('winLength').value),moveLimit:Number($('moveLimit').value),mode:$('mode').value,difficulty:Number($('difficulty').value)};
  }
  function playersFromInputs() {
    return [{mark:'X',name:$('nameX').value},{mark:'O',name:$('mode').value==='computer'?'Computer':$('nameO').value}];
  }
  const name = mark => match ? match.players.find(player=>player.mark===mark).name : playersFromInputs().find(player=>player.mark===mark).name || `Player ${mark}`;
  const unfinished = () => round && ['playing','paused'].includes(round.phase);
  const computerTurn = () => round && round.config.mode === 'computer' && round.turn === 'O' && round.phase === 'playing';
  const canPlay = () => round && round.phase === 'playing' && !computerTurn() && !confirmation;
  function message(text,error=false) {$('status').textContent=text;$('status').classList.toggle('error',error);}
  function cancelAI() {activeRequest=null;controller.cancel();}
  const controller = window.TicAIController.createAIController({
    onMove(requestId,roundId,cell) {
      if (requestId!==activeRequest || !round || round.id!==roundId || !computerTurn() || confirmation) return;
      activeRequest=null;
      if (cell && Core.getLegalMoves(round).some(c=>c.row===cell.row&&c.col===cell.col)) place(cell);
    },
    onStatus(text) {
      if (text.includes('fallback')) {$('aiStatus').hidden=false;$('aiStatus').textContent=text;}
    }
  });
  function scheduleAI() {
    if (computerTurn() && !confirmation && activeRequest === null) {
      activeRequest=++requestSerial;
      controller.request(round,activeRequest);
    }
  }
  function createBoard(size) {
    const board=$('board');
    board.replaceChildren();board.style.setProperty('--size',size);
    board.setAttribute('aria-rowcount',size);board.setAttribute('aria-colcount',size);
    focusCell={row:0,col:0};
    for (let row=0;row<size;row++) {
      const line=document.createElement('div');line.className='board-row';line.setAttribute('role','row');
      for (let col=0;col<size;col++) {
        const button=document.createElement('button');button.type='button';button.className='cell';button.dataset.row=row;button.dataset.col=col;
        button.setAttribute('role','gridcell');button.setAttribute('aria-rowindex',row+1);button.setAttribute('aria-colindex',col+1);
        button.addEventListener('click',()=>{
          if (!canPlay()) {message(!round?'Start the match first.':confirmation?'Choose whether to confirm or keep playing.':round.phase==='paused'?'Resume to place your next mark.':computerTurn()?'Wait for the computer to finish its turn.':'This round is complete. Choose Next round.');return;}
          place({row,col});
        });
        button.addEventListener('focus',()=>{focusCell={row,col};setTabStops();});
        button.addEventListener('keydown',event=>navigate(event,row,col));
        line.append(button);
      }
      board.append(line);
    }
  }
  function setTabStops() {
    $('board').querySelectorAll('.cell').forEach(button=>button.tabIndex=Number(button.dataset.row)===focusCell.row&&Number(button.dataset.col)===focusCell.col?0:-1);
  }
  function navigate(event,row,col) {
    const size=round?round.config.size:Number($('size').value);
    const delta={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};
    if (!delta[event.key] && !['Home','End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key==='Home') col=0;else if(event.key==='End')col=size-1;
    else {row=Math.max(0,Math.min(size-1,row+delta[event.key][0]));col=Math.max(0,Math.min(size-1,col+delta[event.key][1]));}
    const cell=$('board').querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.focus();cell.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function textNode(tag,text,className='') {const element=document.createElement(tag);element.textContent=text;element.className=className;return element;}
  function render() {
    const inputs=configFromInputs(),config=match?match.config:inputs;
    const size=config.size;
    if ($('board').querySelectorAll('.cell').length!==size*size) createBoard(size);
    const playing=canPlay();$('board').setAttribute('aria-disabled',String(!playing));
    $('board').querySelectorAll('.cell').forEach(button=>{
      const row=Number(button.dataset.row),col=Number(button.dataset.col),mark=round?round.board[row][col]:null;
      const queue=mark&&round.queues[mark];
      const oldest=queue&&queue.length===size&&queue[0].row===row&&queue[0].col===col;
      const winning=round&&round.winningCells.some(cell=>cell.row===row&&cell.col===col);
      button.className='cell'+(mark?` mark-${mark.toLowerCase()}`:'')+(oldest?' oldest':'')+(winning?' winning':'');
      button.replaceChildren(textNode('span',mark||'','mark'));
      if(oldest)button.append(textNode('span','next','leave'));
      button.setAttribute('aria-label',`Row ${row+1}, column ${col+1}, ${mark||'empty'}${oldest?`, next to leave on ${mark}'s next move`:''}${winning?', winning line':''}`);
      button.setAttribute('aria-disabled',String(!playing||!!mark));
    });
    setTabStops();
    $('matchSettings').disabled=!!match;
    $('nameO').disabled=!!match||inputs.mode==='computer';
    $('difficultyLabel').hidden=config.mode!=='computer';
    $('rules').textContent=`${size} × ${size} board · connect ${config.winLength} · keep ${size} marks each`;
    $('settingsSummary').textContent=`${config.mode==='computer'?'Computer':'Two players'} · ${size} × ${size} · connect ${config.winLength}`;
    $('rollingHelp').textContent=`Each player keeps ${size} marks. At the limit, your oldest mark leaves before your next mark is placed. Choose a square that is already empty.`;
    $('moveCount').textContent=`${round?round.moveCount:0} / ${config.moveLimit}`;
    $('roundLabel').textContent=match?`Round ${match.outcomes.length+(unfinished()?1:0)} · ${round.starter} starts`:'Ready to play';
    $('turn').textContent=!round?'Start a new match':round.phase==='won'?`${name(round.winner)} wins!`:round.phase==='draw'?'Round drawn':round.phase==='paused'?'Game paused':computerTurn()?'Computer thinking…':`${name(round.turn)}'s turn · ${round.turn}`;
    const active=unfinished(),terminal=round&&!active;
    $('start').hidden=!!match;$('nextRound').hidden=!terminal;$('pause').hidden=!active;$('restart').hidden=!active;$('undo').hidden=!match;$('newMatch').hidden=!match;
    $('pause').textContent=round&&round.phase==='paused'?'Resume':'Pause';
    $('undo').disabled=!active||Core.undo(round)===round||!!confirmation;
    $('undo').title=terminal?'Completed rounds cannot be undone. Choose Next round.':config.mode==='computer'?'Undo your last X move and the computer reply.':'Undo the last placement.';
    for(const id of ['start','nextRound','pause','restart','newMatch'])$(id).disabled=!!confirmation;
    $('players').replaceChildren();
    for (const mark of ['X','O']) {
      const queue=round?round.queues[mark]:[],card=document.createElement('div');card.className='player-card'+(active&&round.turn===mark?' active':'');
      card.append(textNode('div',`${name(mark)} · ${mark}`,'player-name'),textNode('div',`${queue.length} / ${size} active marks`,'player-meta'),textNode('div',queue.length?`Oldest → newest: ${queue.map(c=>`R${c.row+1}C${c.col+1}`).join(' · ')}`:'No marks yet','queue'));
      $('players').append(card);
    }
    const scores=match?Match.getScores(match):{XWins:0,OWins:0,draws:0};
    $('xScoreName').textContent=`${name('X')} · X`;$('oScoreName').textContent=`${name('O')} · O`;
    $('xScore').textContent=scores.XWins;$('oScore').textContent=scores.OWins;$('drawScore').textContent=scores.draws;
    $('history').replaceChildren();$('historyEmpty').hidden=!!(match&&match.outcomes.length);
    if (match)for(const outcome of [...match.outcomes].reverse()) {
      const item=document.createElement('li'),description=document.createElement('div');
      description.append(textNode('strong',`Round ${outcome.roundNumber}`),textNode('small',`${outcome.moveCount} moves · ${outcome.starter} started`));
      item.append(description,textNode('span',outcome.winner?`${name(outcome.winner)} won`:`Draw · ${outcome.drawReason==='repetition'?'threefold repetition':'move limit'}`,'result-badge'));
      $('history').append(item);
    }
  }
  function place(cell) {
    const next=Core.playMove(round,cell);
    if (next===round) {message('That square is occupied. Choose an empty square, including before the oldest mark leaves.');return;}
    round=next;
    const removed=round.history.at(-1).removed;
    if (round.phase==='won'||round.phase==='draw') {
      cancelAI();match=Match.recordOutcome(match,round);
      if (lastTerminalCue!==round.id) {sound.play(round.phase==='won'?'win':'draw');lastTerminalCue=round.id;}
      message(round.phase==='won'?`Winning line highlighted. Completed rounds cannot be undone; choose Next round.`:`Draw by ${round.drawReason==='repetition'?'three occurrences of the same position':'the move limit'}. Choose Next round.`);
    } else {sound.play('place');message(removed?`${round.history.at(-1).mark}'s oldest mark at row ${removed.row+1}, column ${removed.col+1} left the board.`:'Choose an empty square for the next move.');}
    render();scheduleAI();
  }
  function beginRound(starter) {
    cancelAI();sound.stop();round=Core.createRound(`round-${++serial}`,match.config,starter);focusCell={row:0,col:0};
    $('aiStatus').hidden=true;message('Choose an empty square. Watch the oldest mark when your queue fills.');render();scheduleAI();
  }
  $('start').addEventListener('click',()=>{
    const config=configFromInputs(),players=playersFromInputs();const errors=[...Core.validateConfig(config).errors,...Core.validatePlayers(players).errors];
    if(errors.length){$('configuration').open=true;message(errors.join(' '),true);return;}
    match=Match.createMatch(config,players);$('configuration').open=false;beginRound('X');
  });
  $('pause').addEventListener('click',()=>{
    if(!unfinished()||confirmation)return;cancelAI();round=Core.setPaused(round,round.phase!=='paused');
    message(round.phase==='paused'?'Board and computer turns are paused. Resume when ready.':'Game resumed.');render();scheduleAI();
  });
  $('undo').addEventListener('click',()=>{
    if(!unfinished()||confirmation)return;cancelAI();const next=Core.undo(round);if(next===round)return;round=next;sound.stop();message('Last move undone. The board and oldest-mark order have been restored.');render();scheduleAI();
  });
  function ask(text,action,origin) {
    cancelAI();confirmation=action;returnFocus=origin;$('confirmText').textContent=text;$('confirmation').hidden=false;render();$('confirmNo').focus();
  }
  function dismissConfirmation() {confirmation=null;$('confirmation').hidden=true;render();}
  $('confirmNo').addEventListener('click',()=>{dismissConfirmation();message('Kept the current match.');if(returnFocus&&!returnFocus.hidden)returnFocus.focus();scheduleAI();});
  $('confirmYes').addEventListener('click',()=>{const action=confirmation;dismissConfirmation();if(action)action();});
  $('confirmation').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();$('confirmNo').click();}});
  $('restart').addEventListener('click',()=>{
    if(!unfinished()||confirmation)return;
    const restart=()=>beginRound(round.starter);
    if(round.moveCount)ask('Restart this round? Its unfinished moves will be discarded. Match scores stay the same.',restart,$('restart'));else restart();
  });
  $('nextRound').addEventListener('click',()=>{if(!round||unfinished()||confirmation)return;beginRound(Match.nextRoundInfo(match).starter);});
  function newMatch() {
    cancelAI();sound.stop();match=round=null;focusCell={row:0,col:0};$('configuration').open=true;$('aiStatus').hidden=true;
    message('Choose settings and start a new match.');render();$('start').focus();
  }
  $('newMatch').addEventListener('click',()=>{
    if(!match||confirmation)return;
    if(round.moveCount||match.outcomes.length)ask('Start a new match? This clears the board, scores and completed round history.',newMatch,$('newMatch'));else newMatch();
  });
  $('size').addEventListener('change',()=>{
    if(match)return;const prior=Number($('winLength').value),size=Number($('size').value);$('winLength').replaceChildren();
    for(let length=3;length<=size;length++){const option=document.createElement('option');option.value=length;option.textContent=`${length} in a row`;$('winLength').append(option);}
    $('winLength').value=Math.min(prior,size);render();
  });
  $('mode').addEventListener('change',()=>{
    if(match)return;if($('mode').value==='computer'){localOName=$('nameO').value;$('nameO').value='Computer';}else $('nameO').value=localOName;render();
  });
  for(const id of ['winLength','difficulty','nameX','nameO','moveLimit'])$(id).addEventListener('input',()=>{if(!match)render();});
  window.addEventListener('pagehide',()=>{cancelAI();sound.stop();});
  window.addEventListener('pageshow',event=>{if(event.persisted){render();scheduleAI();}});
  render();
})();

