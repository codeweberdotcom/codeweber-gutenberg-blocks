import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { CTASidebar } from './sidebar';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const getTemplateBlocks = (type) => {
	if (type === 'cta-1') {
		return [
			[
				'codeweber-blocks/card',
				{
					backgroundType: 'color',
					backgroundColor: 'navy',
					backgroundColorType: 'solid',
					backgroundGradient: 'gradient-11',
					align: 'text-center',
				},
				[
					[
						'codeweber-blocks/icon',
						{
							iconName: 'envelope-alt',
							iconSize: 'md',
							iconColor: 'primary',
							iconClass: 'fs-60',
							iconWrapper: true,
							iconWrapperClass: 'mb-3',
						},
					],
					[
						'codeweber-gutenberg-blocks/heading-subtitle',
						{
							enableTitle: true,
							enableSubtitle: false,
							enableText: true,
							title: 'Нужна консультация?',
							text: 'Наши специалисты ответят на любой интересующий вопрос',
							titleTag: 'div',
							titleColor: 'light',
							textColor: 'light',
							titleSize: 'h3',
							textSize: 'lead fs-md',
						},
					],
					[
						'codeweber-blocks/button',
						{
							ButtonContent: 'Заказать звонок',
							ButtonColor: 'primary',
							ButtonStyle: 'solid',
							ButtonClass: 'rounded-0',
						},
					],
				],
			],
		];
	}
	if (type === 'cta-3') {
		return [
			[
				'codeweber-blocks/card',
				{
					backgroundType: 'none',
					backgroundColor: '',
					backgroundColorType: 'solid',
					backgroundGradient: '',
					align: 'text-center',
				},
				[
					[
						'codeweber-blocks/icon',
						{
							iconType: 'svg',
							svgIcon: 'email',
							svgStyle: 'lineal',
							iconSize: 'md',
							iconColor: 'primary',
							iconClass: 'fs-60',
							iconWrapper: true,
							iconWrapperClass: 'mb-3',
						},
					],
					[
						'codeweber-gutenberg-blocks/heading-subtitle',
						{
							enableTitle: true,
							enableSubtitle: false,
							enableText: true,
							title: 'Нужна консультация?',
							text: 'Наши специалисты ответят на любой интересующий вопрос',
							titleTag: 'div',
							titleColor: '',
							textColor: '',
							subtitleColor: '',
							titleSize: 'h3',
							textSize: 'lead fs-md',
						},
					],
					[
						'codeweber-blocks/button',
						{
							ButtonContent: 'Заказать звонок',
							ButtonColor: 'primary',
							ButtonStyle: 'solid',
							ButtonClass: 'rounded-0',
						},
					],
				],
			],
		];
	}
	if (type === 'cta-2') {
		return [
			[
				'codeweber-blocks/card',
				{
					backgroundType: 'color',
					backgroundColor: 'dark',
					cardBodyClass: 'p-10',
				},
				[
					[
						'codeweber-blocks/columns',
						{ columnsType: 'classic', columnsClass: '', columnsCount: 2 },
						[
							[
								'codeweber-blocks/column',
								{ columnCol: '12', columnColMd: '9' },
								[
									[
										'codeweber-gutenberg-blocks/heading-subtitle',
										{
											enableTitle: true,
											enableSubtitle: false,
											enableText: true,
											title: 'Join Our Community',
											text: 'We are trusted by over 5000+ clients. Join them by using our services and grow your business.',
											titleTag: 'div',
											titleColor: 'light',
											textColor: 'light',
											align: '',
											titleSize: 'h3',
											titleClass: 'mb-0',
											textClass: 'mb-0',
										},
									],
								],
							],
							[
								'codeweber-blocks/column',
								{ columnCol: '12', columnColMd: '3', columnJustifyContent: 'justify-content-center' },
								[
									[
										'codeweber-blocks/group-button',
										{ groupJustifyContent: 'justify-content-end' },
										[
											[
												'codeweber-blocks/button',
												{
													ButtonContent: 'Join Us',
													ButtonColor: 'primary',
													ButtonStyle: 'solid',
													ButtonClass: 'rounded-0',
												},
											],
										],
									],
								],
							],
						],
					],
				],
			],
		];
	}
	return [];
};

const CTAEdit = ({ attributes, setAttributes, clientId }) => {
	const { ctaType, ctaTheme, ctaAlign, blockClass, blockId, blockData } = attributes;

	const blockProps = useBlockProps({
		className: ['cta-block', `cta-${ctaType}`, blockClass].filter(Boolean).join(' '),
		id: blockId || undefined,
		...(blockData && typeof blockData === 'string'
			? Object.fromEntries(
					blockData.split(',').reduce((acc, pair) => {
						const eq = pair.indexOf('=');
						if (eq > 0) {
							const key = pair.slice(0, eq).trim();
							const value = pair.slice(eq + 1).trim();
							if (key) acc.push([`data-${key}`, value]);
						}
						return acc;
					}, [])
			  )
			: {}),
	});

	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch(blockEditorStore);
	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId) || [],
		[clientId]
	);
	const cardAndChildren = useSelect(
		(select) => {
			const blocks = select(blockEditorStore).getBlocks(clientId) || [];
			const card = blocks[0];
			if (!card || card.name !== 'codeweber-blocks/card') return { cardClientId: null, cardInnerBlocks: [], cardDescendants: [] };
			const getBlocks = (id) => select(blockEditorStore).getBlocks(id) || [];
			const flatten = (block) => [block, ...getBlocks(block.clientId).flatMap(flatten)];
			const cardDescendants = flatten(card);
			return {
				cardClientId: card.clientId,
				cardInnerBlocks: getBlocks(card.clientId),
				cardDescendants,
			};
		},
		[clientId, innerBlocks]
	);

	const previousCtaTypeRef = useRef(ctaType);
	const themeSyncedRef = useRef(false);
	const alignSyncedRef = useRef(null);

	useEffect(() => {
		const template = getTemplateBlocks(ctaType);
		if (template.length === 0) return;

		const ctaTypeChanged = previousCtaTypeRef.current !== ctaType;
		const isEmpty = innerBlocks.length === 0;

		if (isEmpty || ctaTypeChanged) {
			const blocks = createBlocksFromInnerBlocksTemplate(template);
			replaceInnerBlocks(clientId, blocks, false);
			previousCtaTypeRef.current = ctaType;
			themeSyncedRef.current = false;
			alignSyncedRef.current = null;
		}
	}, [ctaType, clientId, replaceInnerBlocks, innerBlocks.length]);

	// Значение align для Card: Left — нет, Center — center, Right — end
	const getCardAlignValue = () => {
		if (ctaAlign === 'left') return '';
		if (ctaAlign === 'right') return 'end';
		return 'center';
	};

	// При смене темы (light/dark), выравнивания (ctaAlign) или при первом появлении Card — обновляем Card и дочерние блоки
	useEffect(() => {
		const { cardClientId, cardInnerBlocks } = cardAndChildren;
		if (!cardClientId) return;

		const themeChanged = !themeSyncedRef.current || themeSyncedRef.current !== ctaTheme;
		const alignChanged = alignSyncedRef.current !== (ctaAlign ?? 'center');
		if (!themeChanged && !alignChanged) return;
		themeSyncedRef.current = ctaTheme;
		alignSyncedRef.current = ctaAlign ?? 'center';

		const isDark = ctaTheme === 'dark';

		updateBlockAttributes(cardClientId, {
			backgroundType: isDark ? 'color' : 'none',
			backgroundColor: isDark ? 'dark' : '',
			backgroundColorType: isDark ? 'solid' : 'solid',
			backgroundGradient: isDark ? 'gradient-11' : '',
			align: getCardAlignValue(),
		});

		const { cardDescendants = [] } = cardAndChildren;
		const headingBlock = cardDescendants.find((b) => b.name === 'codeweber-gutenberg-blocks/heading-subtitle');
		if (headingBlock) {
			updateBlockAttributes(headingBlock.clientId, {
				titleColor: isDark ? 'light' : '',
				textColor: isDark ? 'light' : '',
				subtitleColor: isDark ? 'light' : '',
			});
		}

		const iconBlock = cardDescendants.find((b) => b.name === 'codeweber-blocks/icon');
		if (iconBlock) {
			updateBlockAttributes(iconBlock.clientId, { iconColor: 'primary' });
		}

		const buttonBlocks = cardDescendants.filter((b) => b.name === 'codeweber-blocks/button');
		buttonBlocks.forEach((buttonBlock) => {
			updateBlockAttributes(buttonBlock.clientId, {
				ButtonColor: 'primary',
				ButtonStyle: 'solid',
			});
		});
	}, [ctaTheme, ctaAlign, cardAndChildren, updateBlockAttributes]);

	return (
		<>
			<InspectorControls>
				<CTASidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks templateLock={false} />
			</div>
		</>
	);
};

export default CTAEdit;
