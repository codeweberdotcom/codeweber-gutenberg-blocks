/**
 * LoadMoreControl Component
 * 
 * Universal control for "Load More" / "Show More" functionality
 * Manages settings for AJAX-based content loading
 * 
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl, TextControl, RangeControl } from '@wordpress/components';

export const LoadMoreControl = ({ attributes, setAttributes, attributePrefix = 'loadMore' }) => {
	const getAttr = (suffix) => attributes[`${attributePrefix}${suffix}`];
	
	const enableLoadMore = getAttr('Enable') || false;
	const initialCount = getAttr('InitialCount') || 6;
	const loadMoreCount = getAttr('LoadMoreCount') || 6;
	const loadMoreText = getAttr('Text') || __('Показать еще', 'codeweber-gutenberg-blocks');

	return (
		<>
			<RangeControl
				label={__('Сколько элементов отображать', 'codeweber-gutenberg-blocks')}
				value={initialCount}
				onChange={(value) => setAttributes({ [`${attributePrefix}InitialCount`]: value })}
				min={1}
				max={50}
				help={__('Количество элементов, отображаемых изначально', 'codeweber-gutenberg-blocks')}
			/>

			<ToggleControl
				label={__('Включить кнопку "Показать еще"', 'codeweber-gutenberg-blocks')}
				checked={enableLoadMore}
				onChange={(value) => setAttributes({ [`${attributePrefix}Enable`]: value })}
			/>

			{enableLoadMore && (
				<>
					<TextControl
						label={__('Текст кнопки', 'codeweber-gutenberg-blocks')}
						value={loadMoreText}
						onChange={(value) => setAttributes({ [`${attributePrefix}Text`]: value })}
						help={__('Текст кнопки "Показать еще"', 'codeweber-gutenberg-blocks')}
					/>

					<RangeControl
						label={__('Сколько элементов загружать', 'codeweber-gutenberg-blocks')}
						value={loadMoreCount}
						onChange={(value) => setAttributes({ [`${attributePrefix}LoadMoreCount`]: value })}
						min={1}
						max={50}
						help={__('Количество элементов, загружаемых при клике на кнопку', 'codeweber-gutenberg-blocks')}
					/>
				</>
			)}
		</>
	);
};

