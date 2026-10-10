const test=require('node:test'),a=require('node:assert/strict'),C=require('../game-core.js');
test('secure integer sampling rejects modulo bias and supports both endpoints',()=>{
 let calls=0;const crypto={getRandomValues(values){values[0]=[4294967295,0,9][calls++];return values;}};
 a.equal(C.randomInteger(10,crypto),0);a.equal(calls,2);a.equal(C.randomInteger(10,crypto),9);
 a.equal(C.randomInteger(1,crypto),0);
});
test('duration defaults to secure source and equal bounds stay fixed',()=>{
 const crypto={getRandomValues(values){values[0]=20000;return values;}};
 a.equal(C.sampleDuration({minSeconds:10,maxSeconds:30},undefined,crypto),30000);
 a.equal(C.sampleDuration({minSeconds:5,maxSeconds:5},undefined,crypto),5000);
});
