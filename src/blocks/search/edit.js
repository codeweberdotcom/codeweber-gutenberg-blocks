/**
 * Search Block - Edit Component
 *
 * Two display types: form (inline) and dropdown (Bootstrap dropdown — icon only).
 * Markup only, no shortcode.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { SearchSidebar } from './sidebar';

const Edit = ({ attributes, setAttributes }) => {
	const {
		blockClass,
		blockId,
		displayType,
		dropdownMinWidth,
		placeholder,
		postsPerPage,
		postTypes,
		searchContent,
		showExcerpt,
		taxonomy,
		term,
		includeTaxonomies,
		formId,
		formClass,
	} = attributes;

	const blockClasses = ['cwgb-search-block', displayType === 'dropdown' && 'dropdown', displayType === 'inline' && 'inline', blockClass].filter(Boolean).join(' ');
	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
	});

	const formContent = (
		<div className={'position-relative ' + (formClass || '')}>
			<form className="search-form" id={formId || 'search-form-preview'} role="search">
				<input
					type="text"
					className="search-form form-control"
					placeholder={placeholder || __('Type keyword', 'codeweber-gutenberg-blocks')}
					disabled
					data-posts-per-page={postsPerPage}
					data-post-types={postTypes}
					data-search-content={searchContent}
					data-taxonomy={taxonomy}
					data-term={term}
					data-include-taxonomies={includeTaxonomies}
					data-show-excerpt={showExcerpt}
				/>
			</form>
		</div>
	);

	return (
		<>
			<InspectorControls>
				<SearchSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>
				{displayType === 'dropdown' ? (
					<>
						<a className="dropdown-toggle" href="#" role="button" onClick={(e) => e.preventDefault()} aria-expanded="false" aria-label={__('Search', 'codeweber-blocks')}>
							<i className="uil uil-search"></i>
						</a>
						<div className="dropdown-menu dropdown-menu-end p-0" style={{ minWidth: (dropdownMinWidth && /^\d+$/.test(String(dropdownMinWidth)) ? dropdownMinWidth + 'px' : dropdownMinWidth) || '320px' }}>
							{formContent}
						</div>
					</>
				) : (
					formContent
				)}
			</div>
		</>
	);
};

export default Edit;
