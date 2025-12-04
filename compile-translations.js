const fs = require('fs');
const gettextParser = require('gettext-parser');

console.log('🔄 Compiling translations...\n');

// Читаем .po файл
const poPath = './languages/codeweber-gutenberg-blocks-ru_RU.po';

if (!fs.existsSync(poPath)) {
	console.log('⚠️ PO file not found:', poPath);
	console.log('Please create translations in Loco Translate first.');
	process.exit(1);
}

const poFile = fs.readFileSync(poPath);
const po = gettextParser.po.parse(poFile);

// 1. Компилируем .mo файл для PHP
const mo = gettextParser.mo.compile(po);
fs.writeFileSync('./languages/codeweber-gutenberg-blocks-ru_RU.mo', mo);
console.log('✅ MO file compiled: codeweber-gutenberg-blocks-ru_RU.mo');

// 2. Создаем JSON объект для JavaScript переводов (формат WordPress/Gutenberg)
const wpJson = {
	"locale_data": {
		"codeweber-gutenberg-blocks": {
			"": {
				"domain": "codeweber-gutenberg-blocks",
				"plural-forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10 >= 2 && n%10<=4 &&(n%100<10||n%100 >= 20)? 1 : 2);",
				"lang": "ru_RU"
			}
		}
	}
};

// Преобразуем переводы из .po в формат WordPress
const translations = po.translations[''] || {};
let translationsCount = 0;

for (const msgid in translations) {
	if (msgid === '') continue; // Пропускаем заголовок
	
	const translation = translations[msgid];
	if (translation.msgstr && translation.msgstr[0] && translation.msgstr[0].trim() !== '') {
		wpJson.locale_data["codeweber-gutenberg-blocks"][msgid] = [translation.msgstr[0]];
		translationsCount++;
	}
}

console.log(`📝 Found ${translationsCount} translations\n`);

// 3. Удаляем старые JSON файлы
const langDir = './languages';
const oldJsonFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
if (oldJsonFiles.length > 0) {
	oldJsonFiles.forEach(f => {
		fs.unlinkSync(langDir + '/' + f);
	});
	console.log(`🗑️ Removed ${oldJsonFiles.length} old JSON files`);
}

// 4. Генерируем JSON файлы для каждого блока
const buildDir = './build/blocks';
if (!fs.existsSync(buildDir)) {
	console.log('⚠️ Build directory not found. Run npm run build first.');
	process.exit(1);
}

const blocks = fs.readdirSync(buildDir);
let jsonCount = 0;

blocks.forEach(blockName => {
	const blockPath = buildDir + '/' + blockName;
	const jsFile = blockPath + '/index.js';
	
	if (fs.existsSync(jsFile)) {
		// WordPress генерирует хеш для JSON из ОТНОСИТЕЛЬНОГО пути к скрипту
		// Путь должен быть относительно корня плагина
		const relativePath = 'build/blocks/' + blockName + '/index.js';
		
		// Генерируем MD5 хеш от относительного пути (так делает WordPress)
		const hash = require('crypto').createHash('md5').update(relativePath).digest('hex');
		
		// Создаем JSON файл для этого скрипта
		const jsonFileName = `codeweber-gutenberg-blocks-ru_RU-${hash}.json`;
		const jsonFilePath = langDir + '/' + jsonFileName;
		
		// Сохраняем JSON файл
		fs.writeFileSync(jsonFilePath, JSON.stringify(wpJson, null, 2));
		console.log(`   ${blockName}: ${hash.substring(0, 8)}... (${relativePath})`);
		jsonCount++;
	}
});

console.log(`✅ Created ${jsonCount} JSON files for JavaScript\n`);
console.log('✅ All translations compiled successfully!');

