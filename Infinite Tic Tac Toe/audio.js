(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TicAudio=api;})(globalThis,function(){
  'use strict';
  function createAudio({createContext=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)()}={}){
    let context=null,enabled=true,volume=0.2;const oscillators=new Set();
    async function unlock(){if(!enabled)return;try{if(!context)context=createContext();if(context.state==='suspended')await context.resume();}catch(_){context=null;}}
    function stop(){for(const oscillator of oscillators){try{oscillator.stop();}catch(_){}}oscillators.clear();}
    function play(cue){
      if(!enabled||!context||context.state!=='running')return;
      const tones=cue==='win'?[523,659,784]:cue==='draw'?[392,330]:[440];
      try{tones.forEach((frequency,i)=>{
        const oscillator=context.createOscillator(),gain=context.createGain(),start=context.currentTime+i*0.11;
        oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,start);
        gain.gain.setValueAtTime(Math.max(0.0001,volume*0.12),start);gain.gain.exponentialRampToValueAtTime(0.0001,start+0.12);
        oscillator.connect(gain);gain.connect(context.destination);oscillators.add(oscillator);oscillator.onended=()=>oscillators.delete(oscillator);
        oscillator.start(start);oscillator.stop(start+0.13);
      });}catch(_){stop();}
    }
    function setPreferences(p){enabled=p.enabled===true;volume=Number.isFinite(p.volume)?Math.max(0,Math.min(1,p.volume)):0.2;if(!enabled)stop();}
    return {unlock,play,stop,setPreferences};
  }
  return {createAudio};
});
