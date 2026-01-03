const fs = require('fs');
const path = require('path');

const poPath = path.join(__dirname, 'languages', 'codeweber-gutenberg-blocks-ru_RU.po');

console.log('➕ Adding Video Poster and other missing translations...\n');

// Читаем PO файл
let poContent = fs.readFileSync(poPath, 'utf8');

// Список переводов для добавления
const newTranslations = [
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Video Poster',
		msgstr: 'Постер видео'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Select Poster',
		msgstr: 'Выбрать постер'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js src/src/components/video-url/VideoURLControl.js src/src/components/video-url/VideoURLControl.js',
		msgid: 'Loading poster...',
		msgstr: 'Загрузка постера...'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Auto-load Poster from Provider',
		msgstr: 'Автоматически загружать постер от провайдера'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Muted',
		msgstr: 'Без звука'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Show Controls',
		msgstr: 'Показать элементы управления'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js',
		msgid: 'Show Play Icon',
		msgstr: 'Показать иконку воспроизведения'
	},
	{
		comment: '#: src/src/blocks/media/sidebar.js src/src/blocks/media/sidebar.js',
		msgid: 'Enable Video Lightbox',
		msgstr: 'Включить лайтбокс для видео'
	},
	{
		comment: '#: src/src/blocks/media/sidebar.js src/src/blocks/media/sidebar.js',
		msgid: 'Hover effects are only available for images.',
		msgstr: 'Эффекты при наведении доступны только для изображений.'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js src/src/components/media-upload/VideoUpload.js src/src/components/media-upload/VideoUpload.js',
		msgid: 'YouTube Video ID',
		msgstr: 'ID YouTube видео'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js src/src/components/media-upload/VideoUpload.js src/src/components/media-upload/VideoUpload.js',
		msgid: 'Example: j_Y2Gwaj7Gs',
		msgstr: 'Пример: j_Y2Gwaj7Gs'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js src/src/components/media-upload/VideoUpload.js src/src/components/media-upload/VideoUpload.js',
		msgid: 'Example: 15801179',
		msgstr: 'Пример: 15801179'
	},
	{
		comment: '#: src/src/blocks/media/controls/MediaControl.js src/src/blocks/media/controls/MediaControl.js src/src/components/media-upload/VideoUpload.js src/src/components/media-upload/VideoUpload.js',
		msgid: 'Paste iframe or embed code',
		msgstr: 'Вставьте iframe или embed код'
	}
];

// Проверяем, какие переводы уже есть
const existingMsgids = new Set();
const poLines = poContent.split('\n');
for (let i = 0; i < poLines.length; i++) {
	const line = poLines[i];
	if (line.match(/^msgid "/)) {
		const match = line.match(/^msgid "(.+)"$/);
		if (match) {
			existingMsgids.add(match[1]);
		}
	}
}

// Добавляем только недостающие переводы
let addedCount = 0;
let newEntries = '';

for (const trans of newTranslations) {
	if (!existingMsgids.has(trans.msgid)) {
		newEntries += trans.comment + '\n';
		newEntries += `msgid "${trans.msgid}"\n`;
		newEntries += `msgstr "${trans.msgstr}"\n\n`;
		addedCount++;
	}
}

// Находим место для вставки (перед последней пустой строкой в конце файла)
const lastNonEmptyLine = poContent.trimEnd();
const insertPos = lastNonEmptyLine.length;

// Вставляем новые записи
poContent = poContent.substring(0, insertPos) + '\n' + newEntries;

// Сохраняем
fs.writeFileSync(poPath, poContent, 'utf8');

console.log(`✅ Added ${addedCount} new translations`);
console.log(`📄 PO file updated: ${poPath}`);
console.log('\n💡 Run: npm run i18n:compile to compile translations\n');




