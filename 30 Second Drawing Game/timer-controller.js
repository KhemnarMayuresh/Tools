(function(root){
  'use strict';
  function createTimerController({
    now,schedule,cancel,onStage,onTick,onExpire
  }
  ){
    let generation=0,handle=null;
    function stop(){
      generation++;
      if(handle!==null)cancel(handle);
      handle=null
    }
    function prepare(id,duration){
      stop();
      const token=generation,start=now(),goAt=start+2000,deadline=goAt+duration*1000;
      let stage='ready',finished=false;
      onStage(id,stage);
      function update(){
        if(token!==generation||finished)return;
        const time=now();
        if(time<goAt){
          if(time>=start+1000&&stage==='ready'){
            stage='set';
            onStage(id,stage)
          }
          handle=schedule(update,Math.min(100,time<start+1000?start+1000-time:goAt-time));
          return
        }
        if(stage!=='go'){
          stage='go';
          onStage(id,stage)
        }
        const remaining=Math.max(0,deadline-time);
        onTick(id,remaining,remaining/(duration*1000));
        if(!remaining){
          finished=true;
          handle=null;
          onExpire(id);
          return
        }
        handle=schedule(update,Math.min(100,remaining))
      }
      handle=schedule(update,100)
    }
    return {
      prepare,cancel:stop
    }
  }
  const api={
    createTimerController
  }
  ;
  if(typeof module!=='undefined')module.exports=api;
  else root.DrawingTimer=api
}
)(globalThis);
