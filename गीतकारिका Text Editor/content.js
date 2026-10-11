(function(root){
  'use strict';
  const sizes=new Set(['14px','16px','20px','24px']),allowed=new Set(['P','DIV','BR','STRONG','B','EM','I','U','SPAN']);
  const forbidden=new Set(['SCRIPT','STYLE','IMG','SVG','MATH','IFRAME','OBJECT','EMBED','BUTTON','INPUT','TEXTAREA','SELECT','VIDEO','AUDIO','CANVAS','LINK','META','TEMPLATE','FORM']);
  function sanitize(html){
    const parsed=new DOMParser().parseFromString(String(html),'text/html'),out=document.createElement('div');
    function copy(node,parent){
      if(node.nodeType===3){parent.append(document.createTextNode(node.data));return;}
      if(node.nodeType!==1||forbidden.has(node.tagName.toUpperCase())||node.classList.contains('delete-button')||node.classList.contains('section-delete-button'))return;
      if(!allowed.has(node.tagName.toUpperCase())){for(const child of node.childNodes)copy(child,parent);return;}
      const tag=node.tagName==='B'?'strong':node.tagName==='I'?'em':node.tagName.toLowerCase(),next=document.createElement(tag);
      if(tag==='span'&&sizes.has(node.style.fontSize))next.style.fontSize=node.style.fontSize;
      for(const child of node.childNodes)copy(child,next);parent.append(next);
    }
    for(const node of parsed.body.childNodes)copy(node,out);return out.innerHTML;
  }
  function fromText(text){const container=document.createElement('div');String(text).replace(/\r\n?/g,'\n').split('\n').forEach((line,i)=>{if(i)container.append(document.createElement('br'));container.append(document.createTextNode(line));});return container.innerHTML;}
  function plainText(html){
    const parsed=new DOMParser().parseFromString(html,'text/html');let result='';
    function visit(node){if(node.nodeType===3){result+=node.data;return;}if(node.nodeType!==1)return;if(node.tagName==='BR'){result+='\n';return;}const block=['DIV','P'].includes(node.tagName);if(block&&result&&!result.endsWith('\n'))result+='\n';for(const child of node.childNodes)visit(child);if(block)result+='\n';}
    for(const node of parsed.body.childNodes)visit(node);if(['DIV','P'].includes(parsed.body.lastElementChild?.tagName)&&parsed.body.lastChild===parsed.body.lastElementChild)result=result.slice(0,-1);return result;
  }
  function normalizeDocument(doc){const checked=EditorCore.validateDocument(doc);if(!checked.ok)throw Error(checked.errors.join(' '));const normalized=JSON.parse(JSON.stringify(doc));for(const section of normalized.sections)for(const block of section.blocks)block.html=sanitize(block.html);const final=EditorCore.validateDocument(normalized);if(!final.ok)throw Error(final.errors.join(' '));return normalized;}
  function migrateLegacy(value){
    if(!Array.isArray(value)||value.length>100)throw Error('Invalid legacy sections.');const used=new Set();let n=0;
    const identity=(candidate,prefix)=>{let id=typeof candidate==='string'&&/^[-a-zA-Z0-9_]{1,100}$/.test(candidate)&&!used.has(candidate)?candidate:`${prefix}-legacy-${n++}`;while(used.has(id))id=`${prefix}-legacy-${n++}`;used.add(id);return id;};
    const sections=value.map(s=>{if(!s||typeof s!=='object'||!Array.isArray(s.divs))throw Error('Invalid legacy section.');return {id:identity(s.id,'section'),title:typeof s.name==='string'?s.name:'Section',collapsed:false,width:null,height:null,blocks:s.divs.map(b=>{if(!b||typeof b.text!=='string'||b.text.length>200000)throw Error('Invalid legacy text.');return {id:identity(b.id,'block'),html:sanitize(b.text),align:'left',width:null};})};});
    return normalizeDocument({version:1,sections});
  }
  function exportText(doc){return doc.sections.map(s=>`${s.title||'Untitled section'}\n${'='.repeat(Math.min(40,Array.from(s.title||'Untitled section').length))}\n${s.blocks.map(b=>plainText(b.html)).join('\n\n')}`).join('\n\n');}
  function literalMatches(text,query){if(!query)return [];const regex=new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'giu');return [...text.matchAll(regex)].map(match=>({index:match.index,length:match[0].length}));}
  function textMap(container){let text='',parts=[];
    function newline(start,end){const offset=text.length;text+='\n';parts.push({start:offset,end:text.length,from:start,to:end});}
    function visit(node){if(node.nodeType===3){const start=text.length;text+=node.data;parts.push({start,end:text.length,node});return;}if(node.nodeType!==1)return;const parent=node.parentNode,index=[...parent.childNodes].indexOf(node);if(node.nodeName==='BR'){newline([parent,index],[parent,index+1]);return;}const block=['DIV','P'].includes(node.nodeName);if(block&&text&&!text.endsWith('\n'))newline([parent,index],[node,0]);for(const child of node.childNodes)visit(child);if(block)newline([node,node.childNodes.length],[parent,index+1]);}
    for(const child of container.childNodes)visit(child);if(['DIV','P'].includes(container.lastElementChild?.nodeName)&&container.lastChild===container.lastElementChild)text=text.slice(0,-1);
    function point(offset,end){const part=parts.find(p=>end?offset>p.start&&offset<=p.end:offset>=p.start&&offset<p.end);if(!part)return [container,container.childNodes.length];return part.node?[part.node,offset-part.start]:end?part.to:part.from;}
    return {text,range(index,length){const range=document.createRange();range.setStart(...point(index,false));range.setEnd(...point(index+length,true));return range;}};
  }
  function replaceHtml(html,matches,replacement){const container=document.createElement('div');container.innerHTML=sanitize(html);const map=textMap(container);for(const match of [...matches].sort((a,b)=>b.index-a.index)){const range=map.range(match.index,match.length);range.deleteContents();range.insertNode(document.createTextNode(replacement));}return sanitize(container.innerHTML);}
  root.EditorContent={sanitize,fromText,plainText,normalizeDocument,migrateLegacy,exportText,literalMatches,textMap,replaceHtml};
})(globalThis);
