/**
 * Counter Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	ButtonGroup,
	Button,
	TextControl,
	ToggleControl,
	SelectControl,
	ComboboxControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import {
	Icon,
	symbol,
	typography,
	paragraph as paragraphIcon,
	addCard,
	border,
	cog,
	arrowRight,
	mapMarker,
} from '@wordpress/icons';

import { IconControl, IconRender } from '../../components/icon';
import { ParagraphControl, ParagraphRender } from '../../components/paragraph';
import { BorderSettingsPanel } from '../../components/borders';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';
import {
	createHeadingTagOptions,
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../heading-subtitle/utils';
import { colors } from '../../utilities/colors';
import {
	getCounterClasses,
	getRootClasses,
	getPositionStyles,
	getDataAttributes,
	arrangeLayout,
} from './shared';

const colorOptions = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	...colors,
];

const ratingsOptions = [
	{ label: '1', value: 'one' },
	{ label: '2', value: 'two' },
	{ label: '3', value: 'three' },
	{ label: '4', value: 'four' },
	{ label: '4.5', value: 'four-half' },
	{ label: '5', value: 'five' },
];

const shadowOptions = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: 'shadow-sm', value: 'shadow-sm' },
	{ label: 'shadow', value: 'shadow' },
	{ label: 'shadow-lg', value: 'shadow-lg' },
];

const alignOptions = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Start', 'codeweber-gutenberg-blocks'), value: 'text-start' },
	{ label: __('Center', 'codeweber-gutenberg-blocks'), value: 'text-center' },
	{ label: __('End', 'codeweber-gutenberg-blocks'), value: 'text-end' },
];

const positionOptions = [
	{ label: __('Static', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: 'position-relative', value: 'position-relative' },
	{ label: 'position-absolute', value: 'position-absolute' },
	{ label: 'position-fixed', value: 'position-fixed' },
];

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icon icon={icon} size={20} />
	</span>
);

const Edit = ({ attributes, setAttributes, clientId }) => {
	const {
		counterLayout,
		iconType,
		iconName,
		svgIcon,
		svgStyle,
		iconSize,
		iconFontSize,
		iconColor,
		iconColor2,
		iconClass,
		iconWrapper,
		iconWrapperStyle,
		iconBtnSize,
		iconBtnVariant,
		iconWrapperClass,
		iconGradientColor,
		customSvgUrl,
		customSvgId,
		customSvgSize,
		title,
		titleTag,
		titleColor,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
		counterLg,
		enableParagraph,
		paragraph,
		paragraphTag,
		paragraphColor,
		paragraphColorType,
		paragraphSize,
		paragraphWeight,
		paragraphTransform,
		paragraphClass,
		enableSubtitle,
		subtitle,
		subtitleTag,
		subtitleClass,
		enableRatings,
		ratingsValue,
		align,
		textWhite,
		enableCard,
		enableCardBody,
		cardBodyClass,
		overflowHidden,
		h100,
		shadow,
		cardBorder,
		borderPosition,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
		positionType,
		offsetTop,
		offsetBottom,
		offsetLeft,
		offsetRight,
		zIndex,
		backgroundType,
		backgroundImageUrl,
		backgroundPatternUrl,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	const showIcon =
		counterLayout === 'counter-1' || counterLayout === 'counter-2';
	const isCounter4 = counterLayout === 'counter-4';

	// Animation preview reinit (mirrors feature block)
	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const timer = setTimeout(() => {
			if (typeof window.reinitScrollCue === 'function') {
				window.reinitScrollCue();
			}
		}, 200);

		return () => clearTimeout(timer);
	}, [animationEnabled, animationType, animationDuration, animationDelay, clientId]);

	// Layout preset configurations
	const applyPreset = (preset) => {
		const presets = {
			'counter-1': {
				counterLayout: 'counter-1',
				iconType: 'font',
				iconWrapper: true,
				iconWrapperStyle: 'btn-circle',
				iconBtnSize: 'btn-lg',
				iconBtnVariant: 'soft',
				iconColor: 'purple',
				iconClass: '',
				iconWrapperClass: 'pe-none mx-auto me-4 mb-lg-3 mb-xl-0',
				counterLg: false,
				titleClass: 'mb-1',
				paragraphClass: 'mb-0',
				align: '',
				enableCard: true,
				enableCardBody: true,
				shadow: 'shadow-lg',
				enableSubtitle: false,
				enableRatings: false,
			},
			'counter-2': {
				counterLayout: 'counter-2',
				iconType: 'svg',
				iconWrapper: false,
				svgStyle: 'lineal',
				iconSize: 'lg',
				iconColor: 'primary',
				iconClass: 'mb-3',
				counterLg: false,
				titleClass: 'mb-1',
				paragraphClass: 'mb-0',
				align: 'text-center',
				enableCard: false,
				shadow: '',
				enableSubtitle: false,
				enableRatings: false,
			},
			'counter-3': {
				counterLayout: 'counter-3',
				counterLg: true,
				titleClass: 'mb-1',
				paragraphClass: 'mb-0',
				align: 'text-center',
				enableCard: false,
				shadow: '',
				enableSubtitle: false,
				enableRatings: false,
			},
			'counter-4': {
				counterLayout: 'counter-4',
				counterLg: true,
				titleClass: 'mb-1',
				align: '',
				enableCard: false,
				shadow: '',
				enableSubtitle: true,
				enableRatings: true,
			},
		};
		setAttributes(presets[preset]);
	};

	// Tabs
	const tabs = [
		{ name: 'counter', title: <TabIcon icon={symbol} label={__('Counter', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'number', title: <TabIcon icon={typography} label={__('Number', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'label', title: <TabIcon icon={paragraphIcon} label={__('Label', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'card', title: <TabIcon icon={addCard} label={__('Card', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'borders', title: <TabIcon icon={border} label={__('Borders', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'position', title: <TabIcon icon={mapMarker} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'animation', title: <TabIcon icon={arrowRight} label={__('Animation', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	// Build display elements
	const iconElement =
		showIcon && iconType !== 'none' ? (
			<IconRender
				iconType={iconType}
				iconName={iconName}
				svgIcon={svgIcon}
				svgStyle={svgStyle}
				iconSize={iconSize}
				iconFontSize={iconFontSize}
				iconColor={iconColor}
				iconColor2={iconColor2}
				iconClass={iconClass}
				iconWrapper={iconWrapper}
				iconWrapperStyle={iconWrapperStyle}
				iconBtnSize={iconBtnSize}
				iconBtnVariant={iconBtnVariant}
				iconWrapperClass={iconWrapperClass}
				iconGradientColor={iconGradientColor}
				customSvgUrl={customSvgUrl}
				customSvgId={customSvgId}
				customSvgSize={customSvgSize}
				isEditor={true}
			/>
		) : null;

	const counterElement = (
		<RichText
			tagName={titleTag || 'h3'}
			value={title}
			onChange={(value) => setAttributes({ title: value })}
			className={getCounterClasses(attributes)}
			placeholder={__('7518', 'codeweber-gutenberg-blocks')}
		/>
	);

	const labelElement = enableParagraph ? (
		<ParagraphRender
			attributes={{
				...attributes,
				text: paragraph,
				textColor: paragraphColor,
				textColorType: paragraphColorType,
				textSize: paragraphSize,
				textWeight: paragraphWeight,
				textTransform: paragraphTransform,
				textClass: paragraphClass,
			}}
			setAttributes={(updates) => {
				if (updates.text !== undefined) {
					setAttributes({ paragraph: updates.text });
				} else {
					setAttributes(updates);
				}
			}}
			prefix=""
			tag={paragraphTag}
		/>
	) : null;

	const subtitleElement =
		enableSubtitle && isCounter4 ? (
			<RichText
				tagName={subtitleTag || 'h6'}
				value={subtitle}
				onChange={(value) => setAttributes({ subtitle: value })}
				className={subtitleClass || undefined}
				placeholder={__('Subtitle…', 'codeweber-gutenberg-blocks')}
			/>
		) : null;

	const ratingsElement =
		enableRatings && isCounter4 ? (
			<span className={`ratings ${ratingsValue}`}></span>
		) : null;

	const content = arrangeLayout(counterLayout, {
		icon: iconElement,
		counter: counterElement,
		label: labelElement,
		subtitle: subtitleElement,
		ratings: ratingsElement,
	});

	const blockProps = useBlockProps({
		className: getRootClasses(attributes),
		style: getPositionStyles(attributes),
		id: blockId || undefined,
		...(backgroundType === 'image' &&
			backgroundImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' &&
			backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl }),
		...getDataAttributes(blockData),
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && { 'data-duration': animationDuration }),
				...(animationDelay && { 'data-delay': animationDelay }),
			}),
	});

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* COUNTER TAB */}
							{tab.name === 'counter' && (
								<PanelBody>
									<ButtonGroup>
										<Button
											variant={counterLayout === 'counter-1' ? 'primary' : 'secondary'}
											onClick={() => applyPreset('counter-1')}
										>
											1
										</Button>
										<Button
											variant={counterLayout === 'counter-2' ? 'primary' : 'secondary'}
											onClick={() => applyPreset('counter-2')}
										>
											2
										</Button>
										<Button
											variant={counterLayout === 'counter-3' ? 'primary' : 'secondary'}
											onClick={() => applyPreset('counter-3')}
										>
											3
										</Button>
										<Button
											variant={counterLayout === 'counter-4' ? 'primary' : 'secondary'}
											onClick={() => applyPreset('counter-4')}
										>
											4
										</Button>
									</ButtonGroup>

									<div style={{ marginTop: '16px' }}>
										<SelectControl
											label={__('Text Align', 'codeweber-gutenberg-blocks')}
											value={align}
											options={alignOptions}
											onChange={(value) => setAttributes({ align: value })}
										/>
										<ToggleControl
											label={__('Text White', 'codeweber-gutenberg-blocks')}
											checked={textWhite}
											onChange={(value) => setAttributes({ textWhite: value })}
										/>
									</div>

									{showIcon && (
										<div style={{ marginTop: '16px' }}>
											<IconControl
												attributes={attributes}
												setAttributes={setAttributes}
												prefix=""
											/>
										</div>
									)}
								</PanelBody>
							)}

							{/* NUMBER TAB */}
							{tab.name === 'number' && (
								<PanelBody>
									<SelectControl
										label={__('Tag', 'codeweber-gutenberg-blocks')}
										value={titleTag}
										options={createHeadingTagOptions()}
										onChange={(value) => setAttributes({ titleTag: value })}
									/>
									<ToggleControl
										label={__('Large (counter-lg)', 'codeweber-gutenberg-blocks')}
										checked={counterLg}
										onChange={(value) => setAttributes({ counterLg: value })}
									/>
									<ComboboxControl
										label={__('Color', 'codeweber-gutenberg-blocks')}
										value={titleColor}
										options={colorOptions}
										onChange={(value) => setAttributes({ titleColor: value || '' })}
										allowReset={true}
									/>
									<SelectControl
										label={__('Size', 'codeweber-gutenberg-blocks')}
										value={titleSize}
										options={createSizeOptions()}
										onChange={(value) => setAttributes({ titleSize: value })}
									/>
									<SelectControl
										label={__('Weight', 'codeweber-gutenberg-blocks')}
										value={titleWeight}
										options={createWeightOptions()}
										onChange={(value) => setAttributes({ titleWeight: value })}
									/>
									<SelectControl
										label={__('Transform', 'codeweber-gutenberg-blocks')}
										value={titleTransform}
										options={createTransformOptions()}
										onChange={(value) => setAttributes({ titleTransform: value })}
									/>
									<TextControl
										label={__('Number Classes', 'codeweber-gutenberg-blocks')}
										value={titleClass}
										onChange={(value) => setAttributes({ titleClass: value })}
									/>

									{isCounter4 && (
										<>
											<hr />
											<ToggleControl
												label={__('Enable Subtitle (h6)', 'codeweber-gutenberg-blocks')}
												checked={enableSubtitle}
												onChange={(value) => setAttributes({ enableSubtitle: value })}
											/>
											{enableSubtitle && (
												<TextControl
													label={__('Subtitle Classes', 'codeweber-gutenberg-blocks')}
													value={subtitleClass}
													onChange={(value) => setAttributes({ subtitleClass: value })}
												/>
											)}
											<ToggleControl
												label={__('Enable Ratings', 'codeweber-gutenberg-blocks')}
												checked={enableRatings}
												onChange={(value) => setAttributes({ enableRatings: value })}
											/>
											{enableRatings && (
												<SelectControl
													label={__('Ratings', 'codeweber-gutenberg-blocks')}
													value={ratingsValue}
													options={ratingsOptions}
													onChange={(value) => setAttributes({ ratingsValue: value })}
												/>
											)}
										</>
									)}
								</PanelBody>
							)}

							{/* LABEL TAB */}
							{tab.name === 'label' && (
								<PanelBody>
									<ToggleControl
										label={__('Enable Label', 'codeweber-gutenberg-blocks')}
										checked={enableParagraph}
										onChange={(value) => setAttributes({ enableParagraph: value })}
									/>
									{enableParagraph && (
										<ParagraphControl
											attributes={{
												...attributes,
												text: paragraph,
												textColor: paragraphColor,
												textColorType: paragraphColorType,
												textSize: paragraphSize,
												textWeight: paragraphWeight,
												textTransform: paragraphTransform,
												textClass: paragraphClass,
												textTag: paragraphTag,
											}}
											setAttributes={(updates) => {
												const mapped = {};
												Object.keys(updates).forEach((key) => {
													if (key === 'text') {
														mapped.paragraph = updates[key];
													} else if (key.startsWith('text')) {
														mapped['paragraph' + key.slice(4)] = updates[key];
													} else {
														mapped[key] = updates[key];
													}
												});
												setAttributes(mapped);
											}}
											prefix=""
											label={__('Label', 'codeweber-gutenberg-blocks')}
										/>
									)}
								</PanelBody>
							)}

							{/* CARD TAB */}
							{tab.name === 'card' && (
								<PanelBody>
									<ToggleControl
										label={__('Enable Card Wrapper', 'codeweber-gutenberg-blocks')}
										checked={enableCard}
										onChange={(value) => setAttributes({ enableCard: value })}
									/>
									{enableCard && (
										<ToggleControl
											label={__('Enable Card Body', 'codeweber-gutenberg-blocks')}
											checked={enableCardBody}
											onChange={(value) => setAttributes({ enableCardBody: value })}
										/>
									)}
									<SelectControl
										label={__('Shadow', 'codeweber-gutenberg-blocks')}
										value={shadow}
										options={shadowOptions}
										onChange={(value) => setAttributes({ shadow: value })}
									/>
									<ToggleControl
										label={__('Overflow Hidden', 'codeweber-gutenberg-blocks')}
										checked={overflowHidden}
										onChange={(value) => setAttributes({ overflowHidden: value })}
									/>
									<ToggleControl
										label={__('H-100', 'codeweber-gutenberg-blocks')}
										checked={h100}
										onChange={(value) => setAttributes({ h100: value })}
									/>
									<div style={{ marginTop: '16px' }}>
										<SpacingControl
											spacingType={spacingType}
											spacingXs={spacingXs}
											spacingSm={spacingSm}
											spacingMd={spacingMd}
											spacingLg={spacingLg}
											spacingXl={spacingXl}
											spacingXxl={spacingXxl}
											spacingXxxl={spacingXxxl}
											onChange={(key, value) => setAttributes({ [key]: value })}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<BackgroundSettingsPanel
											attributes={attributes}
											setAttributes={setAttributes}
										/>
									</div>
								</PanelBody>
							)}

							{/* BORDERS TAB */}
							{tab.name === 'borders' && (
								<PanelBody>
									<BorderSettingsPanel
										attributes={{
											...attributes,
											borderPosition: cardBorder || borderPosition,
										}}
										onChange={(obj) => {
											if ('borderPosition' in obj) {
												setAttributes({ ...obj, cardBorder: obj.borderPosition });
											} else {
												setAttributes(obj);
											}
										}}
									/>
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'position' && (
								<PanelBody>
									<SelectControl
										label={__('Position', 'codeweber-gutenberg-blocks')}
										value={positionType}
										options={positionOptions}
										onChange={(value) => setAttributes({ positionType: value })}
										help={__('Use position-absolute for floating cards over a banner.', 'codeweber-gutenberg-blocks')}
									/>
									<TextControl
										label={__('Top', 'codeweber-gutenberg-blocks')}
										value={offsetTop}
										onChange={(value) => setAttributes({ offsetTop: value })}
										placeholder="10%, 1rem, 20px…"
									/>
									<TextControl
										label={__('Bottom', 'codeweber-gutenberg-blocks')}
										value={offsetBottom}
										onChange={(value) => setAttributes({ offsetBottom: value })}
										placeholder="10%, 1rem, 20px…"
									/>
									<TextControl
										label={__('Left', 'codeweber-gutenberg-blocks')}
										value={offsetLeft}
										onChange={(value) => setAttributes({ offsetLeft: value })}
										placeholder="-3%, 0, 20px…"
									/>
									<TextControl
										label={__('Right', 'codeweber-gutenberg-blocks')}
										value={offsetRight}
										onChange={(value) => setAttributes({ offsetRight: value })}
										placeholder="-3%, 0, 20px…"
									/>
									<TextControl
										label={__('Z-Index', 'codeweber-gutenberg-blocks')}
										value={zIndex}
										onChange={(value) => setAttributes({ zIndex: value })}
										placeholder="2, 10…"
									/>
								</PanelBody>
							)}

							{/* ANIMATION TAB */}
							{tab.name === 'animation' && (
								<div style={{ padding: '16px' }}>
									<AnimationControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</div>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<div style={{ padding: '16px' }}>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'blockClass',
											dataKey: 'blockData',
											idKey: 'blockId',
										}}
										labels={{
											classLabel: __('Block Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Block Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Block ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
									{enableCard && enableCardBody && (
										<TextControl
											label={__('Card Body Class', 'codeweber-gutenberg-blocks')}
											value={cardBodyClass || ''}
											onChange={(value) => setAttributes({ cardBodyClass: value })}
										/>
									)}
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				{enableCard && enableCardBody ? (
					<div className={`card-body ${cardBodyClass || ''}`.trim()}>
						{content}
					</div>
				) : (
					content
				)}
			</div>
		</>
	);
};

export default Edit;
