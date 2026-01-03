const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🌐 Translating all English strings to Russian...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Словарь переводов общих слов
const wordDict = {
	// Common words
	'title': 'заголовок',
	'subtitle': 'подзаголовок',
	'paragraph': 'параграф',
	'text': 'текст',
	'body': 'тело',
	'wrapper': 'обёртка',
	'card': 'карточка',
	'item': 'элемент',
	'items': 'элементы',
	'tab': 'вкладка',
	'tabs': 'вкладки',
	'post': 'запись',
	'posts': 'записи',
	'link': 'ссылка',
	'links': 'ссылки',
	'column': 'колонка',
	'columns': 'колонки',
	'image': 'изображение',
	'images': 'изображения',
	'icon': 'иконка',
	'icons': 'иконки',
	'button': 'кнопка',
	'buttons': 'кнопки',
	'form': 'форма',
	'forms': 'формы',
	'field': 'поле',
	'fields': 'поля',
	'user': 'пользователь',
	'users': 'пользователи',
	'video': 'видео',
	'pattern': 'паттерн',
	'option': 'опция',
	'options': 'опции',
	'settings': 'настройки',
	'setting': 'настройка',
	'type': 'тип',
	'size': 'размер',
	'color': 'цвет',
	'colors': 'цвета',
	'style': 'стиль',
	'styles': 'стили',
	'class': 'класс',
	'classes': 'классы',
	'data': 'данные',
	'id': 'ID',
	'name': 'имя',
	'position': 'позиция',
	'direction': 'направление',
	'source': 'источник',
	'template': 'шаблон',
	'document': 'документ',
	'archive': 'архив',
	'banner': 'баннер',
	'modal': 'модальное окно',
	'phone': 'телефон',
	'poster': 'постер',
	'combination': 'комбинация',
	'marker': 'маркер',
	'markers': 'маркеры',
	'hotspot': 'точка',
	'hotspots': 'точки',
	'point': 'точка',
	'points': 'точки',
	'consent': 'согласие',
	'list': 'список',
	'lists': 'списки',
	'accordion': 'аккордеон',
	'selected': 'выбранный',
	'custom': 'пользовательский',
	'client': 'клиент',
	'clients': 'клиенты',
	'page': 'страница',
	'pages': 'страницы',
};

// Функция для перевода слова
function translateWord(word) {
	const lower = word.toLowerCase();
	return wordDict[lower] || word;
}

// Функция для перевода фразы
function translatePhrase(text) {
	// Enable/Disable
	if (/^Enable (.+)$/i.test(text)) {
		const match = text.match(/^Enable (.+)$/i);
		const rest = match[1];
		// Если это просто слово, переводим его
		if (!/\s/.test(rest)) {
			return `Включить ${translateWord(rest)}`;
		}
		// Если это фраза, переводим каждое слово
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Включить ${words}`;
	}
	
	if (/^Disable (.+)$/i.test(text)) {
		const match = text.match(/^Disable (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Отключить ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Отключить ${words}`;
	}
	
	// Add
	if (/^\+ Add (.+)$/i.test(text)) {
		const match = text.match(/^\+ Add (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `+ Добавить ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `+ Добавить ${words}`;
	}
	
	if (/^Add (.+)$/i.test(text)) {
		const match = text.match(/^Add (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Добавить ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Добавить ${words}`;
	}
	
	// Select
	if (/^Select (.+)$/i.test(text)) {
		const match = text.match(/^Select (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Выбрать ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Выбрать ${words}`;
	}
	
	if (/^-- Select (.+) --$/i.test(text)) {
		const match = text.match(/^-- Select (.+) --$/i);
		const rest = match[1];
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `-- Выбрать ${words} --`;
	}
	
	// Remove
	if (/^Remove (.+)$/i.test(text)) {
		const match = text.match(/^Remove (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Удалить ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Удалить ${words}`;
	}
	
	// Show/Hide
	if (/^Show (.+)$/i.test(text)) {
		const match = text.match(/^Show (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Показать ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Показать ${words}`;
	}
	
	if (/^Hide (.+)$/i.test(text)) {
		const match = text.match(/^Hide (.+)$/i);
		const rest = match[1];
		if (!/\s/.test(rest)) {
			return `Скрыть ${translateWord(rest)}`;
		}
		const words = rest.split(/\s+/).map(w => translateWord(w)).join(' ');
		return `Скрыть ${words}`;
	}
	
	// Простые слова
	if (wordDict[text.toLowerCase()]) {
		return wordDict[text.toLowerCase()];
	}
	
	// Если не нашли паттерн, возвращаем пустую строку
	return '';
}

// Находим все случаи, где msgstr пустой или идентичен msgid
const emptyPattern = /msgid "([^"]+)"\s*\nmsgstr "([^"]*)"/g;
let fixedCount = 0;
let skippedCount = 0;

poContent = poContent.replace(emptyPattern, (match, msgid, msgstr) => {
	// Пропускаем пустые msgid и технические строки
	if (msgid === '' || msgid.trim() === '' || /^[A-Z0-9\s\-_]+$/.test(msgid) && msgid.length < 10) {
		return match;
	}
	
	// Если уже есть перевод (не пустой и не идентичен msgid), пропускаем
	if (msgstr && msgstr !== '' && msgstr !== msgid) {
		return match;
	}
	
	// Пробуем перевести
	const translation = translatePhrase(msgid);
	
	if (translation && translation !== '') {
		fixedCount++;
		const escapedTranslation = translation.replace(/"/g, '\\"');
		return `msgid "${msgid}"\nmsgstr "${escapedTranslation}"`;
	}
	
	skippedCount++;
	return match;
});

// Сохраняем исправленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Translated ${fixedCount} strings automatically`);
console.log(`⚠️  ${skippedCount} strings need manual translation`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');


