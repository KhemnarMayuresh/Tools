const t=require('node:test'),a=require('node:assert/strict'),C=require('../core.js');
t('captures and offsets',()=>{const r=C.run({pattern:'(?<word>foo)(bar)?',flags:'g',text:'foo foobar',replacement:'<$<word>>'});a.equal(r.matches.length,2);a.equal(r.matches[1].index,4);a.equal(r.matches[0].groups.word,'foo');a.equal(r.replacement,'<foo> <foo>');});
t('zero length Unicode matches advance',()=>{const r=C.run({pattern:'(?:)',flags:'gu',text:'😀',replacement:'-'});a.deepEqual(r.matches.map(m=>m.index),[0,2]);a.equal(r.replacement,'-😀-');});
t('non global matches only first',()=>a.equal(C.run({pattern:'a',flags:'',text:'aaa',replacement:'b'}).matches.length,1));
t('invalid patterns and result cap',()=>{a.throws(()=>C.run({pattern:'[',flags:'',text:'x'}));a.throws(()=>C.run({pattern:'.',flags:'g',text:'a'.repeat(10001)}),/10,000/);});
