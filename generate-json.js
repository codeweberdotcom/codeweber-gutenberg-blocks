import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { default as gettextParser } from 'gettext-parser';

// Путь к папке с исходными файлами
const srcDir = './src'; // Папка с исходными файлами плагина
const languagesDir = './languages'; // Папка для сохранения файлов перевода

const translationStrings = {};

// Функция для добавления строки перевода в объект
function addTranslation(key, translation) {
	if (!translationStrings[key]) {
		translationStrings[key] = translation;
	}
}

// Чтение и извлечение переводов из .po файлов
async function extractTranslationsFromPoFile(filePath) {
	const content = fs.readFileSync(filePath);
	const poData = gettextParser.po.parse(content);
	const translations = poData.translations[''];

	// Ищем строку с языком в заголовке .po
	const header = poData.headers['Language'];
	const languageCode = header || 'en_US'; // Если язык не найден, по умолчанию используем en_US

	for (const msgid in translations) {
		if (
			translations[msgid].msgstr &&
			translations[msgid].msgstr.length > 0
		) {
			// Добавляем переведенные строки
			addTranslation(msgid, translations[msgid].msgstr[0]);
		}
	}

	return languageCode; // Возвращаем код языка
}

// Генерация JSON файла перевода
function generateTranslationJson(languageCode) {
	// Теперь создаем имя файла с кодом языка, без домена
	const jsonFile = path.join(
		languagesDir,
		`${languageCode}.json` // Формируем файл только с кодом языка
	);

	// Структура JSON должна быть только с переводами
	const jsonData = JSON.stringify(
		{
			translations: { [languageCode]: translationStrings },
		},
		null,
		2
	);

	// Записываем файл
	fs.writeFileSync(jsonFile, jsonData);
	console.log('JSON translation file generated:', jsonFile);
}

// Ищем все PHP файлы для перевода
glob(`${srcDir}/**/*.php`, (err, files) => {
	files.forEach((file) => {
		const content = fs.readFileSync(file, 'utf8');
		const regex = /__\((['"])(.*?)\1\s*,\s*['"](.*?)['"]\)/g;
		let match;

		// Ищем все строки перевода
		while ((match = regex.exec(content)) !== null) {
			const originalText = match[2];
			const textDomain = match[3];

			// Добавляем строку в объект переводов
			addTranslation(originalText, '');
		}
	});
});

// Ищем все JS файлы для перевода
glob(`${srcDir}/**/*.js`, (err, files) => {
	files.forEach((file) => {
		const content = fs.readFileSync(file, 'utf8');
		const regex = /wp\.i18n\.__\((['"])(.*?)\1\s*,\s*['"](.*?)['"]\)/g;
		let match;

		// Ищем все строки перевода
		while ((match = regex.exec(content)) !== null) {
			const originalText = match[2];
			const textDomain = match[3];

			// Добавляем строку в объект переводов
			addTranslation(originalText, '');
		}
	});
});

// Ищем все .po файлы в папке languages и извлекаем переводы для существующих языков
glob(`${languagesDir}/**/*.po`, (err, files) => {
	if (err) {
		console.error('Ошибка поиска файлов .po:', err);
		return;
	}

	// Обрабатываем каждый файл .po
	files.forEach((file) => {
		extractTranslationsFromPoFile(file).then((languageCode) => {
			// Генерируем JSON файл перевода для текущего языка
			generateTranslationJson(languageCode);
		});
	});
});
