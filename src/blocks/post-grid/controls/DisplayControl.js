import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

export const DisplayControl = ({ attributes, setAttributes }) => {
	const {
		template,
		showTitle,
		showDate,
		showCategory,
		showComments,
		showExcerpt,
		titleLength,
		excerptLength,
		showCardArrow,
		cardReadMore,
	} = attributes;

	const hasOverlayOptions = template?.includes('overlay-5');

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

			{hasOverlayOptions && (
				<div
					style={{
						marginTop: '24px',
						paddingTop: '16px',
						borderTop: '1px solid #e0e0e0',
					}}
				>
					<div
						style={{
							fontSize: '11px',
							fontWeight: '500',
							textTransform: 'uppercase',
							color: '#757575',
							marginBottom: '12px',
						}}
					>
						{__(
							'Overlay Card Options',
							'codeweber-gutenberg-blocks'
						)}
					</div>

					<ToggleControl
						label={__(
							'Show Hover Arrow',
							'codeweber-gutenberg-blocks'
						)}
						checked={showCardArrow !== false}
						onChange={(value) =>
							setAttributes({ showCardArrow: value })
						}
						help={__(
							'Arrow icon in the top-right corner that appears on hover.',
							'codeweber-gutenberg-blocks'
						)}
					/>

					<SelectControl
						label={__(
							'Read More Label',
							'codeweber-gutenberg-blocks'
						)}
						value={cardReadMore || 'none'}
						options={[
							{
								value: 'none',
								label: __(
									'None',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'view',
								label: __(
									'View',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'more',
								label: __(
									'Read more',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'read',
								label: __(
									'Read',
									'codeweber-gutenberg-blocks'
								),
							},
						]}
						onChange={(value) =>
							setAttributes({ cardReadMore: value })
						}
						help={__(
							'Optional text label inside the hover overlay (not clickable — whole card is the link).',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</div>
			)}
		</>
	);
};
