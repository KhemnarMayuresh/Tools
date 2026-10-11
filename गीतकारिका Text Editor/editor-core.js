(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EditorCore=api;})(globalThis,function(){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const emptyDocument=()=>({version:1,sections:[]});
  function validateDocument(doc){
    const errors=[],ids=new Set();let blocks=0,total=0;
    const shape=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>keys.includes(key))&&keys.every(key=>Object.hasOwn(value,key));
    const id=value=>{if(typeof value!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(value)||ids.has(value))errors.push('Every section and text block needs a unique valid ID.');ids.add(value);};
    const size=(value,min)=>value===null||(Number.isInteger(value)&&value>=min&&value<=1600);
    if(!shape(doc,['version','sections'])||doc.version!==1||!Array.isArray(doc.sections)||doc.sections.length>100)return {ok:false,errors:['Use a version 1 document with at most 100 sections.']};
    for(const s of doc.sections){
      if(!shape(s,['id','title','collapsed','width','height','blocks'])){errors.push('Invalid section fields.');continue;}id(s.id);
      if(typeof s.title!=='string'||Array.from(s.title).length>200||typeof s.collapsed!=='boolean'||!size(s.width,240)||!size(s.height,120)||!Array.isArray(s.blocks)){errors.push('Invalid section title, layout or blocks.');continue;}
      for(const b of s.blocks){blocks++;if(!shape(b,['id','html','align','width'])){errors.push('Invalid text block fields.');continue;}id(b.id);if(typeof b.html!=='string'||b.html.length>200000||!['left','center','right'].includes(b.align)||!size(b.width,140))errors.push('Invalid text block content or layout.');if(typeof b.html==='string')total+=b.html.length;}
    }
    if(blocks>500||total>2000000)errors.push('Document limit: 500 text blocks and 2,000,000 HTML characters.');
    return {ok:errors.length===0,errors};
  }
  function apply(doc,action){
    const next=clone(doc),section=next.sections.find(s=>s.id===action.id),parent=next.sections.find(s=>s.blocks.some(b=>b.id===action.id)),block=parent?.blocks.find(b=>b.id===action.id);
    const patch=(target,keys)=>{if(target)for(const key of keys)if(Object.hasOwn(action.patch||{},key))target[key]=action.patch[key];};
    const insertion=(index,length)=>Math.max(0,Math.min(length,Number.isInteger(index)?index:length));
    switch(action.type){
      case 'addSection':next.sections.push(clone(action.section));break;
      case 'updateSection':patch(section,['title','collapsed','width','height']);break;
      case 'deleteSection':next.sections=next.sections.filter(s=>s.id!==action.id);break;
      case 'moveSection':if(section){next.sections=next.sections.filter(s=>s.id!==action.id);next.sections.splice(insertion(action.index,next.sections.length),0,section);}break;
      case 'addBlock':{const target=next.sections.find(s=>s.id===action.sectionId);if(target)target.blocks.push(clone(action.block));break;}
      case 'updateBlock':patch(block,['html','align','width']);break;
      case 'deleteBlock':if(parent)parent.blocks=parent.blocks.filter(b=>b.id!==action.id);break;
      case 'moveBlock':{const target=next.sections.find(s=>s.id===action.sectionId);if(block&&target){parent.blocks=parent.blocks.filter(b=>b.id!==action.id);target.blocks.splice(insertion(action.index,target.blocks.length),0,block);}break;}
      default:return doc;
    }
    return validateDocument(next).ok&&JSON.stringify(next)!==JSON.stringify(doc)?next:doc;
  }
  function createHistory(initial){
    let current=clone(initial),past=[],future=[],lastGroup=null,lastTime=-Infinity;
    const bytes=()=>past.reduce((n,d)=>n+JSON.stringify(d).length*2,0);
    return {get current(){return current;},get canUndo(){return past.length>0;},get canRedo(){return future.length>0;},
      commit(doc,{group=null,now=Date.now()}={}){if(JSON.stringify(doc)===JSON.stringify(current))return false;if(!group||group!==lastGroup||now-lastTime>1000||now<lastTime)past.push(current);current=clone(doc);future=[];lastGroup=group;lastTime=now;while(past.length>50||bytes()>8*1024*1024)past.shift();return true;},
      undo(){if(past.length){future.push(current);current=past.pop();lastGroup=null;}return current;},
      redo(){if(future.length){past.push(current);current=future.pop();lastGroup=null;}return current;}
    };
  }
  function counts(text){let words;if(typeof Intl.Segmenter==='function')words=[...new Intl.Segmenter(undefined,{granularity:'word'}).segment(text)].filter(s=>s.isWordLike).length;else words=(text.trim().match(/\S+/gu)||[]).length;return {words,characters:Array.from(text).length};}
  return {emptyDocument,validateDocument,apply,createHistory,counts};
});
