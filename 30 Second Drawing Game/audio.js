(function(root){
  'use strict';
  root.createDrawingAudio=function(){
    let context,enabled=true,volume=.25;
    const nodes=new Set();
    async function unlock(){
      try{
        const Audio=root.AudioContext||root.webkitAudioContext;
        if(!Audio)return;
        context ||=new Audio();
        await context.resume()
      }
      catch{
        context=null
      }
    }
    function cancel(){
      for(const n of nodes){
        try{
          n.stop()
        }
        catch{
        }
      }
      nodes.clear()
    }
    function cue(kind){
      if(!enabled||!context||context.state!=='running')return;
      try{
        const oscillator=context.createOscillator(),gain=context.createGain(),time=context.currentTime,duration=kind==='end'?.45:.12;
        oscillator.frequency.value=kind==='end'?180:kind==='go'?880:440;
        gain.gain.setValueAtTime(volume*.25,time);
        gain.gain.exponentialRampToValueAtTime(.001,time+duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(time+duration);
        nodes.add(oscillator);
        oscillator.onended=()=>{
          nodes.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect()
        }
      }
      catch{
      }
    }
    return {
      unlock,cue,cancel,configure(on,v){
        enabled=on;
        volume=Math.max(0,Math.min(1,Number(v)||0));
        if(!enabled)cancel()
      }
    }
  }
}
)(globalThis);
