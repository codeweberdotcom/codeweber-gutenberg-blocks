const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🔧 Fixing English translations in Russian PO file...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Словарь переводов для исправления
const translations = {
	// Enable/Disable
	'Enable Angled Divider': 'Включить угловой разделитель',
	'Enable Animation': 'Включить анимацию',
	'Enable Autoplay': 'Включить автовоспроизведение',
	'Enable Background': 'Включить фон',
	'Enable background color for bullet icons': 'Включить цвет фона для иконок маркеров',
	'Enable Bottom Wave': 'Включить нижнюю волну',
	'Enable Button': 'Включить кнопку',
	'Enable links to client posts (disabled by default)': 'Включить ссылки на записи клиентов (по умолчанию отключено)',
	'Enable links to post pages': 'Включить ссылки на страницы записей',
	'Enable Rate Limiting': 'Включить ограничение частоты запросов',
	'Enable to show name and position': 'Включить отображение имени и должности',
	'Enable Top Wave': 'Включить верхнюю волну',
	'Enable Video Lightbox': 'Включить лайтбокс для видео',
	
	// Add
	'Add Image': 'Добавить изображение',
	'Add Images': 'Добавить изображения',
	'Add Marker': 'Добавить маркер',
	'Add New Hotspot': 'Добавить новую точку',
	'Add New Image Hotspot': 'Добавить новую точку на изображении',
	'Add Point': 'Добавить точку',
	'Add your content here...': 'Добавьте ваш контент здесь...',
	
	// Additional
	'Additional CSS Classes': 'Дополнительные CSS классы',
	'Additional CSS classes': 'Дополнительные CSS классы',
	'Additional Data': 'Дополнительные данные',
	'Additional help text below the field': 'Дополнительный текст помощи под полем',
	'Additional icon class': 'Дополнительный класс иконки',
	'Additional wrapper classes': 'Дополнительные классы обёртки',
	
	// Other
	'Address': 'Адрес',
	'Adds wrapper for positioning or styling': 'Добавляет обёртку для позиционирования или стилизации',
	'Select': 'Выбрать',
	'Select a user': 'Выбрать пользователя',
	
	// More common strings that might be duplicated
	'Enable Captcha': 'Включить капчу',
	'Enable Clustering': 'Включить кластеризацию',
	'Enable Lightbox': 'Включить лайтбокс',
	'Enable Links': 'Включить ссылки',
	'Enable Paragraph': 'Включить параграф',
	'Enable Subtitle': 'Включить подзаголовок',
	'Enable Title': 'Включить заголовок',
	
	// Select
	'Select Archive': 'Выбрать архив',
	'Select Banner Type': 'Выбрать тип баннера',
	'Select CF7': 'Выбрать CF7',
	'Select combination': 'Выбрать комбинацию',
	'Select data source for markers': 'Выбрать источник данных для маркеров',
	'Select Document': 'Выбрать документ',
	'Select element type: button or link': 'Выбрать тип элемента: кнопка или ссылка',
	'Select Form': 'Выбрать форму',
	'Select how to sort the posts': 'Выбрать способ сортировки записей',
	'Select icon': 'Выбрать иконку',
	'Select icon in settings': 'Выбрать иконку в настройках',
	'Select Image': 'Выбрать изображение',
	'Select Modal': 'Выбрать модальное окно',
	'Select Option': 'Выбрать опцию',
	'Select option': 'Выбрать опцию',
	'Select Pattern': 'Выбрать паттерн',
	'Select Phone': 'Выбрать телефон',
	'Select Poster': 'Выбрать постер',
	'Select sort direction': 'Выбрать направление сортировки',
	'Select text for button or link': 'Выбрать текст для кнопки или ссылки',
	'Select the post type to display': 'Выбрать тип записи для отображения',
	'Select the post type to generate accordion items from': 'Выбрать тип записи для генерации элементов аккордеона',
	'Select the post type to generate list items from': 'Выбрать тип записи для генерации элементов списка',
	'Select the size for featured images.': 'Выбрать размер для изображений записи.',
	'Select the template to display the post card.': 'Выбрать шаблон для отображения карточки записи.',
	'Select the type of form. This determines how the form is processed.': 'Выбрать тип формы. Это определяет, как обрабатывается форма.',
	'Select the type of post to display': 'Выбрать тип записи для отображения',
	'Select User': 'Выбрать пользователя',
	'Select Video': 'Выбрать видео',
	'Select...': 'Выбрать...',
	'Selected Icon': 'Выбранная иконка',
	'Selected Images:': 'Выбранные изображения:',
};

// Функция для замены перевода
function fixTranslation(msgid, translation) {
	// Экранируем специальные символы для PO файла
	const escapedMsgid = msgid.replace(/"/g, '\\"').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const escapedTranslation = translation.replace(/"/g, '\\"');
	
	// Ищем паттерн: msgid "..." за которым следует msgstr с английским текстом
	const pattern = new RegExp(
		`(msgid "${escapedMsgid}"\\s*\\nmsgstr ")${escapedMsgid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`,
		'g'
	);
	
	// Заменяем английский текст на русский перевод
	const replacement = `$1${escapedTranslation}"`;
	
	if (poContent.match(pattern)) {
		poContent = poContent.replace(pattern, replacement);
		return true;
	}
	
	return false;
}

// Исправляем переводы
let fixedCount = 0;
for (const [msgid, translation] of Object.entries(translations)) {
	if (fixTranslation(msgid, translation)) {
		fixedCount++;
	}
}

// Также ищем все случаи, где msgstr совпадает с msgid (английский текст скопирован)
const englishPattern = /(msgid "([^"]+)"\s*\nmsgstr ")\2(")/g;
let autoFixed = 0;

poContent = poContent.replace(englishPattern, (match, prefix, msgid, suffix) => {
	// Пропускаем пустые строки и технические строки
	if (msgid === '' || msgid.trim() === '' || /^[A-Z0-9\s\-_]+$/.test(msgid) && msgid.length < 10) {
		return match;
	}
	
	// Если есть перевод в словаре, используем его
	if (translations[msgid]) {
		autoFixed++;
		const escapedTranslation = translations[msgid].replace(/"/g, '\\"');
		return prefix + escapedTranslation + suffix;
	}
	
	// Для остальных оставляем как есть (потребуется ручной перевод)
	return match;
});

// Сохраняем исправленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Fixed ${fixedCount} translations from dictionary`);
console.log(`✅ Auto-fixed ${autoFixed} additional English translations`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');

