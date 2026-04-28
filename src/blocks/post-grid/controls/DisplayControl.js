import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

export const DisplayControl = ({ attributes, setAttributes }) => {
	const {
		showTitle,
		showDate,
		showCategory,
		showComments,
		showExcerpt,
		titleLength,
		excerptLength,
		showCardArrow,
		cardReadMore,
		postType,
		showOfficeAddress,
		showOfficePhone,
		showOfficeEmail,
		showOfficeHours,
		showOfficeDescription,
		showOfficeMap,
		officeMapStyle,
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

			<div
				style={{
					marginTop: '24px',
					paddingTop: '16px',
					borderTop: '1px solid #e0e0e0',
				}}
			>
				<ToggleControl
					label={__(
						'Show Card Arrow',
						'codeweber-gutenberg-blocks'
					)}
					checked={showCardArrow !== false}
					onChange={(value) =>
						setAttributes({ showCardArrow: value })
					}
					help={__(
						'Arrow icon visible on hover.',
						'codeweber-gutenberg-blocks'
					)}
				/>

				{postType === 'offices' && (
					<>
						<div
							style={{
								marginBottom: '8px',
								fontSize: '11px',
								fontWeight: '600',
								textTransform: 'uppercase',
								color: '#757575',
								letterSpacing: '0.05em',
							}}
						>
							{__('Office Fields', 'codeweber-gutenberg-blocks')}
						</div>
						<ToggleControl
							label={__('Show Address', 'codeweber-gutenberg-blocks')}
							checked={showOfficeAddress !== false}
							onChange={(value) => setAttributes({ showOfficeAddress: value })}
						/>
						<ToggleControl
							label={__('Show Phone', 'codeweber-gutenberg-blocks')}
							checked={showOfficePhone !== false}
							onChange={(value) => setAttributes({ showOfficePhone: value })}
						/>
						<ToggleControl
							label={__('Show Email', 'codeweber-gutenberg-blocks')}
							checked={showOfficeEmail !== false}
							onChange={(value) => setAttributes({ showOfficeEmail: value })}
						/>
						<ToggleControl
							label={__('Show Working Hours', 'codeweber-gutenberg-blocks')}
							checked={showOfficeHours !== false}
							onChange={(value) => setAttributes({ showOfficeHours: value })}
						/>
						<ToggleControl
							label={__('Show Description', 'codeweber-gutenberg-blocks')}
							checked={showOfficeDescription !== false}
							onChange={(value) => setAttributes({ showOfficeDescription: value })}
						/>
						<ToggleControl
							label={__('Show on Map', 'codeweber-gutenberg-blocks')}
							checked={showOfficeMap !== false}
							onChange={(value) => setAttributes({ showOfficeMap: value })}
						/>
						{showOfficeMap !== false && (
							<SelectControl
								label={__('Map Link Style', 'codeweber-gutenberg-blocks')}
								value={officeMapStyle || 'button'}
								options={[
									{ value: 'button', label: __('Button', 'codeweber-gutenberg-blocks') },
									{ value: 'text',   label: __('Text link', 'codeweber-gutenberg-blocks') },
								]}
								onChange={(value) => setAttributes({ officeMapStyle: value })}
							/>
						)}
					</>
				)}

				<SelectControl
					label={__(
						'Read More Label',
						'codeweber-gutenberg-blocks'
					)}
					value={cardReadMore || 'none'}
					options={[
						{ value: 'none',    label: __( 'None',        'codeweber-gutenberg-blocks' ) },
						{ value: 'more',    label: __( 'Read more',   'codeweber-gutenberg-blocks' ) },
						{ value: 'read',    label: __( 'Read',        'codeweber-gutenberg-blocks' ) },
						{ value: 'view',    label: __( 'View',        'codeweber-gutenberg-blocks' ) },
						{ value: 'go',      label: __( 'Go',          'codeweber-gutenberg-blocks' ) },
						{ value: 'open',    label: __( 'Open',        'codeweber-gutenberg-blocks' ) },
						{ value: 'details', label: __( 'Details',     'codeweber-gutenberg-blocks' ) },
						{ value: 'learn',   label: __( 'Learn more',  'codeweber-gutenberg-blocks' ) },
						{ value: 'buy',     label: __( 'Buy',         'codeweber-gutenberg-blocks' ) },
						{ value: 'order',   label: __( 'Order',       'codeweber-gutenberg-blocks' ) },
					]}
					onChange={(value) =>
						setAttributes({ cardReadMore: value })
					}
					help={__(
						'Optional text label inside the card (not a link).',
						'codeweber-gutenberg-blocks'
					)}
				/>
			</div>
		</>
	);
};
