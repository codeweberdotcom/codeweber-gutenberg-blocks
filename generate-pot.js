const fs = require( 'fs' );
const path = require( 'path' );
const gettextParser = require( 'gettext-parser' );

// Функция для рекурсивного поиска файлов в папках и подкаталогах
const getAllFiles = ( dirPaths, arrayOfFiles = [] ) => {
	dirPaths.forEach( ( dirPath ) => {
		const files = fs.readdirSync( dirPath );

		files.forEach( ( file ) => {
			const fullPath = path.join( dirPath, file );
			const stat = fs.statSync( fullPath );

			// Если это директория, рекурсивно ищем дальше
			if ( stat.isDirectory() ) {
				arrayOfFiles = getAllFiles( [ fullPath ], arrayOfFiles );
			} else {
				// Если файл JS или PHP, добавляем его в список
				if (
					fullPath.endsWith( '.js' ) ||
					fullPath.endsWith( '.php' )
				) {
					arrayOfFiles.push( fullPath );
				}
			}
		} );
	} );

	return arrayOfFiles;
};

// Функция для извлечения строк из файлов
const extractStrings = ( dirs ) => {
	const files = getAllFiles( dirs ); // Получаем все файлы с расширением .js и .php из указанных директорий
	const pot = gettextParser.po.parse( '' );

	// Добавляем шапку для .pot файла
	pot.headers = {
		'project-id-version': 'PACKAGE VERSION',
		'pot-creation-date': new Date().toISOString().replace( /\.\d+/, '' ), // Текущая дата
		'po-revision-date': new Date().toISOString().replace( /\.\d+/, '' ), // Текущая дата
		'last-translator': 'FULL NAME <EMAIL@ADDRESS>',
		'language-team': 'LANGUAGE <LL@li.org>',
		language: 'en', // Указываем язык (можно заменить на ваш)
		'mime-version': '1.0',
		'content-type': 'text/plain; charset=UTF-8',
		'content-transfer-encoding': '8bit',
		'plural-forms': 'nplurals=2; plural=(n != 1);', // Правила склонения
	};

	files.forEach( ( file ) => {
		const content = fs.readFileSync( file, 'utf-8' );

		// Регулярное выражение для поиска строк для перевода
		const matches = content.match(
			/__\(['"]([^'"]+)['"](?:,\s*['"]([^'"]+)['"])?\)/g
		);

		if ( matches ) {
			matches.forEach( ( match ) => {
				// Извлекаем строку для перевода (msgid) без домена
				let msg = match
					.replace( /__\(['"]|['"]\)/g, '' )
					.split( ',' )[ 0 ]; // Оставляем только msgid, игнорируем второй аргумент (домен)

				// Удаляем лишнюю кавычку в конце строки, если она есть
				msg = msg.replace( /'$/, '' );

				// Получаем относительный путь к файлу от корня плагина
				const filePath = path
					.relative( path.resolve( __dirname ), file )
					.replace( /\\/g, '/' ); // Путь относительно корня плагина

				// Номер строки
				const lineNumber = content
					.substr( 0, content.indexOf( match ) )
					.split( '\n' ).length;

				// Добавляем комментарий с относительным путем и номером строки перед msgid
				pot.translations[ '' ] = pot.translations[ '' ] || {};
				pot.translations[ '' ][ msg ] = {
					msgid: msg,
					msgstr: '', // Перевод оставляем пустым
					comments: {
						reference: `${ filePath }:${ lineNumber }`, // Указываем относительный путь от корня плагина
					},
				};
			} );
		}
	} );

	return pot;
};

// Жестко заданные директории для поиска
const dirs = [ './src', './settings' ];

// Генерация .pot файла с учётом всех подкаталогов
const pot = extractStrings( dirs );

// Сохраняем результат в .pot файл
fs.writeFileSync(
	'./languages/codeweber-gutenberg-blocks.pot',
	gettextParser.po.compile( pot ),
	'utf-8'
);


