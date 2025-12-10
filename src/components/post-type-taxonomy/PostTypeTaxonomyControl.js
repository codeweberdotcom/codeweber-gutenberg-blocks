import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TaxonomyFilterControl } from '../taxonomy-filter';

/**
 * Reusable control for selecting post type and taxonomy filters.
 *
 * Props:
 * - postType: current post type value
 * - selectedTaxonomies: current taxonomy filter map
 * - onPostTypeChange: (value: string) => void
 * - onTaxonomyChange: (value: object) => void
 * - help: optional help text for post type selector
 */
export const PostTypeTaxonomyControl = ({
	postType,
	selectedTaxonomies,
	onPostTypeChange,
	onTaxonomyChange,
	help = __('Select the post type to display', 'codeweber-gutenberg-blocks'),
}) => {
	const [postTypes, setPostTypes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPostTypes = async () => {
			try {
				const types = await apiFetch({ path: '/wp/v2/types' });
				const postTypeOptions = Object.keys(types)
					.filter((key) => {
						// Стандартные системные типы WordPress
						const excluded = [
							'attachment',
							'wp_block',
							'wp_template',
							'wp_template_part',
							'wp_navigation',
							'nav_menu_item',
							'wp_global_styles',
							'wp_font_family',
							'wp_font_face',
						];
						// Кастомные типы записей темы, которые нужно исключить
						const excludedCustom = [
							'html_blocks',
							'modal',
							'header',
							'footer',
							'page-header',
						];
						
						// Исключаем по ключу
						if (excluded.includes(key) || excludedCustom.includes(key)) {
							return false;
						}
						
						// Фильтрация по названию (для случаев, когда название отличается от ключа)
						const typeName = (types[key].name || '').toLowerCase();
						const excludedNamePatterns = [
							'элементы меню',
							'меню навигации',
							'глобальные стили',
							'семейства шрифтов',
							'гарнитуры шрифта',
							'хедер',
							'футер',
							'заголовки',
							'page header',
							'page headers',
							'модальные окна',
							'modal',
							'html блоки',
							'html blocks',
							'rm content editor',
							'content editor',
						];
						
						// Исключаем по названию (частичное совпадение)
						if (excludedNamePatterns.some(pattern => typeName.includes(pattern.toLowerCase()))) {
							return false;
						}
						
						return true;
					})
					.map((key) => ({
						label: types[key].name || key,
						value: key,
					}));

				setPostTypes(postTypeOptions);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching post types:', error);
				setIsLoading(false);
			}
		};

		fetchPostTypes();
	}, []);

	return (
		<div className="cwgb-post-type-taxonomy-control" style={{ marginBottom: 0 }}>
			<div className="cwgb-post-type-taxonomy-control__select" style={{ marginBottom: 0 }}>
				<SelectControl
					label={__('Post Type', 'codeweber-gutenberg-blocks')}
					value={postType}
					options={isLoading ? [{ label: __('Loading...', 'codeweber-gutenberg-blocks'), value: '' }] : postTypes}
					onChange={onPostTypeChange}
					help={help}
				/>
			</div>

			{postType && (
				<div style={{ marginTop: '16px' }}>
					<TaxonomyFilterControl
						postType={postType}
						selectedTaxonomies={selectedTaxonomies || {}}
						onChange={onTaxonomyChange}
					/>
				</div>
			)}
		</div>
	);
};


