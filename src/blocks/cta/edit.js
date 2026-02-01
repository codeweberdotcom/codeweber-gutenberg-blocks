import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { CTASidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	CTA1,
	CTA2,
	CTA3,
	CTA4,
	CTA5,
	CTA6,
} from './ctas';

const CTAEdit = ({ attributes, setAttributes, clientId }) => {
	const { ctaType, blockClass, blockId, blockData } = attributes;

	const blockWrapperClass = ['cta-block', `cta-${ctaType}`, blockClass].filter(Boolean).join(' ');
	const dataAttributes = {};
	if (blockData && typeof blockData === 'string') {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s && s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}
	const blockProps = useBlockProps({
		className: blockWrapperClass,
		id: blockId || undefined,
		...dataAttributes,
	});

	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch(blockEditorStore);
	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId) || [],
		[clientId]
	);

	// Функция для получения шаблона блоков
	const getTemplateBlocks = (type = ctaType) => {
		if (type === 'cta-1') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Join Our Community',
						text: 'We are trusted by over 5000+ clients. Join them by using our services and grow your business.',
						titleSize: 'display-4 mb-3 text-center',
						textClass: 'lead mb-5 px-md-16 px-lg-3',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Join Us',
						ButtonClass: 'btn btn-primary rounded-pill',
					},
				],
			];
		}

		if (type === 'cta-2') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: false,
						title:
							'We are trusted by over 5000+ clients. Join them by using our services and grow your business.',
						titleTag: 'h3',
						titleSize: 'display-6 mb-6 mb-lg-0 pe-lg-10 pe-xl-5 pe-xxl-18 text-white',
						order: 'title-first',
						subtitleLine: false,
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Join Us',
						ButtonClass: 'btn btn-white rounded-pill mb-0 text-nowrap',
					},
				],
			];
		}

		if (type === 'cta-3') {
			return [
				[
					'codeweber-blocks/icon',
					{
						iconType: 'svg',
						iconName: 'puzzle-2',
						iconClass: 'svg-inject icon-svg icon-svg-md mb-4',
					},
				],
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Join Our Community',
						text: 'We are trusted by over 5000+ clients. Join them by using our services and grow your business.',
						titleSize: 'display-4 mb-3',
						textClass: 'lead fs-lg mb-6 px-xl-10 px-xxl-15',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Join Us',
						ButtonClass: 'btn btn-primary rounded',
					},
				],
			];
		}

		if (type === 'cta-4') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: true,
						enableText: false,
						title:
							'We are <span class="underline-3 style-2 yellow">trusted</span> by over 5000+ clients. Join them now and grow your business.',
						subtitle: 'Join Our Community',
						subtitleSize: 'fs-16 text-uppercase text-white mb-3',
						titleSize: 'display-3 mb-8 px-lg-8 text-white',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Get Started',
						ButtonClass: 'btn btn-white rounded',
					},
				],
			];
		}

		if (type === 'cta-5') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: true,
						enableText: false,
						title:
							'Wonder how much faster your website can go? Easily check your SEO Score now.',
						subtitle: 'Analyze Now',
						subtitleSize: 'fs-16 text-uppercase text-primary mb-3',
						titleSize: 'display-4 mb-0',
					},
				],
				[
					'codeweber-blocks/form',
					{
						formAction: '#',
						formMethod: 'get',
					},
					[
						[
							'codeweber-blocks/form-field',
							{
								fieldType: 'url',
								fieldName: 'url',
								placeholder: 'Enter Website URL',
								fieldLabel: 'Enter Website URL',
								enableInlineButton: true,
								inlineButtonText: 'Analyze',
								inlineButtonClass: 'btn btn-primary',
								fieldClass: 'form-control border-0',
							},
						],
					],
				],
			];
		}

		if (type === 'cta-6') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: true,
						enableText: false,
						title:
							'We are <span class="underline-2 underline-gradient-6"><em>trusted</em></span> by over 5000+ clients. Join them now and grow your business.',
						subtitle: 'Join Our Community',
						subtitleSize: 'fs-16 text-uppercase text-white mb-3',
						titleSize: 'display-3 text-white mb-6',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Join Us',
						ButtonClass: 'btn btn-white',
					},
				],
			];
		}

		// Default template для cta-1
		return [
			[
				'codeweber-gutenberg-blocks/heading-subtitle',
				{
					enableTitle: true,
					enableSubtitle: false,
					enableText: true,
					title: 'Join Our Community',
					text: 'We are trusted by over 5000+ clients. Join them by using our services and grow your business.',
					titleSize: 'display-4 mb-3 text-center',
					textClass: 'lead mb-5 px-md-16 px-lg-3',
				},
			],
			[
				'codeweber-blocks/button',
				{
					ButtonContent: 'Join Us',
					ButtonClass: 'btn btn-primary rounded-pill',
				},
			],
		];
	};

	// Применяем шаблон при первом создании блока или при изменении типа CTA
	const previousCtaTypeRef = useRef(ctaType);
	useEffect(() => {
		const ctaTypeChanged = previousCtaTypeRef.current !== ctaType;
		
		if (innerBlocks.length === 0 && ctaType) {
			// Первое создание - применяем полный шаблон
			const template = getTemplateBlocks(ctaType);
			if (template && template.length > 0) {
				const templateBlocks =
					createBlocksFromInnerBlocksTemplate(template);
				replaceInnerBlocks(clientId, templateBlocks, false);
			}
			previousCtaTypeRef.current = ctaType;
		} else if (ctaTypeChanged && innerBlocks.length > 0 && ctaType) {
			// При изменении типа CTA обновляем только атрибуты форматирования, сохраняя текст
			const template = getTemplateBlocks(ctaType);
			if (template && template.length > 0) {
				innerBlocks.forEach((block, index) => {
					const templateBlock = template[index];
					if (templateBlock && templateBlock[1]) {
						const templateAttrs = templateBlock[1];
						// Обновляем только атрибуты форматирования, исключая текстовый контент
						const updates = {};
						
						// Для heading-subtitle обновляем только форматирование
						if (block.name === 'codeweber-gutenberg-blocks/heading-subtitle') {
							if (templateAttrs.enableTitle !== undefined) updates.enableTitle = templateAttrs.enableTitle;
							if (templateAttrs.enableSubtitle !== undefined) updates.enableSubtitle = templateAttrs.enableSubtitle;
							if (templateAttrs.enableText !== undefined) updates.enableText = templateAttrs.enableText;
							if (templateAttrs.titleTag !== undefined) updates.titleTag = templateAttrs.titleTag;
							if (templateAttrs.titleSize !== undefined) updates.titleSize = templateAttrs.titleSize;
							if (templateAttrs.subtitleSize !== undefined) updates.subtitleSize = templateAttrs.subtitleSize;
							if (templateAttrs.textClass !== undefined) updates.textClass = templateAttrs.textClass;
							if (templateAttrs.order !== undefined) updates.order = templateAttrs.order;
							if (templateAttrs.subtitleLine !== undefined) updates.subtitleLine = templateAttrs.subtitleLine;
							// НЕ обновляем: title, subtitle, text - сохраняем пользовательский текст
						}
						
						// Для button обновляем только классы
						if (block.name === 'codeweber-blocks/button') {
							if (templateAttrs.ButtonClass !== undefined) updates.ButtonClass = templateAttrs.ButtonClass;
							// НЕ обновляем: ButtonContent - сохраняем пользовательский текст
						}
						
						// Для icon обновляем все атрибуты
						if (block.name === 'codeweber-blocks/icon') {
							Object.keys(templateAttrs).forEach(key => {
								updates[key] = templateAttrs[key];
							});
						}
						
						// Для form обновляем только настройки формы
						if (block.name === 'codeweber-blocks/form') {
							if (templateAttrs.formAction !== undefined) updates.formAction = templateAttrs.formAction;
							if (templateAttrs.formMethod !== undefined) updates.formMethod = templateAttrs.formMethod;
						}
						
						if (Object.keys(updates).length > 0) {
							updateBlockAttributes(block.clientId, updates);
						}
					}
				});
			}
			previousCtaTypeRef.current = ctaType;
		}
	}, [innerBlocks.length, clientId, replaceInnerBlocks, ctaType, updateBlockAttributes, innerBlocks]);

	const renderCTA = () => {
		switch (ctaType) {
			case 'cta-1':
				return (
					<CTA1
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'cta-2':
				return (
					<CTA2
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'cta-3':
				return (
					<CTA3
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'cta-4':
				return (
					<CTA4
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'cta-5':
				return (
					<CTA5
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'cta-6':
				return (
					<CTA6
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			default:
				return (
					<CTA1
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
		}
	};

	return (
		<>
			<InspectorControls>
				<CTASidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>{renderCTA()}</div>
		</>
	);
};

export default CTAEdit;

