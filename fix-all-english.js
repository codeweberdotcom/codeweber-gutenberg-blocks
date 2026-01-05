const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🔧 Finding and fixing all English translations in Russian PO file...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Находим все случаи, где msgstr идентичен msgid (английский текст скопирован)
const pattern = /msgid "([^"]+)"\s*\nmsgstr "\1"/g;
const matches = [];
let match;

while ((match = pattern.exec(poContent)) !== null) {
	const msgid = match[1];
	// Пропускаем пустые строки, технические строки и очень короткие
	if (msgid && msgid.trim() !== '' && msgid.length > 3 && !/^[A-Z0-9\s\-_]+$/.test(msgid) || msgid.length > 10) {
		matches.push(msgid);
	}
}

console.log(`Found ${matches.length} strings with English text copied as translation\n`);

// Создаем расширенный словарь переводов
const translations = {};

// Добавляем все найденные строки в словарь с базовыми переводами
matches.forEach(msgid => {
	if (!translations[msgid]) {
		// Простые правила автоматического перевода
		let translation = msgid;
		
		// Enable/Disable patterns
		if (/^Enable (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Enable (.+)$/i);
			const text = match[1];
			translation = `Включить ${text.toLowerCase()}`;
		} else if (/^Disable (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Disable (.+)$/i);
			const text = match[1];
			translation = `Отключить ${text.toLowerCase()}`;
		}
		// Add patterns
		else if (/^\+ Add (.+)$/i.test(msgid)) {
			const match = msgid.match(/^\+ Add (.+)$/i);
			const text = match[1];
			translation = `+ Добавить ${text.toLowerCase()}`;
		} else if (/^Add (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Add (.+)$/i);
			const text = match[1];
			translation = `Добавить ${text.toLowerCase()}`;
		}
		// Select patterns
		else if (/^Select (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Select (.+)$/i);
			const text = match[1];
			translation = `Выбрать ${text.toLowerCase()}`;
		} else if (/^-- Select (.+) --$/i.test(msgid)) {
			const match = msgid.match(/^-- Select (.+) --$/i);
			const text = match[1];
			translation = `-- Выбрать ${text.toLowerCase()} --`;
		}
		// Remove patterns
		else if (/^Remove (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Remove (.+)$/i);
			const text = match[1];
			translation = `Удалить ${text.toLowerCase()}`;
		}
		// Show/Hide patterns
		else if (/^Show (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Show (.+)$/i);
			const text = match[1];
			translation = `Показать ${text.toLowerCase()}`;
		} else if (/^Hide (.+)$/i.test(msgid)) {
			const match = msgid.match(/^Hide (.+)$/i);
			const text = match[1];
			translation = `Скрыть ${text.toLowerCase()}`;
		}
		// Common words
		else {
			// Если не нашли паттерн, оставляем пустым для ручного перевода
			translation = '';
		}
		
		if (translation !== msgid && translation !== '') {
			translations[msgid] = translation;
		}
	}
});

// Заменяем все найденные случаи
let fixedCount = 0;
for (const [msgid, translation] of Object.entries(translations)) {
	if (translation && translation !== '') {
		const escapedMsgid = msgid.replace(/"/g, '\\"').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedTranslation = translation.replace(/"/g, '\\"');
		
		const replacePattern = new RegExp(
			`(msgid "${escapedMsgid}"\\s*\\nmsgstr ")${escapedMsgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`,
			'g'
		);
		
		if (poContent.match(replacePattern)) {
			poContent = poContent.replace(replacePattern, `$1${escapedTranslation}"`);
			fixedCount++;
		}
	}
}

// Для остальных случаев, где msgstr = msgid, заменяем на пустую строку (для ручного перевода)
const emptyPattern = /(msgid "([^"]+)"\s*\nmsgstr ")\2(")/g;
let emptiedCount = 0;

poContent = poContent.replace(emptyPattern, (match, prefix, msgid, suffix) => {
	// Пропускаем пустые строки, технические строки
	if (msgid === '' || msgid.trim() === '' || /^[A-Z0-9\s\-_]+$/.test(msgid) && msgid.length < 10) {
		return match;
	}
	
	// Если уже есть перевод в словаре, пропускаем
	if (translations[msgid]) {
		return match;
	}
	
	// Заменяем на пустую строку для ручного перевода
	emptiedCount++;
	return prefix + suffix;
});

// Сохраняем исправленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Fixed ${fixedCount} translations with automatic rules`);
console.log(`✅ Emptied ${emptiedCount} strings for manual translation`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Remaining strings need manual translation in Loco Translate');
console.log('   Run: npm run i18n:compile to compile translations\n');














