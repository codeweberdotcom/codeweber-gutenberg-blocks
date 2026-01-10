/**
 * Скрипт для очистки лишних пустых строк в конце файлов
 * Оставляет только одну финальную новую строку (согласно стандарту POSIX)
 */

const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');

		// Удаляем все пустые строки в конце файла (включая пробелы и табы)
		content = content.replace(/[ \t]*\n+$/, '');

		// Убеждаемся, что файл заканчивается ровно одной новой строкой (стандарт POSIX)
		// Если файл уже заканчивается на \n, не добавляем еще одну
		if (!content.endsWith('\n')) {
			content += '\n';
		}

		fs.writeFileSync(filePath, content, 'utf8');
		return true;
	} catch (error) {
		console.error(`Ошибка при обработке ${filePath}:`, error.message);
		return false;
	}
}

function walkDir(dir, extensions = ['.js', '.json', '.php', '.scss', '.css']) {
	const files = [];

	function walk(currentPath) {
		const entries = fs.readdirSync(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);

			// Пропускаем node_modules и другие служебные папки
			if (entry.isDirectory()) {
				if (
					![
						'node_modules',
						'.git',
						'build',
						'dist',
						'.temp',
					].includes(entry.name)
				) {
					walk(fullPath);
				}
			} else if (entry.isFile()) {
				const ext = path.extname(entry.name);
				if (extensions.includes(ext)) {
					files.push(fullPath);
				}
			}
		}
	}

	walk(dir);
	return files;
}

// Обрабатываем файлы в папке src
const srcDir = path.join(__dirname, 'src');
const files = walkDir(srcDir);

console.log(`Найдено ${files.length} файлов для обработки...`);

let cleaned = 0;
let errors = 0;

files.forEach((file) => {
	if (cleanFile(file)) {
		cleaned++;
	} else {
		errors++;
	}
});

// Также обрабатываем корневые файлы
const rootFiles = [
	path.join(__dirname, 'package.json'),
	path.join(__dirname, 'package-lock.json'),
	path.join(__dirname, 'plugin.php'),
];

rootFiles.forEach((file) => {
	if (fs.existsSync(file)) {
		if (cleanFile(file)) {
			cleaned++;
		} else {
			errors++;
		}
	}
});

console.log(`\n✅ Обработано файлов: ${cleaned}`);
if (errors > 0) {
	console.log(`❌ Ошибок: ${errors}`);
}
