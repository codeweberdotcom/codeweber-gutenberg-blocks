/**
 * Feature Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	ButtonGroup,
	Button,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import {
	Icon,
	symbol,
	typography,
	button,
	addCard,
	cog,
	arrowRight,
	border,
} from '@wordpress/icons';

import { IconControl, IconRender } from '../../components/icon';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { ParagraphRender } from '../../components/paragraph';
import { BorderSettingsPanel } from '../../components/borders';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';
import { getTitleClasses, getTextClasses } from '../heading-subtitle/utils';
import { generateBackgroundClasses } from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';
import { colors } from '../../utilities/colors';
import { ComboboxControl } from '@wordpress/components';

// Добавляем опцию "Default" в начало списка цветов для кнопки
const buttonColors = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	...colors,
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

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes, clientId }) => {
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
		iconGradientColor,
		customSvgUrl,
		customSvgId,
		customSvgSize,
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
		cardBodyClass,
		overflowHidden,
		h100,
		borderRadius,
		shadow,
		cardBorder,
		borderColor,
		borderPosition,
		borderWidth,
		borderColorType,
		borderAccent,
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
		blockClass,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	// Динамический массив табов
	const tabs = [
		{
			name: 'feature',
			title: (
				<TabIcon
					icon={symbol}
					label={__('Feature', 'codeweber-gutenberg-blocks')}
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

	// Добавляем табы Settings и Animation только если Card включен
	if (enableCard) {
		tabs.push({
			name: 'animation',
			title: (
				<TabIcon
					icon={arrowRight}
					label={__('Animation', 'codeweber-gutenberg-blocks')}
				/>
			),
		});
		tabs.push({
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		});
	}

	// Установка значений по умолчанию для иконки при создании блока
	useEffect(() => {
		const updates = {};
		let hasUpdates = false;

		// Устанавливаем цвет иконки white, если не установлен
		if (!iconColor || iconColor === 'yellow') {
			updates.iconColor = 'white';
			hasUpdates = true;
		}

		// Устанавливаем градиентный цвет 11, если не установлен
		if (!iconColor2 || iconColor2 === '') {
			updates.iconColor2 = '11';
			hasUpdates = true;
		}

		// Устанавливаем вариант градиента, если не установлен
		if (!iconBtnVariant || iconBtnVariant === 'soft') {
			updates.iconBtnVariant = 'gradient';
			hasUpdates = true;
		}

		if (hasUpdates) {
			setAttributes(updates);
		}
	}, []); // Только при монтировании компонента

	// Реинициализация анимации при изменении настроек (Enable, Type, Duration, Delay)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Задержка для применения новых атрибутов в DOM
		const timer = setTimeout(() => {
			const currentBlock = document.querySelector(
				`[data-block="${clientId}"]`
			);
			if (!currentBlock) {
				console.warn('⚠️ Block with clientId not found:', clientId);
				return;
			}

			// Ищем элемент с data-cue - это сам блок или его первый div
			const elementWithCue =
				currentBlock.querySelector('[data-cue]') ||
				(currentBlock.hasAttribute('data-cue') ? currentBlock : null) ||
				currentBlock.querySelector('div[data-cue]');

			// Если анимация включена и есть тип — настраиваем и обновляем
			if (
				animationEnabled &&
				animationType &&
				elementWithCue &&
				elementWithCue.hasAttribute('data-cue')
			) {
				console.log(
					'🎬 Resetting animation:',
					animationType,
					'| Duration:',
					animationDuration,
					'| Delay:',
					animationDelay
				);

				// Шаг 1: Полный сброс состояния
				elementWithCue.classList.remove(
					'cue-hide',
					'cue-show',
					'cue-sticky'
				);
				elementWithCue.removeAttribute('data-show');
				elementWithCue.style.animationDelay = '';
				elementWithCue.style.animationDuration = '';
				elementWithCue.style.opacity = '';

				// Удаляем все animation-классы scrollCue
				const animationClasses = Array.from(
					elementWithCue.classList
				).filter(
					(cls) =>
						cls.startsWith('fadeIn') ||
						cls.startsWith('slideIn') ||
						cls.startsWith('zoomIn') ||
						cls.startsWith('zoomOut') ||
						cls.startsWith('rotateIn') ||
						cls.startsWith('bounceIn') ||
						cls.startsWith('flipIn')
				);
				animationClasses.forEach((cls) =>
					elementWithCue.classList.remove(cls)
				);

				// Шаг 2: Принудительно скрываем элемент (имитируем состояние до срабатывания scrollCue)
				elementWithCue.classList.add('cue-hide');
				elementWithCue.style.opacity = '0';

				// Шаг 3: Глобальная реинициализация scrollCue
				if (typeof window.reinitScrollCue === 'function') {
					// Первый update
					setTimeout(() => {
						window.reinitScrollCue();
					}, 50);

					// Второй update и принудительный показ анимации
					setTimeout(() => {
						elementWithCue.classList.remove('cue-hide');
						elementWithCue.classList.add('cue-show');
						elementWithCue.style.opacity = '';

						// Применяем CSS-анимацию вручную для preview в редакторе
						if (animationDuration) {
							elementWithCue.style.animationDuration = `${animationDuration}ms`;
						}
						if (animationDelay) {
							elementWithCue.style.animationDelay = `${animationDelay}ms`;
						}

						// Добавляем класс анимации для мгновенного preview
						elementWithCue.classList.add(animationType);

						window.reinitScrollCue();
						console.log('✅ Animation reinitialized and triggered');
					}, 200);
				}
				return;
			}

			// Если анимация отключена или тип пустой — очищаем и обновляем
			if (!animationEnabled || !animationType) {
				console.log(
					'🔴 Animation disabled or type empty - cleaning up'
				);

				const target =
					elementWithCue ||
					(currentBlock.hasAttribute('data-cue')
						? currentBlock
						: null) ||
					currentBlock.firstElementChild;

				if (target) {
					target.classList.remove(
						'cue-hide',
						'cue-show',
						'cue-sticky'
					);
					target.removeAttribute('data-show');

					// Сбрасываем inline-стили анимации
					target.style.animationDelay = '';
					target.style.animationDuration = '';

					// Удаляем все animation-классы scrollCue
					const animationClasses = Array.from(
						target.classList
					).filter(
						(cls) =>
							cls.startsWith('fadeIn') ||
							cls.startsWith('slideIn') ||
							cls.startsWith('zoomIn') ||
							cls.startsWith('zoomOut') ||
							cls.startsWith('rotateIn') ||
							cls.startsWith('bounceIn') ||
							cls.startsWith('flipIn')
					);
					animationClasses.forEach((cls) =>
						target.classList.remove(cls)
					);
				}

				if (typeof window.reinitScrollCue === 'function') {
					window.reinitScrollCue();

					// Дополнительный вызов для надежности
					setTimeout(() => {
						window.reinitScrollCue();
						console.log('✅ Animation disabled - cleanup complete');
					}, 150);
				}
			}
		}, 200);

		return () => clearTimeout(timer);
	}, [
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		clientId,
	]);

	// Generate classes for card wrapper
	const getCardClasses = () => {
		const classes = [];

		if (enableCard) {
			classes.push('card');
		}

		if (overflowHidden) {
			classes.push('overflow-hidden');
		}

		if (h100) {
			classes.push('h-100');
		}

		if (borderRadius) {
			classes.push(borderRadius);
		}

		if (shadow) {
			classes.push(shadow);
		}

		if (cardBorder || borderPosition) {
			classes.push(cardBorder || borderPosition);
		}

		// Если выбраны цвет или ширина, но нет позиции - применяем обычный border
		if ((borderColor || borderWidth) && !cardBorder && !borderPosition) {
			classes.push('border');
		}

		if (borderWidth) {
			classes.push(borderWidth);
		}

		if (borderColor) {
			const colorType = borderColorType || 'solid';
			if (colorType === 'soft') {
				classes.push(`border-soft-${borderColor}`);
			} else {
				classes.push(`border-${borderColor}`);
			}
		}

		if (borderAccent) {
			classes.push(borderAccent);
		}

		// Background classes
		classes.push(
			...generateBackgroundClasses({
				backgroundType,
				backgroundColor,
				backgroundColorType,
				backgroundGradient,
				backgroundImageUrl,
				backgroundSize,
				backgroundPatternUrl,
				backgroundOverlay,
			})
		);

		// Spacing classes
		classes.push(
			...getSpacingClasses({
				spacingType,
				spacingXs,
				spacingSm,
				spacingMd,
				spacingLg,
				spacingXl,
				spacingXxl,
			})
		);

		// Custom class
		if (blockClass) {
			classes.push(blockClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Generate inline styles for background preview in editor
	const getCardStyles = () => {
		const styles = {};

		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			styles.backgroundSize = backgroundSize || 'cover';
			styles.backgroundPosition = 'center center';
		}

		if (backgroundType === 'pattern' && backgroundPatternUrl) {
			styles.backgroundImage = `url(${backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
		}

		return Object.keys(styles).length > 0 ? styles : null;
	};

	// Generate button classes
	const getButtonClasses = () => {
		const classes = buttonClass ? buttonClass.split(' ') : [];
		if (buttonColor) {
			classes.push(`link-${buttonColor}`);
		}
		return classes.filter(Boolean).join(' ');
	};

	// Parse data attributes
	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) {
					dataAttrs[`data-${key}`] = value;
				}
			});
		}
		return dataAttrs;
	};

	const blockProps = useBlockProps({
		className: getCardClasses(),
		style: getCardStyles(),
		id: blockId || undefined,
		...(backgroundType === 'image' &&
			backgroundImageUrl && { 'data-image-src': backgroundImageUrl }),
		...(backgroundType === 'pattern' &&
			backgroundPatternUrl && { 'data-image-src': backgroundPatternUrl }),
		...getDataAttributes(),
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && {
					'data-duration': animationDuration,
				}),
				...(animationDelay && { 'data-delay': animationDelay }),
			}),
	});

	// Layout classes применяются к card-body или card, не к основному контейнеру
	// Для feature-3 не нужны классы на основном контейнере
	const layoutClasses =
		featureLayout === 'horizontal' ? 'd-flex flex-row' : '';

	// Render content based on layout
	const renderContent = () => {
		// Icon
		const iconElement = (
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
		);

		// Title
		const titleElement = enableTitle ? (
			<RichText
				tagName={titleTag || 'h4'}
				value={title}
				onChange={(value) => setAttributes({ title: value })}
				className={getTitleClasses(attributes)}
				placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
			/>
		) : null;

		// Paragraph
		const paragraphElement = enableParagraph ? (
			<ParagraphRender
				attributes={{
					...attributes,
					// Map all paragraph attributes to text for ParagraphRender
					text: paragraph,
					textColor: paragraphColor,
					textColorType: paragraphColorType,
					textSize: paragraphSize,
					textWeight: paragraphWeight,
					textTransform: paragraphTransform,
					textClass: paragraphClass,
				}}
				setAttributes={(updates) => {
					// Map text back to paragraph
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

		// Button
		const buttonElement = enableButton ? (
			<a
				href={buttonUrl}
				className={getButtonClasses()}
				onClick={(e) => e.preventDefault()}
			>
				{buttonText}
			</a>
		) : null;

		// Layout 1: Vertical
		if (featureLayout === 'vertical') {
			return (
				<>
					{iconElement}
					{titleElement}
					{paragraphElement}
					{buttonElement}
				</>
			);
		}

		// Layout 2: Horizontal
		if (featureLayout === 'horizontal') {
			return (
				<>
					<div>{iconElement}</div>
					<div>
						{titleElement}
						{paragraphElement}
						{buttonElement}
					</div>
				</>
			);
		}

		// Layout 3: Feature 3 (Icon + Title в одной строке)
		return (
			<>
				<div className="d-flex flex-row align-items-center mb-4">
					{iconElement}
					{titleElement}
				</div>
				{paragraphElement}
				{buttonElement}
			</>
		);
	};

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* FEATURE TAB */}
							{tab.name === 'feature' && (
								<PanelBody>
									<ButtonGroup>
										<Button
											variant={
												featureLayout === 'vertical'
													? 'primary'
													: 'secondary'
											}
											onClick={() => {
												setAttributes({
													featureLayout: 'vertical',
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
												featureLayout === 'horizontal'
													? 'primary'
													: 'secondary'
											}
											onClick={() => {
												setAttributes({
													featureLayout: 'horizontal',
													iconWrapperStyle:
														'btn-circle',
													iconBtnVariant: 'solid',
													iconColor: 'primary',
													iconWrapperClass: 'me-5',
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
												featureLayout === 'feature-3'
													? 'primary'
													: 'secondary'
											}
											onClick={() => {
												setAttributes({
													featureLayout: 'feature-3',
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

									<IconControl
										attributes={attributes}
										setAttributes={setAttributes}
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
											enableSubtitle: false, // Subtitle не используется в Feature
											enableText: enableParagraph, // Map enableParagraph to enableText
											text: paragraph, // Map paragraph to text
										}}
										setAttributes={(updates) => {
											// Map text back to paragraph
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
											setAttributes(mappedUpdates);
										}}
										hideSubtitle={true}
									/>
									<div style={{ marginTop: '16px' }}>
										<HeadingTypographyControl
											attributes={{
												...attributes,
												// Map paragraph attributes to text for HeadingTypographyControl
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
												// Map text attributes back to paragraph
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
												setAttributes(mappedUpdates);
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
											setAttributes({
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
													setAttributes({
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
													setAttributes({
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
												options={buttonColors}
												onChange={(value) =>
													setAttributes({
														buttonColor: value || '',
													})
												}
												allowReset={true}
											/>
											<TextControl
												label={__(
													'Button Classes',
													'codeweber-gutenberg-blocks'
												)}
												value={buttonClass}
												onChange={(value) =>
													setAttributes({
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
											setAttributes({ enableCard: value })
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
												setAttributes({
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
											setAttributes({
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
											setAttributes({ h100: value })
										}
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
												setAttributes({ [key]: value })
											}
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

							{/* ANIMATION TAB - Показывается только если Card включен */}
							{tab.name === 'animation' && enableCard && (
								<div style={{ padding: '16px' }}>
									<AnimationControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</div>
							)}

							{/* SETTINGS TAB - Показывается только если Card включен */}
							{tab.name === 'settings' && enableCard && (
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
											classLabel: __(
												'Card Class',
												'codeweber-gutenberg-blocks'
											),
											dataLabel: __(
												'Card Data',
												'codeweber-gutenberg-blocks'
											),
											idLabel: __(
												'Card ID',
												'codeweber-gutenberg-blocks'
											),
										}}
									/>
									{enableCardBody && (
										<TextControl
											label={__(
												'Card Body Class',
												'codeweber-gutenberg-blocks'
											)}
											value={cardBodyClass || ''}
											onChange={(value) =>
												setAttributes({
													cardBodyClass: value,
												})
											}
										/>
									)}
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps}>
				{enableCard ? (
					enableCardBody ? (
						<div className={`card-body ${layoutClasses} ${cardBodyClass || ''}`.trim()}>
							{renderContent()}
						</div>
					) : (
						<div className={layoutClasses}>{renderContent()}</div>
					)
				) : (
					<div className={layoutClasses}>{renderContent()}</div>
				)}
			</div>
		</>
	);
};

export default Edit;
