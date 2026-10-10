(function(){
  'use strict';
  const Core=window.ParcelCore,$=id=>document.getElementById(id),text=(tag,value,className='')=>{const node=document.createElement(tag);node.textContent=value;node.className=className;return node;};
  let game=null,serial=0,operation=0,sourceOperation=0,preparedSource={kind:'builtin',track:'party',label:'Party beat'},sourceReady=false;
  let audioRecovery=false,previewing=false,resumePending=false,selectedHolder=null,visual=null,confirmation=null;
  const themes=['light','dark','system'],themeKey='parcel-theme',volumeKey='parcel-volume',media=matchMedia('(prefers-color-scheme: dark)');
  const stored=key=>{try{return localStorage.getItem(key);}catch(_){return null;}};
  function message(value,error=false){$('status').textContent=value;$('status').classList.toggle('error',error);}
  function save(key,value){try{localStorage.setItem(key,value);}catch(_){message('Preferences cannot be saved here. They still work for this page.');}}
  let theme=stored(themeKey);if(!themes.includes(theme))theme='system';
  function applyTheme(){document.documentElement.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));}
  media.addEventListener('change',applyTheme);document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.themeChoice;applyTheme();save(themeKey,theme);}));applyTheme();
  const storedVolume=stored(volumeKey);if(storedVolume!==null&&storedVolume.trim()!==''&&Number.isFinite(Number(storedVolume))&&Number(storedVolume)>=0&&Number(storedVolume)<=1)$('volume').value=storedVolume;
  function config(){return {minSeconds:Number($('minTime').value),maxSeconds:Number($('maxTime').value),mode:$('mode').value,playStyle:$('playStyle').value,passIntervalMs:Number($('passInterval').value),musicPosition:$('musicPosition').value,forfeits:$('forfeits').checked};}
  const roster=()=>$('roster').value.trim().split(/\r?\n/);
  const name=id=>game?.players.find(p=>p.id===id)?.name||'';
  const formatTime=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
  function currentPlayers(){return game?game.players:Core.validateRoster(roster()).names.slice(0,20).filter(Boolean).map((name,i)=>({id:`player-${i+1}`,name}));}
  function invalidateAudio(){operation++;resumePending=false;previewing=false;audio.cancel();}
  const audio=window.ParcelAudio.createAudioController({onStatus:value=>{$('audioStatus').textContent=value;},onFailure:({message:reason})=>failRound(reason)});
  function applyVolume(persist=false){const value=Number($('volume').value);audio.setVolume(value);$('volumeNote').textContent=value===0?'Muted — players cannot hear the stop.':`${Math.round(value*100)}%`;$('mutedWarning').hidden=value!==0;if(persist)save(volumeKey,String(value));}
  applyVolume();$('volume').addEventListener('input',()=>applyVolume(true));
  const timer=window.ParcelRound.createRoundController({
    onTick:snapshot=>{if(game?.round?.id===snapshot.roundId&&game.phase==='playing'){visual=snapshot;updateClock();}},
    onStop:snapshot=>{
      if(!game||game.round?.id!==snapshot.roundId||!['playing','paused'].includes(game.phase))return;
      invalidateAudio();visual=snapshot;game=Core.markStopped(game,snapshot.roundId,snapshot);selectedHolder=game.config.playStyle==='screen'?snapshot.holderId:null;
      message(snapshot.reason==='manual'?'Host stopped the music. Confirm the holder before continuing.':'Random stop! Confirm the holder before continuing.');render();
      if(!confirmation){const target=game.config.playStyle==='screen'?$('confirmHolder'):$('holderChoices').querySelector('input');target?.focus();}
    }
  });
  function failRound(reason){
    invalidateAudio();timer.cancel();
    if(game?.round)game=Core.cancelRound(game,game.round.id);
    visual=null;audioRecovery=true;sourceReady=!!preparedSource;message(reason||'Audio unavailable. Retry or change music; no catch was recorded.',true);$('audioStatus').textContent=reason||'Audio unavailable. Retry or change source.';$('configuration').open=true;render();
  }
  function updateClock(){
    const elapsed=visual?.elapsedMs??game?.round?.elapsedMs??0;$('elapsed').textContent=formatTime(elapsed);
    const screen=game?.config.playStyle==='screen',live=game&&['playing','paused','awaiting-holder'].includes(game.phase),holder=game?.round?.holderId||visual?.holderId;
    $('holderCaption').textContent=screen?'On-screen holder':'Pass a real parcel';
    $('holderName').textContent=screen&&live&&holder?name(holder):game?.phase==='playing'?'Keep it moving':game?.phase==='paused'?'Hold the parcel':game?.phase==='awaiting-holder'?'Who has it?':game?.phase==='finished'?'Thanks for playing':'Gather your players';
    $('players').querySelectorAll('[data-player]').forEach(node=>node.classList.toggle('current',!!(screen&&live&&node.dataset.player===holder)));
  }
  function render(){
    const c=game?game.config:config(),phase=game?.phase||'setup',players=currentPlayers(),active=game?game.activeIds:players.map(p=>p.id),busy=['starting','playing','paused','awaiting-holder'].includes(phase),locked=!!game;
    $('gameSettings').disabled=locked;$('musicSettings').disabled=locked&&!audioRecovery;
    $('intervalWrap').hidden=c.playStyle!=='screen';$('forfeitWrap').hidden=c.mode!=='forfeit';$('uploadWrap').hidden=$('musicSource').value!=='upload';
    $('settingsSummary').textContent=`${players.length} players · ${c.playStyle==='screen'?'On-screen simulation':'Physical party'} · ${c.mode==='forfeit'?'Forfeit':'Elimination'}`;
    $('styleNote').textContent=c.playStyle==='screen'?'On-screen simulation: the parcel passes clockwise at the chosen interval. This does not track a physical parcel.':'Physical party: pass a real parcel. When music stops, the host selects the actual holder.';
    $('lockNote').textContent=audioRecovery&&game?'Audio recovery: change music or retry. Your players and results are kept.':locked?'Game settings are locked. Choose New game to change them.':'Settings lock when you start. Choose New game to change them.';
    $('phase').textContent=resumePending?'Starting music…':phase==='starting'?'Starting music…':phase==='playing'?'Music playing':phase==='paused'?'Paused — hold the parcel':phase==='awaiting-holder'?'Music stopped — confirm the holder':phase==='resolved'?'Round complete':phase==='finished'?'Game complete':'Ready to play';
    $('stage').dataset.phase=phase;
    $('roundLabel').textContent=phase==='finished'?`${game.history.length} completed round${game.history.length===1?'':'s'}`:`${busy?'Round':'Ready for round'} ${game?game.history.length+(phase==='resolved'?0:1):1}`;
    $('start').hidden=!['setup','ready'].includes(phase);$('start').disabled=!sourceReady||!!confirmation;
    $('next').hidden=phase!=='resolved';$('next').disabled=!!confirmation||!sourceReady;
    $('pause').hidden=!['playing','paused'].includes(phase);$('pause').textContent=phase==='paused'?'Resume':'Pause';$('pause').disabled=!!confirmation||resumePending;
    $('stop').hidden=!['playing','paused'].includes(phase);$('stop').disabled=!!confirmation||resumePending;
    $('cancel').hidden=!busy;$('cancel').disabled=!!confirmation;
    $('finish').hidden=!game||!game.history.length||!['ready','resolved'].includes(phase);$('finish').disabled=!!confirmation;
    $('newGame').hidden=!game;$('newGame').disabled=!!confirmation;
    $('restore').disabled=!!confirmation;
    $('preview').hidden=locked&&!audioRecovery;$('preview').disabled=!sourceReady||!!confirmation;$('preview').textContent=previewing?'Stop preview':'Preview music';
    $('starterWrap').hidden=c.playStyle!=='screen'||!['setup','ready','resolved'].includes(phase);
    const chosen=$('startingPlayer').value;$('startingPlayer').replaceChildren();const randomOption=text('option','Random starter · choose each round');randomOption.value='random';$('startingPlayer').append(randomOption);for(const player of players.filter(p=>active.includes(p.id))){const option=text('option',player.name);option.value=player.id;$('startingPlayer').append(option);}if(active.includes(chosen))$('startingPlayer').value=chosen;
    $('startingPlayer').disabled=!!confirmation;
    $('players').replaceChildren();for(const player of players){const out=!active.includes(player.id),card=text('div','','player-card'+(out?' out':''));card.dataset.player=player.id;card.append(text('div',player.name,'player-name'),text('div',out?'Eliminated':'In the game','player-status'));$('players').append(card);}
    $('activeCount').textContent=`${active.length} ${game?'active':'ready'}`;$('playerHelp').textContent=c.playStyle==='screen'?'Highlighted player is the simulated holder. Eliminated players are skipped.':'Physical holders are selected by the host, not detected by the page.';
    $('scores').replaceChildren();const stats=game?Core.getStats(game):players.map(p=>({playerId:p.id,name:p.name,catches:0,active:true}));
    for(const item of stats){const row=document.createElement('tr'),score=text('td',String(item.catches));score.dataset.score=item.playerId;row.append(text('td',item.name),score,text('td',game?.winnerId===item.playerId?'Winner':item.active?'Active':'Out'));$('scores').append(row);}
    $('history').replaceChildren();$('historyEmpty').hidden=!!game?.history.length;
    for(const outcome of [...(game?.history||[])].reverse()){const item=document.createElement('li');item.append(text('strong',`Round ${outcome.roundNumber} · ${outcome.holderName}`),text('small',`${outcome.eliminated?'Eliminated':'Caught the parcel'} · ${outcome.stopReason==='random'?'Random stop':'Host stop'} · ${formatTime(outcome.elapsedMs)}`));if(outcome.forfeit)item.append(text('small',`Optional forfeit: ${outcome.forfeit}`));$('history').append(item);}
    $('holderSelection').hidden=phase!=='awaiting-holder';$('holderChoices').replaceChildren();
    if(phase==='awaiting-holder'){
      if(c.playStyle==='physical')for(const player of players.filter(p=>active.includes(p.id))){const label=text('label','','holder-choice'),input=document.createElement('input');input.type='radio';input.name='holder';input.dataset.holder=player.id;input.value=player.id;input.checked=selectedHolder===player.id;input.disabled=!!confirmation;input.addEventListener('change',()=>{selectedHolder=player.id;$('holderPreview').textContent=`Selected: ${player.name}. Confirm to ${c.mode==='elimination'?'eliminate this player':'record the catch'}.`;$('confirmHolder').disabled=false;});label.append(input,document.createTextNode(player.name));$('holderChoices').append(label);}
      $('holderPreview').textContent=c.playStyle==='screen'?`Simulated holder: ${name(selectedHolder)}. Confirm to record this result.`:selectedHolder?`Selected: ${name(selectedHolder)}. Confirm to record this result.`:'Select the actual holder, then confirm.';
    }
    $('confirmHolder').disabled=!selectedHolder||!!confirmation;
    $('result').hidden=!['resolved','finished'].includes(phase);$('result').replaceChildren();const last=game?.history.at(-1);
    if(last&&['resolved','finished'].includes(phase)){$('result').append(text('strong',`${last.holderName} ${last.eliminated?'is out':'caught the parcel'}.`));if(last.forfeit)$('result').append(text('p',`Optional forfeit: ${last.forfeit}`,'hint'));}
    $('completion').hidden=phase!=='finished';$('completion').replaceChildren();
    if(phase==='finished'){
      if(game.winnerId){const card=text('div','','winner-card');card.append(text('div','🏆','winner-trophy'),text('h3','Winner'),text('p',name(game.winnerId),'winner'),text('p','Last player standing','winner-caption'));$('completion').append(card);const confetti=text('div','','confetti');confetti.setAttribute('aria-hidden','true');for(let i=0;i<40;i++){const piece=document.createElement('i');piece.style.setProperty('--x',`${(i*37)%100}%`);piece.style.setProperty('--delay',`${(i%10)*0.12}s`);piece.style.setProperty('--drift',`${(i%2?1:-1)*(20+i%35)}px`);piece.style.setProperty('--fall',`${2.4+(i%5)*0.2}s`);confetti.append(piece);}$('completion').append(confetti);}
      else $('completion').append(text('h3',game.endedEarly?'Ended early':'Game complete'));
      $('completion').append(text('p',`${game.history.length} confirmed round${game.history.length===1?'':'s'}.`));
      if(c.mode==='elimination'){if(!game.winnerId)$('completion').append(text('p',`Remaining: ${game.activeIds.map(name).join(', ')}`));const order=text('ol','','elimination-standings');if(game.winnerId)order.append(text('li',`${name(game.winnerId)} · Winner`,'standing-winner'));for(const result of [...game.history].reverse())order.append(text('li',`${result.holderName} · eliminated in round ${result.roundNumber}`));$('completion').append(text('h4',game.winnerId?'Final standings':'Eliminated · last round first'),order);}
      else $('completion').append(text('p','Everyone’s catches are listed below. Forfeits are optional; catches are not a winner ranking.'));
    }
    updateClock();
  }
  async function prepareSource(candidate){
    const token=++sourceOperation;previewing=false;sourceReady=false;$('audioStatus').textContent='Checking music…';render();
    const result=await audio.prepare(candidate);if(token!==sourceOperation)return;
    if(result.ready){preparedSource={...candidate,label:result.label};sourceReady=true;$('audioStatus').textContent=`Ready: ${result.label}. Music loops during each round.`;}
    else{sourceReady=!!preparedSource;$('musicSource').value=preparedSource.kind==='upload'?'upload':preparedSource.track;$('audioStatus').textContent=result.error||'Kept the previous music source.';message(result.error||'Kept the previous music source.',!!result.error);}
    render();
  }
  $('musicSource').addEventListener('change',()=>{if(game&&!audioRecovery)return;invalidateAudio();if($('musicSource').value==='upload'){sourceReady=preparedSource.kind==='upload';$('audioStatus').textContent=sourceReady?`Ready: ${preparedSource.label}`:'Choose an audio file. The previous source is kept until a new file is ready.';render();}else prepareSource({kind:'builtin',track:$('musicSource').value});});
  $('audioInput').addEventListener('change',()=>{if(game&&!audioRecovery)return;const file=$('audioInput').files[0];if(file)prepareSource({kind:'upload',file});});
  $('preview').addEventListener('click',async()=>{
    if((game&&!audioRecovery)||confirmation||!sourceReady)return;
    if(previewing){invalidateAudio();$('audioStatus').textContent=`Ready: ${preparedSource.label}`;render();return;}
    const token=++operation;previewing=true;render();const result=await audio.preview();if(token!==operation)return;
    previewing=result.started;if(!result.started)$('audioStatus').textContent=result.error||'Preview cancelled.';else $('audioStatus').textContent=`Previewing ${preparedSource.label}. No round is running.`;render();
  });
  async function startRound(){
    if(confirmation||!sourceReady||(game&&!['ready','resolved'].includes(game.phase)))return;
    if(document.hidden){message('Return to this page before starting music.',true);return;}
    if(!game){const c=config(),names=roster(),errors=[...Core.validateConfig(c).errors,...Core.validateRoster(names).errors];if(errors.length){$('configuration').open=true;message(errors.join(' '),true);return;}game=Core.createGame(c,names);}
    const choice=$('startingPlayer').value;
    const startId=game.config.playStyle==='screen'?(choice==='random'?game.activeIds[Core.randomInteger(game.activeIds.length)]:choice||game.activeIds[0]):game.activeIds[0];
    const next=Core.beginRound(game,`round-${++serial}`,startId);if(next===game)return;
    invalidateAudio();timer.cancel();game=next;selectedHolder=null;visual=null;audioRecovery=false;$('configuration').open=false;render();
    const token=++operation,id=game.round.id,durationMs=Core.sampleDuration(game.config);
    const result=await audio.play({restart:game.config.musicPosition==='restart'});
    if(token!==operation||game?.round?.id!==id||game.phase!=='starting')return;
    if(!result.started){failRound(result.error||'Music did not start. Retry or change the source; no catch was recorded.');return;}
    game=Core.markPlaying(game,id);message('Keep passing while the music plays. Its random stop time is hidden.');render();
    timer.start({roundId:id,durationMs,activeIds:game.activeIds,startPlayerId:game.round.startPlayerId,passIntervalMs:game.config.passIntervalMs,playStyle:game.config.playStyle});
  }
  $('start').addEventListener('click',startRound);$('next').addEventListener('click',startRound);
  function pauseRound(reason='Paused. Everyone should hold the parcel.'){
    if(game?.phase!=='playing')return;timer.pause();if(game.phase!=='playing')return;visual=timer.snapshot();invalidateAudio();game=Core.markPaused(game,game.round.id,true);message(reason);render();
  }
  async function resumeRound(){
    if(game?.phase!=='paused'||resumePending||confirmation||document.hidden)return;
    resumePending=true;const token=++operation,id=game.round.id;render();const result=await audio.play({restart:false});
    if(token!==operation||game?.round?.id!==id||game.phase!=='paused')return;
    resumePending=false;if(!result.started){failRound(result.error||'Music could not resume. The unfinished round was cancelled.');return;}
    game=Core.markPaused(game,id,false);message('Music resumed. Continue passing.');render();timer.resume();
  }
  $('pause').addEventListener('click',()=>{if(confirmation)return;if(game?.phase==='playing')pauseRound();else resumeRound();});
  $('stop').addEventListener('click',()=>{if(confirmation||resumePending||!['playing','paused'].includes(game?.phase))return;timer.stopManual();});
  $('confirmHolder').addEventListener('click',()=>{
    if(!game||game.phase!=='awaiting-holder'||confirmation||!selectedHolder)return;
    const forfeit=game.config.mode==='forfeit'&&game.config.forfeits?Core.FORFEITS[Math.floor(Math.random()*Core.FORFEITS.length)]:null;
    const next=Core.confirmHolder(game,game.round.id,selectedHolder,forfeit);if(next===game)return;game=next;message(game.phase==='finished'?'The last remaining player wins. Choose New game to play again.':'Result recorded. Choose Next round when everyone is ready.');render();(game.phase==='finished'?$('newGame'):$('next')).focus();
  });
  function ask(value,action,origin){
    if(confirmation)return;const wasPlaying=game?.phase==='playing';if(wasPlaying)pauseRound('Round paused while you decide.');
    if(game?.phase==='starting'){invalidateAudio();timer.cancel();game=Core.cancelRound(game,game.round.id);}
    if(resumePending)invalidateAudio();
    confirmation={action,origin,wasPlaying};$('confirmText').textContent=value;$('confirmation').hidden=false;render();$('confirmNo').focus();
  }
  function closeConfirmation(){const current=confirmation;confirmation=null;$('confirmation').hidden=true;render();return current;}
  $('confirmNo').addEventListener('click',()=>{const current=closeConfirmation();if(!current)return;message('Kept the current game.');if(!current.origin.hidden)current.origin.focus();if(current.wasPlaying)resumeRound();});
  $('confirmYes').addEventListener('click',()=>{const current=closeConfirmation();current?.action();});
  $('confirmation').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();$('confirmNo').click();}});
  function cancelCurrent(){if(!game?.round)return;invalidateAudio();timer.cancel();game=Core.cancelRound(game,game.round.id);visual=null;selectedHolder=null;message('Round cancelled. No catch or elimination recorded.');render();$('start').focus();}
  $('cancel').addEventListener('click',()=>{if(!game||confirmation||!['starting','playing','paused','awaiting-holder'].includes(game.phase))return;if(game.phase==='starting')cancelCurrent();else ask('Discard this unfinished round? No catch or elimination will be recorded.',cancelCurrent,$('cancel'));});
  $('finish').addEventListener('click',()=>{if(!game||confirmation||!['ready','resolved'].includes(game.phase)||!game.history.length)return;const finish=()=>{invalidateAudio();timer.cancel();game=Core.finishGame(game);message(game.endedEarly?'Game ended early. No champion is declared.':'Game finished. Catches are not a winner ranking.');render();$('newGame').focus();};if(game.config.mode==='elimination')ask('End elimination early? Results are kept, but no champion will be declared.',finish,$('finish'));else finish();});
  function resetGame(defaults=false){
    invalidateAudio();timer.cancel();sourceOperation++;game=null;visual=null;selectedHolder=null;audioRecovery=false;
    if(defaults){audio.dispose();$('roster').value='Player 1\nPlayer 2\nPlayer 3\nPlayer 4';for(const [id,value]of [['minTime',10],['maxTime',30],['mode','forfeit'],['playStyle','physical'],['passInterval',1000],['musicPosition','continue'],['musicSource','party']])$(id).value=value;$('forfeits').checked=true;$('audioInput').value='';preparedSource={kind:'builtin',track:'party',label:'Party beat'};sourceReady=false;prepareSource({kind:'builtin',track:'party'});applyVolume();}
    else{sourceReady=!!preparedSource;$('musicSource').value=preparedSource.kind==='upload'?'upload':preparedSource.track;}
    $('configuration').open=true;message(defaults?'Default game settings restored. Theme and volume preferences are kept.':'New game ready. Your setup and music are kept for reuse.');render();$('start').focus();
  }
  $('newGame').addEventListener('click',()=>{if(!game||confirmation)return;if(game.history.length||['starting','playing','paused','awaiting-holder'].includes(game.phase))ask('Clear the board, catches and round history? Your setup and music stay available.',()=>resetGame(false),$('newGame'));else resetGame(false);});
  $('restore').addEventListener('click',()=>ask('Restore default players and rules, clear results, and discard uploaded music?',()=>resetGame(true),$('restore')));
  for(const id of ['roster','mode','playStyle','minTime','maxTime','passInterval','musicPosition','forfeits'])$(id).addEventListener('input',()=>{if(!game)render();});
  function background(){
    if(game?.phase==='playing')pauseRound('Page left the foreground. Music is paused; hold the parcel and Resume when ready.');
    else if(game?.phase==='starting'){invalidateAudio();timer.cancel();game=Core.cancelRound(game,game.round.id);visual=null;message('Music preparation cancelled when the page was hidden. Start again when ready.');render();}
    else if(resumePending){invalidateAudio();message('Resume cancelled while the page was hidden. Resume when ready.');render();}
    if(previewing){invalidateAudio();render();}
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)background();});
  window.addEventListener('pagehide',event=>{background();audio.pause();if(!event.persisted)audio.dispose();});
  window.addEventListener('pageshow',event=>{if(event.persisted)render();});
  render();prepareSource({kind:'builtin',track:'party'});
})();


