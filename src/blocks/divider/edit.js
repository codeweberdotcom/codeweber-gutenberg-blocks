/**
 * Divider Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import DividerSidebar from './sidebar';
import { getTitleClasses } from '../heading-subtitle/utils';
import { generateColorClass, generateBackgroundClasses } from '../../utilities/class-generators';

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
	const {
		dividerType,
		borderStyle,
		borderIcon,
		textAlign,
		title,
		titleTag,
		titleColor,
		titleColorType,
		waveType,
		waveColor,
		blockClass,
		blockId,
	} = attributes;

	// Классы блока (без отступов для текстового разделителя)
	const blockClasses = [
		'cwgb-divider-block',
		// Для текстового разделителя отступы не добавляем на обертку
		...(dividerType === 'border' && borderStyle === 'text' ? [] : [blockClass]),
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
	});

	// Рендер превью в редакторе
	const renderPreview = () => {
		switch (dividerType) {
			case 'border':
				if (borderStyle === 'simple') {
					return <hr className={blockClass} />;
				} else if (borderStyle === 'double') {
					return <hr className={`double ${blockClass}`} />;
				} else if (borderStyle === 'icon') {
					return (
						<div className="divider-icon">
							{borderIcon ? (
								<i className={borderIcon}></i>
							) : (
								<span>{__('Select icon', 'codeweber-gutenberg-blocks')}</span>
							)}
						</div>
					);
				} else if (borderStyle === 'text') {
					const titleClasses = getTitleClasses(attributes);
					const alignClass = textAlign === 'left' ? 'text-start' : textAlign === 'right' ? 'text-end' : 'text-center';
					const TagName = titleTag || 'span';
					
					// Класс цвета текста для обертки
					const textColorClass = generateColorClass(titleColor, titleColorType, 'text');
					
					// Background классы
					const backgroundClasses = generateBackgroundClasses(attributes);
					
					// Inline стили для background
					const backgroundStyles = {};
					const {
						backgroundType,
						backgroundImageUrl,
						backgroundPatternUrl,
						backgroundSize,
					} = attributes;
					
					if (backgroundType === 'image' && backgroundImageUrl) {
						backgroundStyles.backgroundImage = `url(${backgroundImageUrl})`;
						backgroundStyles.backgroundRepeat = 'no-repeat';
						if (backgroundSize === 'bg-cover') {
							backgroundStyles.backgroundSize = 'cover';
						} else if (backgroundSize === 'bg-full') {
							backgroundStyles.backgroundSize = '100% 100%';
						} else {
							backgroundStyles.backgroundSize = 'auto';
						}
						backgroundStyles.backgroundPosition = 'center';
						backgroundStyles.backgroundAttachment = backgroundSize === 'bg-full' ? 'scroll' : 'fixed';
					}
					
					if (backgroundType === 'pattern' && backgroundPatternUrl) {
						backgroundStyles.backgroundImage = `url(${backgroundPatternUrl})`;
						backgroundStyles.backgroundRepeat = 'repeat';
						if (backgroundSize === 'bg-cover') {
							backgroundStyles.backgroundSize = 'cover';
						} else if (backgroundSize === 'bg-full') {
							backgroundStyles.backgroundSize = '100% 100%';
						} else {
							backgroundStyles.backgroundSize = 'auto';
						}
					}
					
					// Классы для текстового разделителя (с отступами, как на фронтенде)
					const textDividerClasses = [
						'divider-text',
						blockClass,
						alignClass,
						textColorClass,
						...backgroundClasses,
					].filter(Boolean).join(' ');
					
					return (
						<div 
							className={textDividerClasses}
							style={Object.keys(backgroundStyles).length > 0 ? backgroundStyles : undefined}
						>
							{title ? (
								<TagName 
									className={titleClasses}
									dangerouslySetInnerHTML={{ __html: title }}
								/>
							) : (
								<TagName className={titleClasses}>
									{__('Enter title...', 'codeweber-gutenberg-blocks')}
								</TagName>
							)}
						</div>
					);
				}
				break;

			case 'wave':
				const waveColorClass = waveColor ? `text-${waveColor}` : 'text-white';
				return (
					<div className="overflow-hidden">
						<div className={`divider ${waveColorClass} mx-n2`}>
							{renderWaveSVG(waveType)}
						</div>
					</div>
				);

			default:
				return <hr className={blockClass} />;
		}
	};

	return (
		<>
			{/* Inspector Controls */}
			<InspectorControls>
				<DividerSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			{/* Preview */}
			<div {...blockProps}>
				{renderPreview()}
			</div>
		</>
	);
};

/**
 * Рендер SVG для волн
 */
const renderWaveSVG = (waveType) => {
	const waves = {
		'wave-1': (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 70">
				<path fill="currentColor" d="M1440,70H0V45.16a5762.49,5762.49,0,0,1,1440,0Z" />
			</svg>
		),
		'wave-2': (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
				<path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z" />
			</svg>
		),
		'wave-3': (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 92.26">
				<path fill="currentColor" d="M1206,21.2c-60-5-119-36.92-291-5C772,51.11,768,48.42,708,43.13c-60-5.68-108-29.92-168-30.22-60,.3-147,27.93-207,28.23-60-.3-122-25.94-182-36.91S30,5.93,0,16.2V92.26H1440v-87l-30,5.29C1348.94,22.29,1266,26.19,1206,21.2Z" />
			</svg>
		),
		'wave-4': (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
				<path fill="currentColor" d="M1260,1.65c-60-5.07-119.82,2.47-179.83,10.13s-120,11.48-180,9.57-120-7.66-180-6.42c-60,1.63-120,11.21-180,16a1129.52,1129.52,0,0,1-180,0c-60-4.78-120-14.36-180-19.14S60,7,30,7H0v93H1440V30.89C1380.07,23.2,1319.93,6.15,1260,1.65Z" />
			</svg>
		),
		'wave-5': (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
				<path fill="currentColor" d="M1260.2,37.86c-60-10-120-20.07-180-16.76-60,3.71-120,19.77-180,18.47-60-1.71-120-21.78-180-31.82s-120-10-180-1.7c-60,8.73-120,24.79-180,28.5-60,3.31-120-6.73-180-11.74s-120-5-150-5H0V100H1440V49.63C1380.07,57.9,1320.13,47.88,1260.2,37.86Z" />
			</svg>
		),
	};

	return waves[waveType] || waves['wave-1'];
};

export default Edit;












