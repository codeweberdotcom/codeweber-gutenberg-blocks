import { __ } from '@wordpress/i18n';
import { RangeControl, ToggleControl } from '@wordpress/components';

export const DisplayControl = ({ attributes, setAttributes }) => {
	const {
		showTitle,
		showDate,
		showCategory,
		showComments,
		showExcerpt,
		titleLength,
		excerptLength,
	} = attributes;

	return (
		<>
			<ToggleControl
				label={__('Show Title', 'codeweber-gutenberg-blocks')}
				checked={showTitle !== false}
				onChange={(value) => setAttributes({ showTitle: value })}
			/>
			<ToggleControl
				label={__('Show Date', 'codeweber-gutenberg-blocks')}
				checked={showDate !== false}
				onChange={(value) => setAttributes({ showDate: value })}
			/>
			<ToggleControl
				label={__('Show Category', 'codeweber-gutenberg-blocks')}
				checked={showCategory !== false}
				onChange={(value) => setAttributes({ showCategory: value })}
			/>
			<ToggleControl
				label={__('Show Comments', 'codeweber-gutenberg-blocks')}
				checked={showComments !== false}
				onChange={(value) => setAttributes({ showComments: value })}
			/>
			<ToggleControl
				label={__('Show Excerpt', 'codeweber-gutenberg-blocks')}
				checked={!!showExcerpt}
				onChange={(value) => setAttributes({ showExcerpt: value })}
			/>
			<RangeControl
				label={__('Title Length', 'codeweber-gutenberg-blocks')}
				value={typeof titleLength === 'number' ? titleLength : 56}
				onChange={(value) => setAttributes({ titleLength: value })}
				min={0}
				max={200}
				step={1}
				help={__(
					'Maximum title characters (0 = no limit).',
					'codeweber-gutenberg-blocks'
				)}
			/>
			<RangeControl
				label={__('Excerpt Length', 'codeweber-gutenberg-blocks')}
				value={typeof excerptLength === 'number' ? excerptLength : 20}
				onChange={(value) => setAttributes({ excerptLength: value })}
				min={0}
				max={100}
				step={1}
				help={__(
					'Maximum excerpt words (0 = no limit).',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};
