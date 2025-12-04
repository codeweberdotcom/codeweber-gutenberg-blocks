import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, RangeControl, ButtonGroup, Button } from '@wordpress/components';

export const LayoutControl = ({ attributes, setAttributes }) => {
	const {
		displayMode,
		gridColumns,
		gridGapX,
		gridGapY,
		swiperEffect,
		swiperItems,
		swiperItemsXs,
		swiperItemsSm,
		swiperItemsMd,
		swiperItemsLg,
		swiperItemsXl,
		swiperItemsXxl,
		swiperSpeed,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperAutoHeight,
		swiperWatchOverflow,
		swiperMargin,
		swiperLoop,
		swiperNav,
		swiperDots,
		swiperDrag,
		swiperReverse,
		swiperUpdateResize,
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

			{/* Grid Settings */}
			{displayMode === 'grid' && (
				<>
					<SelectControl
						label={__('Grid Columns', 'codeweber-blocks')}
						value={gridColumns}
						options={[
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
							{ label: '7', value: '7' },
							{ label: '8', value: '8' },
							{ label: '9', value: '9' },
							{ label: '10', value: '10' },
							{ label: '11', value: '11' },
							{ label: '12', value: '12' },
						]}
						onChange={(value) => setAttributes({ gridColumns: value })}
					/>

					<SelectControl
						label={__('Grid Gap X', 'codeweber-blocks')}
						value={gridGapX}
						options={[
							{ label: 'None', value: '0' },
							{ label: 'XS (5)', value: 'xs-5' },
							{ label: 'SM (5)', value: 'sm-5' },
							{ label: 'MD (5)', value: 'md-5' },
							{ label: 'LG (5)', value: 'lg-5' },
							{ label: 'XL (5)', value: 'xl-5' },
						]}
						onChange={(value) => setAttributes({ gridGapX: value })}
					/>

					<SelectControl
						label={__('Grid Gap Y', 'codeweber-blocks')}
						value={gridGapY}
						options={[
							{ label: '0', value: '0' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
						]}
						onChange={(value) => setAttributes({ gridGapY: value })}
					/>
				</>
			)}

			{/* Swiper Settings */}
			{displayMode === 'swiper' && (
				<>
					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Transition', 'codeweber-blocks')}
					</h3>

					<SelectControl
						label={__('Effect', 'codeweber-blocks')}
						value={swiperEffect}
						options={[
							{ label: 'Slide', value: 'slide' },
							{ label: 'Fade', value: 'fade' },
						]}
						onChange={(value) => setAttributes({ swiperEffect: value })}
					/>

					<RangeControl
						label={__('Speed (ms)', 'codeweber-blocks')}
						value={swiperSpeed}
						onChange={(value) => setAttributes({ swiperSpeed: value })}
						min={100}
						max={3000}
						step={100}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Items Per View', 'codeweber-blocks')}
					</h3>

					<SelectControl
						label={__('Items (Default)', 'codeweber-blocks')}
						value={swiperItems}
						options={[
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
						]}
						onChange={(value) => setAttributes({ swiperItems: value })}
					/>

					<SelectControl
						label={__('Items XS (0-575px)', 'codeweber-blocks')}
						value={swiperItemsXs}
						options={[
							{ label: 'Default', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
						]}
						onChange={(value) => setAttributes({ swiperItemsXs: value })}
					/>

					<SelectControl
						label={__('Items SM (576-767px)', 'codeweber-blocks')}
						value={swiperItemsSm}
						options={[
							{ label: 'Default (items-xs)', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
						]}
						onChange={(value) => setAttributes({ swiperItemsSm: value })}
					/>

					<SelectControl
						label={__('Items MD (768-991px)', 'codeweber-blocks')}
						value={swiperItemsMd}
						options={[
							{ label: 'Default (items-sm)', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
						]}
						onChange={(value) => setAttributes({ swiperItemsMd: value })}
					/>

					<SelectControl
						label={__('Items LG (992-1199px)', 'codeweber-blocks')}
						value={swiperItemsLg}
						options={[
							{ label: 'Default (items-md)', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
						]}
						onChange={(value) => setAttributes({ swiperItemsLg: value })}
					/>

					<SelectControl
						label={__('Items XL (1200-1400px)', 'codeweber-blocks')}
						value={swiperItemsXl}
						options={[
							{ label: 'Default (items-lg)', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
						]}
						onChange={(value) => setAttributes({ swiperItemsXl: value })}
					/>

					<SelectControl
						label={__('Items XXL (1400px+)', 'codeweber-blocks')}
						value={swiperItemsXxl}
						options={[
							{ label: 'Default (items-xl)', value: '' },
							{ label: '1', value: '1' },
							{ label: '2', value: '2' },
							{ label: '3', value: '3' },
							{ label: '4', value: '4' },
							{ label: '5', value: '5' },
							{ label: '6', value: '6' },
						]}
						onChange={(value) => setAttributes({ swiperItemsXxl: value })}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Spacing & Behavior', 'codeweber-blocks')}
					</h3>

					<RangeControl
						label={__('Margin (px)', 'codeweber-blocks')}
						value={parseInt(swiperMargin)}
						onChange={(value) => setAttributes({ swiperMargin: value.toString() })}
						min={0}
						max={100}
						step={5}
					/>

					<ToggleControl
						label={__('Loop', 'codeweber-blocks')}
						checked={swiperLoop}
						onChange={(value) => setAttributes({ swiperLoop: value })}
					/>

					<ToggleControl
						label={__('Auto Height', 'codeweber-blocks')}
						checked={swiperAutoHeight}
						onChange={(value) => setAttributes({ swiperAutoHeight: value })}
					/>

					<ToggleControl
						label={__('Watch Overflow', 'codeweber-blocks')}
						checked={swiperWatchOverflow}
						onChange={(value) => setAttributes({ swiperWatchOverflow: value })}
					/>

					<ToggleControl
						label={__('Update on Resize', 'codeweber-blocks')}
						checked={swiperUpdateResize}
						onChange={(value) => setAttributes({ swiperUpdateResize: value })}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Autoplay', 'codeweber-blocks')}
					</h3>

					<ToggleControl
						label={__('Enable Autoplay', 'codeweber-blocks')}
						checked={swiperAutoplay}
						onChange={(value) => setAttributes({ swiperAutoplay: value })}
					/>

					{swiperAutoplay && (
						<>
							<RangeControl
								label={__('Autoplay Time (ms)', 'codeweber-blocks')}
								value={swiperAutoplayTime}
								onChange={(value) => setAttributes({ swiperAutoplayTime: value })}
								min={1000}
								max={10000}
								step={500}
							/>

							<ToggleControl
								label={__('Reverse Direction', 'codeweber-blocks')}
								checked={swiperReverse}
								onChange={(value) => setAttributes({ swiperReverse: value })}
							/>
						</>
					)}

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Navigation', 'codeweber-blocks')}
					</h3>

					<ToggleControl
						label={__('Navigation Arrows', 'codeweber-blocks')}
						checked={swiperNav}
						onChange={(value) => setAttributes({ swiperNav: value })}
					/>

					<ToggleControl
						label={__('Pagination Dots', 'codeweber-blocks')}
						checked={swiperDots}
						onChange={(value) => setAttributes({ swiperDots: value })}
					/>

					<ToggleControl
						label={__('Touch Drag', 'codeweber-blocks')}
						checked={swiperDrag}
						onChange={(value) => setAttributes({ swiperDrag: value })}
					/>
				</>
			)}
		</>
	);
};

