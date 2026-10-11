(function(root){
  'use strict';
  const key=s=>String(s).trim().normalize('NFC').toLowerCase(),length=s=>Array.from(s).length;
  function validateDuration(v){
    const valid=Number.isInteger(v)&&v>=10&&v<=120;
    return {
      valid,error:valid?null:'Choose a whole number from 10 to 120 seconds.'
    }
  }
  function validatePlayers(names){
    const errors=[];
    if(!Array.isArray(names)||names.length<1||names.length>12)return {
      valid:false,errors:['Enter 1–12 players.']
    }
    ;
    const seen=new Set();
    for(const raw of names){
      const name=String(raw).trim().normalize('NFC');
      if(!name||length(name)>40)errors.push('Player names must have 1–40 characters.');
      if(seen.has(key(name)))errors.push('Player names must be unique.');
      seen.add(key(name))
    }
    return {
      valid:!errors.length,errors
    }
  }
  function createGame(players,selectedPromptIds){
    return {
      phase:'setup',players:players.map(x=>({
        ...x
      }
      )),rosterLocked:false,selectedPromptIds:[...new Set(selectedPromptIds)],usedPromptIds:[],active:null,history:[]
    }
  }
  function getEligiblePrompts(s,p){
    const selected=new Set(s.selectedPromptIds),used=new Set(s.usedPromptIds);
    return p.filter(x=>selected.has(x.id)&&!used.has(x.id))
  }
  function record(s,p,outcome){
    const prompt=p.find(x=>x.id===s.active.promptId);
    return {
      id:s.active.roundId,attempt:s.history.length+1,promptId:prompt.id,promptName:prompt.name,categoryName:prompt.categoryName,durationSeconds:s.active.durationSeconds,outcome,resolved:outcome!=='completed',winnerId:null,winnerName:null
    }
  }
  function transition(s,e,p){
    if(s.phase==='finished' && e.type!=='NEW_GAME')return s;
    const matches=s.active&&s.active.roundId===e.roundId;
    switch(e.type){
      case 'START':{
        if(!['setup','exhausted','review'].includes(s.phase)||s.phase==='review'&&!s.history.at(-1)?.resolved||!validateDuration(e.durationSeconds).valid||!validatePlayers(s.players.map(x=>x.name)).valid||!e.roundId||s.history.some(x=>x.id===e.roundId))return s;
        const eligible=getEligiblePrompts(s,p);
        if(!eligible.length&&e.promptId===null)return {
          ...s,phase:'exhausted',active:null
        }
        ;
        if(!eligible.some(x=>x.id===e.promptId))return s;
        return {
          ...s,phase:'preparing',rosterLocked:true,active:{
            roundId:e.roundId,promptId:e.promptId,durationSeconds:e.durationSeconds
          }
        }
      }
      case 'BEGIN_DRAWING':return matches&&s.phase==='preparing'?{
        ...s,phase:'drawing',usedPromptIds:[...s.usedPromptIds,s.active.promptId]
      }
      :s;
      case 'EXPIRE':case 'SKIP':return matches&&s.phase==='drawing'?{
        ...s,phase:'review',history:[...s.history,record(s,p,e.type==='SKIP'?'skipped':'completed')]
      }
      :s;
      case 'RESOLVE':{
        if(!matches||s.phase!=='review'||s.history.at(-1)?.outcome!=='completed')return s;
        const player=s.players.find(x=>x.id===e.winnerId);
        if(e.winnerId!==null&&!player)return s;
        return {
          ...s,history:s.history.map(x=>x.id===e.roundId?{
            ...x,resolved:true,winnerId:player?.id||null,winnerName:player?.name||null
          }
          :x)
        }
      }
      case 'UPDATE_SELECTION':return ['setup','review','exhausted'].includes(s.phase)?{
        ...s,selectedPromptIds:[...new Set(e.promptIds.filter(id=>p.some(x=>x.id===id)))]
      }
      :s;
      case 'RESET_POOL':return {
        ...s,phase:'setup',active:null,usedPromptIds:[],history:s.phase==='drawing'?[...s.history,record(s,p,'aborted')]:s.history
      }
      ;
      case 'FINISH':
        if(!s.history.length || ['preparing','drawing'].includes(s.phase) || (s.phase==='review'&&!s.history.at(-1).resolved))return s;
        return {...s,phase:'finished',active:null};
      case 'NEW_GAME':return createGame(s.players,s.selectedPromptIds);
      default:return s
    }
  }
  function getScores(s){
    return s.players.map(x=>({
      ...x,playerId:x.id,points:s.history.filter(r=>r.outcome==='completed'&&r.resolved&&r.winnerId===x.id).length
    }
    ))
  }
  function getRankings(s){
    const scores=getScores(s).sort((a,b)=>b.points-a.points);
    return scores.map((player,index)=>({...player,rank:scores.findIndex(p=>p.points===player.points)+1,tied:scores.filter(p=>p.points===player.points).length>1}));
  }
  function normalizeEverydayWords(words){
    const errors=[],prompts=[],seen=new Set();
    if(!Array.isArray(words))return {prompts:[],errors:['Enter one word per line.']};
    for(const raw of words){
      if(typeof raw!=='string'){errors.push('Every word must be text.');continue;}
      const name=raw.trim().normalize('NFC');
      if(!name)continue;
      if(length(name)>80)errors.push('Each word must have at most 80 characters.');
      const normalized=key(name);
      if(seen.has(normalized))continue;
      seen.add(normalized);
      const id='everyday-'+Array.from(normalized,ch=>ch.codePointAt(0).toString(16)).join('-');
      prompts.push({id,name,categoryId:'category-everyday',categoryName:'Everyday Things',category:'Everyday Things',imageUrl:null});
    }
    if(!prompts.length)errors.push('Keep at least one word in Everyday Things.');
    if(prompts.length>200)errors.push('Everyday Things can have up to 200 unique words.');
    return {prompts:errors.length?[]:prompts,errors};
  }
  function normalizeCustomPrompts(category,words,existing){
    const errors=[],name=String(category).trim().normalize('NFC'),custom=existing.filter(x=>x.custom);
    if(!name||length(name)>40)errors.push('Category must have 1–40 characters.');
    const categories=new Set(custom.map(x=>key(x.categoryName)));
    if(!categories.has(key(name))&&categories.size>=10)errors.push('Limit: 10 custom categories.');
    const seen=new Set(existing.map(x=>key(x.categoryName)+'|'+key(x.name))),prompts=[];
    const categoryId=existing.find(x=>key(x.categoryName)===key(name))?.categoryId||'custom-category-'+(categories.size+1);
    let sequence=custom.length;
    for(const raw of words){
      const word=String(raw).trim().normalize('NFC');
      if(!word)continue;
      if(length(word)>80)errors.push('Words must have at most 80 characters.');
      const pair=key(name)+'|'+key(word);
      if(seen.has(pair))continue;
      seen.add(pair);
      prompts.push({
        id:'custom-prompt-'+(++sequence),categoryId,categoryName:name,name:word,imageUrl:null,custom:true
      }
      )
    }
    if(custom.length+prompts.length>200)errors.push('Limit: 200 custom prompts.');
    return {
      prompts:errors.length?[]:prompts,errors
    }
  }
  const api={
    validateDuration,validatePlayers,createGame,getEligiblePrompts,transition,getScores,getRankings,normalizeEverydayWords,normalizeCustomPrompts
  }
  ;
  if(typeof module!=='undefined')module.exports=api;
  else root.DrawingCore=api;
}
)(globalThis);
