(function(root){
  'use strict';
  function tokenizeLines(text,options={}){
    if(!options.preserveLineEndings)text=text.replace(/\r\n/g,'\n');
    let count=0;for(const character of text){if(character==='\n'&&++count>50000)throw new Error('Each input must contain at most 50,000 lines.');}
    if(!text)return [];
    if(count+(text.endsWith('\n')?0:1)>50000)throw new Error('Each input must contain at most 50,000 lines.');
    const parts=text.split('\n'), trailing=parts.at(-1)==='';
    if(trailing)parts.pop();
    return parts.map((text,i)=>({text,hasNewline:i<parts.length-1||trailing}));
  }
  // Myers frontier with bounded trace storage. Shared edges are removed first.
  function sequenceDiff(a,b,equal,budget=250000){
    let prefix=0,suffix=0;
    while(prefix<a.length&&prefix<b.length&&equal(a[prefix],b[prefix]))prefix++;
    while(suffix<a.length-prefix&&suffix<b.length-prefix&&equal(a[a.length-1-suffix],b[b.length-1-suffix]))suffix++;
    const left=a.slice(prefix,a.length-suffix),right=b.slice(prefix,b.length-suffix);
    if(!left.length||!right.length)return [...a.slice(0,prefix).map((a,i)=>({kind:'equal',a,b:b[i]})),...left.map(a=>({kind:'delete',a})),...right.map(b=>({kind:'insert',b})),...a.slice(a.length-suffix).map((a,i)=>({kind:'equal',a,b:b[b.length-suffix+i]}))];
    const n=left.length,m=right.length,trace=[];let v=new Map([[1,0]]),steps=0,found=false;
    for(let d=0;d<=n+m;d++){
      trace.push(new Map(v));
      for(let k=-d;k<=d;k+=2){
        if(++steps>budget)throw new Error('Comparison is too complex. Try smaller inputs.');
        let x=k===-d||(k!==d&&(v.get(k-1)??-1)<(v.get(k+1)??-1))?(v.get(k+1)??0):(v.get(k-1)??0)+1;
        let y=x-k;
        while(x<n&&y<m&&equal(left[x],right[y])){x++;y++;}
        v.set(k,x);
        if(x>=n&&y>=m){found=true;break;}
      }
      if(found)break;
    }
    let x=n,y=m;const middle=[];
    for(let d=trace.length-1;d>=0;d--){
      const frontier=trace[d],k=x-y;
      const prevK=k===-d||(k!==d&&(frontier.get(k-1)??-1)<(frontier.get(k+1)??-1))?k+1:k-1;
      const prevX=frontier.get(prevK)??0,prevY=prevX-prevK;
      while(x>prevX&&y>prevY){middle.push({kind:'equal',a:left[--x],b:right[--y]});}
      if(d===0)break;
      if(x===prevX)middle.push({kind:'insert',b:right[--y]});
      else middle.push({kind:'delete',a:left[--x]});
    }
    middle.reverse();
    // Stable patch ordering: deletions precede additions in each changed block.
    const ordered=[];
    for(let i=0;i<middle.length;){if(middle[i].kind==='equal'){ordered.push(middle[i++]);continue;}let j=i;while(j<middle.length&&middle[j].kind!=='equal')j++;ordered.push(...middle.slice(i,j).filter(x=>x.kind==='delete'),...middle.slice(i,j).filter(x=>x.kind==='insert'));i=j;}
    return [...a.slice(0,prefix).map((a,i)=>({kind:'equal',a,b:b[i]})),...ordered,...a.slice(a.length-suffix).map((a,i)=>({kind:'equal',a,b:b[b.length-suffix+i]}))];
  }
  function compareLines(oldText,newText,options={}){
    const a=tokenizeLines(oldText,options),b=tokenizeLines(newText,options);
    const key=l=>(options.ignoreWhitespace?l.text.replace(/[\t ]+/g,' ').replace(/^ | $/g,''):l.text)+'\u0000'+l.hasNewline;
    let oldLine=0,newLine=0,additions=0,deletions=0;
    const rows=sequenceDiff(a,b,(a,b)=>key(a)===key(b),options.workBudget??250000).map(item=>{
      if(item.kind==='insert')additions++;if(item.kind==='delete')deletions++;
      return {kind:item.kind,oldLine:item.a?++oldLine:null,newLine:item.b?++newLine:null,oldText:item.a?.text??null,newText:item.b?.text??null,oldNewline:item.a?.hasNewline??false,newNewline:item.b?.hasNewline??false};
    });return {rows,additions,deletions};
  }
  function buildHunks(rows,contextLines=3){
    const ranges=[];
    rows.forEach((r,i)=>{if(r.kind==='equal')return;const start=Math.max(0,i-contextLines),end=Math.min(rows.length,i+contextLines+1);const last=ranges.at(-1);if(last&&start<=last.endRow)last.endRow=end;else ranges.push({startRow:start,endRow:end});});
    let oldBefore=0,newBefore=0,cursor=0;
    return ranges.map(range=>{while(cursor<range.startRow){if(rows[cursor].oldLine!==null)oldBefore++;if(rows[cursor].newLine!==null)newBefore++;cursor++;}const slice=rows.slice(range.startRow,range.endRow),oldCount=slice.filter(r=>r.oldLine!==null).length,newCount=slice.filter(r=>r.newLine!==null).length;return {...range,oldStart:oldBefore+(oldCount?1:0),oldCount,newStart:newBefore+(newCount?1:0),newCount};});
  }
  function compareInline(a,b){
    const tokens=s=>s.match(/[\p{L}\p{N}_]+|\s+|[^\p{L}\p{N}_\s]/gu)||[];
    if(a.length+b.length>4000)return {oldTokens:[{text:a,changed:true}],newTokens:[{text:b,changed:true}]};
    let diff;try{diff=sequenceDiff(tokens(a),tokens(b),(a,b)=>a===b,10000);}catch{return {oldTokens:[{text:a,changed:true}],newTokens:[{text:b,changed:true}]};}
    return {oldTokens:diff.filter(t=>t.a!==undefined).map(t=>({text:t.a,changed:t.kind!=='equal'})),newTokens:diff.filter(t=>t.b!==undefined).map(t=>({text:t.b,changed:t.kind!=='equal'}))};
  }
  const api={tokenizeLines,compareLines,buildHunks,compareInline};
  if(typeof module!=='undefined')module.exports=api;else root.DiffCore=api;
})(globalThis);



