importScripts('core.js');onmessage=e=>{try{postMessage({result:RegexCore.run(e.data)});}catch(error){postMessage({error:error.message});}};
