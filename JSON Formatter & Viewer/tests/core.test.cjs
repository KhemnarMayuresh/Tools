const test=require('node:test'),a=require('node:assert/strict'),C=require('../core.js');
test('preserves numeric literals and duplicate entries',()=>{const n=C.parse('{"n":9007199254740993,"n":1e400,"z":-0}');a.equal(C.format(n,''),'{"n":9007199254740993,"n":1e400,"z":-0}');a.equal(C.duplicates(n).length,1);});
test('nested Unicode round trip and pointer escaping',()=>{const s='{"a/b":{"~": ["भारत",true,null]}}';a.deepEqual(JSON.parse(C.format(C.parse(s),'  ')),JSON.parse(s));a.equal(C.pointer(['a/b','~',0]),'/a~1b/~0/0');});
test('strict syntax and useful locations',()=>{for(const s of ['01','[1,]','{"x":1,}','NaN','"bad\nstring"','true false'])a.throws(()=>C.parse(s),e=>e.line>=1&&e.column>=1);});
test('depth and size bounds',()=>{a.throws(()=>C.parse('['.repeat(130)+'0'+']'.repeat(130)),/depth/i);a.throws(()=>C.parse(' '.repeat(2097153)),/size/i);});
