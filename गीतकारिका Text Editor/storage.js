(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EditorStorage=api;})(globalThis,function(){
  'use strict';const KEY='geetkarika-document-v1',LEGACY='sections';
  function createStorage({storage,schedule=setTimeout,cancel=clearTimeout,onStatus=()=>{}}){
    let pending=null,timer=null,generation=0,protectedData=false,closed=false;
    const status=(state,message)=>onStatus({state,message});
    function clear(){generation++;if(timer!==null)cancel(timer);timer=null;}
    function load(){try{let raw=storage.getItem(KEY),kind='document';if(raw===null){raw=storage.getItem(LEGACY);kind='legacy';}if(raw===null)return {kind:'empty',value:null,raw:null};try{return {kind,value:JSON.parse(raw),raw};}catch(_){protectedData=true;status('error','Saved data could not be read. Download recovery data before starting fresh.');return {kind:'corrupt',raw};}}catch(error){status('error','Browser storage is unavailable. Export a JSON backup to keep your work.');return {kind:'unavailable',error:error.message};}}
    function flush(){clear();if(closed||pending===null)return;if(protectedData){status('error','Saved data is protected. Download recovery data or explicitly start fresh.');return;}try{storage.setItem(KEY,pending);pending=null;status('saved','Saved on this browser');}catch(_){status('error','Unable to save on this browser. Your edits remain open; export a JSON backup.');}}
    function save(doc){if(closed)return;pending=JSON.stringify(doc);clear();if(protectedData){status('error','Saved data is protected. Export a backup or start fresh explicitly.');return;}status('saving','Saving…');const token=generation;timer=schedule(()=>{if(token===generation)flush();},400);}
    return {load,save,flush,protect(){protectedData=true;clear();},allowOverwrite(){protectedData=false;},dispose(){flush();clear();closed=true;}};
  }
  return {createStorage,KEY,LEGACY};
});
