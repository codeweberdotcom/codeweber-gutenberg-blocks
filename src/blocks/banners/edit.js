import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { BannersSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Banner34, Banner3, Banner14, Banner23 } from './banners';

// Все блоки Codeweber Gutenberg Blocks (исключая сам banners, чтобы избежать рекурсии)
const ALLOWED_CODEWEBER_BLOCKS = [
	'codeweber-blocks/accordion',
	'codeweber-blocks/avatar',
	'codeweber-blocks/banner',
	'codeweber-blocks/button',
	'codeweber-blocks/section',
	'codeweber-blocks/column',
	'codeweber-blocks/columns',
	'codeweber-gutenberg-blocks/heading-subtitle',
	'codeweber-blocks/icon',
	'codeweber-blocks/lists',
	'codeweber-blocks/media',
	'codeweber-blocks/paragraph',
	'codeweber-blocks/card',
	'codeweber-blocks/feature',
	'codeweber-blocks/image-simple',
	'codeweber-blocks/post-grid',
	'codeweber-blocks/tabs',
	'codeweber-blocks/label-plus',
	'codeweber-blocks/form',
	'codeweber-blocks/form-field',
	'codeweber-blocks/submit-button',
	'codeweber-blocks/divider',
];

const BannersEdit = ({ attributes, setAttributes, clientId }) => {
	const { bannerType } = attributes;

	const blockProps = useBlockProps({
		className: `banners-block banner-${bannerType}`,
	});

	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId) || [],
		[clientId]
	);

	// Функция для получения шаблона блоков
	const getTemplateBlocks = () => {
		if (bannerType === 'banner-3') {
			return [
				['codeweber-gutenberg-blocks/heading-subtitle', {
					enableTitle: true,
					enableSubtitle: false,
					enableText: true,
					title: 'Sandbox focuses on ',
					text: 'We carefully consider our solutions to support each and every stage of your growth.',
					titleSize: 'display-1',
					textClass: 'lead fs-24 lh-sm text-white mb-7 pe-md-18 pe-lg-0 pe-xxl-15',
					titleClass: 'text-white mb-4',
				}],
				['codeweber-blocks/button', {
					ButtonContent: 'Get Started',
					ButtonSize: '',
				}],
			];
		}
		
		if (bannerType === 'banner-14') {
			return [
				['codeweber-gutenberg-blocks/heading-subtitle', {
					enableTitle: true,
					enableSubtitle: false,
					enableText: true,
					title: 'We bring rapid solutions for your business.',
					text: 'We are an award winning branding design agency that strongly believes in the power of creative ideas.',
					titleSize: 'display-1 fs-66 lh-xxs mb-0',
					textClass: 'lead fs-25 my-3',
				}],
				['codeweber-blocks/button', {
					ButtonContent: 'Learn More',
					ButtonClass: 'more hover',
				}],
			];
		}
		
		if (bannerType === 'banner-23') {
			return [
				['codeweber-gutenberg-blocks/heading-subtitle', {
					enableTitle: true,
					enableSubtitle: true,
					enableText: false,
					title: "I'm Julia Sandbox",
					subtitle: 'couples & wedding photographer',
					titleSize: 'fs-19 text-uppercase ls-xl text-white mb-3',
					subtitleSize: 'display-1 fs-60 text-white mb-0',
				}],
			];
		}
		
		// Default template для banner-34
		return [
			['codeweber-gutenberg-blocks/heading-subtitle', {
				enableTitle: true,
				enableSubtitle: false,
				enableText: true,
				title: 'We bring solutions to make life easier for our customers.',
				text: 'We have considered our solutions to support every stage of your growth.',
				titleSize: 'display-1',
				textClass: 'lead fs-lg mb-7',
			}],
			['codeweber-blocks/button', {
				ButtonContent: 'Get Started',
				ButtonSize: '',
			}],
		];
	};

	// Применяем шаблон при первом создании блока, если блоки пусты
	const hasAppliedTemplateRef = useRef(false);
	useEffect(() => {
		if (innerBlocks.length === 0 && !hasAppliedTemplateRef.current) {
			const template = getTemplateBlocks();
			const templateBlocks = createBlocksFromInnerBlocksTemplate(template);
			replaceInnerBlocks(clientId, templateBlocks, false);
			hasAppliedTemplateRef.current = true;
		}
	}, [innerBlocks.length, clientId, replaceInnerBlocks]);

	const renderBanner = () => {
		switch (bannerType) {
			case 'banner-34':
				return <Banner34 attributes={attributes} isEditor={true} clientId={clientId} />;
			case 'banner-3':
				return <Banner3 attributes={attributes} isEditor={true} clientId={clientId} />;
			case 'banner-14':
				return <Banner14 attributes={attributes} isEditor={true} clientId={clientId} />;
			case 'banner-23':
				return <Banner23 attributes={attributes} isEditor={true} clientId={clientId} />;
			default:
				return <Banner34 attributes={attributes} isEditor={true} clientId={clientId} />;
		}
	};

	return (
		<>
			<InspectorControls>
				<BannersSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{renderBanner()}
			</div>
		</>
	);
};

export default BannersEdit;

