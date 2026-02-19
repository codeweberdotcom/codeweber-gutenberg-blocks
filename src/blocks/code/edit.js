/**
 * Code Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextareaControl } from '@wordpress/components';

const LANGUAGES = [
	{ label: 'HTML', value: 'html' },
	{ label: 'CSS', value: 'css' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'JSX', value: 'jsx' },
	{ label: 'PHP', value: 'php' },
	{ label: 'JSON', value: 'json' },
	{ label: 'Bash', value: 'bash' },
	{ label: 'Plain text', value: 'plaintext' },
];

const BACKGROUND_OPTIONS = [
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
];

/** Prism language id (HTML is 'markup' in Prism) */
const getPrismLanguage = (lang) => (lang === 'html' ? 'markup' : lang);

const Edit = ({ attributes, setAttributes }) => {
	const { content, language, copyLabel, backgroundColor } = attributes;
	const codeRef = useRef(null);
	const blockProps = useBlockProps({
		className: 'wp-block-codeweber-blocks-code',
	});
	const prismLang = getPrismLanguage(language);
	const isDark = backgroundColor === 'dark';
	const innerBgClass = isDark ? 'bg-dark' : 'bg-light';
	const buttonVariantClass = isDark ? 'btn-white' : 'btn-dark';

	useEffect(() => {
		if (!codeRef.current || !content) return;
		if (typeof window.Prism === 'undefined') return;
		window.Prism.highlightElement(codeRef.current);
	}, [content, language]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Code', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<TextareaControl
						label={__('Code', 'codeweber-gutenberg-blocks')}
						value={content}
						onChange={(value) => setAttributes({ content: value || '' })}
						placeholder={__('Paste or type code here…', 'codeweber-gutenberg-blocks')}
						rows={12}
						className="codeweber-code-block-textarea"
						help={__('Enter the code snippet to display.', 'codeweber-gutenberg-blocks')}
					/>
					<SelectControl
						label={__('Language', 'codeweber-gutenberg-blocks')}
						value={language}
						options={LANGUAGES}
						onChange={(value) => setAttributes({ language: value || 'html' })}
					/>
					<SelectControl
						label={__('Background', 'codeweber-gutenberg-blocks')}
						value={backgroundColor}
						options={BACKGROUND_OPTIONS}
						onChange={(value) => setAttributes({ backgroundColor: value || 'dark' })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="code-wrapper codeweber-code-editor-preview">
					<button type="button" className={`btn btn-sm ${buttonVariantClass} rounded-pill btn-clipboard`} disabled>
						{copyLabel}
					</button>
					<div className={`code-wrapper-inner ${innerBgClass}`}>
						<pre className={`language-${prismLang}`} tabIndex={0}>
							<code ref={codeRef} className={`language-${prismLang}`}>
								{content || ' '}
							</code>
						</pre>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
