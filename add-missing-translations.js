const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('🌐 Adding Russian translations for all missing strings...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Находим все пустые переводы
const emptyTranslations = [];
const lines = poContent.split('\n');

for (let i = 0; i < lines.length; i++) {
	if (lines[i].match(/^msgid "/) && i + 1 < lines.length && lines[i + 1].match(/^msgstr ""$/)) {
		const msgid = lines[i].replace(/^msgid "/, '').replace(/"$/, '');
		if (msgid && msgid.length > 2 && msgid !== '') {
			emptyTranslations.push(msgid);
		}
	}
}

console.log(`Found ${emptyTranslations.length} empty translations\n`);

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
	
	// Video URL
	'YouTube Video ID': 'ID YouTube видео',
	'Example: j_Y2Gwaj7Gs': 'Пример: j_Y2Gwaj7Gs',
	'Example: 15801179': 'Пример: 15801179',
	'Paste iframe or embed code': 'Вставьте iframe или embed код',
	
	// Common UI
	'Select': 'Выбрать',
	'Remove': 'Удалить',
	'Edit': 'Редактировать',
	'Delete': 'Удалить',
	'Cancel': 'Отмена',
	'Save': 'Сохранить',
	'Close': 'Закрыть',
	'Add': 'Добавить',
	'Update': 'Обновить',
	'Apply': 'Применить',
	'Reset': 'Сбросить',
	'Clear': 'Очистить',
	'Search': 'Поиск',
	'Filter': 'Фильтр',
	'Sort': 'Сортировка',
	'View': 'Просмотр',
	'Preview': 'Предпросмотр',
	'Loading...': 'Загрузка...',
	'No results found': 'Результаты не найдены',
	'Select an option': 'Выберите опцию',
	'Please select': 'Пожалуйста, выберите',
	
	// Media
	'Media': 'Медиа',
	'Image': 'Изображение',
	'Video': 'Видео',
	'Audio': 'Аудио',
	'File': 'Файл',
	'Upload': 'Загрузить',
	'Select Image': 'Выбрать изображение',
	'Select Video': 'Выбрать видео',
	'Select File': 'Выбрать файл',
	'Remove Image': 'Удалить изображение',
	'Remove Video': 'Удалить видео',
	'Replace Image': 'Заменить изображение',
	'Replace Video': 'Заменить видео',
	
	// Settings
	'Settings': 'Настройки',
	'General': 'Общие',
	'Advanced': 'Расширенные',
	'Appearance': 'Внешний вид',
	'Layout': 'Макет',
	'Style': 'Стиль',
	'Color': 'Цвет',
	'Size': 'Размер',
	'Position': 'Позиция',
	'Alignment': 'Выравнивание',
	'Spacing': 'Отступы',
	'Padding': 'Внутренний отступ',
	'Margin': 'Внешний отступ',
	'Border': 'Граница',
	'Shadow': 'Тень',
	'Background': 'Фон',
	'Typography': 'Типографика',
	'Font': 'Шрифт',
	'Font Size': 'Размер шрифта',
	'Font Weight': 'Вес шрифта',
	'Line Height': 'Высота строки',
	'Text Color': 'Цвет текста',
	'Text Align': 'Выравнивание текста',
	
	// Common actions
	'Enable': 'Включить',
	'Disable': 'Отключить',
	'Show': 'Показать',
	'Hide': 'Скрыть',
	'Yes': 'Да',
	'No': 'Нет',
	'On': 'Вкл',
	'Off': 'Выкл',
	'True': 'Истина',
	'False': 'Ложь',
	
	// Status
	'Active': 'Активный',
	'Inactive': 'Неактивный',
	'Enabled': 'Включено',
	'Disabled': 'Отключено',
	'Visible': 'Видимый',
	'Hidden': 'Скрытый',
	'Published': 'Опубликовано',
	'Draft': 'Черновик',
	'Pending': 'Ожидает',
	'Private': 'Приватный',
	
	// Time
	'Today': 'Сегодня',
	'Yesterday': 'Вчера',
	'Tomorrow': 'Завтра',
	'Now': 'Сейчас',
	'Never': 'Никогда',
	'Always': 'Всегда',
	
	// Directions
	'Top': 'Верх',
	'Bottom': 'Низ',
	'Left': 'Слева',
	'Right': 'Справа',
	'Center': 'Центр',
	'Middle': 'Середина',
	'Start': 'Начало',
	'End': 'Конец',
	
	// Common words
	'Title': 'Заголовок',
	'Subtitle': 'Подзаголовок',
	'Description': 'Описание',
	'Content': 'Контент',
	'Text': 'Текст',
	'Label': 'Метка',
	'Name': 'Имя',
	'ID': 'ID',
	'Type': 'Тип',
	'Value': 'Значение',
	'Default': 'По умолчанию',
	'Custom': 'Пользовательский',
	'None': 'Нет',
	'All': 'Все',
	'Any': 'Любой',
	'Other': 'Другое',
	'More': 'Больше',
	'Less': 'Меньше',
	
	// Numbers
	'One': 'Один',
	'Two': 'Два',
	'Three': 'Три',
	'Four': 'Четыре',
	'Five': 'Пять',
	'First': 'Первый',
	'Second': 'Второй',
	'Third': 'Третий',
	'Last': 'Последний',
	'Next': 'Следующий',
	'Previous': 'Предыдущий',
	
	// Actions
	'Click': 'Клик',
	'Double Click': 'Двойной клик',
	'Hover': 'Наведение',
	'Focus': 'Фокус',
	'Active': 'Активный',
	'Selected': 'Выбранный',
	'Checked': 'Отмеченный',
	'Unchecked': 'Не отмеченный',
	
	// Messages
	'Success': 'Успех',
	'Error': 'Ошибка',
	'Warning': 'Предупреждение',
	'Info': 'Информация',
	'Notice': 'Уведомление',
	'Message': 'Сообщение',
	'Alert': 'Предупреждение',
	
	// Forms
	'Submit': 'Отправить',
	'Reset': 'Сбросить',
	'Clear': 'Очистить',
	'Required': 'Обязательно',
	'Optional': 'Необязательно',
	'Placeholder': 'Плейсхолдер',
	'Help Text': 'Текст подсказки',
	'Validation': 'Валидация',
	'Valid': 'Валидный',
	'Invalid': 'Невалидный',
	
	// Media states
	'Uploading': 'Загрузка',
	'Uploaded': 'Загружено',
	'Failed': 'Не удалось',
	'Processing': 'Обработка',
	'Complete': 'Завершено',
	'Pending': 'Ожидает',
	
	// Common phrases
	'Please wait': 'Пожалуйста, подождите',
	'Loading': 'Загрузка',
	'Processing': 'Обработка',
	'Saving': 'Сохранение',
	'Deleting': 'Удаление',
	'Updating': 'Обновление',
	'Creating': 'Создание',
	'Editing': 'Редактирование',
	'Viewing': 'Просмотр',
	'Searching': 'Поиск',
	'Filtering': 'Фильтрация',
	'Sorting': 'Сортировка',
	
	// Errors
	'An error occurred': 'Произошла ошибка',
	'Please try again': 'Пожалуйста, попробуйте снова',
	'Invalid input': 'Неверный ввод',
	'Required field': 'Обязательное поле',
	'Field is required': 'Поле обязательно',
	'Please fill in all required fields': 'Пожалуйста, заполните все обязательные поля',
	
	// Success
	'Saved successfully': 'Успешно сохранено',
	'Updated successfully': 'Успешно обновлено',
	'Deleted successfully': 'Успешно удалено',
	'Created successfully': 'Успешно создано',
	
	// Confirmations
	'Are you sure?': 'Вы уверены?',
	'This action cannot be undone': 'Это действие нельзя отменить',
	'Delete permanently?': 'Удалить навсегда?',
	'Cancel changes?': 'Отменить изменения?',
	
	// Navigation
	'Back': 'Назад',
	'Next': 'Далее',
	'Previous': 'Предыдущий',
	'Continue': 'Продолжить',
	'Finish': 'Завершить',
	'Skip': 'Пропустить',
	'Done': 'Готово',
	
	// Common UI elements
	'Button': 'Кнопка',
	'Link': 'Ссылка',
	'Icon': 'Иконка',
	'Image': 'Изображение',
	'Video': 'Видео',
	'Audio': 'Аудио',
	'File': 'Файл',
	'Folder': 'Папка',
	'Document': 'Документ',
	'Page': 'Страница',
	'Post': 'Запись',
	'Category': 'Категория',
	'Tag': 'Тег',
	'User': 'Пользователь',
	'Role': 'Роль',
	'Permission': 'Разрешение',
	
	// Status indicators
	'Online': 'Онлайн',
	'Offline': 'Оффлайн',
	'Available': 'Доступно',
	'Unavailable': 'Недоступно',
	'Busy': 'Занят',
	'Away': 'Отошел',
	
	// Time periods
	'Second': 'Секунда',
	'Minute': 'Минута',
	'Hour': 'Час',
	'Day': 'День',
	'Week': 'Неделя',
	'Month': 'Месяц',
	'Year': 'Год',
	'Today': 'Сегодня',
	'Yesterday': 'Вчера',
	'Tomorrow': 'Завтра',
	'This week': 'На этой неделе',
	'Last week': 'На прошлой неделе',
	'Next week': 'На следующей неделе',
	'This month': 'В этом месяце',
	'Last month': 'В прошлом месяце',
	'Next month': 'В следующем месяце',
	'This year': 'В этом году',
	'Last year': 'В прошлом году',
	'Next year': 'В следующем году',
	
	// Common actions
	'Add new': 'Добавить новое',
	'Edit item': 'Редактировать элемент',
	'Delete item': 'Удалить элемент',
	'View details': 'Просмотреть детали',
	'View all': 'Просмотреть все',
	'Show more': 'Показать больше',
	'Show less': 'Показать меньше',
	'Load more': 'Загрузить больше',
	'See all': 'Смотреть все',
	'View all items': 'Просмотреть все элементы',
	'No items found': 'Элементы не найдены',
	'No results': 'Нет результатов',
	'Nothing found': 'Ничего не найдено',
	
	// Form fields
	'Text': 'Текст',
	'Email': 'Email',
	'Password': 'Пароль',
	'Number': 'Число',
	'Date': 'Дата',
	'Time': 'Время',
	'DateTime': 'Дата и время',
	'URL': 'URL',
	'Phone': 'Телефон',
	'Textarea': 'Текстовая область',
	'Select': 'Выбрать',
	'Checkbox': 'Чекбокс',
	'Radio': 'Радиокнопка',
	'File upload': 'Загрузка файла',
	'Image upload': 'Загрузка изображения',
	'Video upload': 'Загрузка видео',
	
	// Validation messages
	'Please enter a valid email': 'Пожалуйста, введите действительный email',
	'Please enter a valid URL': 'Пожалуйста, введите действительный URL',
	'Please enter a valid phone number': 'Пожалуйста, введите действительный номер телефона',
	'Please enter a valid number': 'Пожалуйста, введите действительное число',
	'Please select a value': 'Пожалуйста, выберите значение',
	'Please upload a file': 'Пожалуйста, загрузите файл',
	'File is too large': 'Файл слишком большой',
	'File type not allowed': 'Тип файла не разрешен',
	'Maximum file size exceeded': 'Превышен максимальный размер файла',
	
	// Media upload
	'Drop files here': 'Перетащите файлы сюда',
	'Click to upload': 'Нажмите для загрузки',
	'Or select files': 'Или выберите файлы',
	'Upload files': 'Загрузить файлы',
	'Select files': 'Выбрать файлы',
	'Choose files': 'Выбрать файлы',
	'Browse files': 'Просмотреть файлы',
	'Drag and drop': 'Перетащите и отпустите',
	'File selected': 'Файл выбран',
	'Files selected': 'Файлы выбраны',
	'Remove file': 'Удалить файл',
	'Remove files': 'Удалить файлы',
	'Replace file': 'Заменить файл',
	'Change file': 'Изменить файл',
	'Upload progress': 'Прогресс загрузки',
	'Upload complete': 'Загрузка завершена',
	'Upload failed': 'Загрузка не удалась',
	'Upload cancelled': 'Загрузка отменена',
	
	// Video specific
	'Video URL': 'URL видео',
	'Video ID': 'ID видео',
	'Video title': 'Название видео',
	'Video description': 'Описание видео',
	'Video thumbnail': 'Миниатюра видео',
	'Video duration': 'Длительность видео',
	'Video quality': 'Качество видео',
	'Video format': 'Формат видео',
	'Video codec': 'Кодек видео',
	'Video bitrate': 'Битрейт видео',
	'Video resolution': 'Разрешение видео',
	'Video frame rate': 'Частота кадров видео',
	'Video aspect ratio': 'Соотношение сторон видео',
	'Video file size': 'Размер файла видео',
	'Video file type': 'Тип файла видео',
	'Video file format': 'Формат файла видео',
	'Video source': 'Источник видео',
	'Video provider': 'Провайдер видео',
	'Video platform': 'Платформа видео',
	'Video service': 'Сервис видео',
	'Video player': 'Плеер видео',
	'Video controls': 'Элементы управления видео',
	'Video settings': 'Настройки видео',
	'Video options': 'Опции видео',
	'Video properties': 'Свойства видео',
	'Video metadata': 'Метаданные видео',
	'Video information': 'Информация о видео',
	'Video details': 'Детали видео',
	'Video preview': 'Предпросмотр видео',
	'Video embed': 'Встраивание видео',
	'Video embed code': 'Код встраивания видео',
	'Video iframe': 'Iframe видео',
	'Video iframe code': 'Код iframe видео',
	'Video embed URL': 'URL встраивания видео',
	'Video share URL': 'URL для sharing видео',
	'Video watch URL': 'URL для просмотра видео',
	'Video download URL': 'URL для скачивания видео',
	'Video stream URL': 'URL потока видео',
	'Video playback URL': 'URL воспроизведения видео',
	'Video source URL': 'URL источника видео',
	'Video file URL': 'URL файла видео',
	'Video thumbnail URL': 'URL миниатюры видео',
	'Video poster URL': 'URL постера видео',
	'Video preview image': 'Изображение предпросмотра видео',
	'Video cover image': 'Обложка видео',
	'Video background image': 'Фоновое изображение видео',
	'Video placeholder image': 'Изображение-заглушка видео',
	'Video fallback image': 'Резервное изображение видео',
	'Video default image': 'Изображение по умолчанию для видео',
	'Video loading image': 'Изображение загрузки видео',
	'Video error image': 'Изображение ошибки видео',
	'Video no preview image': 'Изображение отсутствия предпросмотра видео',
	'Video no thumbnail image': 'Изображение отсутствия миниатюры видео',
	'Video no poster image': 'Изображение отсутствия постера видео',
	'Video no cover image': 'Изображение отсутствия обложки видео',
	'Video no background image': 'Изображение отсутствия фонового изображения видео',
	'Video no placeholder image': 'Изображение отсутствия изображения-заглушки видео',
	'Video no fallback image': 'Изображение отсутствия резервного изображения видео',
	'Video no default image': 'Изображение отсутствия изображения по умолчанию для видео',
	'Video no loading image': 'Изображение отсутствия изображения загрузки видео',
	'Video no error image': 'Изображение отсутствия изображения ошибки видео',
	
	// Auto-translate function for common patterns
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
		const part = match[1];
		return `Настройки ${part.toLowerCase()}`;
	}
	
	// "Enable X" -> "Включить X"
	if (/^Enable (.+)$/.test(msgid)) {
		const match = msgid.match(/^Enable (.+)$/);
		const part = match[1];
		return `Включить ${part.toLowerCase()}`;
	}
	
	// "Disable X" -> "Отключить X"
	if (/^Disable (.+)$/.test(msgid)) {
		const match = msgid.match(/^Disable (.+)$/);
		const part = match[1];
		return `Отключить ${part.toLowerCase()}`;
	}
	
	// "Show X" -> "Показать X"
	if (/^Show (.+)$/.test(msgid)) {
		const match = msgid.match(/^Show (.+)$/);
		const part = match[1];
		return `Показать ${part.toLowerCase()}`;
	}
	
	// "Hide X" -> "Скрыть X"
	if (/^Hide (.+)$/.test(msgid)) {
		const match = msgid.match(/^Hide (.+)$/);
		const part = match[1];
		return `Скрыть ${part.toLowerCase()}`;
	}
	
	// "Select X" -> "Выбрать X"
	if (/^Select (.+)$/.test(msgid)) {
		const match = msgid.match(/^Select (.+)$/);
		const part = match[1];
		return `Выбрать ${part.toLowerCase()}`;
	}
	
	// "Add X" -> "Добавить X"
	if (/^Add (.+)$/.test(msgid)) {
		const match = msgid.match(/^Add (.+)$/);
		const part = match[1];
		return `Добавить ${part.toLowerCase()}`;
	}
	
	// "Remove X" -> "Удалить X"
	if (/^Remove (.+)$/.test(msgid)) {
		const match = msgid.match(/^Remove (.+)$/);
		const part = match[1];
		return `Удалить ${part.toLowerCase()}`;
	}
	
	// "X URL" -> "URL X"
	if (/^(.+) URL$/.test(msgid)) {
		const match = msgid.match(/^(.+) URL$/);
		const part = match[1];
		return `URL ${part.toLowerCase()}`;
	}
	
	// "X ID" -> "ID X"
	if (/^(.+) ID$/.test(msgid)) {
		const match = msgid.match(/^(.+) ID$/);
		const part = match[1];
		return `ID ${part.toLowerCase()}`;
	}
	
	// Если не нашли, возвращаем пустую строку
	return '';
}

// Добавляем переводы
let addedCount = 0;
let skippedCount = 0;

for (const msgid of emptyTranslations) {
	let translation = translations[msgid] || autoTranslate(msgid);
	
	if (!translation) {
		skippedCount++;
		continue;
	}
	
	// Экранируем специальные символы
	const escapedMsgid = msgid.replace(/"/g, '\\"').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const escapedTranslation = translation.replace(/"/g, '\\"');
	
	// Ищем и заменяем
	const pattern = new RegExp(
		`(msgid "${escapedMsgid}"\\s*\\nmsgstr ")(")`,
		'g'
	);
	
	if (poContent.match(pattern)) {
		poContent = poContent.replace(pattern, `$1${escapedTranslation}"`);
		addedCount++;
	}
}

// Сохраняем обновленный PO файл
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${addedCount} Russian translations`);
console.log(`⚠️  ${skippedCount} strings need manual translation`);
console.log(`\n📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');















