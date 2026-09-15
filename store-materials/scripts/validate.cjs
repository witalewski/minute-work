const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8').trim();
const report = ['# Materials validation', '', 'Validates prepared assets, not native release readiness.', ''];
const fields = [
 ['Android/en-US/name.txt',30],['Android/en-US/short-description.txt',80],
 ['Android/en-US/description.txt',4000],['Android/en-US/release-notes.txt',500],
 ['iOS/en-US/name.txt',30],['iOS/en-US/subtitle.txt',30],
 ['iOS/en-US/promotional-text.txt',170],['iOS/en-US/keywords.txt',100],
 ['iOS/en-US/description.txt',4000],['iOS/en-US/release-notes.txt',4000],
];
for(const [p,max] of fields){const n=[...read(p)].length;assert(n>0&&n<=max,`${p}: ${n}/${max}`);report.push(`- ${p}: ${n}/${max} characters — PASS`);}
for(const platform of ['Android','iOS']){
 const m=JSON.parse(read(`${platform}/listing.json`));
 assert.equal(m.name,read(`${platform}/en-US/name.txt`));
 assert.equal(m[platform==='Android'?'full_description':'description'],read(`${platform}/en-US/description.txt`));
 const mapping=platform==='Android'?{'short_description':'short-description'}:{subtitle:'subtitle',promotional_text:'promotional-text',keywords:'keywords'};
 for(const [key,file] of Object.entries(mapping)) assert.equal(m[key],read(`${platform}/en-US/${file}.txt`));
}
const pngs = [
 ['Android/graphics/store-icon-512.png',512,512,1024*1024],
 ['Android/graphics/feature-graphic-1024x500.png',1024,500,15*1024*1024],
 ['iOS/graphics/app-store-icon-1024.png',1024,1024,Infinity],
];
for(const [platform,w,h] of [['Android',1080,1920],['iOS',1320,2868]]){
 const dir=`${platform}/screenshots/preview-only`;
 const files=fs.readdirSync(path.join(root,dir)).filter(x=>x.endsWith('-PREVIEW.png'));
 assert.equal(files.length,5,`${platform}: expected five preview compositions`);
 for(const f of files) pngs.push([`${dir}/${f}`,w,h,Infinity]);
}
for(const [p,w,h,max] of pngs){
 const b=fs.readFileSync(path.join(root,p));
 assert.equal(b.subarray(1,4).toString(),'PNG');
 assert.equal(b.readUInt32BE(16),w,p);assert.equal(b.readUInt32BE(20),h,p);
 assert.equal(b[25],2,`${p}: expected RGB without alpha`);
 assert(b.length<=max,`${p}: file too large`);
 report.push(`- ${p}: ${w} × ${h}, RGB PNG, ${b.length} bytes — PASS`);
}
report.push('', '## Remaining submission work', '', '- Replace owner/contact/URL placeholders and host the privacy/support pages.', '- Capture native screenshots. All current screenshot compositions are web previews.', '- Verify privacy declarations against signed native builds and SDK behavior.', '- Finish platform setup, release testing and console questionnaires.');
fs.writeFileSync(path.join(root,'validation-report.md'),report.join('\n')+'\n');
console.log('PASS: metadata limits, JSON/copy consistency, three store graphics and ten screenshot preview dimensions/format. See validation-report.md.');
