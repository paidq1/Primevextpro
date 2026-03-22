const fs = require('fs');
let f = fs.readFileSync('src/pages/ManageBots.jsx', 'utf8');

// Remove color top bar
f = f.replace(/\s*{\/\* Color top bar \*\/}\s*<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: bot\.color, borderRadius: '4px 4px 0 0' }} \/>/g, '');

// Uniform card style
f = f.replace(/background: '#0d1426', border: `1px solid \${bot\.color}30`/g, "background: '#1a2e4a', border: '1px solid rgba(99,102,241,0.3)'");

// Bot name color -> #818cf8 uniform
f = f.replace(/color: bot\.color, fontSize: '9px', fontWeight: '800'/g, "color: '#818cf8', fontSize: '7px', fontWeight: '600'");

// Amount color -> #6366f1
f = f.replace(/color: 'white', fontSize: '14px', fontWeight: '900'/g, "color: '#6366f1', fontSize: '10px', fontWeight: '700'");

// Button -> always #6366f1
f = f.replace(/background: canAfford \? bot\.color : 'rgba\(255,255,255,0\.06\)'/g, "background: canAfford ? '#6366f1' : 'rgba(255,255,255,0.06)'");

// Active bot border
f = f.replace(/border: `1px solid \${botColor}40`/g, "border: '1px solid rgba(99,102,241,0.3)'");

// Active bot progress bar color
f = f.replace(/background: botColor, borderRadius: '3px'/g, "background: '#6366f1', borderRadius: '3px'");

fs.writeFileSync('src/pages/ManageBots.jsx', f);
console.log('Done!');
