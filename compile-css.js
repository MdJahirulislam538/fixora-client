const fs = require('fs');
const path = require('path');
const { compile } = require('@tailwindcss/node');

async function buildCss() {
  const inputCss = fs.readFileSync(path.join(__dirname, 'app', 'globals.css'), 'utf-8');
  console.log('Compiling Tailwind CSS with @tailwindcss/node...');
  
  const compiler = await compile(inputCss, {
    base: __dirname,
    onDependency(dep) {
      // console.log('Dependency:', dep);
    }
  });

  // Find all class candidates from files in app/ and components/
  const candidateFiles = [];
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        scanDir(full);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.html')) {
        candidateFiles.push(full);
      }
    }
  }

  scanDir(path.join(__dirname, 'app'));
  if (fs.existsSync(path.join(__dirname, 'components'))) {
    scanDir(path.join(__dirname, 'components'));
  }

  const allContent = candidateFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  
  // Use Tailwind compiler's candidate scanner / regex or compiler.build
  // In Tailwind v4 compiler.build takes candidates array or string
  // Let's test passing words from allContent:
  const words = allContent.match(/[^<>"'`\s:;{}()\[\]]+/g) || [];
  // Also keep full string candidate matches with brackets like bg-[#2563EB]
  const complexMatches = allContent.match(/[a-zA-Z0-9_\-\/\[\]#:.%]+/g) || [];
  const uniqueCandidates = Array.from(new Set([...words, ...complexMatches]));
  
  console.log(`Found ${uniqueCandidates.length} candidate tokens across ${candidateFiles.length} source files.`);

  const outputCss = compiler.build(uniqueCandidates);
  console.log(`Generated CSS size: ${(outputCss.length / 1024).toFixed(2)} KB`);

  fs.writeFileSync(path.join(__dirname, 'app', 'tailwind-built.css'), outputCss);
  console.log('Wrote app/tailwind-built.css successfully!');
}

buildCss().catch(err => {
  console.error('Build CSS failed:', err);
  process.exit(1);
});
