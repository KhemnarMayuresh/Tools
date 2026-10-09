(function(root){
  'use strict';
  const core=typeof module!=='undefined'?require('./diff-core.js'):root.DiffCore;
  function createPatch(oldText,newText,options={}){
    const result=core.compareLines(oldText,newText,{workBudget:options.workBudget,preserveLineEndings:true}),hunks=core.buildHunks(result.rows,options.contextLines??3);
    if(!hunks.length)return '';
    const name=(value,fallback)=>String(value||fallback).replace(/[\r\n\t"\\]/g,'_');
    let patch=`--- a/${name(options.oldName,'original.txt')}\n+++ b/${name(options.newName,'modified.txt')}\n`;
    for(const h of hunks){patch+=`@@ -${h.oldStart},${h.oldCount} +${h.newStart},${h.newCount} @@\n`;for(const row of result.rows.slice(h.startRow,h.endRow)){const text=row.kind==='insert'?row.newText:row.oldText;patch+=(row.kind==='equal'?' ':row.kind==='delete'?'-':'+')+text+'\n';if(!(row.kind==='insert'?row.newNewline:row.oldNewline))patch+='\\ No newline at end of file\n';}}
    return patch;
  }
  if(typeof module!=='undefined')module.exports={createPatch};else root.PatchExport={createPatch};
})(globalThis);

