const { execSync } = require('child_process');
const fs = require('path');

console.log('📝 Generating POT file...');
console.log('⚠️  Please use Loco Translate in WordPress admin to generate POT file:');
console.log('   1. Go to: Loco Translate → Plugins → Codeweber Gutenberg Blocks');
console.log('   2. Click "Sync" button');
console.log('   3. POT file will be updated automatically');
console.log('\n✅ After syncing in Loco Translate, run: npm run i18n:compile');
