/**
 * Image Hover Control Component
 *
 * Universal control for image hover effects based on Sandbox theme documentation
 * https://sandbox.elemisthemes.com/docs/elements/image-hover.html
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl, Button, SelectControl } from '@wordpress/components';

/**
 * ImageHoverControl Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 */
export const ImageHoverControl = ({ attributes, setAttributes, showAdvanced = true }) => {
	const {
		// Simple эффекты (только один)
		simpleEffect = 'none', // none, lift, hover-scale

		// Advanced эффекты (только один)
		effectType = 'none', // none, tooltip, overlay, cursor

		// Tooltip настройки
		tooltipStyle = 'itooltip-dark', // itooltip-dark, itooltip-light, itooltip-primary

		// Overlay настройки
		overlayStyle = 'overlay-1', // overlay-1, overlay-2, overlay-3, overlay-4, overlay-5, overlay-6, overlay-7
		overlayGradient = 'gradient-1', // gradient-1 to gradient-7 (для overlay-3)
		overlayColor = false, // добавляет класс 'color' для overlay-2
		overlayIconColor = 'bg-frost', // bg-frost, bg-soft-frost, bg-pale-frost (для overlay-6)

		// Cursor настройки
		cursorStyle = 'cursor-dark', // cursor-dark, cursor-light, cursor-primary
	} = attributes;

	// Component render

	return (
		<>
			{/* SIMPLE ЭФФЕКТЫ (только один) */}
			<div style={{ marginBottom: '16px' }}>
				<div className="component-sidebar-title">
					<label>
						{__(
							'Simple Effects (Choose One)',
							'codeweber-gutenberg-blocks'
						)}
					</label>
				</div>

				<div className="button-group-sidebar_33">
					<Button
						isPrimary={simpleEffect === 'none'}
						isSecondary={simpleEffect !== 'none'}
						onClick={() => {
							setAttributes({ simpleEffect: 'none' });
						}}
					>
						{__('None', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={simpleEffect === 'lift'}
						isSecondary={simpleEffect !== 'lift'}
						onClick={() => {
							setAttributes({ simpleEffect: 'lift' });
						}}
					>
						{__('Lift', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={simpleEffect === 'hover-scale'}
						isSecondary={simpleEffect !== 'hover-scale'}
						onClick={() => {
							setAttributes({ simpleEffect: 'hover-scale' });
						}}
					>
						{__('Hover Scale', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={simpleEffect === 'hover-scale-rotate'}
						isSecondary={simpleEffect !== 'hover-scale-rotate'}
						onClick={() => {
							setAttributes({ simpleEffect: 'hover-scale-rotate' });
						}}
					>
						{__('Scale Rotate', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>
			</div>

			{/* ADVANCED ЭФФЕКТЫ (только один) */}
			{showAdvanced && (
			<div style={{ marginBottom: '16px' }}>
				<div className="component-sidebar-title">
					<label>
						{__(
							'Advanced Effects (Choose One)',
							'codeweber-gutenberg-blocks'
						)}
					</label>
				</div>

				<div className="button-group-sidebar_50">
					<Button
						isPrimary={effectType === 'none'}
						isSecondary={effectType !== 'none'}
						onClick={() => {
							setAttributes({ effectType: 'none' });
						}}
					>
						{__('None', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={effectType === 'tooltip'}
						isSecondary={effectType !== 'tooltip'}
						onClick={() => {
							setAttributes({ effectType: 'tooltip' });
						}}
					>
						{__('Tooltip', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={effectType === 'overlay'}
						isSecondary={effectType !== 'overlay'}
						onClick={() => {
							setAttributes({ effectType: 'overlay' });
						}}
					>
						{__('Overlay', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						isPrimary={effectType === 'cursor'}
						isSecondary={effectType !== 'cursor'}
						onClick={(e) => {
							console.log(
								'🟢 Advanced Effect CLICKED: cursor',
								'Current:',
								effectType,
								'Event:',
								e
							);
							setAttributes({ effectType: 'cursor' });
							console.log('✅ setAttributes called for: cursor');
						}}
					>
						{__('Cursor', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>
			</div>
			)}

			{/* TOOLTIP НАСТРОЙКИ */}
			{showAdvanced && effectType === 'tooltip' && (
				<div style={{ marginBottom: '16px' }}>
					<SelectControl
						label={__(
							'Tooltip Style',
							'codeweber-gutenberg-blocks'
						)}
						value={tooltipStyle}
						options={[
							{
								label: __('Dark', 'codeweber-gutenberg-blocks'),
								value: 'itooltip-dark',
							},
							{
								label: __(
									'Light',
									'codeweber-gutenberg-blocks'
								),
								value: 'itooltip-light',
							},
							{
								label: __(
									'Primary',
									'codeweber-gutenberg-blocks'
								),
								value: 'itooltip-primary',
							},
						]}
						onChange={(value) =>
							setAttributes({ tooltipStyle: value })
						}
					/>
				</div>
			)}

			{/* OVERLAY НАСТРОЙКИ */}
			{showAdvanced && effectType === 'overlay' && (
				<div style={{ marginBottom: '16px' }}>
					<SelectControl
						label={__(
							'Overlay Style',
							'codeweber-gutenberg-blocks'
						)}
						value={overlayStyle}
						options={[
							{
								label: __(
									'Overlay 5 (Plus Icon)',
									'codeweber-gutenberg-blocks'
								),
								value: 'overlay-5',
							},
							{
								label: __(
									'Overlay 5 + Bottom Caption',
									'codeweber-gutenberg-blocks'
								),
								value: 'overlay-5-bottom',
							},
							{
								label: __(
									'Overlay 6 (Hover Overlay)',
									'codeweber-gutenberg-blocks'
								),
								value: 'overlay-6',
							},
							{
								label: __(
									'Overlay 7 (Item Link)',
									'codeweber-gutenberg-blocks'
								),
								value: 'overlay-7',
							},
						]}
						onChange={(value) =>
							setAttributes({ overlayStyle: value })
						}
					/>

					{/* Overlay-6: Icon color */}
					{overlayStyle === 'overlay-6' && (
						<SelectControl
							label={__(
								'Icon Background',
								'codeweber-gutenberg-blocks'
							)}
							value={overlayIconColor || 'bg-frost'}
							options={[
								{
									label: __(
										'Frost',
										'codeweber-gutenberg-blocks'
									),
									value: 'bg-frost',
								},
								{
									label: __(
										'Soft Frost',
										'codeweber-gutenberg-blocks'
									),
									value: 'bg-soft-frost',
								},
								{
									label: __(
										'Pale Frost',
										'codeweber-gutenberg-blocks'
									),
									value: 'bg-pale-frost',
								},
							]}
							onChange={(value) =>
								setAttributes({ overlayIconColor: value })
							}
						/>
					)}

				</div>
			)}

			{/* CURSOR НАСТРОЙКИ */}
			{showAdvanced && effectType === 'cursor' && (
				<div style={{ marginBottom: '16px' }}>
					<SelectControl
						label={__('Cursor Style', 'codeweber-gutenberg-blocks')}
						value={cursorStyle}
						options={[
							{
								label: __('Dark', 'codeweber-gutenberg-blocks'),
								value: 'cursor-dark',
							},
							{
								label: __(
									'Light',
									'codeweber-gutenberg-blocks'
								),
								value: 'cursor-light',
							},
							{
								label: __(
									'Primary',
									'codeweber-gutenberg-blocks'
								),
								value: 'cursor-primary',
							},
						]}
						onChange={(value) =>
							setAttributes({ cursorStyle: value })
						}
					/>
				</div>
			)}
		</>
	);
};

/**
 * Get Image Hover Classes
 * Generates CSS classes based on hover settings
 *
 * @param {Object} attributes - Block attributes
 * @returns {string} Space-separated class names
 */
export const getImageHoverClasses = (attributes) => {
	const {
		simpleEffect = 'none',
		effectType = 'none',
		tooltipStyle = 'itooltip-dark',
		overlayStyle = 'overlay-1',
		overlayGradient = 'gradient-1',
		overlayColor = false,
		overlayIconColor = 'bg-frost',
		cursorStyle = 'cursor-dark',
	} = attributes;

	const classes = [];

	// Simple эффект (только один)
	if (simpleEffect && simpleEffect !== 'none') {
		classes.push(simpleEffect);
	}

	// Advanced эффект (только один)
	switch (effectType) {
		case 'tooltip':
			classes.push('itooltip', tooltipStyle);
			break;

		case 'overlay':
			// overlay-5-bottom uses overlay-5 CSS class (bottom-overlay added separately)
			classes.push('overlay', overlayStyle === 'overlay-5-bottom' ? 'overlay-5' : overlayStyle);

			// Overlay-2 with color
			if (overlayStyle === 'overlay-2' && overlayColor) {
				classes.push('color');
			}

			// Overlay-3 with gradient
			if (overlayStyle === 'overlay-3' && overlayGradient) {
				classes.push(`overlay-${overlayGradient}`);
			}

			// Overlay-5: plus icon with hover-scale
			if (overlayStyle === 'overlay-5') {
				classes.push('hover-scale', 'hover-plus');
			}

			// Overlay-5-bottom: plus icon + always-visible bottom caption
			if (overlayStyle === 'overlay-5-bottom') {
				classes.push('hover-scale', 'hover-plus', 'bottom-overlay');
			}

			// Overlay-6: hover-overlay with icon (no overlay base class)
			if (overlayStyle === 'overlay-6') {
				// Remove 'overlay' and 'overlay-6' added above, replace with hover classes
				const overlayIdx = classes.indexOf('overlay');
				if (overlayIdx > -1) classes.splice(overlayIdx, 1);
				const overlay6Idx = classes.indexOf('overlay-6');
				if (overlay6Idx > -1) classes.splice(overlay6Idx, 1);
				classes.push('hover-scale', 'hover-overlay');
			}

			// Overlay-7: item-link (position-relative only, no overlay classes)
			if (overlayStyle === 'overlay-7') {
				const overlayIdx = classes.indexOf('overlay');
				if (overlayIdx > -1) classes.splice(overlayIdx, 1);
				const overlay7Idx = classes.indexOf('overlay-7');
				if (overlay7Idx > -1) classes.splice(overlay7Idx, 1);
				classes.push('position-relative');
			}
			break;

		case 'cursor':
			classes.push(cursorStyle);
			break;

		case 'none':
		default:
			// No additional classes
			break;
	}

	return classes.filter(Boolean).join(' ');
};

/**
 * Get Tooltip Title HTML
 * Generates title attribute for iTooltip
 *
 * @param {Object} image - Image object with title, caption, description
 * @param {string} effectType - Current effect type
 * @returns {string} HTML string for tooltip title
 */
export const getTooltipTitle = (image, effectType) => {
	if (!image || effectType !== 'tooltip') {
		return '';
	}

	let html = '';
	const titleText = image.title || image.caption;

	if (titleText) {
		html += `<h5 class="mb-1">${titleText}</h5>`;
	}

	if (image.description) {
		html += `<p class="mb-0">${image.description}</p>`;
	}

	return html;
};
