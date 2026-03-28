/**
 * Card Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	ToggleControl,
	ButtonGroup,
	Button,
	ComboboxControl,
	TextControl,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';
import {
	Icon,
	symbol,
	resizeCornerNE,
	positionCenter,
	image,
	cog,
	arrowRight,
} from '@wordpress/icons';
import { border } from '@wordpress/icons';
import { useEffect, useRef, useState } from '@wordpress/element';

import { BorderSettingsPanel } from '../../components/borders';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { BackgroundSettingsPanel } from '../../components/background/BackgroundSettingsPanel';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';
import {
	generateBackgroundClasses,
	generateAlignmentClasses,
} from '../../utilities/class-generators';
import { getSpacingClasses } from '../section/utils';

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
		cardType,
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
		backgroundImageUrl,
		backgroundSize,
		backgroundPatternUrl,
		backgroundOverlay,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		align,
		alignItems,
		justifyContent,
		position,
		blockClass,
		cardBodyClass,
		blockId,
		blockData,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		animationInterval,
		enableCardFooter,
		cardFooterLinkText,
		cardFooterCode,
		cardFooterCollapseId,
		cardFooterCodeLanguage,
		cardFooterCodeBackground,
		cardFooterLinkColor,
	} = attributes;

	const CARD_FOOTER_LANGUAGES = [
		{ label: 'HTML', value: 'html' },
		{ label: 'CSS', value: 'css' },
		{ label: 'JavaScript', value: 'javascript' },
		{ label: 'JSX', value: 'jsx' },
		{ label: 'PHP', value: 'php' },
		{ label: 'JSON', value: 'json' },
		{ label: 'Bash', value: 'bash' },
		{ label: 'Plain text', value: 'plaintext' },
	];

	const CARD_FOOTER_BACKGROUND_OPTIONS = [
		{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
		{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	];

	const CARD_FOOTER_LINK_COLOR_OPTIONS = [
		{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
		{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
		{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	];

	/** Prism language id (HTML is 'markup' in Prism) */
	const getPrismLanguage = (lang) => (lang === 'html' ? 'markup' : lang);

	const tabs = [
		{
			name: 'general',
			title: (
				<TabIcon
					icon={symbol}
					label={__('General', 'codeweber-gutenberg-blocks')}
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
		{
			name: 'spacing',
			title: (
				<TabIcon
					icon={resizeCornerNE}
					label={__('Spacing', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'align',
			title: (
				<TabIcon
					icon={positionCenter}
					label={__('Position', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'background',
			title: (
				<TabIcon
					icon={image}
					label={__('Background', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		...((cardType === 'card' && enableCard) || cardType === 'wrapper'
			? [
					{
						name: 'animation',
						title: (
							<TabIcon
								icon={arrowRight}
								label={__(
									'Animation',
									'codeweber-gutenberg-blocks'
								)}
							/>
						),
					},
				]
			: []),
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	// Generate classes for card wrapper
	const getCardClasses = () => {
		const classes = [];

		// Card-specific classes only apply in card mode
		if (cardType === 'card') {
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
				} else if (colorType === 'pale') {
					classes.push(`border-pale-${borderColor}`);
				} else {
					classes.push(`border-${borderColor}`);
				}
			}
		}

		// Background classes (color, gradient, image)
		classes.push(...generateBackgroundClasses(attributes));

		// Spacing classes
		classes.push(...getSpacingClasses(attributes));

		// Alignment classes - применяются к card только если card-body не включен (только для card mode)
		if (cardType === 'card' && !enableCardBody) {
			classes.push(...generateAlignmentClasses(attributes));
		} else if (cardType === 'wrapper') {
			// Для wrapper всегда применяем alignment
			classes.push(...generateAlignmentClasses(attributes));
		}

		// Custom class
		if (blockClass) {
			classes.push(blockClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	// Generate classes for card-body
	const getCardBodyClasses = () => {
		const classes = ['card-body'];

		// Alignment classes - применяются к card-body если он включен
		if (enableCardBody) {
			classes.push(...generateAlignmentClasses(attributes));
		}

		if (cardBodyClass) {
			classes.push(cardBodyClass);
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

	// Generate inline styles for editor preview (NOT saved to DB)
	const getCardStyles = () => {
		const styles = {};

		if (backgroundType === 'image' && backgroundImageUrl) {
			styles.backgroundImage = `url(${backgroundImageUrl})`;
			styles.backgroundRepeat = 'no-repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
			styles.backgroundPosition = 'center';
		}

		if (backgroundType === 'pattern' && backgroundPatternUrl) {
			styles.backgroundImage = `url(${backgroundPatternUrl})`;
			styles.backgroundRepeat = 'repeat';
			if (backgroundSize === 'bg-cover') {
				styles.backgroundSize = 'cover';
			} else if (backgroundSize === 'bg-full') {
				styles.backgroundSize = '100% 100%';
			} else {
				styles.backgroundSize = 'auto';
			}
		}

		return Object.keys(styles).length > 0 ? styles : undefined;
	};

	const blockProps = useBlockProps({
		className: getCardClasses(),
		...(blockId && { id: blockId }),
		...getDataAttributes(),
		'data-block': clientId,
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				...(animationDuration && {
					'data-duration': animationDuration,
				}),
				...(animationDelay && { 'data-delay': animationDelay }),
				// data-interval выводится всегда, даже если равен 0
				'data-interval': animationInterval !== undefined ? animationInterval : 0,
			}),
	});

	// Реинициализация scrollCue при изменении настроек анимации
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

			// Ищем элемент с data-cue - это сам блок
			const elementWithCue = currentBlock.hasAttribute('data-cue')
				? currentBlock
				: currentBlock.querySelector('[data-cue]');

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
						elementWithCue.style.opacity = '1';
						window.reinitScrollCue();
					}, 150);
				}
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		clientId,
	]);

	// Set unique collapse ID for Card Footer when enabled (for save output).
	useEffect(() => {
		if (enableCardFooter && !cardFooterCollapseId && clientId) {
			const shortId = clientId.replace(/\D/g, '').slice(-8) || '1';
			setAttributes({ cardFooterCollapseId: 'collapse-' + shortId });
		}
	}, [enableCardFooter, clientId]);

	const cardFooterCodeRef = useRef(null);
	const [cardFooterCodeExpanded, setCardFooterCodeExpanded] = useState(false);

	// Prism syntax highlighting in editor for Card Footer code block.
	useEffect(() => {
		if (!enableCardFooter || !cardFooterCodeRef.current) return;
		if (typeof window.Prism === 'undefined') return;
		window.Prism.highlightElement(cardFooterCodeRef.current);
	}, [enableCardFooter, cardFooterCode, cardFooterCodeLanguage]);

	return (
		<>
			{/* Inspector Controls */}
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* GENERAL TAB */}
							{tab.name === 'general' && (
								<PanelBody>
									<div style={{ marginBottom: '16px' }}>
										<label
											style={{
												display: 'block',
												marginBottom: '8px',
												fontWeight: 600,
											}}
										>
											{__(
												'Type',
												'codeweber-gutenberg-blocks'
											)}
										</label>
										<ButtonGroup style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
											<Button
												isPressed={cardType === 'card'}
												onClick={() =>
													setAttributes({
														cardType: 'card',
													})
												}
											>
												{__(
													'Card',
													'codeweber-gutenberg-blocks'
												)}
											</Button>
											<Button
												isPressed={cardType === 'wrapper'}
												onClick={() =>
													setAttributes({
														cardType: 'wrapper',
													})
												}
											>
												{__(
													'Wrapper',
													'codeweber-gutenberg-blocks'
												)}
											</Button>
										</ButtonGroup>
									</div>

									{cardType === 'card' && (
										<>
											<ToggleControl
												label={__(
													'Включить обертку карточки',
													'codeweber-gutenberg-blocks'
												)}
												checked={enableCard}
												onChange={(value) =>
													setAttributes({
														enableCard: value,
													})
												}
											/>

											{enableCard && (
												<ToggleControl
													label={__(
														'Включить тело карточки',
														'codeweber-gutenberg-blocks'
													)}
													checked={enableCardBody}
													onChange={(value) =>
														setAttributes({
															enableCardBody:
																value,
														})
													}
												/>
											)}

											<ToggleControl
												label={__(
													'Скрыть переполнение',
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
													setAttributes({
														h100: value,
													})
												}
											/>

											<ToggleControl
												label={__(
													'Card Footer',
													'codeweber-gutenberg-blocks'
												)}
												checked={enableCardFooter}
												onChange={(value) =>
													setAttributes({
														enableCardFooter: value,
													})
												}
											/>

											{enableCardFooter && (
												<>
													<SelectControl
														label={__(
															'Code language',
															'codeweber-gutenberg-blocks'
														)}
														value={cardFooterCodeLanguage || 'html'}
														options={CARD_FOOTER_LANGUAGES}
														onChange={(value) =>
															setAttributes({
																cardFooterCodeLanguage: value || 'html',
															})
														}
													/>
													<TextControl
														label={__(
															'Footer link text',
															'codeweber-gutenberg-blocks'
														)}
														value={
															cardFooterLinkText || ''
														}
														placeholder={__(
															"View example's code",
															'codeweber-gutenberg-blocks'
														)}
														onChange={(value) =>
															setAttributes({
																cardFooterLinkText: value,
															})
														}
													/>
													<SelectControl
														label={__(
															'Footer link color',
															'codeweber-gutenberg-blocks'
														)}
														value={cardFooterLinkColor || ''}
														options={CARD_FOOTER_LINK_COLOR_OPTIONS}
														onChange={(value) =>
															setAttributes({
																cardFooterLinkColor: value || '',
															})
														}
													/>
													<SelectControl
														label={__(
															"View example's code — Light / Dark",
															'codeweber-gutenberg-blocks'
														)}
														value={cardFooterCodeBackground || 'dark'}
														options={CARD_FOOTER_BACKGROUND_OPTIONS}
														onChange={(value) =>
															setAttributes({
																cardFooterCodeBackground: value || 'dark',
															})
														}
													/>
													<TextareaControl
														label={__(
															'Code',
															'codeweber-gutenberg-blocks'
														)}
														value={
															cardFooterCode || ''
														}
														placeholder={__(
															'Paste or type code to show in collapse…',
															'codeweber-gutenberg-blocks'
														)}
														onChange={(value) =>
															setAttributes({
																cardFooterCode: value,
															})
														}
														rows={10}
														style={{
															fontFamily: 'monospace',
															fontSize: '13px',
														}}
													/>
												</>
											)}
										</>
									)}
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

							{/* SPACING TAB */}
							{tab.name === 'spacing' && (
								<PanelBody>
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
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'align' && (
								<PanelBody>
									<PositioningControl
										alignItems={alignItems}
										onAlignItemsChange={(value) =>
											setAttributes({ alignItems: value })
										}
										justifyContent={justifyContent}
										onJustifyContentChange={(value) =>
											setAttributes({
												justifyContent: value,
											})
										}
										textAlign={align}
										onTextAlignChange={(value) =>
											setAttributes({ align: value })
										}
										position={position}
										onPositionChange={(value) =>
											setAttributes({ position: value })
										}
										noPanel={true}
									/>
								</PanelBody>
							)}

							{/* BACKGROUND TAB */}
							{tab.name === 'background' && (
								<PanelBody>
									<BackgroundSettingsPanel
										attributes={attributes}
										setAttributes={setAttributes}
										allowVideo={false}
									/>
								</PanelBody>
							)}

							{/* ANIMATION TAB - Показывается для Card (если включен) и для Wrapper */}
							{tab.name === 'animation' &&
								((cardType === 'card' && enableCard) ||
									cardType === 'wrapper') && (
								<div style={{ padding: '16px' }}>
									<AnimationControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</div>
							)}

							{/* SETTINGS TAB */}
							{tab.name === 'settings' && (
								<PanelBody>
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
									{cardType === 'card' && enableCardBody && (
										<TextControl
											label={__(
												'Card Body Class',
												'codeweber-gutenberg-blocks'
											)}
											value={cardBodyClass || ''}
											placeholder={__(
												'custom classes',
												'codeweber-gutenberg-blocks'
											)}
											onChange={(value) =>
												setAttributes({
													cardBodyClass: value,
												})
											}
										/>
									)}
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			{/* Card Preview */}
			<div {...blockProps} style={getCardStyles()}>
				{cardType === 'card' && enableCard && enableCardBody ? (
					<div className={getCardBodyClasses()}>
						<InnerBlocks />
					</div>
				) : (
					<InnerBlocks />
				)}
				{cardType === 'card' &&
					enableCard &&
					enableCardFooter &&
					(cardFooterCollapseId || clientId) && (
						<>
							<div className="card-footer position-relative">
								<a
									className={
										'collapse-link stretched-link ' +
										(cardFooterCodeExpanded ? '' : 'collapsed') +
										(cardFooterLinkColor === 'light' ? ' text-light' : '')
									}
									href="#"
									aria-expanded={cardFooterCodeExpanded}
									onClick={(e) => {
										e.preventDefault();
										setCardFooterCodeExpanded((prev) => !prev);
									}}
								>
									{cardFooterLinkText ||
										__("View example's code", 'codeweber-gutenberg-blocks')}
								</a>
							</div>
							<div
								id={
									cardFooterCollapseId ||
									'collapse-' + clientId.replace(/\D/g, '').slice(-8)
								}
								className={
									'card-footer p-0 accordion-collapse collapse ' +
									(cardFooterCodeExpanded ? 'show ' : '') +
									(cardFooterCodeBackground === 'light' ? 'bg-light' : 'bg-dark')
								}
								style={cardFooterCodeExpanded ? { display: 'block' } : { display: 'none' }}
							>
								{(() => {
									const prismLang = getPrismLanguage(cardFooterCodeLanguage || 'html');
									const isDark = cardFooterCodeBackground !== 'light';
									const innerBgClass = isDark ? 'bg-dark' : 'bg-light';
									const buttonVariantClass = isDark ? 'btn-white' : 'btn-dark';
									return (
										<div className="code-wrapper">
											<button
												type="button"
												className={`btn btn-sm ${buttonVariantClass} rounded-pill btn-clipboard`}
												disabled
											>
												Copy
											</button>
											<div className={`code-wrapper-inner ${innerBgClass}`}>
												<pre className={`language-${prismLang}`} tabIndex={0}>
													<code
														ref={cardFooterCodeRef}
														className={`language-${prismLang}`}
													>
														{cardFooterCode || ' '}
													</code>
												</pre>
											</div>
										</div>
									);
								})()}
							</div>
						</>
					)}
			</div>
		</>
	);
};

export default Edit;
