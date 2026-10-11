const {test}=require('node:test');const assert=require('node:assert/strict');const {compareLines}=require('../diff-core');
test('excessive line counts fail with a useful limit',()=>assert.throws(()=>compareLines('\n'.repeat(50001),''),/50,000/));
test('fallback computation has a smaller explicit work budget',()=>assert.throws(()=>compareLines('a\nb\nc','x\ny\nz',{workBudget:2}),/complex/));
