/**
 * Social Wrapper Block - Edit
 * Only Button blocks inside. Wrapper settings (size, social style, class) sync to all child buttons.
 */

import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

const TEMPLATE = [
	[
		'codeweber-blocks/button',
		{
			ButtonType: 'social',
			SocialIconClass: 'facebook',
			ButtonSize: '',
			SocialIconStyle: 'style_1',
			LinkUrl: '#',
		},
	],
	[
		'codeweber-blocks/button',
		{
			ButtonType: 'social',
			SocialIconClass: 'telegram',
			ButtonSize: '',
			SocialIconStyle: 'style_1',
			LinkUrl: '#',
		},
	],
	[
		'codeweber-blocks/button',
		{
			ButtonType: 'social',
			SocialIconClass: 'whatsapp',
			ButtonSize: '',
			SocialIconStyle: 'style_1',
			LinkUrl: '#',
		},
	],
];

const SocialWrapperEdit = ({ attributes, setAttributes, clientId }) => {
	const { ButtonSize, SocialIconStyle, blockClass, wrapperClass } = attributes;
	const navClassName = [
		'nav',
		'social',
		SocialIconStyle === 'style_2' ? 'social-muted' : '',
		wrapperClass,
	]
		.filter(Boolean)
		.join(' ');
	const blockProps = useBlockProps({ className: navClassName });

	const childButtonIds = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');
			const block = getBlock(clientId);
			if (!block?.innerBlocks?.length) return [];
			return block.innerBlocks
				.filter((b) => b.name === 'codeweber-blocks/button')
				.map((b) => b.clientId);
		},
		[clientId]
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// Sync wrapper attributes to all child Button blocks
	useEffect(() => {
		if (!childButtonIds.length) return;
		childButtonIds.forEach((childClientId) => {
			updateBlockAttributes(childClientId, {
				ButtonSize,
				SocialIconStyle,
				blockClass,
				ButtonType: 'social',
			});
		});
	}, [ButtonSize, SocialIconStyle, blockClass, childButtonIds, updateBlockAttributes]);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Social buttons', 'codeweber-gutenberg-blocks')}>
					<div className="component-sidebar-title">
						<label>{__('Button Size', 'codeweber-gutenberg-blocks')}</label>
					</div>
					<div className="button-size-controls button-group-sidebar_33">
						{[
							{ label: 'ExSm', value: 'btn-xs' },
							{ label: 'Sm', value: 'btn-sm' },
							{ label: 'Md', value: '' },
							{ label: 'Lg', value: 'btn-lg' },
							{ label: 'ExLg', value: 'btn-elg' },
						].map((size) => (
							<Button
								key={size.value}
								isPrimary={ButtonSize === size.value}
								onClick={() => setAttributes({ ButtonSize: size.value })}
							>
								{size.label}
							</Button>
						))}
					</div>

					<div className="social-icon-style-controls button-group-sidebar">
						<div className="component-sidebar-title">
							<label>
								{__('Social Icon Style', 'codeweber-gutenberg-blocks')}
							</label>
						</div>
						<div className="social-icon-style-buttons">
							{[
								{ label: 'Style 1', value: 'style_1' },
								{ label: 'Style 2', value: 'style_2' },
								{ label: 'Style 3', value: 'style_3' },
							].map((style) => (
								<Button
									key={style.value}
									isPrimary={SocialIconStyle === style.value}
									onClick={() =>
										setAttributes({ SocialIconStyle: style.value })
									}
								>
									{style.label}
								</Button>
							))}
						</div>
					</div>

					<TextControl
						label={__('Wrapper class', 'codeweber-gutenberg-blocks')}
						value={wrapperClass || ''}
						onChange={(value) => setAttributes({ wrapperClass: value || '' })}
						help={__(
							'Additional CSS class for the wrapper (nav).',
							'codeweber-gutenberg-blocks'
						)}
					/>

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
								'Button Class',
								'codeweber-gutenberg-blocks'
							),
							dataLabel: __(
								'Button Data',
								'codeweber-gutenberg-blocks'
							),
							idLabel: __(
								'Button ID',
								'codeweber-gutenberg-blocks'
							),
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<nav {...blockProps} className={navClassName}>
				<InnerBlocks
					allowedBlocks={['codeweber-blocks/button']}
					template={TEMPLATE}
					templateLock={false}
				/>
			</nav>
		</>
	);
};

export default SocialWrapperEdit;
