importScripts('split-core.js');
onmessage = ({data}) => {
  try { postMessage({requestId: data.requestId, bundle: SplitCore.buildBundle(data.source, data.options)}); }
  catch (error) { postMessage({requestId: data.requestId, error: error.message}); }
};
