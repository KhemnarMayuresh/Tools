(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const MAX_BYTES = 2 * 1024 * 1024;
  const imports = { old: 0, new: 0 };
  const names = { old: '', new: '' };
  const rawInputs = { old: null, new: null };
  let generation = 0, worker, timer, result;
  let patch = '', expanded = [], active = -1, limit = 600, windowStart = 0;

  function status(message, error = false) {
    $('status').textContent = message;
    $('status').classList.toggle('error', error);
  }
  function stop() {
    generation++;
    worker?.terminate();
    worker = null;
    clearTimeout(timer);
    $('cancel').hidden = true;
    $('compare').disabled = false;
  }
  function invalidate() {
    stop();
    result = null;
    patch = '';
    $('review').hidden = true;
    $('patch-fallback').hidden = true;
    status('Inputs changed. Compare to update results.');
  }
  function language() {
    return $('language').value === 'auto'
      ? Syntax.detectLanguage($('new').value || $('old').value, names.new || names.old)
      : $('language').value;
  }
  function contextLines() {
    return $('context').value === 'all' ? 3 : Number($('context').value);
  }
  function render() {
    if (!result) return;
    const rendered = DiffRenderer.renderDiff($('result'), result, {
      view: $('view').value, contextLines: contextLines(),
      full: $('context').value === 'all', expandedRanges: expanded,
      language: language(), limit, startRow: windowStart,
      onExpand: (start, end) => { expanded.push([start, end]); windowStart = start; render(); }
    });
    $('more').hidden = !rendered.hasMore;
    const count = rendered.hunks.length;
    $('previous').disabled = $('next').disabled = !count;
    $('position').textContent = count ? `${active < 0 ? '—' : active + 1} / ${count}` : 'No changes';
    $('summary').textContent = `+${result.additions} additions · −${result.deletions} deletions`;
  }
  function finish(data, id) {
    if (id !== generation) return;
    stop();
    if (data.error) { status(data.error, true); return; }
    result = data.result;
    patch = data.patch;
    expanded = [];
    active = -1;
    limit = 600;
    windowStart = 0;
    $('review').hidden = false;
    render();
    status(result.additions || result.deletions ? 'Comparison ready.' :
      patch ? 'Texts match for display. Patch includes ignored whitespace or line-ending changes.' :
      $('whitespace').checked ? 'Texts match with spaces and tabs ignored.' : 'Texts are identical.');
  }
  function compare() {
    stop();
    result = null;
    patch = '';
    $('review').hidden = true;
    $('patch-fallback').hidden = true;
    const oldText = rawInputs.old ?? $('old').value, newText = rawInputs.new ?? $('new').value;
    if (new Blob([oldText]).size > MAX_BYTES || new Blob([newText]).size > MAX_BYTES) {
      status('Each input must be 2 MiB or smaller.', true); return;
    }
    const id = generation;
    const options = { ignoreWhitespace: $('whitespace').checked, oldName: names.old, newName: names.new };
    status('Comparing…');
    $('compare').disabled = true;
    $('cancel').hidden = false;
    function fallback() {
      worker?.terminate();
      worker = null;
      if (oldText.length + newText.length > 40000) {
        stop();
        status('Worker unavailable. Direct-file fallback supports 40,000 characters total. Serve this folder over HTTP for larger comparisons.', true);
        return;
      }
      setTimeout(() => {
        if (id !== generation) return;
        options.workBudget = 20000;
        try {
          finish({ result: DiffCore.compareLines(oldText, newText, options),
            patch: PatchExport.createPatch(oldText, newText, options) }, id);
        } catch (error) { finish({ error: error.message }, id); }
      }, 0);
    }
    timer = setTimeout(() => { stop(); status('Comparison exceeded five seconds. Try smaller inputs.', true); }, 5000);
    try {
      worker = new Worker('diff-worker.js');
      worker.onmessage = event => finish(event.data, id);
      worker.onerror = event => { event.preventDefault(); if (id === generation) fallback(); };
      worker.postMessage({ requestId: id, oldText, newText, options });
    } catch { fallback(); }
  }
  async function importFile(side, file) {
    if (!file) return;
    const request = ++imports[side];
    if (file.size > MAX_BYTES) { status('File exceeds the 2 MiB limit.', true); return; }
    invalidate();
    status('Reading file…');
    try {
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buffer);
      if (text.includes('\0')) throw new Error('Binary files are unsupported. Choose UTF-8 text.');
      if (request !== imports[side]) return;
      invalidate();
      $(side).value = text;
      rawInputs[side] = text;
      names[side] = file.name;
      $(side + '-info').textContent = `${file.name} · ${file.size.toLocaleString()} bytes`;
      status('File loaded. Ready to compare.');
    } catch (error) {
      if (request === imports[side]) status(error.message || 'Unable to read file.', true);
    }
  }
  for (const side of ['old', 'new']) {
    $(side).addEventListener('input', () => {
      imports[side]++;
      names[side] = '';
      rawInputs[side] = null;
      $(side + '-info').textContent = 'Pasted text · up to 2 MiB';
      invalidate();
    });
    $(side + '-file').onchange = event => {
      importFile(side, event.target.files[0]);
      event.target.value = '';
    };
    const panel = $(side).closest('.input-panel');
    panel.ondragover = event => event.preventDefault();
    panel.ondrop = event => { event.preventDefault(); importFile(side, event.dataTransfer.files[0]); };
  }
  $('compare').onclick = compare;
  $('cancel').onclick = () => { stop(); status('Comparison cancelled.'); };
  $('clear').onclick = () => {
    invalidate();
    for (const side of ['old', 'new']) {
      imports[side]++;
      $(side).value = '';
      names[side] = '';
      $(side + '-info').textContent = 'Paste text or drop a file · up to 2 MiB';
    }
    status('Ready to compare.');
    $('old').focus();
  };
  $('whitespace').onchange = invalidate;
  for (const id of ['view', 'language']) $(id).onchange = () => { render(); if (active >= 0) navigate(0); };
  $('context').onchange = () => { expanded = []; active = -1; windowStart = 0; limit = 600; render(); };
  $('more').onclick = () => { limit += 600; render(); };
  function navigate(delta) {
    if (!result) return;
    const hunks = DiffCore.buildHunks(result.rows, contextLines());
    if (!hunks.length) return;
    active = active < 0 ? (delta > 0 ? 0 : hunks.length - 1) : (active + delta + hunks.length) % hunks.length;
    const hunk = hunks[active];
    expanded.push([hunk.startRow, hunk.endRow]);
    windowStart = hunk.startRow;
    limit = 600;
    render();
    const target = $('result').querySelector(`[data-row="${hunk.startRow}"]`) || $('result').querySelector(`[data-hunk="${active}"]`);
    $('result').querySelectorAll('.active-change').forEach(element => element.classList.remove('active-change'));
    target?.classList.add('active-change');
    target?.scrollIntoView({ block: 'nearest' });
  }
  $('previous').onclick = () => navigate(-1);
  $('next').onclick = () => navigate(1);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); compare(); }
    if (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault(); navigate(event.key === 'ArrowUp' ? -1 : 1);
    }
  });
  $('copy').onclick = async () => {
    try { await navigator.clipboard.writeText(patch); status(patch ? 'Patch copied.' : 'No changes to export.'); }
    catch {
      $('patch-fallback').hidden = false;
      $('patch-fallback').value = patch;
      $('patch-fallback').focus();
      $('patch-fallback').select();
      status('Clipboard unavailable. Copy the selected patch text.');
    }
  };
  $('download').onclick = () => {
    const url = URL.createObjectURL(new Blob([patch], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'comparison.diff'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const media = matchMedia('(prefers-color-scheme: dark)');
  let themeValue = 'system';
  try {
    const saved = localStorage.getItem('text-compare-theme');
    if (['system', 'light', 'dark'].includes(saved)) themeValue = saved;
  } catch {}
  function theme() {
    document.documentElement.dataset.theme = themeValue === 'system' ? (media.matches ? 'dark' : 'light') : themeValue;
    for (const button of document.querySelectorAll('.theme-switch button')) button.setAttribute('aria-pressed', String(button.dataset.theme === themeValue));
    try { localStorage.setItem('text-compare-theme', themeValue); } catch {}
  }
  for (const button of document.querySelectorAll('.theme-switch button')) button.onclick = () => { themeValue = button.dataset.theme; theme(); };
  media.addEventListener('change', theme);
  theme();
  if (matchMedia('(max-width:700px)').matches) $('view').value = 'unified';
})();
