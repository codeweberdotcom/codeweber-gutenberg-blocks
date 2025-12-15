/**
 * PostSortControl - компонент для сортировки постов
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * PostSortControl Component
 * 
 * @param {Object} props
 * @param {string} props.orderBy - Текущее значение сортировки (orderby)
 * @param {string} props.order - Текущее направление сортировки (order)
 * @param {Function} props.onOrderByChange - Callback при изменении orderby
 * @param {Function} props.onOrderChange - Callback при изменении order
 */
export const PostSortControl = ({
	orderBy = 'date',
	order = 'desc',
	onOrderByChange,
	onOrderChange,
}) => {
	const orderByOptions = [
		{ label: __('Date', 'codeweber-gutenberg-blocks'), value: 'date' },
		{ label: __('Title', 'codeweber-gutenberg-blocks'), value: 'title' },
		{ label: __('Modified Date', 'codeweber-gutenberg-blocks'), value: 'modified' },
		{ label: __('Comment Count', 'codeweber-gutenberg-blocks'), value: 'comment_count' },
		{ label: __('Random', 'codeweber-gutenberg-blocks'), value: 'rand' },
		{ label: __('ID', 'codeweber-gutenberg-blocks'), value: 'id' },
		{ label: __('Author', 'codeweber-gutenberg-blocks'), value: 'author' },
		{ label: __('Menu Order', 'codeweber-gutenberg-blocks'), value: 'menu_order' },
	];

	const orderOptions = [
		{ label: __('Descending', 'codeweber-gutenberg-blocks'), value: 'desc' },
		{ label: __('Ascending', 'codeweber-gutenberg-blocks'), value: 'asc' },
	];

	return (
		<>
			<SelectControl
				label={__('Sort By', 'codeweber-gutenberg-blocks')}
				value={orderBy}
				options={orderByOptions}
				onChange={onOrderByChange}
				help={__('Select how to sort the posts', 'codeweber-gutenberg-blocks')}
			/>
			
			<div style={{ marginTop: '16px' }}>
				<SelectControl
					label={__('Order', 'codeweber-gutenberg-blocks')}
					value={order}
					options={orderOptions}
					onChange={onOrderChange}
					help={__('Select sort direction', 'codeweber-gutenberg-blocks')}
				/>
			</div>
		</>
	);
};










