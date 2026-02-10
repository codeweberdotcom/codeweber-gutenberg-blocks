const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/blocks/navbar/templates');
const destDir = path.join(__dirname, '../build/blocks/navbar/templates');

if (fs.existsSync(srcDir)) {
	fs.mkdirSync(destDir, { recursive: true });
	fs.readdirSync(srcDir).forEach((file) => {
		const src = path.join(srcDir, file);
		const dest = path.join(destDir, file);
		if (fs.statSync(src).isFile()) {
			fs.copyFileSync(src, dest);
			console.log('Copied navbar/templates/' + file);
		}
	});
}
