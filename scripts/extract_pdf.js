const fs = require('fs');
const zlib = require('zlib');

const buffer = fs.readFileSync('public/assets/aistudio/UI_UX_Strategy___Content_Blueprint_74a732ec.pdf');
const content = buffer.toString('binary');
const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
let count = 0;
while ((match = streamRegex.exec(content)) !== null) {
  count++;
  try {
    const raw = Buffer.from(match[1], 'binary');
    const decompressed = zlib.inflateSync(raw).toString('latin1');
    const lines = [];
    const tjRegex = /\((.*?)\)\s*Tj/g;
    let m;
    while ((m = tjRegex.exec(decompressed)) !== null) {
      lines.push(m[1]);
    }
    const arrayRegex = /\[(.*?)\]\s*TJ/g;
    while ((m = arrayRegex.exec(decompressed)) !== null) {
      const parts = m[1].match(/\((.*?)\)/g);
      if (parts) {
        lines.push(parts.map(p => p.slice(1, -1)).join(''));
      }
    }
    if (lines.length > 0) {
      console.log(`\n=== STREAM ${count} ===\n`);
      console.log(lines.join(' '));
    }
  } catch (e) {
  }
}
