/**
 * Logo Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { LogoSidebar } from './sidebar';

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
	const {
		logoType,
		logoSize,
		blockAlign,
		blockClass,
		blockData,
		blockId,
		enableLink,
		logoUrl,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
	} = attributes;

	// Состояние для логотипов
	const [logos, setLogos] = useState({
		light: null,
		dark: null,
		loading: true,
	});

	// Загружаем логотипы из Redux через REST API
	useEffect(() => {
		apiFetch({
			path: '/codeweber-gutenberg-blocks/v1/logos',
		})
			.then((data) => {
				setLogos({
					light: data.light,
					dark: data.dark,
					loading: false,
				});
			})
			.catch((error) => {
				console.error('Error fetching logos:', error);
				// Fallback на дефолтные логотипы - используем window.location для правильного пути
				const baseUrl = window.location.origin;
				const themeUrl = `${baseUrl}/wp-content/themes/codeweber`;
				setLogos({
					light: `${themeUrl}/dist/assets/img/logo-light.png`,
					dark: `${themeUrl}/dist/assets/img/logo-dark.png`,
					loading: false,
				});
			});
	}, []);

	// Классы блока
	const blockClasses = [
		'cwgb-logo-block',
		blockAlign ? `text-${blockAlign}` : '',
		blockClass,
	]
		.filter(Boolean)
		.join(' ');

	// Парсим data-атрибуты
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
		...dataAttributes,
		...(animationEnabled &&
			animationType && {
				'data-cue': animationType,
				'data-duration': animationDuration || 1000,
				'data-delay': animationDelay || 0,
			}),
	});

	// Получаем URL логотипов для превью
	const getLogoUrls = () => {
		if (logos.loading || !logos.light || !logos.dark) {
			// Fallback на дефолтные пути - используем window.location для правильного пути
			const baseUrl = window.location.origin;
			const themeUrl = `${baseUrl}/wp-content/themes/codeweber`;
			return {
				light: `${themeUrl}/dist/assets/img/logo-light.png`,
				dark: `${themeUrl}/dist/assets/img/logo-dark.png`,
			};
		}
		return {
			light: logos.light,
			dark: logos.dark,
		};
	};

	const logoUrls = getLogoUrls();
	const sizeStyle = logoSize ? { width: logoSize, height: 'auto' } : {};

	// Получаем URL ссылки
	const getLinkUrl = () => {
		if (logoUrl) {
			return logoUrl;
		}
		// Используем home_url() по умолчанию, как в хедере
		return window.codeweberBlocks?.homeUrl || '/';
	};

	// Рендерим логотип(ы)
	const renderLogo = () => {
		const logoContent =
			logoType === 'both' ? (
				<>
					<img
						src={logoUrls.dark}
						alt={__('Logo Dark', 'codeweber-gutenberg-blocks')}
						className="logo-dark"
						style={sizeStyle}
					/>
					<img
						src={logoUrls.light}
						alt={__('Logo Light', 'codeweber-gutenberg-blocks')}
						className="logo-light"
						style={sizeStyle}
					/>
				</>
			) : (
				<img
					src={logoType === 'light' ? logoUrls.light : logoUrls.dark}
					alt={__('Logo', 'codeweber-gutenberg-blocks')}
					className={
						logoType === 'light' ? 'logo-light' : 'logo-dark'
					}
					style={sizeStyle}
				/>
			);

		// Если ссылка включена, оборачиваем в <a>
		if (enableLink) {
			return (
				<a
					href={getLinkUrl()}
					onClick={(e) => e.preventDefault()}
					style={{ pointerEvents: 'none', cursor: 'default' }}
				>
					{logoContent}
				</a>
			);
		}

		return logoContent;
	};

	return (
		<>
			{/* Toolbar выравнивания */}
			<BlockControls>
				<AlignmentToolbar
					value={blockAlign}
					onChange={(value) => setAttributes({ blockAlign: value })}
				/>
			</BlockControls>

			{/* Inspector Controls */}
			<InspectorControls>
				<LogoSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			{/* Preview */}
			<div {...blockProps}>
				<div
					className="cwgb-logo-preview"
					style={{ display: 'inline-block' }}
				>
					{renderLogo()}
				</div>
			</div>
		</>
	);
};

export default Edit;
