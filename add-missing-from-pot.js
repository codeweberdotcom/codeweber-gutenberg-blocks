const fs = require('fs');
const path = require('path');

const potPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks.pot');
const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🔄 Adding missing translations from POT file...\n');

// Читаем файлы
const potContent = fs.readFileSync(potPath, 'utf8');
let poContent = fs.readFileSync(poPath, 'utf8');

// Извлекаем все msgid из POT с контекстом
const potEntries = [];
const potLines = potContent.split('\n');

let currentComment = '';
let currentMsgid = null;
let inMsgid = false;
let msgidBuffer = '';

for (let i = 0; i < potLines.length; i++) {
	const line = potLines[i];
	
	if (line.startsWith('#:')) {
		currentComment = line;
	}
	
	if (line.startsWith('msgid "')) {
		inMsgid = true;
		const match = line.match(/^msgid "(.+)"$/);
		if (match) {
			msgidBuffer = match[1];
		} else {
			// Многострочный msgid
			const match2 = line.match(/^msgid "(.*)$/);
			if (match2) {
				msgidBuffer = match2[1];
			}
		}
	} else if (inMsgid && line.startsWith('"')) {
		// Продолжение многострочного msgid
		const match = line.match(/^"(.*)"$/);
		if (match) {
			msgidBuffer += match[1];
		}
	} else if (line.startsWith('msgstr')) {
		if (msgidBuffer && msgidBuffer !== '') {
			potEntries.push({
				comment: currentComment,
				msgid: msgidBuffer
			});
		}
		msgidBuffer = '';
		inMsgid = false;
		currentComment = '';
	}
}

console.log(`Found ${potEntries.length} strings in POT file`);

// Извлекаем существующие msgid из PO
const existingMsgids = new Set();
const poLines = poContent.split('\n');

for (let i = 0; i < poLines.length; i++) {
	const line = poLines[i];
	if (line.match(/^msgid "/)) {
		const match = line.match(/^msgid "(.+)"$/);
		if (match && match[1] !== '') {
			existingMsgids.add(match[1]);
		}
	}
}

console.log(`Found ${existingMsgids.size} existing strings in PO file`);

// Находим недостающие
const missing = potEntries.filter(entry => !existingMsgids.has(entry.msgid));
console.log(`\nFound ${missing.length} missing strings\n`);

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

// Добавляем недостающие строки в конец файла (перед последней пустой строкой)
let newEntries = '\n';
let addedCount = 0;

for (const entry of missing) {
	if (entry.comment) {
		newEntries += entry.comment + '\n';
	}
	newEntries += `msgid "${entry.msgid}"\n`;
	
	const translation = translations[entry.msgid] || '';
	newEntries += `msgstr "${translation}"\n\n`;
	addedCount++;
}

// Находим место для вставки (после последнего перевода, перед концом файла)
// Ищем последний непустой msgstr
let insertPos = poContent.length;
const lastMsgstrMatch = poContent.match(/msgstr "[^"]*"\n\n/g);
if (lastMsgstrMatch) {
	const lastMatch = lastMsgstrMatch[lastMsgstrMatch.length - 1];
	insertPos = poContent.lastIndexOf(lastMatch) + lastMatch.length;
}

// Вставляем новые записи
poContent = poContent.substring(0, insertPos) + newEntries + poContent.substring(insertPos);

// Сохраняем
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${addedCount} missing entries to PO file`);
console.log(`📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');














