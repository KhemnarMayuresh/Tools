(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ParcelAudio=api;})(globalThis,function(){
  'use strict';
  const TRACKS={party:{label:'Party beat',step:0.25,notes:[262,330,392,330,294,349,440,349,330,392,494,392,294,349,440,392]},gentle:{label:'Gentle melody',step:0.4,notes:[262,294,330,392,330,294,262,196,220,262,294,349,330,294,262,220]}};
  function createAudioController({createContext=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),createMedia=()=>new Audio(),
    createURL=file=>URL.createObjectURL(file),revokeURL=url=>URL.revokeObjectURL(url),schedule=setTimeout,cancel=clearTimeout,onStatus=()=>{},onFailure=()=>{}}={}){
    let generation=0,source=null,context=null,master=null,active=null,pump=null,volume=0.35;
    const nodes=new Set(),waits=new Set();
    function waitOwned(promise,token,message){
      return new Promise(resolve=>{
        let done=false,handle=null;
        const finish=result=>{if(done)return;done=true;if(handle!==null)cancel(handle);waits.delete(abort);resolve(result);};
        const abort=()=>finish({ok:false,cancelled:true,error:'Playback cancelled.'});
        waits.add(abort);handle=schedule(()=>finish({ok:false,error:message}),3000);
        Promise.resolve(promise).then(value=>finish(token===generation?{ok:true,value}:{ok:false,cancelled:true,error:'Playback cancelled.'}),error=>finish({ok:false,error:error?.message||'Music unavailable.'}));
      });
    }
    function stopNodes(){
      if(pump!==null)cancel(pump);pump=null;
      for(const node of nodes){try{node.oscillator.stop();node.oscillator.disconnect();node.gain.disconnect();}catch(_){}}
      nodes.clear();
    }
    function pause(){
      generation++;for(const abort of [...waits])abort();
      if(active){
        if(active.kind==='builtin'&&context)active.source.offset+=Math.max(0,context.currentTime-active.startedAt);
        if(active.media){active.source.offset=Number.isFinite(active.media.currentTime)?active.media.currentTime:0;active.media.pause();}
      }
      active=null;stopNodes();
    }
    function release(record){
      if(!record||record.released)return;record.released=true;
      if(record.cleanup)record.cleanup();
      if(record.media){record.media.pause();record.media.removeAttribute('src');record.media.load();}
      if(record.url)revokeURL(record.url);
    }
    function report(message){onStatus(message);return {started:false,error:message};}
    function fail(message){if(!active)return;pause();onStatus(message);onFailure({message});}
    function contextChanged(){if(active?.kind==='builtin'&&context?.state!=='running')fail('Built-in audio was interrupted. This round was cancelled; retry or upload music.');}
    async function prepare(candidate){
      pause();const token=generation;
      if(candidate.kind==='builtin'){
        if(!TRACKS[candidate.track])return {ready:false,label:source?.label||'',error:'Choose a built-in track.'};
        const next={kind:'builtin',track:candidate.track,label:TRACKS[candidate.track].label,offset:0};release(source);source=next;
        return {ready:true,label:source.label,error:null};
      }
      const file=candidate.file;
      if(candidate.kind!=='upload'||!file||file.size<=0||file.size>50*1024*1024)return {ready:false,label:source?.label||'',error:'Choose an audio file no larger than 50 MiB.'};
      let record=null;
      try{
        const media=createMedia(),url=createURL(file);record={kind:'upload',media,url,label:file.name||'Uploaded music',offset:0,released:false};
        media.preload='auto';media.loop=true;media.volume=volume;
        let ready,failed;
        const loading=new Promise((resolve,reject)=>{
          ready=()=>{if(media.readyState>=2&&Number.isFinite(media.duration)&&media.duration>0)resolve();};
          failed=()=>reject(Error('This audio file could not be decoded. Try MP3, WAV, OGG or M4A.'));
          media.addEventListener('loadeddata',ready);media.addEventListener('canplay',ready);media.addEventListener('error',failed);
        });
        media.src=url;media.load();ready();
        const result=await waitOwned(loading,token,'Audio file did not become ready within 3 seconds. Try another file.');
        media.removeEventListener('loadeddata',ready);media.removeEventListener('canplay',ready);media.removeEventListener('error',failed);
        if(!result.ok||token!==generation){release(record);return {ready:false,label:source?.label||'',error:result.cancelled?null:result.error};}
        const error=()=>{if(active&&active.source===record)fail('Music playback failed. This round was cancelled; retry or change the source.');};
        const stalled=()=>{if(active&&active.source===record&&active.started&&!media.seeking&&media.readyState<3)fail('Music stalled. This round was cancelled; retry or change the source.');};
        const ended=()=>{if(active&&active.source===record&&active.started)fail('Music ended unexpectedly. This round was cancelled; retry or change the source.');};
        media.addEventListener('error',error);media.addEventListener('waiting',stalled);media.addEventListener('stalled',stalled);media.addEventListener('ended',ended);
        record.cleanup=()=>{media.removeEventListener('error',error);for(const event of ['waiting','stalled'])media.removeEventListener(event,stalled);media.removeEventListener('ended',ended);};
        release(source);source=record;return {ready:true,label:record.label,error:null};
      }catch(error){release(record);return {ready:false,label:source?.label||'',error:error.message||'Audio file unavailable.'};}
    }
    function synthesize(token){
      const track=TRACKS[source.track],offset=source.offset;
      let nextStep=Math.ceil((offset-0.000001)/track.step);
      function fill(){
        if(token!==generation||!active)return;
        contextChanged();if(token!==generation||!active)return;
        try{
          const elapsed=offset+Math.max(0,context.currentTime-active.startedAt);
          // Skip missed notes rather than creating a burst after a delayed callback.
          nextStep=Math.max(nextStep,Math.floor(elapsed/track.step));
          let count=0;
          while(nextStep*track.step<elapsed+0.16&&count++<3){
            const at=Math.max(context.currentTime,active.startedAt+nextStep*track.step-offset),frequency=track.notes[nextStep%track.notes.length];
            const oscillator=context.createOscillator(),gain=context.createGain(),owned={oscillator,gain};
            oscillator.type=source.track==='party'?'triangle':'sine';oscillator.frequency.setValueAtTime(frequency,at);
            gain.gain.setValueAtTime(0.0001,at);gain.gain.exponentialRampToValueAtTime(0.13,at+0.015);gain.gain.exponentialRampToValueAtTime(0.0001,at+track.step*0.8);
            oscillator.connect(gain);gain.connect(master);nodes.add(owned);
            oscillator.onended=()=>{nodes.delete(owned);try{oscillator.disconnect();gain.disconnect();}catch(_){}};
            oscillator.start(at);oscillator.stop(at+track.step*0.85);nextStep++;
          }
          pump=schedule(fill,50);
        }catch(_){fail('Built-in audio is unavailable. This round was cancelled; retry or upload music.');}
      }
      fill();
    }
    async function play({restart=false}={}){
      pause();const token=generation,prepared=source;
      if(!prepared)return report('Choose ready music before starting.');
      if(restart)prepared.offset=0;
      try{
        if(prepared.kind==='builtin'){
          if(!context){context=createContext();context.addEventListener?.('statechange',contextChanged);master=context.createGain();master.connect(context.destination);}
          master.gain.value=volume;
          const resumed=context.state==='running'?{ok:true}:await waitOwned(context.resume(),token,'Audio did not start within 3 seconds. Retry or upload music.');
          if(!resumed.ok||token!==generation){if(token===generation)pause();return resumed.cancelled?{started:false,error:null}:report(resumed.error);}
          if(context.state!=='running')throw Error('Audio is unavailable. Enable sound in your browser or upload music.');
          active={kind:'builtin',source:prepared,startedAt:context.currentTime,started:true,token};synthesize(token);
          return token===generation&&active?{started:true,error:null}:{started:false,error:'Audio unavailable.'};
        }
        const media=prepared.media;media.loop=true;media.volume=volume;if(Math.abs(media.currentTime-prepared.offset)>0.001)media.currentTime=prepared.offset;
        active={kind:'upload',source:prepared,media,started:false,token};
        const pending=Promise.resolve(media.play());
        pending.then(()=>{if(token!==generation&&(!active||active.media!==media))media.pause();},()=>{});
        const result=await waitOwned(pending,token,'Music did not start within 3 seconds. Retry or change the source.');
        if(!result.ok||token!==generation){if(token===generation)pause();return result.cancelled?{started:false,error:null}:report(result.error);}
        active.started=true;return {started:true,error:null};
      }catch(error){if(token===generation)pause();return report(`Audio unavailable: ${error.message||'playback failed'}. Retry or change the source.`);}
    }
    function setVolume(value){volume=Number.isFinite(value)?Math.max(0,Math.min(1,value)):0.35;if(master)master.gain.value=volume;if(source?.media)source.media.volume=volume;}
    function dispose(){pause();context?.removeEventListener?.('statechange',contextChanged);release(source);source=null;if(context&&context.close){try{Promise.resolve(context.close()).catch(()=>{});}catch(_){}}context=master=null;}
    return {prepare,play,preview:()=>play({restart:false}),pause,cancel:pause,dispose,setVolume};
  }
  return {createAudioController};
});

