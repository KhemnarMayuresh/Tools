const {test}=require('node:test');const assert=require('node:assert/strict');const {createPatch}=require('../patch-export.js');
test('patch contains headers ranges and newline markers',()=>{const p=createPatch('a','b\n',{});assert.ok(p.startsWith('--- a/original.txt\n+++ b/modified.txt\n'));assert.ok(p.includes('@@ -1,1 +1,1 @@'));assert.ok(p.includes('-a\n\\ No newline at end of file\n+b\n'));});
test('empty-side patch ranges',()=>assert.ok(createPatch('','x\n',{}).includes('@@ -0,0 +1,1 @@')));
test('patch is exact independently of whitespace preferences',()=>assert.ok(createPatch('a b\n','a  b\n',{ignoreWhitespace:true}).includes('-a b\n+a  b\n')));
test('filename newlines cannot inject headers',()=>assert.ok(!createPatch('a','b',{oldName:'foo\nEVIL'}).includes('\nEVIL')));
