import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, RangeControl, ButtonGroup, Button, Tooltip } from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { ResponsiveControl, createSwiperItemsConfig } from '../../../components/responsive-control';
import { GridControl } from '../../../components/grid-control';

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
		swiperNavStyle,
		swiperNavPosition,
		swiperDotsStyle,
		swiperContainerType,
		swiperItemsAuto,
		swiperCentered,
	} = attributes;

	// Helper для label с tooltip
	const LabelWithTooltip = ({ label, tooltip }) => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
			<span>{label}</span>
			<Tooltip text={tooltip}>
				<span style={{ display: 'inline-flex', cursor: 'help' }}>
					<Icon icon={info} size={16} style={{ color: '#949494' }} />
				</span>
			</Tooltip>
		</div>
	);

	// Используем универсальный компонент ResponsiveControl вместо ItemsPerViewTabs

	return (
		<>
			<div className="component-sidebar-title">
				<label>{__('Display Mode', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<ButtonGroup className="button-group-sidebar_3">
				<Button
					isPrimary={displayMode === 'single'}
					onClick={() => setAttributes({ displayMode: 'single' })}
				>
					{__('Single', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					isPrimary={displayMode === 'grid'}
					onClick={() => setAttributes({ displayMode: 'grid' })}
				>
					{__('Grid', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					isPrimary={displayMode === 'swiper'}
					onClick={() => setAttributes({ displayMode: 'swiper' })}
				>
					{__('Swiper', 'codeweber-gutenberg-blocks')}
				</Button>
			</ButtonGroup>

			{/* Grid Settings */}
			{displayMode === 'grid' && (
				<>
					{/* GridControl для Row Cols и Gap */}
					<GridControl
						attributes={attributes}
						setAttributes={setAttributes}
						attributePrefix="grid"
						showRowCols={true}
						showGap={true}
						showSpacing={false}
						rowColsLabel={__('Images Per Row', 'codeweber-gutenberg-blocks')}
						gapLabel={__('Grid Gap', 'codeweber-gutenberg-blocks')}
					/>
				</>
			)}

			{/* Swiper Settings */}
			{displayMode === 'swiper' && (
				<>
					<SelectControl
						label={__('Container Type', 'codeweber-gutenberg-blocks')}
						value={swiperContainerType}
						options={[
							{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
							{ label: __('Hero Slider', 'codeweber-gutenberg-blocks'), value: 'swiper-hero' },
							{ label: __('Fullscreen Slider', 'codeweber-gutenberg-blocks'), value: 'swiper-fullscreen' },
						]}
						onChange={(value) => setAttributes({ swiperContainerType: value })}
						help={__('Special slider types for hero sections or fullscreen layouts', 'codeweber-gutenberg-blocks')}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Transition', 'codeweber-gutenberg-blocks')}
					</h3>

					<SelectControl
						label={__('Effect', 'codeweber-gutenberg-blocks')}
						value={swiperEffect}
						options={[
							{ label: 'Slide', value: 'slide' },
							{ label: 'Fade', value: 'fade' },
						]}
						onChange={(value) => setAttributes({ swiperEffect: value })}
					/>

					<RangeControl
						label={__('Speed (ms)', 'codeweber-gutenberg-blocks')}
						value={swiperSpeed}
						onChange={(value) => setAttributes({ swiperSpeed: value })}
						min={100}
						max={3000}
						step={100}
					/>

					<ResponsiveControl
						{...createSwiperItemsConfig(attributes, setAttributes)}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Auto Width', 'codeweber-gutenberg-blocks')}
								tooltip={__('Slides will have auto width based on their content. Overrides items per view settings.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperItemsAuto}
						onChange={(value) => setAttributes({ swiperItemsAuto: value })}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Spacing & Behavior', 'codeweber-gutenberg-blocks')}
					</h3>

					<RangeControl
						label={__('Margin (px)', 'codeweber-gutenberg-blocks')}
						value={parseInt(swiperMargin)}
						onChange={(value) => setAttributes({ swiperMargin: value.toString() })}
						min={0}
						max={100}
						step={5}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Loop', 'codeweber-gutenberg-blocks')}
								tooltip={__('Enable continuous loop mode. Slides will loop from last to first seamlessly.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperLoop}
						onChange={(value) => setAttributes({ swiperLoop: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Auto Height', 'codeweber-gutenberg-blocks')}
								tooltip={__('Slider wrapper will adapt its height to the height of the currently active slide.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperAutoHeight}
						onChange={(value) => setAttributes({ swiperAutoHeight: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Watch Overflow', 'codeweber-gutenberg-blocks')}
								tooltip={__('When enabled, Swiper will be disabled and hide navigation buttons when there are not enough slides.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperWatchOverflow}
						onChange={(value) => setAttributes({ swiperWatchOverflow: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Update on Resize', 'codeweber-gutenberg-blocks')}
								tooltip={__('Swiper will recalculate slides position on window resize (orientation change).', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperUpdateResize}
						onChange={(value) => setAttributes({ swiperUpdateResize: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Centered Slides', 'codeweber-gutenberg-blocks')}
								tooltip={__('Active slide will be centered, not at the beginning of the slider.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperCentered}
						onChange={(value) => setAttributes({ swiperCentered: value })}
					/>

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Autoplay', 'codeweber-gutenberg-blocks')}
					</h3>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Enable Autoplay', 'codeweber-gutenberg-blocks')}
								tooltip={__('Enable automatic slide change. Slides will automatically transition at specified intervals.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperAutoplay}
						onChange={(value) => setAttributes({ swiperAutoplay: value })}
					/>

					{swiperAutoplay && (
						<>
							<RangeControl
								label={__('Autoplay Time (ms)', 'codeweber-gutenberg-blocks')}
								value={swiperAutoplayTime}
								onChange={(value) => setAttributes({ swiperAutoplayTime: value })}
								min={1000}
								max={10000}
								step={500}
							/>

							<ToggleControl
								label={__('Reverse Direction', 'codeweber-gutenberg-blocks')}
								checked={swiperReverse}
								onChange={(value) => setAttributes({ swiperReverse: value })}
							/>
						</>
					)}

					<h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
						{__('Navigation', 'codeweber-gutenberg-blocks')}
					</h3>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Navigation Arrows', 'codeweber-gutenberg-blocks')}
								tooltip={__('Show previous/next navigation arrows to manually change slides.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperNav}
						onChange={(value) => setAttributes({ swiperNav: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Pagination Dots', 'codeweber-gutenberg-blocks')}
								tooltip={__('Show pagination bullets/dots indicator at the bottom of the slider.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperDots}
						onChange={(value) => setAttributes({ swiperDots: value })}
					/>

					<ToggleControl
						label={
							<LabelWithTooltip
								label={__('Touch Drag', 'codeweber-gutenberg-blocks')}
								tooltip={__('Enable touch/mouse drag to change slides by swiping with finger or mouse.', 'codeweber-gutenberg-blocks')}
							/>
						}
						checked={swiperDrag}
						onChange={(value) => setAttributes({ swiperDrag: value })}
					/>

					<div style={{ marginBottom: '12px' }}>
						<div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', color: '#1e1e1e' }}>
							{__('Navigation Style', 'codeweber-gutenberg-blocks')}
						</div>
						<ButtonGroup style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
							<Button
								variant={swiperNavStyle === '' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavStyle: '' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Default', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperNavStyle === 'nav-dark' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavStyle: 'nav-dark' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Dark', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperNavStyle === 'nav-color' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavStyle: 'nav-color' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Primary', 'codeweber-gutenberg-blocks')}
							</Button>
						</ButtonGroup>
					</div>

					<div style={{ marginBottom: '12px' }}>
						<div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', color: '#1e1e1e' }}>
							{__('Navigation Position', 'codeweber-gutenberg-blocks')}
						</div>
						<ButtonGroup style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
							<Button
								variant={swiperNavPosition === '' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavPosition: '' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Center', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperNavPosition === 'nav-bottom' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavPosition: 'nav-bottom' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Below', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperNavPosition === 'nav-bottom nav-start' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperNavPosition: 'nav-bottom nav-start' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Left', 'codeweber-gutenberg-blocks')}
							</Button>
						</ButtonGroup>
					</div>

					<div style={{ marginBottom: '12px' }}>
						<div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', color: '#1e1e1e' }}>
							{__('Pagination Style', 'codeweber-gutenberg-blocks')}
						</div>
						<ButtonGroup style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
							<Button
								variant={swiperDotsStyle === '' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperDotsStyle: '' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Default', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperDotsStyle === 'dots-light' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperDotsStyle: 'dots-light' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Light', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperDotsStyle === 'dots-start' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperDotsStyle: 'dots-start' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Start', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperDotsStyle === 'dots-over' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperDotsStyle: 'dots-over' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Over', 'codeweber-gutenberg-blocks')}
							</Button>
							<Button
								variant={swiperDotsStyle === 'dots-closer' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ swiperDotsStyle: 'dots-closer' })}
								style={{ flex: '1 1 auto' }}
							>
								{__('Closer', 'codeweber-gutenberg-blocks')}
							</Button>
						</ButtonGroup>
					</div>
				</>
			)}
		</>
	);
};



