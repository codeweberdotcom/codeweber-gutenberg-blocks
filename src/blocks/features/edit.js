/**
 * Features Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel, PanelBody, SelectControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	Icon,
	symbol,
	typography,
	button,
	addCard,
	starFilled,
	border,
} from '@wordpress/icons';
import { ButtonGroup, Button } from '@wordpress/components';
import { getFeaturesTemplates } from './templates';

import { IconControl } from '../../components/icon';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { BorderSettingsPanel } from '../../components/borders';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import {
	TextControl,
	ToggleControl,
	ComboboxControl,
} from '@wordpress/components';
import { colors } from '../../utilities/colors';

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

const ALLOWED_BLOCKS = ['codeweber-blocks/columns'];

const FeaturesEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		featureLayout,
		// Icon
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
		customSvgUrl,
		customSvgId,
		// Title
		enableTitle,
		title,
		titleTag,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
		titleClass,
		// Paragraph
		enableParagraph,
		paragraph,
		paragraphTag,
		paragraphColor,
		paragraphColorType,
		paragraphSize,
		paragraphWeight,
		paragraphTransform,
		paragraphClass,
		// Button
		enableButton,
		buttonText,
		buttonUrl,
		buttonColor,
		buttonClass,
		// Card
		enableCard,
		enableCardBody,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		borderPosition,
		borderWidth,
		borderColorType,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
		backgroundOverlay,
		backgroundPatternUrl,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
	} = attributes;

	const { replaceInnerBlocks, updateBlockAttributes } =
		useDispatch('core/block-editor');
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	const hasInitialized = useRef(false);
	const [selectedTemplate, setSelectedTemplate] = useState('default');

	// Get templates with localization applied
	const featuresTemplates = getFeaturesTemplates();

	// Function to apply template
	const applyTemplate = (template) => {
		if (!template) return;

		const {
			columnsConfig,
			featuresConfig,
			featureData,
			columnConfig,
			firstColumn,
		} = template;

		// Create columns block with template configuration
		const columnBlocks = [];

		// First column (if specified) - Card with Title
		if (firstColumn !== null && firstColumn !== undefined) {
			const firstColumnAttrs =
				columnConfig && columnConfig[0]
					? columnConfig[0]
					: columnConfig && columnConfig.default
						? columnConfig.default
						: {};

			const cardBlock = createBlock(
				'codeweber-blocks/card',
				{
					enableCard: true,
					enableCardBody: true,
					h100: true, // Всегда true для card блоков
				},
				[
					createBlock('codeweber-gutenberg-blocks/heading-subtitle', {
						enableTitle: true,
						enableSubtitle: true,
						enableText:
							firstColumn.enableText !== undefined
								? firstColumn.enableText
								: true,
						subtitle: firstColumn.subtitle || '',
						title: firstColumn.title || '',
						text: firstColumn.text || '',
						subtitleLine:
							firstColumn.subtitleLine !== undefined
								? firstColumn.subtitleLine
								: false,
						align: 'left',
						subtitleClass: 'text-left mb-3',
						titleClass: 'text-left',
						titleTag: 'h2', // Тег заголовка h2 для Title блока
						titleSize: 'h3', // Размер заголовка h3 для Title блока
					}),
				]
			);

			columnBlocks.push(
				createBlock('codeweber-blocks/column', firstColumnAttrs, [
					cardBlock,
				])
			);
		}

		// Feature columns
		const featureColumns = featureData.map((data, index) => {
			const featureIndex =
				firstColumn !== null && firstColumn !== undefined
					? index + 1
					: index;
			const featureAttrs = {
				...featuresConfig,
				iconName: data.iconName,
				// Используем значения из data, если они явно указаны, иначе из featuresConfig, иначе значения по умолчанию
				iconColor:
					data.iconColor !== undefined &&
					data.iconColor !== null &&
					data.iconColor !== ''
						? data.iconColor
						: featuresConfig.iconColor !== undefined &&
							  featuresConfig.iconColor !== null &&
							  featuresConfig.iconColor !== ''
							? featuresConfig.iconColor
							: 'white',
				iconColor2:
					data.iconColor2 !== undefined &&
					data.iconColor2 !== null &&
					data.iconColor2 !== ''
						? data.iconColor2
						: featuresConfig.iconColor2 !== undefined &&
							  featuresConfig.iconColor2 !== null &&
							  featuresConfig.iconColor2 !== ''
							? featuresConfig.iconColor2
							: '11',
				iconBtnVariant:
					data.iconBtnVariant !== undefined &&
					data.iconBtnVariant !== null &&
					data.iconBtnVariant !== ''
						? data.iconBtnVariant
						: featuresConfig.iconBtnVariant !== undefined &&
							  featuresConfig.iconBtnVariant !== null &&
							  featuresConfig.iconBtnVariant !== ''
							? featuresConfig.iconBtnVariant
							: 'gradient',
				buttonColor:
					data.buttonColor !== undefined &&
					data.buttonColor !== null &&
					data.buttonColor !== ''
						? data.buttonColor
						: featuresConfig.buttonColor !== undefined &&
							  featuresConfig.buttonColor !== null &&
							  featuresConfig.buttonColor !== ''
							? featuresConfig.buttonColor
							: 'primary',
				title: data.title,
				paragraph: data.paragraph,
				buttonText: data.buttonText || featuresConfig.buttonText,
				buttonClass: data.buttonClass || featuresConfig.buttonClass,
				titleTag: 'h3', // Всегда h3 для feature блоков
				h100: true, // Всегда true для feature блоков
			};

			// Column attributes (if specified in template)
			const columnAttrs =
				columnConfig && columnConfig[featureIndex]
					? columnConfig[featureIndex]
					: columnConfig && columnConfig.default
						? columnConfig.default
						: {};

			return createBlock('codeweber-blocks/column', columnAttrs, [
				createBlock('codeweber-blocks/feature', featureAttrs),
			]);
		});

		columnBlocks.push(...featureColumns);

		const columnsBlock = createBlock(
			'codeweber-blocks/columns',
			columnsConfig,
			columnBlocks
		);

		replaceInnerBlocks(clientId, [columnsBlock], false);

		// Apply features config to parent block attributes
		if (featuresConfig) {
			setAttributes(featuresConfig);
		}
	};

	// Initialize with default template
	useEffect(() => {
		if (hasInitialized.current || innerBlocks.length > 0) {
			return;
		}

		const defaultTemplate = featuresTemplates.find(
			(t) => t.id === 'default'
		);
		if (defaultTemplate) {
			applyTemplate(defaultTemplate);
		}

		hasInitialized.current = true;
	}, [clientId, innerBlocks.length, replaceInnerBlocks]);

	// Handle template change
	const handleTemplateChange = (templateId) => {
		const template = featuresTemplates.find((t) => t.id === templateId);
		if (template) {
			applyTemplate(template);
			setSelectedTemplate(templateId);
		}
	};

	// Применяем настройки из featuresConfig к существующим feature блокам при изменении шаблона
	const previousTemplateRef = useRef(selectedTemplate);
	useEffect(() => {
		// Пропускаем первую инициализацию
		if (previousTemplateRef.current === selectedTemplate) {
			return;
		}

		// Обновляем ref
		previousTemplateRef.current = selectedTemplate;

		if (!selectedTemplate || innerBlocks.length === 0) {
			return;
		}

		const template = featuresTemplates.find(
			(t) => t.id === selectedTemplate
		);
		if (!template || !template.featuresConfig) {
			return;
		}

		const { featuresConfig } = template;

		// Подготавливаем обновления для feature блоков
		const updates = {};

		// Применяем настройки иконки из featuresConfig
		if (featuresConfig.iconColor !== undefined) {
			updates.iconColor = featuresConfig.iconColor;
		}
		if (featuresConfig.iconColor2 !== undefined) {
			updates.iconColor2 = featuresConfig.iconColor2;
		}
		if (featuresConfig.iconBtnVariant !== undefined) {
			updates.iconBtnVariant = featuresConfig.iconBtnVariant;
		}
		if (featuresConfig.buttonColor !== undefined) {
			updates.buttonColor = featuresConfig.buttonColor;
		}

		// Если есть обновления, применяем их ко всем feature блокам
		if (Object.keys(updates).length > 0) {
			// Find all feature blocks recursively
			const findFeatureBlocks = (blocks) => {
				const featureBlocks = [];

				const traverse = (blockList) => {
					if (!blockList || !Array.isArray(blockList)) return;

					blockList.forEach((block) => {
						if (block.name === 'codeweber-blocks/feature') {
							featureBlocks.push(block);
						}
						// Recursively check inner blocks
						if (block.innerBlocks && block.innerBlocks.length > 0) {
							traverse(block.innerBlocks);
						}
					});
				};

				traverse(blocks);
				return featureBlocks;
			};

			const featureBlocks = findFeatureBlocks(innerBlocks);
			featureBlocks.forEach((block) => {
				updateBlockAttributes(block.clientId, updates);
			});
		}
	}, [
		selectedTemplate,
		innerBlocks,
		featuresTemplates,
		updateBlockAttributes,
	]);

	// Apply settings to all child feature blocks
	const applySettingsToFeatures = (updates) => {
		setAttributes(updates);

		// Find all feature blocks recursively
		const findFeatureBlocks = (blocks) => {
			const featureBlocks = [];

			const traverse = (blockList) => {
				if (!blockList || !Array.isArray(blockList)) return;

				blockList.forEach((block) => {
					if (block.name === 'codeweber-blocks/feature') {
						featureBlocks.push(block);
					}
					// Recursively check inner blocks
					if (block.innerBlocks && block.innerBlocks.length > 0) {
						traverse(block.innerBlocks);
					}
				});
			};

			traverse(blocks);
			return featureBlocks;
		};

		const featureBlocks = findFeatureBlocks(innerBlocks);
		featureBlocks.forEach((block) => {
			updateBlockAttributes(block.clientId, updates);
		});
	};

	const blockProps = useBlockProps({
		className: 'features-wrapper',
	});

	const tabs = [
		{
			name: 'feature',
			title: (
				<TabIcon
					icon={starFilled}
					label={__('Feature', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'icon',
			title: (
				<TabIcon
					icon={symbol}
					label={__('Icon', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'title',
			title: (
				<TabIcon
					icon={typography}
					label={__('Title', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'button',
			title: (
				<TabIcon
					icon={button}
					label={__('Button', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'card',
			title: (
				<TabIcon
					icon={addCard}
					label={__('Card', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'borders',
			title: (
				<TabIcon
					icon={border}
					label={__('Borders', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* FEATURE TAB */}
							{tab.name === 'feature' && (
								<PanelBody
									title={__(
										'Feature Settings',
										'codeweber-gutenberg-blocks'
									)}
									initialOpen={true}
								>
									<SelectControl
										label={__(
											'Template',
											'codeweber-gutenberg-blocks'
										)}
										value={selectedTemplate || 'default'}
										options={
											featuresTemplates &&
											Array.isArray(featuresTemplates)
												? featuresTemplates.map(
														(t) => ({
															value: t.id,
															label: t.labelKey
																? __(
																		t.labelKey,
																		'codeweber-gutenberg-blocks'
																	)
																: t.label,
														})
													)
												: [
														{
															value: 'default',
															label: __(
																'Default Template',
																'codeweber-gutenberg-blocks'
															),
														},
													]
										}
										onChange={handleTemplateChange}
										__nextHasNoMarginBottom
									/>
									<div style={{ marginTop: '16px' }}>
										<ButtonGroup>
											<Button
												variant={
													featureLayout === 'vertical'
														? 'primary'
														: 'secondary'
												}
												onClick={() => {
													applySettingsToFeatures({
														featureLayout:
															'vertical',
														iconWrapperStyle: 'btn',
														iconBtnVariant: 'soft',
														iconColor: 'yellow',
														iconWrapperClass:
															'pe-none mb-5',
														titleClass: '',
														buttonColor: 'yellow',
													});
												}}
											>
												{__(
													'Feature 1',
													'codeweber-gutenberg-blocks'
												)}
											</Button>
											<Button
												variant={
													featureLayout ===
													'horizontal'
														? 'primary'
														: 'secondary'
												}
												onClick={() => {
													applySettingsToFeatures({
														featureLayout:
															'horizontal',
														iconWrapperStyle:
															'btn-circle',
														iconBtnVariant: 'solid',
														iconColor: 'primary',
														iconWrapperClass:
															'me-5',
														titleClass: '',
														buttonColor: '',
													});
												}}
											>
												{__(
													'Feature 2',
													'codeweber-gutenberg-blocks'
												)}
											</Button>
											<Button
												variant={
													featureLayout ===
													'feature-3'
														? 'primary'
														: 'secondary'
												}
												onClick={() => {
													applySettingsToFeatures({
														featureLayout:
															'feature-3',
														iconWrapperStyle:
															'btn-circle',
														iconBtnVariant: 'soft',
														iconColor: 'primary',
														iconWrapperClass:
															'pe-none me-5',
														titleClass: 'mb-1',
														buttonColor: 'yellow',
													});
												}}
											>
												{__(
													'Feature 3',
													'codeweber-gutenberg-blocks'
												)}
											</Button>
										</ButtonGroup>
									</div>
								</PanelBody>
							)}

							{/* ICON TAB */}
							{tab.name === 'icon' && (
								<PanelBody>
									<IconControl
										attributes={attributes}
										setAttributes={applySettingsToFeatures}
										prefix=""
									/>
								</PanelBody>
							)}

							{/* TITLE TAB */}
							{tab.name === 'title' && (
								<PanelBody>
									<HeadingContentControl
										attributes={{
											...attributes,
											enableSubtitle: false,
											enableText: enableParagraph,
											text: paragraph,
										}}
										setAttributes={(updates) => {
											const mappedUpdates = {};
											Object.keys(updates).forEach(
												(key) => {
													if (key === 'text') {
														mappedUpdates.paragraph =
															updates[key];
													} else if (
														key === 'enableText'
													) {
														mappedUpdates.enableParagraph =
															updates[key];
													} else {
														mappedUpdates[key] =
															updates[key];
													}
												}
											);
											applySettingsToFeatures(
												mappedUpdates
											);
										}}
										hideSubtitle={true}
									/>
									<div style={{ marginTop: '16px' }}>
										<HeadingTypographyControl
											attributes={{
												...attributes,
												textTag: paragraphTag,
												textColor: paragraphColor,
												textColorType:
													paragraphColorType,
												textSize: paragraphSize,
												textWeight: paragraphWeight,
												textTransform:
													paragraphTransform,
												textClass: paragraphClass,
											}}
											setAttributes={(updates) => {
												const mappedUpdates = {};
												Object.keys(updates).forEach(
													(key) => {
														if (
															key.startsWith(
																'text'
															)
														) {
															const paragraphKey =
																key.replace(
																	/^text/,
																	'paragraph'
																);
															mappedUpdates[
																paragraphKey
															] = updates[key];
														} else {
															mappedUpdates[key] =
																updates[key];
														}
													}
												);
												applySettingsToFeatures(
													mappedUpdates
												);
											}}
											hideSubtitle={true}
										/>
									</div>
								</PanelBody>
							)}

							{/* BUTTON TAB */}
							{tab.name === 'button' && (
								<PanelBody>
									<ToggleControl
										label={__(
											'Enable Button',
											'codeweber-gutenberg-blocks'
										)}
										checked={enableButton}
										onChange={(value) =>
											applySettingsToFeatures({
												enableButton: value,
											})
										}
									/>
									{enableButton && (
										<>
											<TextControl
												label={__(
													'Button Text',
													'codeweber-gutenberg-blocks'
												)}
												value={buttonText}
												onChange={(value) =>
													applySettingsToFeatures({
														buttonText: value,
													})
												}
											/>
											<TextControl
												label={__(
													'Button URL',
													'codeweber-gutenberg-blocks'
												)}
												value={buttonUrl}
												onChange={(value) =>
													applySettingsToFeatures({
														buttonUrl: value,
													})
												}
											/>
											<ComboboxControl
												label={__(
													'Button Color',
													'codeweber-gutenberg-blocks'
												)}
												value={buttonColor}
												options={colors}
												onChange={(value) =>
													applySettingsToFeatures({
														buttonColor: value,
													})
												}
											/>
											<TextControl
												label={__(
													'Button Classes',
													'codeweber-gutenberg-blocks'
												)}
												value={buttonClass}
												onChange={(value) =>
													applySettingsToFeatures({
														buttonClass: value,
													})
												}
												help={__(
													'Default: more hover',
													'codeweber-gutenberg-blocks'
												)}
											/>
										</>
									)}
								</PanelBody>
							)}

							{/* CARD TAB */}
							{tab.name === 'card' && (
								<PanelBody>
									<ToggleControl
										label={__(
											'Enable Card Wrapper',
											'codeweber-gutenberg-blocks'
										)}
										checked={enableCard}
										onChange={(value) =>
											applySettingsToFeatures({
												enableCard: value,
											})
										}
									/>
									{enableCard && (
										<ToggleControl
											label={__(
												'Enable Card Body',
												'codeweber-gutenberg-blocks'
											)}
											checked={enableCardBody}
											onChange={(value) =>
												applySettingsToFeatures({
													enableCardBody: value,
												})
											}
										/>
									)}
									<ToggleControl
										label={__(
											'Overflow Hidden',
											'codeweber-gutenberg-blocks'
										)}
										checked={overflowHidden}
										onChange={(value) =>
											applySettingsToFeatures({
												overflowHidden: value,
											})
										}
									/>
									<ToggleControl
										label={__(
											'H-100',
											'codeweber-gutenberg-blocks'
										)}
										checked={h100}
										onChange={(value) =>
											applySettingsToFeatures({
												h100: value,
											})
										}
									/>
									<BorderSettingsPanel
										borderRadius={borderRadius}
										onBorderRadiusChange={(value) =>
											applySettingsToFeatures({
												borderRadius: value,
											})
										}
										shadow={shadow}
										onShadowChange={(value) =>
											applySettingsToFeatures({
												shadow: value,
											})
										}
										showBorder={false}
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
											onChange={(key, value) =>
												applySettingsToFeatures({
													[key]: value,
												})
											}
										/>
									</div>
									<div style={{ marginTop: '16px' }}>
										<BackgroundSettingsPanel
											attributes={attributes}
											setAttributes={
												applySettingsToFeatures
											}
										/>
									</div>
								</PanelBody>
							)}

							{/* BORDERS TAB */}
							{tab.name === 'borders' && (
								<PanelBody>
									<BorderSettingsPanel
										borderRadius={borderRadius}
										onBorderRadiusChange={(value) =>
											applySettingsToFeatures({
												borderRadius: value,
											})
										}
										shadow={shadow}
										onShadowChange={(value) =>
											applySettingsToFeatures({
												shadow: value,
											})
										}
										borderPosition={borderPosition}
										borderColor={borderColor}
										borderColorType={
											borderColorType || 'solid'
										}
										borderWidth={borderWidth}
										showPosition={true}
										showBorderRadius={true}
										showShadow={true}
										showBorder={true}
										onBorderPositionChange={(value) =>
											applySettingsToFeatures({
												borderPosition: value,
											})
										}
										onBorderColorChange={(value) =>
											applySettingsToFeatures({
												borderColor: value,
											})
										}
										onBorderColorTypeChange={(value) =>
											applySettingsToFeatures({
												borderColorType: value,
											})
										}
										onBorderWidthChange={(value) =>
											applySettingsToFeatures({
												borderWidth: value,
											})
										}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default FeaturesEdit;
