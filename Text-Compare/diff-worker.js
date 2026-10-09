importScripts('diff-core.js','patch-export.js');
onmessage=({data})=>{
  try{const result=DiffCore.compareLines(data.oldText,data.newText,data.options);const patch=PatchExport.createPatch(data.oldText,data.newText,data.options);postMessage({requestId:data.requestId,result,patch});}
  catch(error){postMessage({requestId:data.requestId,error:error.message});}
};
