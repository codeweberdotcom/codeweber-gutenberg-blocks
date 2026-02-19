/**
 * Code component – code wrapper with Copy button and pre/code block.
 * Matches theme markup: .code-wrapper, .btn-clipboard, .code-wrapper-inner.
 * Theme's ClipboardJS uses trigger.nextElementSibling as copy target.
 *
 * @package CodeWeber Gutenberg Blocks
 */

function escapeHtml(text) {
	if (!text) return '';
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export default function CodeRender({
	content = '',
	language = 'html',
	copyLabel = 'Copy',
	backgroundColor = 'dark',
}) {
	const langClass = language ? `language-${language}` : 'language-html';
	const escapedCode = escapeHtml(content);
	const isDark = backgroundColor === 'dark';
	const innerBgClass = isDark ? 'bg-dark' : 'bg-light';
	const buttonVariantClass = isDark ? 'btn-white' : 'btn-dark';

	return (
		<div className="code-wrapper">
			<button
				type="button"
				className={`btn btn-sm ${buttonVariantClass} rounded-pill btn-clipboard`}
			>
				{copyLabel}
			</button>
			<div className={`code-wrapper-inner ${innerBgClass}`}>
				<pre className={langClass} tabIndex={0}>
					<code className={langClass} dangerouslySetInnerHTML={{ __html: escapedCode }} />
				</pre>
			</div>
		</div>
	);
}
