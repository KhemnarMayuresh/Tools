(function () {
  'use strict';
  const c = DrawingCore;
  const $ = id => document.getElementById(id);
  const audio = createDrawingAudio();
  const everydayCategoryId = 'category-everyday';
  const everydayStorageKey = 'drawing-everyday-words';
  let prompts = [...data];
  let everydayLoadMessage = '';
  try {
    const stored = localStorage.getItem(everydayStorageKey);
    if (stored !== null) {
      const result = c.normalizeEverydayWords(JSON.parse(stored));
      if (result.errors.length) throw new Error('Invalid saved word list');
      prompts = [...result.prompts, ...prompts.filter(p => p.categoryId !== everydayCategoryId)];
    }
  } catch {
    everydayLoadMessage = 'Using the default words. Your saved list could not be loaded.';
  }
  let roundSequence = 0;
  let pendingReset = null;
  let lastSecond = null;
  let state = c.createGame(
    [{id: 'player-1', name: 'Player 1'}, {id: 'player-2', name: 'Player 2'}],
    prompts.filter(p => defaultSelectedCategories.includes(p.categoryName)).map(p => p.id)
  );

  const busy = () => ['preparing', 'drawing'].includes(state.phase);
  const finished = () => state.phase === 'finished';
  const message = text => {
    $('status').textContent = text;
    $('setupStatus').textContent = $('configuration').open ? text : '';
  };
  const initials = name => Array.from(name.trim()).slice(0, 2).join('').toUpperCase();
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function dispatch(event) {
    state = c.transition(state, event, prompts);
    render();
  }

  const timer = DrawingTimer.createTimerController({
    now: () => performance.now(),
    schedule: (fn, ms) => setTimeout(fn, ms),
    cancel: clearTimeout,
    onStage(id, stage) {
      if (state.active?.roundId !== id) return;
      if (stage === 'go') dispatch({type: 'BEGIN_DRAWING', roundId: id});
      $('stage').textContent = stage === 'go' ? 'Go — draw!' : stage === 'set' ? 'Set' : 'Ready';
      $('timerCaption').textContent = stage === 'go' ? 'seconds left' : 'get ready to draw';
      if (stage === 'ready') {
        $('timer').textContent = state.active.durationSeconds;
        audio.unlock().then(() => {
          if (state.phase === 'preparing' && state.active?.roundId === id &&
              $('stage').textContent === 'Ready' && !document.hidden) audio.cue('ready');
        });
      } else if (!document.hidden) audio.cue(stage);
    },
    onTick(id, ms, fraction) {
      if (state.active?.roundId !== id || state.phase !== 'drawing') return;
      const seconds = Math.ceil(ms / 1000);
      $('timer').textContent = seconds;
      $('timer').style.background = `conic-gradient(var(--panel) ${(1 - fraction) * 360}deg, var(--surface) 0deg)`;
      document.querySelector('.play').classList.toggle('urgent', seconds <= 5 && seconds > 0);
      $('urgency').textContent = seconds <= 5 && seconds > 0 ? `${seconds} seconds remaining` : '';
      if (lastSecond !== null && seconds === lastSecond - 1 && seconds >= 1 && seconds <= 5 && !document.hidden) audio.cue('tick');
      lastSecond = seconds;
    },
    onExpire(id) {
      if (state.phase !== 'drawing' || state.active?.roundId !== id) return;
      audio.cue('end');
      dispatch({type: 'EXPIRE', roundId: id});
      message('Pencils down! Pick a winner below, or choose No winner.');
    }
  });

  function stop() {
    timer.cancel();
    audio.cancel();
    lastSecond = null;
    $('timer').textContent = '—';
    $('timer').style.background = '';
    $('urgency').textContent = '';
    document.querySelector('.play').classList.remove('urgent');
  }
  function image(parent, prompt) {
    if (!prompt?.imageUrl) {
      parent.textContent = 'No reference image for this prompt. Let your imagination lead.';
      return;
    }
    const img = element('img');
    img.alt = `Reference: ${prompt.name}`;
    img.src = prompt.imageUrl;
    img.onerror = () => {
      if (parent.contains(img)) parent.replaceChildren(document.createTextNode('Reference image unavailable. You can still score this round.'));
    };
    parent.append(img);
  }

  function render() {
    const record = state.history.at(-1);
    const currentPrompt = prompts.find(p => p.id === state.active?.promptId);
    // A saved result keeps the label revealed for that round, even if the word is edited.
    const active = state.phase === 'review' && record ? {...currentPrompt, id: record.promptId, name: record.promptName, categoryName: record.categoryName} : currentPrompt;
    const shown = ['drawing', 'review'].includes(state.phase);
    $('roundContent').hidden = finished();
    $('results').hidden = !finished();
    $('scoreboard').hidden = finished();
    $('prompt').textContent = shown ? active?.name || '' : '';
    $('promptPlaceholder').hidden = shown;
    $('reference').replaceChildren();
    const showReference = shown && (state.phase === 'review' || $('imageMode').value === 'during');
    if (showReference) image($('reference'), active);
    $('referenceEmpty').hidden = showReference;
    $('referenceHint').textContent = state.phase === 'preparing' ? 'Eyes on the timer. Your prompt is coming.' :
      state.phase === 'drawing' ? 'Draw your version. The reference appears after the round.' : 'The prompt appears at Go. No peeking!';
    if (!busy()) {
      $('stage').textContent = state.phase === 'review' ? 'Round review' : state.phase === 'exhausted' ? 'Choose more prompts' : 'Ready to play';
      $('urgency').textContent = '';
      document.querySelector('.play').classList.remove('urgent');
      $('timerCaption').textContent = state.phase === 'review' ? (record?.outcome === 'completed' ? 'time is up' : 'round skipped') : 'seconds per round';
      if (['setup', 'exhausted'].includes(state.phase)) {
        $('timer').textContent = c.validateDuration(Number($('duration').value)).valid ? $('duration').value : '30';
        $('timer').style.background = '';
      }
    }
    const attempt = state.phase === 'review' ? state.history.length : state.history.length + 1;
    $('roundLabel').textContent = `ROUND ${String(attempt).padStart(2, '0')}`;
    $('players').disabled = state.rosterLocked;
    $('rosterHint').textContent = state.rosterLocked ? 'Players are locked. New Game lets you change the roster.' : '1–12 unique names. Up to 40 characters each.';
    for (const id of ['duration', 'imageMode', 'search', 'selectAll', 'selectNone', 'customCategory', 'customWords', 'addCustom', 'editEveryday', 'everydayWords', 'saveEveryday', 'cancelEveryday', 'restoreEveryday', 'restoreEverydayYes', 'restoreEverydayCancel']) $(id).disabled = busy() || finished();
    $('reset').disabled = finished();
    $('skip').disabled = state.phase !== 'drawing';
    $('start').disabled = busy() || finished() || (state.phase === 'review' && !record?.resolved);
    $('start').replaceChildren(document.createTextNode(state.history.length ? 'Next round' : 'Start round'));
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'icon');
    arrow.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#icon-arrow');
    arrow.append(use);
    $('start').append(arrow);
    $('playHint').textContent = state.phase === 'preparing' ? 'Ready… Set… then everyone draws.' : state.phase === 'drawing' ? 'Draw on your paper. Skip if you get stuck.' : state.phase === 'review' ? (record?.resolved ? 'Play another round, or finish the game.' : 'Choose a result to unlock the next round.') : 'Everyone draws the same prompt.';
    $('finish').disabled = !state.history.length || busy() || finished() || (state.phase === 'review' && !record?.resolved);
    $('finishHint').textContent = busy() ? 'Finish game is available after this round.' : state.phase === 'review' && !record?.resolved ? 'Choose a winner or No winner before finishing.' : state.history.length ? 'Keep drawing, or finish to reveal the final standings.' : 'One point for each round won. Play your first round to get started.';
    $('setupSummary').textContent = `${state.players.length} players · ${$('duration').value || '30'} seconds · ${state.selectedPromptIds.length} prompts`;
    renderScores();
    renderHistory();
    renderReview(record);
    renderCategories();
    $('everydayCount').textContent = prompts.filter(p => p.categoryId === everydayCategoryId).length + ' words';
    if (finished()) renderResults();
  }

  function renderScores() {
    $('scores').replaceChildren(...c.getScores(state).map(player => {
      const card = element('div', 'score-card');
      card.dataset.player = player.id;
      const info = element('div', 'player-info');
      const avatar = element('span', 'avatar', initials(player.name));
      avatar.setAttribute('aria-hidden', 'true');
      info.append(avatar, element('span', 'player-name', player.name));
      card.append(info, element('strong', 'score-number', String(player.points)));
      card.setAttribute('aria-label', `${player.name}: ${player.points} points`);
      return card;
    }));
  }
  function renderHistory() {
    $('historyEmpty').hidden = state.history.length > 0;
    $('historyCount').textContent = `${state.history.length} ${state.history.length === 1 ? 'round' : 'rounds'}`;
    $('history').replaceChildren(...state.history.map(record => {
      const row = element('li');
      const detail = element('div', 'history-main');
      detail.append(element('strong', '', record.promptName), element('small', '', `${record.categoryName} · ${record.durationSeconds}s · ${record.outcome}`));
      const result = !record.resolved ? 'Awaiting result' : record.winnerName ? `${record.winnerName} +1` : record.outcome === 'skipped' ? 'Skipped' : record.outcome === 'aborted' ? 'Cancelled' : 'No winner';
      row.append(element('span', 'history-number', String(record.attempt).padStart(2, '0')), detail, element('span', 'history-result', result));
      return row;
    }));
  }
  function renderReview(record) {
    $('review').replaceChildren();
    $('review').hidden = state.phase !== 'review';
    if (state.phase !== 'review') return;
    if (record?.outcome !== 'completed') {
      $('review').append(element('p', '', 'Prompt skipped — no points awarded. Ready for another?'));
      return;
    }
    $('review').append(element('p', '', record.resolved ? 'Result saved. You can change it before the next round.' : 'Who wins this round? Choose one player for +1 point.'));
    for (const player of [...state.players, {id: null, name: 'No winner'}]) {
      const button = element('button', '', player.name);
      button.dataset.winner = player.id || 'none';
      button.setAttribute('aria-pressed', String(record.resolved && record.winnerId === player.id));
      button.onclick = () => {
        dispatch({type: 'RESOLVE', roundId: state.active.roundId, winnerId: player.id});
        message(player.id ? `${player.name} wins this round. +1 point!` : 'No winner this round. Ready for the next one?');
      };
      $('review').append(button);
    }
  }

  function renderResults() {
    const rankings = c.getRankings(state);
    const leader = rankings[0];
    const sharedFirst = rankings.filter(p => p.rank === 1).length > 1;
    $('resultsTitle').textContent = leader.points === 0 ? 'Every sketch was a win!' : sharedFirst ? "It's a draw!" : `${leader.name} takes the win!`;
    const scoredRounds = state.history.filter(r => r.outcome === 'completed' && r.resolved).length;
    $('resultsSummary').textContent = `${state.players.length} ${state.players.length === 1 ? 'player' : 'players'} · ${scoredRounds} ${scoredRounds === 1 ? 'completed round' : 'completed rounds'} · plenty of creativity`;
    $('tieNote').textContent = rankings.some(p => p.tied) ? 'Equal scores share a rank. Tied players appear in roster order.' : 'One point per round won. Every sketch counts as a good time.';
    $('podium').replaceChildren(...rankings.slice(0, 3).map((player, index) => {
      const place = element('div', 'podium-place');
      place.dataset.place = index + 1;
      place.dataset.player = player.id;
      const label = `#${player.rank}`;
      const block = element('div', 'podium-block', label);
      block.append(element('small', '', player.tied ? 'JOINT PLACE' : index === 0 ? 'WINNER' : 'WELL PLAYED'));
      place.append(element('div', 'podium-avatar', initials(player.name)), element('p', 'podium-name', player.name), element('p', 'podium-points', `${player.points} ${player.points === 1 ? 'point' : 'points'}`), block);
      return place;
    }));
    $('remainingRanks').replaceChildren(...rankings.slice(3).map(player => {
      const row = element('div', 'rank-row');
      row.dataset.player = player.id;
      row.append(element('span', 'rank', `#${player.rank}`), element('span', 'avatar', initials(player.name)), element('span', 'player-name', player.name + (player.tied ? ' (tied)' : '')), element('span', 'rank-points', `${player.points} pts`));
      return row;
    }));
    $('confetti').replaceChildren(...Array.from({length: 24}, (_, index) => {
      const piece = element('span', 'confetti-piece');
      piece.style.left = `${(index * 37) % 100}%`;
      piece.style.backgroundColor = ['#9c8df5', '#e6b94d', '#79c9bb', '#e88fab'][index % 4];
      piece.style.animationDelay = `${(index % 7) * .12}s`;
      return piece;
    }));
  }

  function renderCategories() {
    const query = $('search').value.trim().normalize('NFC').toLowerCase();
    const selected = new Set(state.selectedPromptIds);
    const groups = new Map();
    for (const prompt of prompts) {
      if (!groups.has(prompt.categoryId)) groups.set(prompt.categoryId, []);
      groups.get(prompt.categoryId).push(prompt);
    }
    const host = $('categories');
    const open = new Set([...host.querySelectorAll('details[open]')].map(node => node.dataset.category));
    host.replaceChildren();
    let matches = 0;
    for (const [id, items] of groups) {
      const visible = items.filter(p => !query || p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query));
      if (!visible.length) continue;
      matches += visible.length;
      const details = element('details');
      details.dataset.category = id;
      details.open = !!query || open.has(id);
      const summary = element('summary', '', `${items[0].categoryName} · ${items.filter(p => selected.has(p.id)).length}/${items.length}`);
      const toggle = element('input');
      toggle.type = 'checkbox';
      toggle.setAttribute('aria-label', `Select category ${items[0].categoryName}`);
      toggle.checked = items.every(p => selected.has(p.id));
      toggle.indeterminate = !toggle.checked && items.some(p => selected.has(p.id));
      toggle.disabled = busy() || finished();
      toggle.onchange = () => {
        items.forEach(p => toggle.checked ? selected.add(p.id) : selected.delete(p.id));
        dispatch({type: 'UPDATE_SELECTION', promptIds: [...selected]});
      };
      const categoryLabel = element('label', 'category-toggle');
      categoryLabel.append(toggle, document.createTextNode('Select category'));
      details.append(summary, categoryLabel);
      const list = element('div', 'category-items');
      for (const prompt of visible) {
        const label = element('label', 'word' + (query ? ' match' : ''));
        const input = element('input');
        input.type = 'checkbox';
        input.checked = selected.has(prompt.id);
        input.disabled = busy() || finished();
        input.dataset.prompt = prompt.id;
        input.onchange = () => {
          input.checked ? selected.add(prompt.id) : selected.delete(prompt.id);
          dispatch({type: 'UPDATE_SELECTION', promptIds: [...selected]});
        };
        label.append(input);
        if (prompt.imageUrl) {
          const img = element('img');
          img.loading = 'lazy';
          img.alt = '';
          img.src = prompt.imageUrl;
          img.onerror = () => img.remove();
          label.append(img);
        }
        label.append(document.createTextNode(prompt.name));
        list.append(label);
      }
      details.append(list);
      host.append(details);
    }
    if (!matches) host.textContent = 'No matches. Clear the search to see all prompts.';
    $('totals').textContent = `${selected.size} selected · ${c.getEligiblePrompts(state, prompts).length} unused · ${prompts.length} total`;
  }

  $('start').onclick = () => {
    if (busy() || finished()) return;
    const duration = Number($('duration').value);
    const check = c.validateDuration(duration);
    if (!check.valid) {
      $('configuration').open = true;
      $('duration').focus();
      return message(check.error);
    }
    if (!state.rosterLocked) {
      const names = $('players').value.split('\n').map(name => name.trim().normalize('NFC'));
      const valid = c.validatePlayers(names);
      if (!valid.valid) {
        $('configuration').open = true;
        $('players').focus();
        return message(valid.errors.join(' '));
      }
      state = {...state, players: names.map((name, index) => ({id: `player-${index + 1}`, name}))};
    }
    const eligible = c.getEligiblePrompts(state, prompts);
    const prompt = eligible[Math.floor(Math.random() * eligible.length)];
    const id = `round-${++roundSequence}`;
    dispatch({type: 'START', roundId: id, promptId: prompt?.id || null, durationSeconds: duration});
    if (state.phase === 'exhausted') {
      $('configuration').open = true;
      return message('Select unused prompts or Reset word pool in Game settings.');
    }
    if (state.phase !== 'preparing') return;
    $('configuration').open = false;
    stop();
    message('Wait for Go, then everyone draws the same prompt.');
    timer.prepare(id, duration);
  };
  $('skip').onclick = () => {
    if (state.phase !== 'drawing') return;
    const id = state.active.roundId;
    stop();
    dispatch({type: 'SKIP', roundId: id});
    message('Skipped. No points awarded. Start the next round when ready.');
  };
  $('finish').onclick = () => {
    const next = c.transition(state, {type: 'FINISH'}, prompts);
    if (next === state) return;
    stop();
    state = next;
    $('configuration').open = false;
    render();
    $('results').focus();
  };
  $('playAgain').onclick = () => {
    stop();
    dispatch({type: 'NEW_GAME'});
    $('configuration').open = false;
    message('A fresh game, a fresh page. Ready when you are.');
    $('start').focus();
  };

  function requestReset(type) {
    pendingReset = type;
    $('confirmText').textContent = type === 'NEW_GAME' ? 'Start a new game? Scores and history will clear, and any active round will stop.' : 'Refill the word pool? Any active round will stop. Scores and history stay.';
    $('confirmation').showModal();
  }
  $('reset').onclick = () => requestReset('RESET_POOL');
  $('newGame').onclick = () => requestReset('NEW_GAME');
  $('confirmNo').onclick = () => { $('confirmation').close(); pendingReset = null; };
  $('confirmation').onclose = () => { pendingReset = null; };
  $('confirmYes').onclick = () => {
    const type = pendingReset;
    if (!type) return;
    stop();
    dispatch({type});
    $('confirmation').close();
    pendingReset = null;
    message(type === 'NEW_GAME' ? 'New game ready.' : 'Word pool reset.');
  };
  $('search').oninput = renderCategories;
  $('selectAll').onclick = () => dispatch({type: 'UPDATE_SELECTION', promptIds: prompts.map(p => p.id)});
  $('selectNone').onclick = () => dispatch({type: 'UPDATE_SELECTION', promptIds: []});
  $('addCustom').onclick = () => {
    if (busy() || finished()) return;
    if ($('customCategory').value.trim().normalize('NFC').toLowerCase() === 'everyday things') {
      const result = c.normalizeEverydayWords([...prompts.filter(p => p.categoryId === everydayCategoryId).map(p => p.name), ...$('customWords').value.split('\n')]);
      if (result.errors.length) return message(result.errors.join(' '));
      applyEverydayWords(result.prompts);
      $('customWords').value = '';
      return;
    }
    const result = c.normalizeCustomPrompts($('customCategory').value, $('customWords').value.split('\n'), prompts);
    if (result.errors.length) return message(result.errors.join(' '));
    if (!result.prompts.length) return message('No new prompts. Check for duplicates or blank lines.');
    prompts.push(...result.prompts);
    dispatch({type: 'UPDATE_SELECTION', promptIds: [...state.selectedPromptIds, ...result.prompts.map(p => p.id)]});
    $('customWords').value = '';
    message(`${result.prompts.length} custom prompts added.`);
  };
  function applyEverydayWords(replacement, restore = false) {
    if (busy() || finished()) return;
    const previousIds = new Set(prompts.filter(p => p.categoryId === everydayCategoryId).map(p => p.id));
    const nextIds = new Set(replacement.map(p => p.id));
    const selection = state.selectedPromptIds.filter(id => !previousIds.has(id) || nextIds.has(id));
    for (const prompt of replacement) if (!previousIds.has(prompt.id)) selection.push(prompt.id);
    prompts = [...replacement, ...prompts.filter(p => p.categoryId !== everydayCategoryId)];
    // Used IDs are retained so removal/re-addition does not recycle a word mid-game.
    state = c.transition(state, {type: 'UPDATE_SELECTION', promptIds: selection}, prompts);
    let saved = true;
    try {
      if (restore) localStorage.removeItem(everydayStorageKey);
      else localStorage.setItem(everydayStorageKey, JSON.stringify(replacement.map(p => p.name)));
    } catch { saved = false; }
    $('everydayWords').value = replacement.map(p => p.name).join('\n');
    $('everydayRestoreConfirm').hidden = true;
    render();
    const feedback = replacement.length + ' words saved.' + (saved ? ' Your list will be available next time. Existing selections are kept; new words are selected.' : ' Saved for this game only; browser storage is unavailable.');
    $('everydayFeedback').textContent = feedback;
    $('setupStatus').textContent = '';
  }
  $('editEveryday').onclick = () => {
    if (busy() || finished()) return;
    $('everydayWords').value = prompts.filter(p => p.categoryId === everydayCategoryId).map(p => p.name).join('\n');
    $('everydayEditor').hidden = false;
    $('everydayRestoreConfirm').hidden = true;
    $('everydayFeedback').textContent = '';
    $('everydayWords').focus();
  };
  $('saveEveryday').onclick = () => {
    if (busy() || finished()) return;
    const result = c.normalizeEverydayWords($('everydayWords').value.split('\n'));
    if (result.errors.length) {
      $('everydayFeedback').textContent = result.errors.join(' ');
      $('everydayWords').focus();
      return;
    }
    applyEverydayWords(result.prompts);
  };
  $('cancelEveryday').onclick = () => {
    if (busy() || finished()) return;
    $('everydayEditor').hidden = true;
    $('everydayRestoreConfirm').hidden = true;
    $('everydayFeedback').textContent = '';
    $('editEveryday').focus();
  };
  $('restoreEveryday').onclick = () => {
    if (busy() || finished()) return;
    $('everydayRestoreConfirm').hidden = false;
    $('restoreEverydayCancel').focus();
  };
  $('restoreEverydayCancel').onclick = () => {
    $('everydayRestoreConfirm').hidden = true;
    $('restoreEveryday').focus();
  };
  $('restoreEverydayYes').onclick = () => {
    if (busy() || finished()) return;
    applyEverydayWords(c.normalizeEverydayWords(defaultEverydayWords).prompts, true);
    $('saveEveryday').focus();
  };
  $('everydayFeedback').textContent = everydayLoadMessage;
    $('imageMode').onchange = render;
  $('duration').oninput = render;
  $('players').oninput = () => {
    if (state.rosterLocked) return;
    const names = $('players').value.split('\n').map(name => name.trim().normalize('NFC'));
    if (c.validatePlayers(names).valid) {
      state = {...state, players: names.map((name, index) => ({id: `player-${index + 1}`, name}))};
      render();
    }
  };

  function preference(key, value) {
    try { localStorage.setItem('drawing-' + key, value); } catch { /* Preferences are optional. */ }
  }
  function readPreference(key, fallback) {
    try { return localStorage.getItem('drawing-' + key) || fallback; } catch { return fallback; }
  }
  let themeValue = readPreference('theme', 'system');
  if (!['system', 'light', 'dark'].includes(themeValue)) themeValue = 'system';
  function applyTheme() {
    document.documentElement.dataset.theme = themeValue;
    for (const button of document.querySelectorAll('.theme-switch button')) button.setAttribute('aria-pressed', String(button.dataset.theme === themeValue));
    preference('theme', themeValue);
  }
  for (const button of document.querySelectorAll('.theme-switch button')) button.onclick = () => { themeValue = button.dataset.theme; applyTheme(); };
  applyTheme();
  $('sound').checked = readPreference('sound', 'on') === 'on';
  $('volume').value = readPreference('volume', '.25');
  function sound() {
    audio.configure($('sound').checked, $('volume').value);
    preference('sound', $('sound').checked ? 'on' : 'off');
    preference('volume', $('volume').value);
  }
  $('sound').onchange = () => { sound(); audio.unlock(); };
  $('volume').oninput = sound;
  sound();
  document.addEventListener('visibilitychange', () => { lastSecond = null; if (document.hidden) audio.cancel(); });
  render();
})();
