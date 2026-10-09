const {test}=require('node:test');const assert=require('node:assert/strict');const {compareLines}=require('../diff-core');
test('ignore horizontal whitespace preserves nonbreaking spaces',()=>assert.equal(compareLines('\u00a0a','a',{ignoreWhitespace:true}).additions,1));
