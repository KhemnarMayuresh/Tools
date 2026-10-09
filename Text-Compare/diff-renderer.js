(function(root){
  const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  function codeContent(text,tokens,language){
    const code=el('span','code'),syntax=Syntax.syntaxTokens(text,language);let offset=0;
    const changed=[];for(const token of tokens||[{text,changed:false}]){changed.push({start:offset,end:offset+token.text.length,changed:token.changed});offset+=token.text.length;}
    let rangeIndex=0;offset=0;for(const token of syntax){let pos=offset,end=offset+token.text.length;while(pos<end){while(rangeIndex<changed.length&&changed[rangeIndex].end<=pos)rangeIndex++;const range=changed[rangeIndex];const stop=Math.min(end,range?.end??end);code.append(el('span',[token.type?'syntax-'+token.type:'',range?.changed?'inline-change':''].join(' '),text.slice(pos,stop)));pos=stop;}offset=end;}return code;
  }
  function cell(text,number,kind,tokens,language,otherNumber,hasNewline){
    const c=el('div','cell '+kind+(text===null?' blank':''));c.append(el('span','gutter',number??''));if(otherNumber!==undefined)c.append(el('span','gutter',otherNumber??''));c.append(el('span','prefix',kind==='delete'?'−':kind==='insert'?'+':' '));if(text!==null){c.append(codeContent(text,tokens,language));if(!hasNewline)c.append(el('span','newline-note',' ↵ No final newline'));}return c;
  }
  function renderDiff(container,result,options){
    container.replaceChildren();const hunks=DiffCore.buildHunks(result.rows,options.contextLines),rows=result.rows;let index=options.startRow||0,displayed=0,truncated=false;
    if(index>0){const before=index;const button=el('button','fold',`Show ${before} earlier rows`);button.onclick=()=>options.onExpand(0,before);container.append(button);}
    const visible=i=>options.full||options.expandedRanges.some(r=>i>=r[0]&&i<r[1])||hunks.some(h=>i>=h.startRow&&i<h.endRow);
    const append=(left,right,source,inline)=>{if(displayed>=options.limit){truncated=true;return;}const row=el('div','diff-row '+(options.view==='unified'?'unified':''));row.dataset.row=source;const h=hunks.findIndex(h=>source>=h.startRow&&source<h.endRow);if(h>=0)row.dataset.hunk=h;
      if(options.view==='split'){row.append(cell(left?.oldText??null,left?.oldLine??null,left?.kind==='delete'?'delete':'equal',inline?.oldTokens,options.language,undefined,left?.oldNewline),cell(right?.newText??null,right?.newLine??null,right?.kind==='insert'?'insert':'equal',inline?.newTokens,options.language,undefined,right?.newNewline));}
      else{const r=left||right;row.append(cell(r.kind==='insert'?r.newText:r.oldText,r.oldLine,r.kind,r.kind==='insert'?inline?.newTokens:inline?.oldTokens,options.language,r.newLine,r.kind==='insert'?r.newNewline:r.oldNewline));}container.append(row);displayed++;};
    while(index<rows.length&&displayed<options.limit){
      if(!visible(index)){let end=index+1;while(end<rows.length&&!visible(end))end++;const start=index;const button=el('button','fold',`Show ${end-start} unchanged lines`);button.onclick=()=>options.onExpand(start,end);container.append(button);index=end;continue;}
      const r=rows[index];if(r.kind==='equal'){append(r,r,index);index++;continue;}
      let end=index;while(end<rows.length&&rows[end].kind!=='equal')end++;
      const deletes=[],inserts=[];for(let i=index;i<end;i++){(rows[i].kind==='delete'?deletes:inserts).push({r:rows[i],i});}
      const inlineAt=i=>displayed<options.limit&&deletes[i]&&inserts[i]?DiffCore.compareInline(deletes[i].r.oldText,inserts[i].r.newText):undefined;
      if(options.view==='split'){for(let i=0;i<Math.max(deletes.length,inserts.length);i++)append(deletes[i]?.r,inserts[i]?.r,deletes[i]?.i??inserts[i].i,inlineAt(i));}
      else{deletes.forEach((d,i)=>append(d.r,null,d.i,inlineAt(i)));inserts.forEach((a,i)=>append(null,a.r,a.i,inlineAt(i)));}index=end;
    }
    return {hunks,hasMore:truncated||index<rows.length};
  }
  root.DiffRenderer={renderDiff};
})(globalThis);

