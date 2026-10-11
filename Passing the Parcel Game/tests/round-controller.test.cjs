const test=require('node:test'),a=require('node:assert/strict'),{createRoundController}=require('../round-controller.js');
function harness(){let time=0,next=0;const jobs=new Map(),stops=[],ticks=[];
 const controller=createRoundController({now:()=>time,schedule:(fn,ms)=>{jobs.set(++next,{fn,ms});return next;},cancel:id=>jobs.delete(id),onStop:e=>stops.push(e),onTick:e=>ticks.push(e)});
 const settings={roundId:'r1',durationMs:3000,activeIds:['a','b','c'],startPlayerId:'a',passIntervalMs:1000,playStyle:'screen'};
 return {controller,jobs,stops,ticks,settings,setTime:n=>time=n};}
test('deadline holder uses exact stop/pass boundaries, even with late delivery',()=>{
 for(const [duration,holder]of [[2999,'c'],[3000,'a']]){const h=harness();h.controller.start({...h.settings,durationMs:duration});const deadline=[...h.jobs.values()].find(j=>j.ms===duration);h.setTime(3600);deadline.fn();a.equal(h.stops.length,1);a.equal(h.stops[0].holderId,holder);a.equal(h.stops[0].elapsedMs,duration);a.equal(h.jobs.size,0);h.controller.stopManual();a.equal(h.stops.length,1);}
});
test('pause freezes active elapsed and holder; resume uses original remaining duration',()=>{
 const h=harness();h.controller.start(h.settings);h.setTime(1500);h.controller.pause();a.equal(h.jobs.size,0);h.setTime(9900);a.equal(h.controller.snapshot().elapsedMs,1500);a.equal(h.controller.snapshot().holderId,'b');h.controller.resume();a.ok([...h.jobs.values()].some(j=>j.ms===1500));h.setTime(11400);h.controller.stopManual();a.equal(h.stops[0].reason,'random');a.equal(h.stops[0].holderId,'a');
});
test('cancel/replacement protects against deliberately delivered obsolete callbacks',()=>{
 const h=harness();h.controller.start(h.settings);const old=[...h.jobs.values()].map(j=>j.fn);h.controller.start({...h.settings,roundId:'r2'});old.forEach(fn=>fn());h.controller.cancel();a.equal(h.jobs.size,0);a.equal(h.stops.length,0);old.forEach(fn=>fn());a.equal(h.stops.length,0);
});
test('physical holder remains unknown; manual stop and endpoint durations are supported',()=>{
 for(const durationMs of [5000,120000]){const h=harness();h.controller.start({...h.settings,playStyle:'physical',durationMs});h.setTime(1250);a.equal(h.controller.snapshot().holderId,null);h.controller.stopManual();a.equal(h.stops[0].elapsedMs,1250);a.equal(h.stops[0].reason,'manual');a.equal(h.stops[0].holderId,null);}
});
