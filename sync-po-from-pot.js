const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const potPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks.pot');
const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🔄 Syncing PO file from POT file...\n');

// Читаем POT файл
const potContent = fs.readFileSync(potPath, 'utf8');
let poContent = fs.readFileSync(poPath, 'utf8');

// Извлекаем все msgid из POT
const potEntries = new Map();
const potLines = potContent.split('\n');

let currentMsgid = null;
let currentContext = null;
let currentComment = null;

for (let i = 0; i < potLines.length; i++) {
	const line = potLines[i];
	
	// Парсим комментарии с контекстом
	if (line.startsWith('#:')) {
		currentComment = line;
	}
	
	// Парсим msgid
	if (line.startsWith('msgid "')) {
		const match = line.match(/^msgid "(.+)"$/);
		if (match) {
			currentMsgid = match[1];
			if (currentMsgid && currentMsgid !== '') {
				potEntries.set(currentMsgid, {
					comment: currentComment || '',
					msgid: currentMsgid
				});
			}
		}
	}
	
	// Сбрасываем контекст после msgstr
	if (line.startsWith('msgstr')) {
		currentComment = null;
		currentMsgid = null;
	}
}

console.log(`Found ${potEntries.size} strings in POT file`);

// Извлекаем все существующие переводы из PO
const existingTranslations = new Map();
const poLines = poContent.split('\n');

for (let i = 0; i < poLines.length; i++) {
	const line = poLines[i];
	if (line.startsWith('msgid "')) {
		const match = line.match(/^msgid "(.+)"$/);
		if (match && i + 1 < poLines.length) {
			const msgid = match[1];
			const msgstrLine = poLines[i + 1];
			if (msgstrLine.startsWith('msgstr "')) {
				const msgstrMatch = msgstrLine.match(/^msgstr "(.+)"$/);
				if (msgstrMatch) {
					existingTranslations.set(msgid, msgstrMatch[1]);
				}
			}
		}
	}
}

console.log(`Found ${existingTranslations.size} existing translations in PO file`);

// Словарь переводов
const translations = {
	'Video Poster': 'Постер видео',
	'Select Poster': 'Выбрать постер',
	'Loading poster...': 'Загрузка постера...',
	'Auto-load Poster from Provider': 'Автоматически загружать постер от провайдера',
	'Muted': 'Без звука',
	'Show Controls': 'Показать элементы управления',
	'Show Play Icon': 'Показать иконку воспроизведения',
	'Enable Video Lightbox': 'Включить лайтбокс для видео',
	'Hover effects are only available for images.': 'Эффекты при наведении доступны только для изображений.',
	'YouTube Video ID': 'ID YouTube видео',
	'Example: j_Y2Gwaj7Gs': 'Пример: j_Y2Gwaj7Gs',
	'Example: 15801179': 'Пример: 15801179',
	'Paste iframe or embed code': 'Вставьте iframe или embed код',
	'Block Rounded': 'Скругление блока',
	'Media': 'Медиа',
	'Display image or video with effects, masks and lightbox': 'Отображение изображения или видео с эффектами, масками и лайтбоксом',
	'hover': 'наведение',
	'image': 'изображение',
	'lightbox': 'лайтбокс',
	'mask': 'маска',
	'video': 'видео',
	'Add New Hotspot': 'Добавить новую точку',
	'Add New Image Hotspot': 'Добавить новую точку на изображении',
	'Add Point': 'Добавить точку',
	'An addon for Codeweber theme.': 'Дополнение для темы Codeweber.',
	'Auto': 'Авто',
	'Bottom': 'Низ',
	'Button Shape': 'Форма кнопки',
	'Button Size': 'Размер кнопки',
	'Button Style': 'Стиль кнопки',
	'Cancel': 'Отмена',
	'-- Select Post --': '-- Выбрать запись --',
	'-- Select Post Type --': '-- Выбрать тип записи --',
};

// Находим недостающие строки
const missingEntries = [];
for (const [msgid, entry] of potEntries) {
	if (!existingTranslations.has(msgid)) {
		missingEntries.push({ msgid, comment: entry.comment });
	}
}

console.log(`\nFound ${missingEntries.length} missing translations\n`);

// Добавляем недостающие строки в конец PO файла (перед последней пустой строкой)
// Находим позицию для вставки (после последнего перевода)
const lastTranslationIndex = poContent.lastIndexOf('msgstr');
if (lastTranslationIndex === -1) {
	console.error('Could not find last translation in PO file');
	process.exit(1);
}

// Находим конец последнего перевода
let insertPosition = poContent.length;
const lines = poContent.split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
	if (lines[i].trim() && !lines[i].startsWith('#')) {
		insertPosition = poContent.indexOf(lines[i]) + lines[i].length;
		break;
	}
}

// Формируем новые записи
let newEntries = '\n';
for (const entry of missingEntries) {
	if (entry.comment) {
		newEntries += entry.comment + '\n';
	}
	newEntries += `msgid "${entry.msgid}"\n`;
	
	// Пробуем найти перевод в словаре
	const translation = translations[entry.msgid] || '';
	newEntries += `msgstr "${translation}"\n\n`;
}

// Вставляем новые записи
const beforeInsert = poContent.substring(0, insertPosition);
const afterInsert = poContent.substring(insertPosition);
poContent = beforeInsert + newEntries + afterInsert;

// Сохраняем обновленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${missingEntries.length} missing entries to PO file`);
console.log(`📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');











