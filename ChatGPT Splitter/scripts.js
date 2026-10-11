(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const core = SplitCore;
  const profiles = Object.fromEntries(['manual', 'chatgpt', 'claude', 'gemini', 'custom'].map(key => [key, 12000]));
  let bundle = null, generatedOptions = null, stale = false, version = 0;
  let worker = null, timeout, busy = false, visibleParts = 25, cursor = 0;
  let initialEdited = false, copied = new Set(), copyPending = null, manualPending = null;
  const cards = new Map();
  function status(text, error = false) {
    $('status').textContent = text;
    $('status').classList.toggle('error', error);
  }
  function options() {
    return { messageLimit: Number($('charLimit').value), locale: $('locale').value,
      smartSplit: $('smartSplit').checked, initialTemplate: $('template').value, finalTask: $('finalTask').value };
  }
  function invalidateCopy() {
    version++;
    copyPending = null;
    manualPending = null;
    $('manualCopy').hidden = true;
  }
  function stopWorker() {
    worker?.terminate(); worker = null; clearTimeout(timeout); busy = false;
    $('cancelGeneration').hidden = true; $('splitButton').disabled = false;
  }
  function markStale() {
    stopWorker(); invalidateCopy();
    if (bundle) { stale = true; $('stale').hidden = false; }
    $('confirmRegenerate').hidden = true;
    refreshWorkflow();
    status(bundle ? 'Settings or source changed. Generate again to update messages.' : 'Ready to split.');
  }
  function sourceCounters() {
    const count = core.countCodePoints($('prompt').value);
    $('charCount').textContent = `${count.toLocaleString()} characters · ~${Math.ceil(count / 4).toLocaleString()} estimated tokens`;
  }
  function message(index) {
    if (!bundle) return '';
    return index === 0 ? bundle.initialMessage : core.serializePart(bundle.parts[index - 1].payload,
      index, bundle.totalParts, generatedOptions.finalTask);
  }
  function allowed(index) {
    return bundle && !stale && !busy && index <= bundle.totalParts &&
      core.countCodePoints(message(index)) <= generatedOptions.messageLimit;
  }
  function refreshCard(index) {
    const card = cards.get(index);
    if (!card) return;
    const text = message(index), count = core.countCodePoints(text), remaining = generatedOptions.messageLimit - count;
    const payload = index ? core.countCodePoints(bundle.parts[index - 1].payload) : count;
    card.counters.textContent = `${index ? 'Payload: ' + payload.toLocaleString() + ' · ' : ''}Copied message: ${count.toLocaleString()} / ${generatedOptions.messageLimit.toLocaleString()} characters · ~${core.estimateTokens(text).toLocaleString()} estimated tokens · ${remaining < 0 ? -remaining + ' over limit' : remaining.toLocaleString() + ' remaining'}`;
    card.counters.classList.toggle('error', remaining < 0);
    card.container.classList.toggle('over-budget', remaining < 0);
    card.button.disabled = !allowed(index) || !!copyPending;
    card.flags.textContent = [copied.has(index) ? 'Copied' : '', (index ? bundle.parts[index - 1].edited : initialEdited) ? 'Edited' : ''].filter(Boolean).join(' · ');
  }
  function refreshWorkflow() {
    $('output').hidden = !bundle || !bundle.totalParts;
    if (!bundle || !bundle.totalParts) return;
    $('stale').hidden = !stale;
    const finished = cursor > bundle.totalParts;
    $('copyNext').textContent = finished ? 'Sequence copied' : cursor === 0 ? 'Copy initial instructions' : `Copy part ${cursor} / ${bundle.totalParts}`;
    $('copyNext').disabled = finished || !allowed(cursor) || !!copyPending;
    $('progress').textContent = `${copied.size} of ${bundle.totalParts + 1} messages marked copied · ${finished ? 'Sequence complete. Paste each message into your chosen app.' : 'Next in sequence: ' + (cursor ? 'part ' + cursor : 'initial instructions')}`;
    $('restart').disabled = busy;
    for (const index of cards.keys()) refreshCard(index);
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function edited(index, value) {
    if (busy) { stopWorker(); status('Generation cancelled because a message was edited. Generate again to replace output.'); }
    invalidateCopy(); copied.delete(index);
    cursor = Math.min(cursor, index);
    if (index === 0) { bundle.initialMessage = value; initialEdited = true; }
    else { bundle.parts[index - 1].payload = value; bundle.parts[index - 1].edited = true; }
    refreshWorkflow();
  }
  function createCard(index) {
    const container = element('article', 'message-card');
    container.dataset.message = index;
    const header = element('div', 'card-header');
    const title = element('h3', '', index ? `Part ${index} / ${bundle.totalParts}` : 'Initial instructions');
    const flags = element('span', 'card-flags');
    const button = element('button', 'copy-button', index ? 'Copy part ' + index : 'Copy initial instructions');
    button.onclick = () => copyMessage(index, false);
    header.append(title, flags, button);
    const editor = element('textarea', 'part-editor');
    editor.id = 'message-' + index; editor.setAttribute('aria-label', index ? 'Edit part ' + index + ' payload' : 'Edit initial instructions');
    editor.spellcheck = false; editor.value = index ? bundle.parts[index - 1].payload : bundle.initialMessage;
    editor.addEventListener('input', () => edited(index, editor.value));
    const counters = element('p', 'card-counters');
    container.append(header, editor, counters);
    cards.set(index, { container, editor, flags, button, counters });
    refreshCard(index);
    return container;
  }
  function renderCards() {
    cards.clear(); $('initialCard').replaceChildren(); $('splitParts').replaceChildren();
    if (!bundle || !bundle.totalParts) { refreshWorkflow(); return; }
    $('initialCard').append(createCard(0));
    addCards();
  }
  function addCards() {
    for (let index = 1; index <= Math.min(visibleParts, bundle.totalParts); index++) {
      if (!cards.has(index)) $('splitParts').append(createCard(index));
    }
    $('loadMore').hidden = visibleParts >= bundle.totalParts;
    $('summary').textContent = `${bundle.totalParts} ${bundle.totalParts === 1 ? 'part' : 'parts'} · ${bundle.sourceCodePoints.toLocaleString()} source characters`;
    refreshWorkflow();
  }
  function accept(data, request) {
    if (request !== version) return;
    stopWorker();
    if (data.error) { refreshWorkflow(); status(data.error, true); return; }
    bundle = data.bundle; generatedOptions = data.options; stale = false;
    initialEdited = false; copied = new Set(); cursor = 0; visibleParts = 25;
    renderCards();
    status(bundle.totalParts ? 'Messages ready. Copy the initial instructions, then each part.' : 'Source is empty. Enter text to generate parts.');
  }
  function generate() {
    const selectedOptions = options(), source = $('prompt').value;
    const validation = core.validateOptions(selectedOptions);
    if (!validation.valid) { status(validation.errors.join(' '), true); return; }
    if (new Blob([source]).size > 2 * 1024 * 1024) { status('Source input must be 2 MiB or smaller.', true); return; }
    stopWorker(); invalidateCopy();
    const request = version;
    busy = true; $('splitButton').disabled = true; $('cancelGeneration').hidden = false;
    if (bundle) stale = true;
    refreshWorkflow(); status('Generating messages…');
    function fallback() {
      worker?.terminate(); worker = null;
      if (source.length > 20000) {
        accept({ error: 'Worker unavailable. Direct-file fallback supports 20,000 characters. Serve this folder over HTTP for larger inputs.' }, request);
        return;
      }
      setTimeout(() => {
        if (request !== version) return;
        try { accept({ bundle: core.buildBundle(source, selectedOptions), options: selectedOptions }, request); }
        catch (error) { accept({ error: error.message }, request); }
      }, 0);
    }
    timeout = setTimeout(() => {
      if (request !== version) return;
      stopWorker(); invalidateCopy(); refreshWorkflow(); status('Generation exceeded ten seconds. Try smaller input.', true);
    }, 10000);
    try {
      worker = new Worker('split-worker.js');
      worker.onmessage = event => accept({ ...event.data, options: selectedOptions }, request);
      worker.onerror = event => { event.preventDefault(); if (request === version) fallback(); };
      worker.postMessage({ requestId: request, source, options: selectedOptions });
    } catch { fallback(); }
  }
  function requestGeneration() {
    if (busy) return;
    if (bundle && (initialEdited || bundle.parts.some(part => part.edited))) {
      $('confirmRegenerate').hidden = false; $('replaceEdits').focus();
    } else generate();
  }
  function reveal(index) {
    if (index > visibleParts) { visibleParts = Math.ceil(index / 25) * 25; addCards(); }
    cards.get(index)?.container.scrollIntoView({ block: 'nearest' });
  }
  function completed(token) {
    copied.add(token.index);
    if (token.sequential) cursor = token.index + 1;
    manualPending = null; $('manualCopy').hidden = true;
    refreshWorkflow();
    status(`${token.index ? 'Part ' + token.index : 'Initial instructions'} marked copied. Paste it into your chosen app.`);
  }
  async function copyMessage(index, sequential) {
    if (!allowed(index) || copyPending) return;
    reveal(index);
    const token = { version, index, sequential, text: message(index) };
    copyPending = token; manualPending = null; $('manualCopy').hidden = true;
    refreshWorkflow();
    try {
      await navigator.clipboard.writeText(token.text);
      if (token.version !== version || copyPending !== token) return;
      copyPending = null; completed(token);
    } catch {
      if (token.version !== version || copyPending !== token) return;
      copyPending = null; manualPending = token;
      $('manualCopy').hidden = false; $('fallbackText').value = token.text;
      $('fallbackText').focus(); $('fallbackText').select();
      refreshWorkflow(); status('Clipboard unavailable. Copy manually, then mark this message copied.');
    }
  }
  $('copyNext').onclick = () => copyMessage(cursor, true);
  $('markCopied').onclick = () => {
    if (!manualPending || manualPending.version !== version || !allowed(manualPending.index)) return;
    completed(manualPending);
  };
  $('dismissFallback').onclick = () => { manualPending = null; $('manualCopy').hidden = true; $('copyNext').focus(); };
  $('restart').onclick = () => {
    invalidateCopy(); copied.clear(); cursor = 0; refreshWorkflow(); status('Copy sequence restarted. Your edits are retained.');
  };
  $('loadMore').onclick = () => { visibleParts += 25; addCards(); };
  $('splitButton').onclick = requestGeneration;
  $('replaceEdits').onclick = () => { $('confirmRegenerate').hidden = true; generate(); };
  $('keepEdits').onclick = () => { $('confirmRegenerate').hidden = true; $('splitButton').focus(); status('Edits retained. Generate again when ready.'); };
  $('cancelGeneration').onclick = () => { stopWorker(); invalidateCopy(); refreshWorkflow(); status('Generation cancelled.'); };
  $('clear').onclick = () => {
    stopWorker(); invalidateCopy(); bundle = null; generatedOptions = null; stale = false;
    copied.clear(); cursor = 0; initialEdited = false;
    $('prompt').value = ''; $('template').value = core.DEFAULT_TEMPLATE; $('finalTask').value = core.DEFAULT_TASK;
    $('confirmRegenerate').hidden = true; renderCards(); sourceCounters(); status('Ready to split.'); $('prompt').focus();
  };
  $('prompt').addEventListener('input', () => { sourceCounters(); markStale(); });
  for (const id of ['charLimit', 'locale', 'smartSplit', 'template', 'finalTask']) $(id).addEventListener('input', markStale);
  $('charLimit').addEventListener('change', () => {
    const value = Number($('charLimit').value);
    if (Number.isInteger(value) && value >= 50 && value <= 1000000) {
      profiles[$('profile').value] = value;
      try { localStorage.setItem('splitter-profiles', JSON.stringify(profiles)); } catch {}
    }
  });
  $('profile').onchange = () => { $('charLimit').value = profiles[$('profile').value]; markStale(); };
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); requestGeneration(); }
    if (event.key === 'Escape' && !$('confirmRegenerate').hidden) $('keepEdits').click();
  });
  const themeMedia = matchMedia('(prefers-color-scheme: dark)');
  let themeValue = 'system';
  function theme() {
    document.documentElement.dataset.theme = themeValue === 'system' ? (themeMedia.matches ? 'dark' : 'light') : themeValue;
    for (const button of document.querySelectorAll('.theme-switch button')) button.setAttribute('aria-pressed', String(button.dataset.theme === themeValue));
    try { localStorage.setItem('splitter-theme', themeValue); } catch {}
  }
  try {
    const stored = JSON.parse(localStorage.getItem('splitter-profiles') || '{}');
    for (const key of Object.keys(profiles)) if (Number.isInteger(stored[key]) && stored[key] >= 50 && stored[key] <= 1000000) profiles[key] = stored[key];
    const savedTheme = localStorage.getItem('splitter-theme');
    if (['system', 'light', 'dark'].includes(savedTheme)) themeValue = savedTheme;
  } catch {}
  $('charLimit').value = profiles.manual;
  for (const button of document.querySelectorAll('.theme-switch button')) button.onclick = () => { themeValue = button.dataset.theme; theme(); };
  themeMedia.addEventListener('change', theme); theme();
  $('template').value = core.DEFAULT_TEMPLATE; $('finalTask').value = core.DEFAULT_TASK;
  sourceCounters();
})();
