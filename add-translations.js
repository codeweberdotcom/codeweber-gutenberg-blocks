const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('📝 Adding Russian translations to PO file...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Словарь переводов для часто используемых строк
const translations = {
	// Card block
	'Enable Card Wrapper': 'Включить обёртку карточки',
	'Enable Card Body': 'Включить тело карточки',
	'Overflow Hidden': 'Скрыть переполнение',
	'H-100': 'Высота 100%',
	'Card Class': 'Класс карточки',
	'Card Data': 'Данные карточки',
	'Card ID': 'ID карточки',
	
	// Common
	'General': 'Общее',
	'Borders': 'Границы',
	'Spacing': 'Отступы',
	'Position': 'Позиция',
	'Background': 'Фон',
	'Animation': 'Анимация',
	'Settings': 'Настройки',
	
	// Enable/Disable
	'Enable Title': 'Включить заголовок',
	'Enable Subtitle': 'Включить подзаголовок',
	'Enable Paragraph': 'Включить параграф',
	'Enable Captcha': 'Включить капчу',
	'Enable Clustering': 'Включить кластеризацию',
	'Enable Lightbox': 'Включить лайтбокс',
	'Enable Links': 'Включить ссылки',
	
	// Text fields
	'Title Text': 'Текст заголовка',
	'Subtitle Text': 'Текст подзаголовка',
	'Paragraph Text': 'Текст параграфа',
	'Enter title...': 'Введите заголовок...',
	'Enter subtitle...': 'Введите подзаголовок...',
	'Enter paragraph...': 'Введите параграф...',
	
	// Buttons
	'+ Add Accordion Item': '+ Добавить элемент аккордеона',
	'+ Add Consent': '+ Добавить согласие',
	'+ Add List Item': '+ Добавить элемент списка',
	'+ Add Tab': '+ Добавить вкладку',
	
	// Select
	'-- Select Post --': '-- Выберите запись --',
	'-- Select Post Type --': '-- Выберите тип записи --',
	'-- Выберите блок --': '-- Выберите блок --',
	
	// Columns
	'1 column': '1 колонка',
	'2 columns': '2 колонки',
	'10 columns': '10 колонок',
	'11 columns': '11 колонок',
	'12 columns': '12 колонок',
	
	// Borders
	'1px': '1px',
	
	// Other common
	'0': '0',
	'25000+': '25000+',
};

// Функция для добавления перевода
function addTranslation(msgid, translation) {
	// Экранируем специальные символы для PO файла
	const escapedMsgid = msgid.replace(/"/g, '\\"');
	const escapedTranslation = translation.replace(/"/g, '\\"');
	
	// Ищем паттерн: msgid "..." за которым следует msgstr ""
	const pattern = new RegExp(
		`(msgid "${escapedMsgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*\\nmsgstr ")(")`,
		'g'
	);
	
	// Заменяем пустой msgstr на перевод
	const replacement = `$1${escapedTranslation}"`;
	
	if (poContent.match(pattern)) {
		poContent = poContent.replace(pattern, replacement);
		return true;
	}
	
	return false;
}

// Добавляем переводы из словаря
let addedCount = 0;
for (const [msgid, translation] of Object.entries(translations)) {
	if (addTranslation(msgid, translation)) {
		addedCount++;
	}
}

// Для остальных строк без переводов добавляем автоматический перевод
// Используем более умную логику перевода
const emptyMsgstrPattern = /(msgid "([^"]+)"\s*\nmsgstr ")(")/g;
let autoTranslated = 0;

// Словарь простых слов для перевода
const wordTranslations = {
	'title': 'заголовок',
	'subtitle': 'подзаголовок',
	'paragraph': 'параграф',
	'text': 'текст',
	'body': 'тело',
	'wrapper': 'обёртка',
	'card': 'карточка',
	'item': 'элемент',
	'tab': 'вкладка',
	'post': 'запись',
	'link': 'ссылка',
	'links': 'ссылки',
	'column': 'колонка',
	'columns': 'колонки',
};

// Функция для автоматического перевода простых строк
function autoTranslate(msgid) {
	// Пропускаем технические строки и числа
	if (/^\d+$/.test(msgid) || (/^[A-Z0-9\s\-_]+$/.test(msgid) && msgid.length < 20)) {
		return msgid; // Оставляем как есть для технических строк
	}
	
	const lowerMsgid = msgid.toLowerCase();
	
	// Enable/Disable
	if (/^enable (.+)$/i.test(msgid)) {
		const match = msgid.match(/^enable (.+)$/i);
		const text = match[1].toLowerCase();
		const translated = wordTranslations[text] || text;
		return `Включить ${translated}`;
	}
	
	if (/^disable (.+)$/i.test(msgid)) {
		const match = msgid.match(/^disable (.+)$/i);
		const text = match[1].toLowerCase();
		const translated = wordTranslations[text] || text;
		return `Отключить ${translated}`;
	}
	
	// Add
	if (/^\+ add (.+)$/i.test(msgid)) {
		const match = msgid.match(/^\+ add (.+)$/i);
		const text = match[1].toLowerCase();
		const translated = wordTranslations[text] || text;
		return `+ Добавить ${translated}`;
	}
	
	// Select
	if (/^-- select (.+) --$/i.test(msgid)) {
		const match = msgid.match(/^-- select (.+) --$/i);
		const text = match[1].toLowerCase();
		const translated = wordTranslations[text] || text;
		return `-- Выберите ${translated} --`;
	}
	
	// Простые слова
	if (wordTranslations[lowerMsgid]) {
		return wordTranslations[lowerMsgid];
	}
	
	// Если не нашли правило, возвращаем оригинал (потребуется ручной перевод)
	return msgid;
}

poContent = poContent.replace(emptyMsgstrPattern, (match, prefix, msgid, emptyStr) => {
	// Пропускаем уже переведенные и пустые msgid
	if (msgid === '' || msgid.trim() === '') {
		return match;
	}
	
	// Если это строка, которая уже есть в словаре, пропускаем
	if (translations[msgid]) {
		return match;
	}
	
	// Пробуем автоматический перевод
	const translated = autoTranslate(msgid);
	if (translated !== msgid) {
		autoTranslated++;
		// Экранируем кавычки в переводе
		const escapedTranslation = translated.replace(/"/g, '\\"');
		return prefix + escapedTranslation + '"';
	}
	
	// Если не удалось перевести, оставляем оригинал (для ручного перевода)
	return match;
});

// Сохраняем обновленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${addedCount} translations from dictionary`);
console.log(`✅ Auto-translated ${autoTranslated} additional strings`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Note: Some translations may need manual review.');
console.log('   Run: npm run i18n:compile to compile translations\n');

