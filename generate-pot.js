const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pluginPath = __dirname;
const potFile = path.join(
	pluginPath,
	'languages',
	'codeweber-gutenberg-blocks.pot'
);
const textDomain = 'codeweber-gutenberg-blocks';
const packageName = 'Codeweber Gutenberg Blocks';

// Scans PHP + build/blocks/**/*.js (compiled webpack output).
// Loco Translate is configured via loco.xml to scan the same paths,
// so both tools produce identical string sets.
const EXCLUDE = [
	'node_modules',
	'vendor',
	'src',
	'.git',
	'scripts',
	'languages',
].join( ',' );

console.log( 'Generating POT file...\n' );

try {
	const command = [
		`wp i18n make-pot "${ pluginPath }" "${ potFile }"`,
		`--domain="${ textDomain }"`,
		`--package-name="${ packageName }"`,
		`--headers='{"Last-Translator":"FULL NAME <EMAIL@ADDRESS>","Language-Team":"LANGUAGE <LL@li.org>"}'`,
		`--exclude=${ EXCLUDE }`,
	].join( ' ' );

	console.log( 'Running: wp i18n make-pot (PHP + build/ JS)...' );
	execSync( command, { cwd: pluginPath, stdio: 'inherit' } );

	const lineCount = fs.readFileSync( potFile, 'utf8' ).split( '\n' ).length;
	const msgidCount = fs
		.readFileSync( potFile, 'utf8' )
		.split( '\n' )
		.filter( ( l ) => l.startsWith( 'msgid "' ) && l !== 'msgid ""' ).length;

	console.log( `\nPOT file updated: ${ potFile }` );
	console.log( `Strings found: ${ msgidCount } (${ lineCount } lines)` );
} catch ( error ) {
	console.error( '\nError generating POT file:' );
	console.error( error.message );
	process.exit( 1 );
}
