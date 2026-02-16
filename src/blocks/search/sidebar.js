/**
 * Search Block - Sidebar
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const EXCLUDED_POST_TYPES = [
	'attachment',
	'wp_block',
	'wp_template',
	'wp_template_part',
	'wp_navigation',
	'nav_menu_item',
	'wp_global_styles',
	'wp_font_family',
	'wp_font_face',
	'html_blocks',
	'modal',
	'header',
	'footer',
	'page-header',
	'codeweber_form',
	'cw_image_hotspot',
];

const EXCLUDED_NAME_PATTERNS = [
	'элементы меню', 'меню навигации', 'глобальные стили', 'семейства шрифтов',
	'гарнитуры шрифта', 'хедер', 'футер', 'заголовки', 'page header', 'page headers',
	'модальные окна', 'modal', 'html блоки', 'html blocks', 'rm content editor',
	'content editor', 'формы', 'forms', 'image hotspot', 'image hotspots', 'hotspot', 'hotspots',
];

export const SearchSidebar = ({ attributes, setAttributes }) => {
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

	const [postTypeOptions, setPostTypeOptions] = useState([]);
	const [postTypesLoading, setPostTypesLoading] = useState(true);

	useEffect(() => {
		// Use PHP-passed list (all public CPT from theme/active theme) if available
		if (typeof window.cwgbSearchPostTypes !== 'undefined' && window.cwgbSearchPostTypes.postTypes?.length) {
			setPostTypeOptions(window.cwgbSearchPostTypes.postTypes);
			setPostTypesLoading(false);
			return;
		}
		const fetchPostTypes = async () => {
			try {
				const types = await apiFetch({ path: '/wp/v2/types' });
				const options = Object.keys(types)
					.filter((key) => {
						if (EXCLUDED_POST_TYPES.includes(key)) return false;
						const typeName = (types[key].name || '').toLowerCase();
						if (EXCLUDED_NAME_PATTERNS.some((p) => typeName.includes(p.toLowerCase()))) return false;
						return true;
					})
					.map((key) => ({
						label: types[key].name || key,
						value: key,
					}));
				setPostTypeOptions(options.length ? options : [{ label: 'Post', value: 'post' }]);
			} catch (e) {
				setPostTypeOptions([{ label: 'Post', value: 'post' }]);
			}
			setPostTypesLoading(false);
		};
		fetchPostTypes();
	}, []);

	return (
		<>
			<PanelBody title={__('Block Settings', 'codeweber-blocks')} initialOpen={true}>
				<TextControl
					label={__('Block Class', 'codeweber-blocks')}
					value={blockClass || ''}
					onChange={(value) => setAttributes({ blockClass: value })}
				/>
				<TextControl
					label={__('Block ID', 'codeweber-blocks')}
					value={blockId || ''}
					onChange={(value) => setAttributes({ blockId: (value || '').replace(/^#/, '').trim() })}
				/>
			</PanelBody>
			<PanelBody title={__('Search form', 'codeweber-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Display type', 'codeweber-blocks')}
					value={displayType || 'form'}
					options={[
						{ value: 'form', label: __('Form (inline)', 'codeweber-blocks') },
						{ value: 'inline', label: __('Inline', 'codeweber-blocks') },
						{ value: 'dropdown', label: __('Dropdown (no button)', 'codeweber-blocks') },
					]}
					onChange={(value) => setAttributes({ displayType: value })}
				/>
				{displayType === 'dropdown' && (
					<TextControl
						label={__('Dropdown min width', 'codeweber-blocks')}
						value={dropdownMinWidth ?? '320'}
						help={__('e.g. 320, 320px, 20rem. Default: 320px', 'codeweber-blocks')}
						onChange={(value) => setAttributes({ dropdownMinWidth: value || '320' })}
					/>
				)}
				<TextControl
					label={__('Placeholder', 'codeweber-blocks')}
					value={placeholder || ''}
					help={__('Leave empty to use “Type keyword” (translatable in Loco).', 'codeweber-blocks')}
					onChange={(value) => setAttributes({ placeholder: value })}
				/>
				<TextControl
					label={__('Posts per page', 'codeweber-blocks')}
					value={postsPerPage || '8'}
					onChange={(value) => setAttributes({ postsPerPage: value })}
				/>
				<SelectControl
					label={__('Post types', 'codeweber-blocks')}
					value={postTypes || 'post'}
					options={
						postTypesLoading
							? [{ label: __('Loading…', 'codeweber-blocks'), value: '' }]
							: postTypeOptions
					}
					onChange={(value) => setAttributes({ postTypes: value || 'post' })}
					help={__('Post type to search in (theme and active theme CPT).', 'codeweber-blocks')}
				/>
				<SelectControl
					label={__('Search content', 'codeweber-blocks')}
					value={searchContent || 'false'}
					options={[
						{ value: 'false', label: __('No', 'codeweber-blocks') },
						{ value: 'true', label: __('Yes', 'codeweber-blocks') },
					]}
					onChange={(value) => setAttributes({ searchContent: value })}
				/>
				<SelectControl
					label={__('Show excerpt', 'codeweber-blocks')}
					value={showExcerpt || 'false'}
					options={[
						{ value: 'false', label: __('No', 'codeweber-blocks') },
						{ value: 'true', label: __('Yes', 'codeweber-blocks') },
					]}
					onChange={(value) => setAttributes({ showExcerpt: value })}
				/>
				<TextControl
					label={__('Taxonomy', 'codeweber-blocks')}
					value={taxonomy || ''}
					help={__('e.g. category, post_tag', 'codeweber-blocks')}
					onChange={(value) => setAttributes({ taxonomy: value })}
				/>
				<TextControl
					label={__('Term slug', 'codeweber-blocks')}
					value={term || ''}
					onChange={(value) => setAttributes({ term: value })}
				/>
				<SelectControl
					label={__('Include taxonomies', 'codeweber-blocks')}
					value={includeTaxonomies || 'false'}
					options={[
						{ value: 'false', label: __('No', 'codeweber-blocks') },
						{ value: 'true', label: __('Yes', 'codeweber-blocks') },
					]}
					onChange={(value) => setAttributes({ includeTaxonomies: value })}
				/>
				<TextControl
					label={__('Form ID', 'codeweber-blocks')}
					value={formId || ''}
					help={__('Leave empty for auto', 'codeweber-blocks')}
					onChange={(value) => setAttributes({ formId: value })}
				/>
				<TextControl
					label={__('Form wrapper class', 'codeweber-blocks')}
					value={formClass || ''}
					onChange={(value) => setAttributes({ formClass: value })}
				/>
			</PanelBody>
		</>
	);
};
