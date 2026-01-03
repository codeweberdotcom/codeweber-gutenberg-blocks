const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const pluginPath = __dirname;
const potFile = path.join(pluginPath, 'languages', 'codeweber-gutenberg-blocks.pot');
const textDomain = 'codeweber-gutenberg-blocks';
const packageName = 'Codeweber Gutenberg Blocks';

console.log('📝 Generating POT file from source files...\n');

// Функция для извлечения строк из JS/JSX файлов
function extractStringsFromJS(filePath) {
	const content = fs.readFileSync(filePath, 'utf8');
	const strings = [];
	
	// Паттерны для поиска строк перевода:
	// __('text', 'domain')
	// __('text', "domain")
	// __("text", 'domain')
	// __("text", "domain")
	const patterns = [
		/__\(['"]([^'"]+)['"]\s*,\s*['"]codeweber-gutenberg-blocks['"]\)/g,
		/__\(["']([^"']+)["']\s*,\s*["']codeweber-gutenberg-blocks["']\)/g,
	];
	
	patterns.forEach(pattern => {
		let match;
		while ((match = pattern.exec(content)) !== null) {
			strings.push({
				text: match[1],
				file: path.relative(pluginPath, filePath),
			});
		}
	});
	
	return strings;
}

try {
	// Проверяем наличие wp-cli
	try {
		execSync('wp --version', { stdio: 'ignore' });
	} catch (e) {
		console.log('⚠️  wp-cli not found, using manual extraction...\n');
	}

	// Сначала генерируем POT из PHP файлов используя wp i18n make-pot
	let phpCommand = `wp i18n make-pot "${pluginPath}" "${potFile}" --domain="${textDomain}" --package-name="${packageName}" --headers='{"Last-Translator":"FULL NAME <EMAIL@ADDRESS>","Language-Team":"LANGUAGE <LL@li.org>"}' --skip-js --skip-jsx`;
	
	try {
		console.log('Running: wp i18n make-pot (PHP files)...');
		execSync(phpCommand, { 
			cwd: pluginPath,
			stdio: 'inherit'
		});
	} catch (error) {
		console.log('⚠️  wp i18n make-pot failed, will extract manually...\n');
	}

	// Извлекаем строки из JS/JSX файлов
	console.log('Extracting strings from JS/JSX files...');
	const jsFiles = glob.sync('src/**/*.{js,jsx}', { cwd: pluginPath });
	const allStrings = new Map();
	
	jsFiles.forEach(file => {
		const fullPath = path.join(pluginPath, file);
		const strings = extractStringsFromJS(fullPath);
		strings.forEach(({ text, file: filePath }) => {
			if (!allStrings.has(text)) {
				allStrings.set(text, []);
			}
			allStrings.get(text).push(filePath);
		});
	});

	// Читаем существующий POT файл или создаём новый
	let potContent = '';
	if (fs.existsSync(potFile)) {
		potContent = fs.readFileSync(potFile, 'utf8');
	} else {
		potContent = `#, fuzzy
msgid ""
msgstr ""
"Project-Id-Version: ${packageName}\\n"
"POT-Creation-Date: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}+0000\\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"
"Language-Team: LANGUAGE <LL@li.org>\\n"
"Language: \\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=INTEGER; plural=EXPRESSION;\\n"
"X-Generator: Custom Script\\n"

`;
	}

	// Добавляем строки из JS файлов
	let newEntries = '';
	allStrings.forEach((files, text) => {
		// Проверяем, нет ли уже этой строки в POT
		if (!potContent.includes(`msgid "${text.replace(/"/g, '\\"')}"`)) {
			const fileRefs = files.map(f => `src/${f.replace(/\\/g, '/')}`).join(' ');
			newEntries += `#: ${fileRefs}\n`;
			newEntries += `msgid "${text.replace(/"/g, '\\"')}"\n`;
			newEntries += `msgstr ""\n\n`;
		}
	});

	if (newEntries) {
		potContent += newEntries;
		fs.writeFileSync(potFile, potContent, 'utf8');
		console.log(`✅ Added ${allStrings.size} strings from JS/JSX files to POT`);
	} else {
		console.log('ℹ️  No new strings found in JS/JSX files');
	}

	console.log(`\n✅ POT file updated: ${potFile}`);
	console.log('\n📋 Next steps:');
	console.log('   1. Review the POT file');
	console.log('   2. Sync in Loco Translate if needed');
	console.log('   3. Run: npm run i18n:compile\n');

} catch (error) {
	console.error('\n❌ Error generating POT file:');
	console.error(error.message);
	console.error('\n💡 Alternative: Use Loco Translate in WordPress admin:');
	console.error('   1. Go to: Loco Translate → Plugins → Codeweber Gutenberg Blocks');
	console.error('   2. Click "Sync" button');
	console.error('   3. POT file will be updated automatically\n');
	process.exit(1);
}
