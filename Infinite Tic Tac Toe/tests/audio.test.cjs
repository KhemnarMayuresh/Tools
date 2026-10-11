const test=require('node:test'),a=require('node:assert/strict');
const {createAudio}=require('../audio.js');
test('unsupported/denied audio and muted cues never interrupt play',async()=>{
 for(const createContext of [()=>{throw Error('unsupported');},()=>({resume:()=>Promise.reject(Error('denied')),state:'suspended'})]){
 const sound=createAudio({createContext});await sound.unlock();a.doesNotThrow(()=>sound.play('place'));sound.setPreferences({enabled:false,volume:0.2});sound.stop();}
});
test('tones are owned and stop clears oscillators; mute prevents creation',async()=>{
 const notes=[];const context={state:'running',currentTime:0,destination:{},resume:async()=>{},createOscillator:()=>{const o={frequency:{setValueAtTime(){}},connect(){},start(){notes.push(o);},stop(){o.stopped=true;}};return o;},createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}})};
 const sound=createAudio({createContext:()=>context});await sound.unlock();sound.play('win');a.ok(notes.length);sound.stop();a.ok(notes.every(o=>o.stopped));const n=notes.length;sound.setPreferences({enabled:false,volume:0.3});sound.play('place');a.equal(notes.length,n);
});
