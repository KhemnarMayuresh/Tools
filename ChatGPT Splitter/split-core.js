(function (root) {
  'use strict';
  const MAX_BYTES = 2 * 1024 * 1024;
  const MAX_PARTS = 1000;
  const DEFAULT_TEMPLATE = 'I will send you {totalParts} parts of one text. Acknowledge each part and wait until ALL PARTS SENT before processing the complete content.';
  const DEFAULT_TASK = 'Please process the complete content according to my original request.';
  function countCodePoints(text) { let count = 0; for (const character of text) count++; return count; }
  function estimateTokens(text) { return Math.ceil(countCodePoints(text) / 4); }
  function serializeInitial(template, totalParts) { return template.replaceAll('{totalParts}', String(totalParts)); }
  function serializePart(payload, partNumber, totalParts, finalTask) {
    let message = `[START PART ${partNumber}/${totalParts}]\n${payload}\n[END PART ${partNumber}/${totalParts}]`;
    if (partNumber === totalParts) message += '\n\nALL PARTS SENT' + (finalTask ? '\n' + finalTask : '');
    return message;
  }
  function validateOptions(options) {
    const errors = [];
    if (!Number.isInteger(options.messageLimit) || options.messageLimit < 50 || options.messageLimit > 1000000)
      errors.push('Message limit must be an integer from 50 to 1,000,000 characters.');
    if (typeof options.initialTemplate !== 'string' || typeof options.finalTask !== 'string')
      errors.push('Initial instructions and final task must be text.');
    else if (countCodePoints(serializeInitial(options.initialTemplate, 1)) > options.messageLimit)
      errors.push('Initial instructions exceed the message limit. Shorten them or increase the limit.');
    return { valid: errors.length === 0, errors };
  }
  function buildBundle(source, givenOptions) {
    const options = { messageLimit: 12000, locale: 'en', smartSplit: true,
      initialTemplate: DEFAULT_TEMPLATE, finalTask: DEFAULT_TASK, ...givenOptions };
    const validation = validateOptions(options);
    if (!validation.valid) throw new Error(validation.errors.join(' '));
    if (new TextEncoder().encode(source).length > MAX_BYTES) throw new Error('Source input must be 2 MiB or smaller.');
    if (!source.length) return { initialMessage: '', parts: [], messages: [], totalParts: 0, sourceCodePoints: 0 };
    if (typeof Intl.Segmenter !== 'function') throw new Error('This browser needs Intl.Segmenter support to split Unicode safely.');
    let graphemes, sentences;
    try { graphemes = new Intl.Segmenter(options.locale, { granularity: 'grapheme' });
      if (options.smartSplit) sentences = new Intl.Segmenter(options.locale, { granularity: 'sentence' }); }
    catch { throw new Error('Choose a valid locale for sentence and Unicode segmentation.'); }
    // Typed arrays keep segmentation memory bounded even for many short graphemes.
    const offsets = new Uint32Array(source.length + 1);
    const counts = new Uint32Array(source.length + 1);
    let length = 0;
    for (const item of graphemes.segment(source)) {
      length++;
      offsets[length] = item.index + item.segment.length;
      counts[length] = counts[length - 1] + countCodePoints(item.segment);
    }
    const paragraphEnds = new Set(), sentenceEnds = new Set(), whitespaceEnds = new Set();
    if (options.smartSplit) {
      for (const match of source.matchAll(/\n[\t ]*\n(?:[\t ]*\n)*/g)) paragraphEnds.add(match.index + match[0].length);
      for (const item of sentences.segment(source)) sentenceEnds.add(item.index + item.segment.length);
      for (let index = 1; index <= length; index++) {
        const text = source.slice(offsets[index - 1], offsets[index]);
        if (/^\s+$/u.test(text)) whitespaceEnds.add(offsets[index]);
      }
    }
    function split(total) {
      const parts = [];
      let start = 0;
      while (start < length) {
        const number = parts.length + 1;
        if (number > MAX_PARTS) throw new Error('This would create more than 1,000 parts. Increase the message limit.');
        const finalBudget = options.messageLimit - countCodePoints(serializePart('', number, number, options.finalTask))
          - 2 * (String(total).length - String(number).length);
        if (finalBudget < 1) throw new Error('Message limit leaves no payload budget after final instructions. Shorten the final task or increase the limit.');
        let end;
        if (counts[length] - counts[start] <= finalBudget) end = length;
        else {
          const budget = options.messageLimit - countCodePoints(`[START PART ${number}/${total}]\n\n[END PART ${number}/${total}]`);
          let low = start, high = length - 1;
          while (low < high) {
            const middle = Math.ceil((low + high) / 2);
            if (counts[middle] - counts[start] <= budget) low = middle;
            else high = middle - 1;
          }
          end = low;
          if (end === start) throw new Error('One grapheme exceeds the available payload budget. Increase the message limit.');
          if (options.smartSplit) {
            const threshold = counts[start] + Math.ceil(budget * 0.6);
            for (const boundaries of [paragraphEnds, sentenceEnds, whitespaceEnds]) {
              let chosen = 0;
              for (let index = end; index > start && counts[index] >= threshold; index--) {
                if (boundaries.has(offsets[index])) { chosen = index; break; }
              }
              if (chosen) { end = chosen; break; }
            }
          }
        }
        if (end === start) throw new Error('One grapheme exceeds the final-message payload budget. Increase the message limit.');
        parts.push({ id: 'part-' + number, payload: source.slice(offsets[start], offsets[end]),
          sourceStart: offsets[start], sourceEnd: offsets[end], edited: false });
        start = end;
      }
      return parts;
    }
    let provisional = 1, parts;
    for (let pass = 0; pass < 5; pass++) {
      parts = split(provisional);
      if (String(parts.length).length === String(provisional).length) break;
      provisional = parts.length;
      if (pass === 4) throw new Error('Part numbering could not stabilize within the message limit.');
    }
    const totalParts = parts.length;
    const initialMessage = serializeInitial(options.initialTemplate, totalParts);
    const messages = parts.map((part, index) => serializePart(part.payload, index + 1, totalParts, options.finalTask));
    if ([initialMessage, ...messages].some(message => countCodePoints(message) > options.messageLimit))
      throw new Error('Instructions or part numbering exceed the message limit. Shorten instructions or increase the limit.');
    return { initialMessage, parts, messages, totalParts, sourceCodePoints: counts[length] };
  }
  const api = { countCodePoints, estimateTokens, validateOptions, serializeInitial, serializePart, buildBundle,
    DEFAULT_TEMPLATE, DEFAULT_TASK };
  if (typeof module !== 'undefined') module.exports = api;
  else root.SplitCore = api;
})(globalThis);
