const fs = require('fs');
const p = process.argv[2] || 'src/app/favicon.ico';
try {
  const b = fs.readFileSync(p);
  const head = b.slice(0,4).toJSON().data.map(x=>x.toString(16).padStart(2,'0')).join(' ');
  console.log('File:', p);
  console.log('Size (bytes):', b.length);
  console.log('Header bytes:', head);
  if (head === '00 00 01 00') console.log('✅ Looks like a valid ICO header.');
  else console.log('❌ Not an ICO header — file is likely invalid or wrong format.');
} catch(e){
  console.error('Error reading file:', e.message);
}
