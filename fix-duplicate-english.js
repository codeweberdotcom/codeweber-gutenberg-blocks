const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🔧 Finding and fixing all duplicate English strings...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Находим все случаи, где msgstr идентичен msgid (английский текст скопирован)
const pattern = /msgid "([^"]+)"\s*\nmsgstr "\1"/g;
const duplicates = [];
let match;

while ((match = pattern.exec(poContent)) !== null) {
	const msgid = match[1];
	// Пропускаем пустые строки, технические строки и очень короткие
	if (msgid && msgid.trim() !== '' && msgid.length > 3) {
		// Пропускаем только если это чисто техническая строка (цифры, заглавные буквы)
		if (!(/^[A-Z0-9\s\-_]+$/.test(msgid) && msgid.length < 15)) {
			duplicates.push(msgid);
		}
	}
}

console.log(`Found ${duplicates.length} strings where English text is duplicated as translation\n`);

// Заменяем все найденные случаи на пустые строки (для ручного перевода)
// Это лучше, чем оставлять английский текст
let fixedCount = 0;

for (const msgid of duplicates) {
	const escapedMsgid = msgid.replace(/"/g, '\\"').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const replacePattern = new RegExp(
		`(msgid "${escapedMsgid}"\\s*\\nmsgstr ")${escapedMsgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`,
		'g'
	);
	
	if (poContent.match(replacePattern)) {
		poContent = poContent.replace(replacePattern, `$1$2`);
		fixedCount++;
	}
}

// Сохраняем исправленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Fixed ${fixedCount} duplicate English strings (replaced with empty for manual translation)`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 These strings now have empty translations and need to be translated in Loco Translate');
console.log('   Run: npm run i18n:compile to compile translations\n');















