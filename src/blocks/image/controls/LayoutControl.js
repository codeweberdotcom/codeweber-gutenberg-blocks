import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, TextControl, RangeControl, ButtonGroup, Button } from '@wordpress/components';

export const LayoutControl = ({ attributes, setAttributes }) => {
	const {
		displayMode,
		gridColumns,
		gridGapX,
		gridGapY,
		swiperNav,
		swiperDots,
		swiperMargin,
		swiperItemsXl,
		swiperItemsMd,
		swiperItemsXs,
	} = attributes;

	return (
		<>
			<div className="component-sidebar-title">
				<label>{__('Display Mode', 'codeweber-blocks')}</label>
			</div>
			<ButtonGroup className="button-group-sidebar_3">
				<Button
					isPrimary={displayMode === 'single'}
					onClick={() => setAttributes({ displayMode: 'single' })}
				>
					{__('Single', 'codeweber-blocks')}
				</Button>
				<Button
					isPrimary={displayMode === 'grid'}
					onClick={() => setAttributes({ displayMode: 'grid' })}
				>
					{__('Grid', 'codeweber-blocks')}
				</Button>
				<Button
					isPrimary={displayMode === 'swiper'}
					onClick={() => setAttributes({ displayMode: 'swiper' })}
				>
					{__('Swiper', 'codeweber-blocks')}
				</Button>
			</ButtonGroup>

			{displayMode === 'grid' && (
				<>
					<SelectControl
						label={__('Columns', 'codeweber-blocks')}
						value={gridColumns}
						options={[
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
						]}
						onChange={(value) => setAttributes({ gridColumns: value })}
					/>

					<SelectControl
						label={__('Gap X (Horizontal)', 'codeweber-blocks')}
						value={gridGapX}
						options={[
							{ label: 'gx-0', value: '0' },
							{ label: 'gx-1', value: '1' },
							{ label: 'gx-2', value: '2' },
							{ label: 'gx-3', value: '3' },
							{ label: 'gx-4', value: '4' },
							{ label: 'gx-5', value: '5' },
							{ label: 'gx-md-5', value: 'md-5' },
							{ label: 'gx-lg-8', value: 'lg-8' },
							{ label: 'gx-xl-12', value: 'xl-12' },
						]}
						onChange={(value) => setAttributes({ gridGapX: value })}
					/>

					<SelectControl
						label={__('Gap Y (Vertical)', 'codeweber-blocks')}
						value={gridGapY}
						options={[
							{ label: 'gy-0', value: '0' },
							{ label: 'gy-1', value: '1' },
							{ label: 'gy-2', value: '2' },
							{ label: 'gy-3', value: '3' },
							{ label: 'gy-4', value: '4' },
							{ label: 'gy-5', value: '5' },
							{ label: 'gy-6', value: '6' },
							{ label: 'gy-8', value: '8' },
							{ label: 'gy-10', value: '10' },
							{ label: 'gy-12', value: '12' },
						]}
						onChange={(value) => setAttributes({ gridGapY: value })}
					/>
				</>
			)}

			{displayMode === 'swiper' && (
				<>
					<ToggleControl
						label={__('Navigation (Arrows)', 'codeweber-blocks')}
						checked={swiperNav}
						onChange={(value) => setAttributes({ swiperNav: value })}
					/>

					<ToggleControl
						label={__('Pagination (Dots)', 'codeweber-blocks')}
						checked={swiperDots}
						onChange={(value) => setAttributes({ swiperDots: value })}
					/>

					<TextControl
						label={__('Margin (Gap between slides)', 'codeweber-blocks')}
						value={swiperMargin}
						onChange={(value) => setAttributes({ swiperMargin: value })}
						type="number"
						help={__('Spacing in pixels', 'codeweber-blocks')}
					/>

					<RangeControl
						label={__('Items XL (Desktop)', 'codeweber-blocks')}
						value={parseInt(swiperItemsXl)}
						onChange={(value) => setAttributes({ swiperItemsXl: value.toString() })}
						min={1}
						max={6}
					/>

					<RangeControl
						label={__('Items MD (Tablet)', 'codeweber-blocks')}
						value={parseInt(swiperItemsMd)}
						onChange={(value) => setAttributes({ swiperItemsMd: value.toString() })}
						min={1}
						max={6}
					/>

					<RangeControl
						label={__('Items XS (Mobile)', 'codeweber-blocks')}
						value={parseInt(swiperItemsXs)}
						onChange={(value) => setAttributes({ swiperItemsXs: value.toString() })}
						min={1}
						max={3}
					/>
				</>
			)}
		</>
	);
};

