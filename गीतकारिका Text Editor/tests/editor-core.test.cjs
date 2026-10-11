const test=require('node:test'),a=require('node:assert/strict'),C=require('../editor-core.js');
const section=id=>({id,title:'भारत',collapsed:false,width:null,height:null,blocks:[]});
const block=id=>({id,html:'<p>नमस्ते 😀</p>',align:'left',width:null});
test('schema validates strict unique IDs and bounded dimensions/content',()=>{
 const d={version:1,sections:[section('s1')]};a.equal(C.validateDocument(d).ok,true);a.equal(C.validateDocument({...d,version:2}).ok,false);a.equal(C.validateDocument({...d,sections:[section('s1'),section('s1')]}).ok,false);a.equal(C.validateDocument({...d,sections:[{...section('s1'),width:NaN}]}).ok,false);a.equal(C.validateDocument({...d,sections:[{...section('s1'),blocks:[{...block('b1'),html:'x'.repeat(200001)}]}]}).ok,false);
});
test('immutable add/update/move to empty section preserves stable identity',()=>{
 const initial=C.emptyDocument();let d=C.apply(initial,{type:'addSection',section:section('s1')});d=C.apply(d,{type:'addSection',section:section('s2')});d=C.apply(d,{type:'addBlock',sectionId:'s1',block:block('b1')});const before=JSON.stringify(d);const moved=C.apply(d,{type:'moveBlock',id:'b1',sectionId:'s2',index:0});a.equal(JSON.stringify(d),before);a.equal(moved.sections[0].blocks.length,0);a.equal(moved.sections[1].blocks[0].id,'b1');a.equal(C.apply(moved,{type:'moveBlock',id:'missing',sectionId:'s1',index:0}),moved);a.equal(C.apply(moved,{type:'addBlock',sectionId:'s1',block:block('b1')}),moved);a.equal(initial.sections.length,0);
 const ordered=C.apply(moved,{type:'moveSection',id:'s2',index:0});a.equal(ordered.sections[0].id,'s2');const edited=C.apply(ordered,{type:'updateBlock',id:'b1',patch:{html:'hello',align:'center'}});a.equal(edited.sections[0].blocks[0].align,'center');a.equal(C.apply(edited,{type:'deleteSection',id:'s2'}).sections.length,1);
});
test('typing groups undo; structural actions/import split groups and redo clears',()=>{
 const d={version:1,sections:[{...section('s1'),blocks:[block('b1')]}]},h=C.createHistory(d);let x=C.apply(d,{type:'updateBlock',id:'b1',patch:{html:'a'}});h.commit(x,{group:'b1',now:0});x=C.apply(x,{type:'updateBlock',id:'b1',patch:{html:'ab'}});h.commit(x,{group:'b1',now:500});a.equal(h.undo().sections[0].blocks[0].html,d.sections[0].blocks[0].html);a.equal(h.redo().sections[0].blocks[0].html,'ab');h.commit(C.emptyDocument());a.equal(h.undo().sections.length,1);h.commit(C.apply(h.current,{type:'updateSection',id:'s1',patch:{title:'new'}}));a.equal(h.canRedo,false);a.equal(d.sections[0].title,'भारत');
});
test('Unicode counts include characters and segmented Hindi words',()=>{const c=C.counts('नमस्ते दुनिया 😀');a.equal(c.words,2);a.equal(c.characters,Array.from('नमस्ते दुनिया 😀').length);});
test('history is bounded and retains the current document',()=>{const h=C.createHistory(C.emptyDocument());for(let i=0;i<65;i++)h.commit({version:1,sections:[{...section('s1'),title:String(i)}]});let n=0;while(h.canUndo){h.undo();n++;}a.ok(n<=50);a.equal(h.canUndo,false);});
