/**
 * LoadMoreControl Component
 * 
 * Universal control for "Load More" / "Show More" functionality
 * Manages settings for AJAX-based content loading
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl, RangeControl, SelectControl } from '@wordpress/components';

export const LoadMoreControl = ({ attributes, setAttributes, attributePrefix = 'loadMore' }) => {
	const getAttr = (suffix) => attributes[`${attributePrefix}${suffix}`];
	
	const enableLoadMore = getAttr('Enable') || false;
	const initialCount = getAttr('InitialCount') || 6;
	const loadMoreCount = getAttr('LoadMoreCount') || 6;
	const loadMoreText = getAttr('Text') || 'show-more';
	const loadMoreType = getAttr('Type') || 'button';

	// Предустановленные тексты для кнопки/ссылки
	const textOptions = [
		{ label: __('Show More', 'codeweber-gutenberg-blocks'), value: 'show-more' },
		{ label: __('Load More', 'codeweber-gutenberg-blocks'), value: 'load-more' },
		{ label: __('Show More Items', 'codeweber-gutenberg-blocks'), value: 'show-more-items' },
		{ label: __('More Posts', 'codeweber-gutenberg-blocks'), value: 'more-posts' },
		{ label: __('View All', 'codeweber-gutenberg-blocks'), value: 'view-all' },
		{ label: __('Show All', 'codeweber-gutenberg-blocks'), value: 'show-all' },
	];

	// Типы элементов
	const typeOptions = [
		{ label: __('Button', 'codeweber-gutenberg-blocks'), value: 'button' },
		{ label: __('Link', 'codeweber-gutenberg-blocks'), value: 'link' },
	];

	// Получаем текст по значению
	const getTextByValue = (value) => {
		const option = textOptions.find(opt => opt.value === value);
		return option ? option.label : textOptions[0].label;
	};

	return (
		<>
			<RangeControl
				label={__('How many items to display', 'codeweber-gutenberg-blocks')}
				value={initialCount}
				onChange={(value) => setAttributes({ [`${attributePrefix}InitialCount`]: value })}
				min={1}
				max={50}
				help={__('Number of items displayed initially', 'codeweber-gutenberg-blocks')}
			/>

			<ToggleControl
				label={__('Enable "Show More" button', 'codeweber-gutenberg-blocks')}
				checked={enableLoadMore}
				onChange={(value) => setAttributes({ [`${attributePrefix}Enable`]: value })}
			/>

			{enableLoadMore && (
				<>
					<SelectControl
						label={__('Element Type', 'codeweber-gutenberg-blocks')}
						value={loadMoreType}
						options={typeOptions}
						onChange={(value) => setAttributes({ [`${attributePrefix}Type`]: value })}
						help={__('Select element type: button or link', 'codeweber-gutenberg-blocks')}
					/>

					<SelectControl
						label={__('Button/Link Text', 'codeweber-gutenberg-blocks')}
						value={loadMoreText}
						options={textOptions}
						onChange={(value) => setAttributes({ [`${attributePrefix}Text`]: value })}
						help={__('Select text for button or link', 'codeweber-gutenberg-blocks')}
					/>

					<RangeControl
						label={__('How many items to load', 'codeweber-gutenberg-blocks')}
						value={loadMoreCount}
						onChange={(value) => setAttributes({ [`${attributePrefix}LoadMoreCount`]: value })}
						min={1}
						max={50}
						help={__('Number of items loaded when clicking the button', 'codeweber-gutenberg-blocks')}
					/>
				</>
			)}
		</>
	);
};



