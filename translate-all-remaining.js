const fs = require('fs');
const path = require('path');

const potPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks.pot');
const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🌐 Translating all remaining strings...\n');

// Читаем файлы
const potContent = fs.readFileSync(potPath, 'utf8');
let poContent = fs.readFileSync(poPath, 'utf8');

// Парсим POT файл - извлекаем все msgid с контекстом
const potEntries = new Map();
const potLines = potContent.split('\n');

let currentComment = '';
let currentMsgid = '';
let inMsgid = false;

for (let i = 0; i < potLines.length; i++) {
	const line = potLines[i];
	
	if (line.startsWith('#:')) {
		currentComment = line;
	}
	
	if (line.startsWith('msgid "')) {
		inMsgid = true;
		const match = line.match(/^msgid "(.+)"$/);
		if (match) {
			currentMsgid = match[1];
		} else {
			// Многострочный msgid
			const match2 = line.match(/^msgid "(.*)$/);
			if (match2) {
				currentMsgid = match2[1];
			}
		}
	} else if (inMsgid && line.startsWith('"')) {
		// Продолжение многострочного msgid
		const match = line.match(/^"(.*)"$/);
		if (match) {
			currentMsgid += match[1];
		}
	} else if (line.startsWith('msgstr')) {
		if (currentMsgid && currentMsgid !== '') {
			potEntries.set(currentMsgid, {
				comment: currentComment,
				msgid: currentMsgid
			});
		}
		currentMsgid = '';
		inMsgid = false;
		currentComment = '';
	}
}

console.log(`Found ${potEntries.size} strings in POT file`);

// Парсим PO файл - извлекаем все существующие msgid
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

// Находим недостающие строки
const missing = [];
for (const [msgid, entry] of potEntries) {
	if (!existingMsgids.has(msgid)) {
		missing.push(entry);
	}
}

console.log(`\nFound ${missing.length} missing strings in PO file\n`);

// Расширенный словарь переводов
const translations = {
	// Video related
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
	
	// Common UI
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

// Функция для автоматического перевода
function autoTranslate(msgid) {
	// Проверяем словарь
	if (translations[msgid]) {
		return translations[msgid];
	}
	
	// Паттерны для автоматического перевода
	// "X Settings" -> "Настройки X"
	if (/^(.+) Settings$/.test(msgid)) {
		const match = msgid.match(/^(.+) Settings$/);
		const part = match[1].toLowerCase();
		return `Настройки ${part}`;
	}
	
	// "Enable X" -> "Включить X"
	if (/^Enable (.+)$/.test(msgid)) {
		const match = msgid.match(/^Enable (.+)$/);
		const part = match[1].toLowerCase();
		return `Включить ${part}`;
	}
	
	// "Disable X" -> "Отключить X"
	if (/^Disable (.+)$/.test(msgid)) {
		const match = msgid.match(/^Disable (.+)$/);
		const part = match[1].toLowerCase();
		return `Отключить ${part}`;
	}
	
	// "Show X" -> "Показать X"
	if (/^Show (.+)$/.test(msgid)) {
		const match = msgid.match(/^Show (.+)$/);
		const part = match[1].toLowerCase();
		return `Показать ${part}`;
	}
	
	// "Hide X" -> "Скрыть X"
	if (/^Hide (.+)$/.test(msgid)) {
		const match = msgid.match(/^Hide (.+)$/);
		const part = match[1].toLowerCase();
		return `Скрыть ${part}`;
	}
	
	// "Select X" -> "Выбрать X"
	if (/^Select (.+)$/.test(msgid)) {
		const match = msgid.match(/^Select (.+)$/);
		const part = match[1].toLowerCase();
		return `Выбрать ${part}`;
	}
	
	// "Add X" -> "Добавить X"
	if (/^Add (.+)$/.test(msgid)) {
		const match = msgid.match(/^Add (.+)$/);
		const part = match[1].toLowerCase();
		return `Добавить ${part}`;
	}
	
	// "Remove X" -> "Удалить X"
	if (/^Remove (.+)$/.test(msgid)) {
		const match = msgid.match(/^Remove (.+)$/);
		const part = match[1].toLowerCase();
		return `Удалить ${part}`;
	}
	
	// "X URL" -> "URL X"
	if (/^(.+) URL$/.test(msgid)) {
		const match = msgid.match(/^(.+) URL$/);
		const part = match[1].toLowerCase();
		return `URL ${part}`;
	}
	
	// "X ID" -> "ID X"
	if (/^(.+) ID$/.test(msgid)) {
		const match = msgid.match(/^(.+) ID$/);
		const part = match[1].toLowerCase();
		return `ID ${part}`;
	}
	
	// Если не нашли, возвращаем пустую строку
	return '';
}

// Добавляем недостающие строки в конец файла
let newEntries = '\n';
let addedCount = 0;
let translatedCount = 0;

for (const entry of missing) {
	newEntries += entry.comment + '\n';
	newEntries += `msgid "${entry.msgid}"\n`;
	
	const translation = translations[entry.msgid] || autoTranslate(entry.msgid);
	if (translation) {
		newEntries += `msgstr "${translation}"\n\n`;
		translatedCount++;
	} else {
		newEntries += `msgstr ""\n\n`;
	}
	addedCount++;
}

// Находим место для вставки (перед концом файла)
const lastNonEmpty = poContent.trimEnd();
const insertPos = lastNonEmpty.length;

// Вставляем новые записи
poContent = poContent.substring(0, insertPos) + newEntries;

// Сохраняем
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${addedCount} missing entries to PO file`);
console.log(`✅ Auto-translated ${translatedCount} strings`);
console.log(`⚠️  ${addedCount - translatedCount} strings need manual translation`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');















