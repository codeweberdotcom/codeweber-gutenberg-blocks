const fs = require('fs');
const path = require('path');

const potPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks.pot');
const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🌐 Translating all 425 remaining strings...\n');

// Читаем файлы
const potContent = fs.readFileSync(potPath, 'utf8');
let poContent = fs.readFileSync(poPath, 'utf8');

// Парсим PO файл - находим все пустые переводы (включая многострочные)
const emptyTranslations = [];
const poLines = poContent.split('\n');

for (let i = 0; i < poLines.length; i++) {
	const line = poLines[i];
	if (line.match(/^msgid "/)) {
		const match = line.match(/^msgid "(.+)"$/);
		if (match && i + 1 < poLines.length) {
			const msgid = match[1];
			const nextLine = poLines[i + 1];
			// Проверяем пустой msgstr (может быть на следующей строке или через одну)
			if (nextLine.match(/^msgstr ""$/) || 
			    (nextLine === '' && i + 2 < poLines.length && poLines[i + 2].match(/^msgstr ""$/))) {
				if (msgid && msgid.length > 2) {
					// Находим комментарий перед msgid
					let comment = '';
					for (let j = i - 1; j >= 0; j--) {
						if (poLines[j].startsWith('#:')) {
							comment = poLines[j];
							break;
						}
					}
					emptyTranslations.push({ msgid, comment, lineIndex: i });
				}
			}
		}
	}
}

// Также ищем через regex для надежности
const regex = /msgid "([^"]+)"\s*\nmsgstr ""/g;
let match;
while ((match = regex.exec(poContent)) !== null) {
	const msgid = match[1];
	if (msgid && msgid.length > 2) {
		// Проверяем, не добавлен ли уже
		if (!emptyTranslations.find(e => e.msgid === msgid)) {
			emptyTranslations.push({ msgid, comment: '', lineIndex: -1 });
		}
	}
}

console.log(`Found ${emptyTranslations.length} empty translations in PO file`);

// Расширенный словарь переводов
const translations = {
	'Show previous/next navigation arrows to manually change slides.': 'Показать стрелки навигации влево/вправо для ручной смены слайдов.',
	'Simple layout with figure overlay and post header/footer': 'Простая компоновка с наложением изображения и заголовком/подвалом записи',
	'When enabled, multiple accordion items can be open at the same time.': 'При включении несколько элементов аккордеона могут быть открыты одновременно.',
	'No posts found. Please select a post type and check your filters.': 'Записи не найдены. Пожалуйста, выберите тип записи и проверьте ваши фильтры.',
	'Replace existing label text with default text for this document?': 'Заменить существующий текст метки на текст по умолчанию для этого документа?',
	'Field will be shown only for non-logged-in users (guests)': 'Поле будет показано только для неавторизованных пользователей (гостей)',
	
	// Video Poster and related (если еще не добавлены)
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
	
	// Common
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
	
	// Additional translations from empty strings
	'Circle': 'Круг',
	'Click': 'Клик',
	'Codeweber': 'Codeweber',
	'Codeweber Gutenberg Elements': 'Элементы Codeweber Gutenberg',
	'Copy shortcode': 'Копировать шорткод',
	'Delete Point': 'Удалить точку',
	'Edit Point': 'Редактировать точку',
	'Failed to copy shortcode': 'Не удалось скопировать шорткод',
	'First select the type of post (Post, Page, Client, etc.)': 'Сначала выберите тип записи (Запись, Страница, Клиент и т.д.)',
	'Focus': 'Фокус',
	'Global shape for all hotspot buttons': 'Глобальная форма для всех кнопок точек',
	'Global size for all hotspot buttons': 'Глобальный размер для всех кнопок точек',
	'Global style for all hotspot buttons': 'Глобальный стиль для всех кнопок точек',
	'Hotspot Editor': 'Редактор точек',
	'https://naviddev.com': 'https://naviddev.com',
	'Hybrid (Text + Post)': 'Гибридный (Текст + Запись)',
	'Interactive image hotspots with tooltips and popups': 'Интерактивные точки на изображении с подсказками и всплывающими окнами',
	'Learn more': 'Узнать больше',
	'Medium': 'Средний',
	'New Image Hotspot': 'Новая точка на изображении',
	'Popover Placement': 'Позиция отображения popover',
	'Popover Trigger': 'Способ открытия Bootstrap Popover',
	'Post content will be loaded via AJAX when popover opens.': 'Содержимое записи будет загружено через AJAX при открытии всплывающего окна.',
	'Save': 'Сохранить',
	'Search Hotspots': 'Поиск точек',
	'Shortcode': 'Шорткод',
	'Upload an image to start adding hotspots': 'Загрузите изображение, чтобы начать добавлять точки',
	'View Image Hotspot': 'Просмотреть точку на изображении',
	'Yandex Maps API key is not configured.': 'API ключ Яндекс.Карт не настроен.',
	'Yandex Maps class is not available.': 'Класс Яндекс.Карт недоступен.',
	'Позиция отображения popover': 'Позиция отображения popover',
	'Способ открытия Bootstrap Popover': 'Способ открытия Bootstrap Popover',
	'Theme': 'Тема',
	'Banner 1': 'Баннер 1',
	'Banner 2': 'Баннер 2',
	'Banner 3': 'Баннер 3',
	'Banner 4': 'Баннер 4',
	'Banner 6': 'Баннер 6',
	'Banner 7': 'Баннер 7',
	'Banner 8': 'Баннер 8',
	'Banner 10': 'Баннер 10',
	'Banner 11': 'Баннер 11',
	'Banner 14': 'Баннер 14',
	'Banner 15': 'Баннер 15',
	'Banner 16': 'Баннер 16',
	'Banner 18': 'Баннер 18',
	'Banner 20': 'Баннер 20',
	'Banner 23': 'Баннер 23',
	'Banner 24': 'Баннер 24',
	'Banner 25': 'Баннер 25',
	'Banner 27': 'Баннер 27',
	'Banner 29': 'Баннер 29',
	'Banner 30': 'Баннер 30',
	'Banner 32': 'Баннер 32',
	'Banner 34': 'Баннер 34',
	'Apply column width to all child columns:': 'Применить ширину колонки ко всем дочерним колонкам:',
	'Double': 'Двойной',
	'Enter margin class (e.g., my-8, mt-4)': 'Введите класс отступа (например, my-8, mt-4)',
	'Enter margin class (e.g., my-8, mb-4)': 'Введите класс отступа (например, my-8, mb-4)',
	'Gradient Cards Template': 'Шаблон градиентных карточек',
	'Read more': 'Читать далее',
	'Наши преимущества': 'Наши преимущества',
	'Быстрая доставка': 'Быстрая доставка',
	'Выгодные цены': 'Выгодные цены',
	'Гарантия качества': 'Гарантия качества',
	'Индивидуальный подход': 'Индивидуальный подход',
	'Опыт и экспертиза': 'Опыт и экспертиза',
	'Email': 'Email',
	'Max file size': 'Максимальный размер файла',
	'Max files': 'Максимум файлов',
	'Value': 'Значение',
	'Place a submit button inside this field (inline button layout)': 'Разместить кнопку отправки внутри этого поля (встроенная кнопка)',
	'Mask': 'Маска',
	'Mask caret': 'Маска каретка',
	'Mask soft caret': 'Маска мягкая каретка',
	'Maximum size per file (e.g., 5MB, 500KB)': 'Максимальный размер файла (например, 5MB, 500KB)',
	'Maximum total size for all files (e.g., 50MB, 1GB)': 'Максимальный общий размер всех файлов (например, 50MB, 1GB)',
	'Thank you! Your message has been sent.': 'Спасибо! Ваше сообщение отправлено.',
	'An error occurred. Please try again.': 'Произошла ошибка. Пожалуйста, попробуйте снова.',
	'Feedback form': 'Форма обратной связи',
	'Your Review': 'Ваш отзыв',
	'Submit Review': 'Отправить отзыв',
	'Message shown after successful form submission': 'Сообщение, отображаемое после успешной отправки формы',
	'Message shown when form submission fails': 'Сообщение, отображаемое при ошибке отправки формы',
	'-- Выберите блок --': '-- Выберите блок --',
	'Ошибка загрузки контента': 'Ошибка загрузки контента',
	'Настройки HTML блока': 'Настройки HTML блока',
	'Загрузка блоков...': 'Загрузка блоков...',
	'Выберите HTML блок': 'Выберите HTML блок',
	'Выберите блок из CPT html_blocks для отображения': 'Выберите блок из CPT html_blocks для отображения',
	'Дополнительные настройки': 'Дополнительные настройки',
	'CSS класс': 'CSS класс',
	'Data атрибуты': 'Data атрибуты',
	'ID элемента': 'ID элемента',
	'Выберите HTML блок из списка в настройках': 'Выберите HTML блок из списка в настройках',
	'Загрузка контента...': 'Загрузка контента...',
	'Use CSS units, e.g. 10% or 20px': 'Используйте CSS единицы, например 10% или 20px',
	'Use CSS units, e.g. -3% or 0': 'Используйте CSS единицы, например -3% или 0',
	'25000+': '25000+',
	'Happy Clients': 'Довольных клиентов',
	
	// Remaining 87 strings
	'Video Player (Preview)': 'Плеер видео (Предпросмотр)',
	'Paste embed code': 'Вставьте embed код',
	'Mask 1': 'Маска 1',
	'Mask 2': 'Маска 2',
	'Mask 3': 'Маска 3',
	'Embed Code': 'Embed код',
	'Swiper Wrapper Class': 'Класс обёртки Swiper',
	'Class will be applied to swiper-wrapper element': 'Класс будет применён к элементу swiper-wrapper',
	'Class will be applied to all swiper-slide elements': 'Класс будет применён ко всем элементам swiper-slide',
	'Items (default)': 'Элементы (по умолчанию)',
	'Cube': 'Куб',
	'Latitude': 'Широта',
	'Longitude': 'Долгота',
	'Coordinates': 'Координаты',
	'Working Hours': 'Часы работы',
	'City': 'Город',
	'Category': 'Категория',
	'Delete this marker?': 'Удалить этот маркер?',
	'Edit': 'Редактировать',
	'Limit number of offices': 'Ограничить количество офисов',
	'Hold Ctrl/Cmd to select multiple cities': 'Удерживайте Ctrl/Cmd для выбора нескольких городов',
	'Hold Ctrl/Cmd to select multiple categories': 'Удерживайте Ctrl/Cmd для выбора нескольких категорий',
	'Yandex Map': 'Яндекс.Карта',
	'Offices Map Preview': 'Предпросмотр карты офисов',
	'Custom Markers Map Preview': 'Предпросмотр карты с пользовательскими маркерами',
	'Map will be rendered on the frontend': 'Карта будет отображена на фронтенде',
	'Markers': 'Маркеры',
	'Sidebar': 'Боковая панель',
	'Satellite': 'Спутник',
	'Hybrid': 'Гибридный',
	'Red Dot': 'Красная точка',
	'Blue Dot': 'Синяя точка',
	'Dark Blue Dot': 'Тёмно-синяя точка',
	'Orange Dot': 'Оранжевая точка',
	'Violet Cluster': 'Фиолетовый кластер',
	'Blue Cluster': 'Синий кластер',
	'Red Cluster': 'Красный кластер',
	'Offices from CPT': 'Офисы из CPT',
	'Zoom Level': 'Уровень масштаба',
	'Offices Query': 'Запрос офисов',
	'Marker Display': 'Отображение маркера',
	'Logo': 'Логотип',
	'Marker Preset': 'Пресет маркера',
	'Auto Open Balloon': 'Автоматически открывать балун',
	'Sidebar Title': 'Заголовок боковой панели',
	'Sidebar Item Fields': 'Поля элементов боковой панели',
	'Map Controls': 'Элементы управления картой',
	'Geolocation Control': 'Управление геолокацией',
	'Scroll Zoom': 'Масштаб прокруткой',
	'Drag': 'Перетаскивание',
	'Double Click Zoom': 'Масштаб двойным кликом',
	'Automatically adjust map bounds to fit all markers': 'Автоматически подогнать границы карты под все маркеры',
	'Clustering': 'Кластеризация',
	'Cluster Preset': 'Пресет кластера',
	'Balloon Max Width': 'Максимальная ширина балуна',
	'Balloon Fields': 'Поля балуна',
	'Available': 'Доступно',
	'All': 'Все',
	'1px': '1px',
	'2px': '2px',
	'3px': '3px',
	'4px': '4px',
	'5px': '5px',
	'Spacing between grid items (both axes)': 'Промежуток между элементами сетки (обе оси)',
	'Horizontal spacing between grid items': 'Горизонтальный промежуток между элементами сетки',
	'Vertical spacing between grid items': 'Вертикальный промежуток между элементами сетки',
	'Choose between padding (inside) or margin (outside)': 'Выберите между padding (внутри) или margin (снаружи)',
	'For Lineal icons, only outline style is available': 'Для Lineal иконок доступен только стиль outline',
	'For Solid icons, filled styles are available': 'Для Solid иконок доступны заполненные стили',
	'Simple Effects (Choose One)': 'Простые эффекты (Выберите один)',
	'Lift': 'Подъём',
	'Advanced Effects (Choose One)': 'Расширенные эффекты (Выберите один)',
	'Outline': 'Контур',
	'Basic testimonial card with rating, text, avatar and author': 'Базовая карточка отзыва с рейтингом, текстом, аватаром и автором',
	'Card with colored backgrounds (Sandbox style)': 'Карточка с цветными фонами (стиль Sandbox)',
	'Simple blockquote with icon, without rating': 'Простая цитата с иконкой, без рейтинга',
	'FAQ card with icon, question and answer': 'Карточка FAQ с иконкой, вопросом и ответом',
	'Basic staff card with image, name and position': 'Базовая карточка сотрудника с изображением, именем и должностью',
	'Circular avatar with social links': 'Круглый аватар с социальными ссылками',
	'Circular avatar centered with social links': 'Круглый аватар по центру с социальными ссылками',
	'Circle Center Alt': 'Круг по центру Alt',
	'Circular avatar centered with link on image and social links': 'Круглый аватар по центру со ссылкой на изображении и социальными ссылками',
	'None (col)': 'Нет (col)',
	'Auto (col-auto)': 'Авто (col-auto)',
	'Set column width for each breakpoint (based on 12-column grid)': 'Установить ширину колонки для каждой точки останова (на основе 12-колоночной сетки)',
	'Archive': 'Архив',
	'Формы': 'Формы',
};

// Функция для автоматического перевода
function autoTranslate(msgid) {
	// Проверяем словарь
	if (translations[msgid]) {
		return translations[msgid];
	}
	
	// Паттерны для автоматического перевода
	const patterns = [
		[/^(.+) Settings$/, (m) => `Настройки ${m[1].toLowerCase()}`],
		[/^Enable (.+)$/, (m) => `Включить ${m[1].toLowerCase()}`],
		[/^Disable (.+)$/, (m) => `Отключить ${m[1].toLowerCase()}`],
		[/^Show (.+)$/, (m) => `Показать ${m[1].toLowerCase()}`],
		[/^Hide (.+)$/, (m) => `Скрыть ${m[1].toLowerCase()}`],
		[/^Select (.+)$/, (m) => `Выбрать ${m[1].toLowerCase()}`],
		[/^Add (.+)$/, (m) => `Добавить ${m[1].toLowerCase()}`],
		[/^Remove (.+)$/, (m) => `Удалить ${m[1].toLowerCase()}`],
		[/^(.+) URL$/, (m) => `URL ${m[1].toLowerCase()}`],
		[/^(.+) ID$/, (m) => `ID ${m[1].toLowerCase()}`],
	];
	
	for (const [pattern, fn] of patterns) {
		const match = msgid.match(pattern);
		if (match) {
			return fn(match);
		}
	}
	
	return '';
}

// Заменяем пустые переводы
let fixedCount = 0;
let skippedCount = 0;

for (const entry of emptyTranslations) {
	const translation = translations[entry.msgid] || autoTranslate(entry.msgid);
	
	if (translation) {
		// Экранируем специальные символы
		const escapedMsgid = entry.msgid.replace(/"/g, '\\"').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedTranslation = translation.replace(/"/g, '\\"');
		
		// Ищем и заменяем
		const pattern = new RegExp(
			`(msgid "${escapedMsgid}"\\s*\\nmsgstr ")(")`,
			'g'
		);
		
		if (poContent.match(pattern)) {
			poContent = poContent.replace(pattern, `$1${escapedTranslation}"`);
			fixedCount++;
		}
	} else {
		skippedCount++;
	}
}

// Сохраняем
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Translated ${fixedCount} strings`);
console.log(`⚠️  ${skippedCount} strings need manual translation`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 For remaining strings, sync PO with POT in Loco Translate, then run this script again');
console.log('   Run: npm run i18n:compile to compile translations\n');

