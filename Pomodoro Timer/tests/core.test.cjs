const t=require('node:test'),a=require('node:assert/strict'),C=require('../core.js');
t('pause resume preserves exact remaining time',()=>{let s=C.create();s=C.start(s,1000);s=C.pause(s,61000);a.equal(s.remaining,1440000);s=C.start(s,100000);a.equal(C.remaining(s,101000),1439000);});
t('completion once and long break after four focus sessions',()=>{let s=C.create();for(let i=0;i<4;i++){s=C.start(s,0);s=C.complete(s,s.deadline);a.equal(s.completed,i+1);if(i<3){a.equal(s.phase,'short');s=C.skip(s);}else a.equal(s.phase,'long');}a.equal(C.complete(s,99999999).completed,4);});
t('skip does not count focus and reset clears running timestamp',()=>{let s=C.skip(C.start(C.create(),0));a.equal(s.completed,0);s=C.reset(s);a.equal(s.deadline,null);a.equal(s.running,false);});
