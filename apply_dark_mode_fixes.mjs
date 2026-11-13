import fs from 'fs';
import path from 'path';

const replacements = {
  'bg-white': 'bg-card',
  'border-zinc-200': 'border-border',
  'border-zinc-300': 'border-border',
  'text-zinc-700': 'text-foreground',
  'text-zinc-500': 'text-muted-foreground',
  'text-zinc-600': 'text-foreground',
  'bg-zinc-100': 'bg-muted',
  'bg-zinc-50': 'bg-muted',
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      for (const [oldVal, newVal] of Object.entries(replacements)) {
        if (content.includes(oldVal)) {
          content = content.replace(new RegExp(oldVal, 'g'), newVal);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

processDirectory('./app');
console.log("Dark mode color migration completed.");
