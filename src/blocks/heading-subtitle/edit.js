import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	ButtonGroup,
	Button,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, createElement } from '@wordpress/element';
import {
	Icon,
	edit,
	typography,
	positionCenter,
	resizeCornerNE,
	cog,
	update,
	group,
} from '@wordpress/icons';

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
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';
import { getTitleClasses, getSubtitleClasses } from './utils';
import { getParagraphClasses } from '../../components/paragraph';

const HeadingSubtitleEdit = ({ attributes, setAttributes }) => {
	const {
		enableTitle,
		enableSubtitle,
		enableText,
		title,
		subtitle,
		text,
		order,
		titleTag,
		subtitleTag,
		textTag,
		titleColor,
		titleColorType,
		subtitleColor,
		subtitleColorType,
		align,
		alignItems,
		justifyContent,
		position,
		spacing,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		spacingXxxl,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		wrapperClass,
		wrapperId,
	} = attributes;

	const [activeElement, setActiveElement] = useState('title');

	const blockProps = useBlockProps();

	// Strip <strong> on the title preview to mirror save.js output (which keeps
	// cleanStrongTags). Editing happens in the Content tab as raw HTML source.
	const cleanStrongTags = (html) => {
		if (!html) return html;
		let cleaned = html;
		let previous = '';
		while (cleaned !== previous) {
			previous = cleaned;
			cleaned = cleaned
				.replace(/<strong[^>]*>/gi, '')
				.replace(/<\/strong>/gi, '');
		}
		return cleaned;
	};

	// Render a non-editable HTML preview of a field (raw HTML on the canvas,
	// matching the front end). Content is edited in the Content tab textarea.
	const renderPreview = (tag, html, className, key, placeholder) => {
		const hasContent = html && html.trim() !== '';
		return createElement(tag || 'div', {
			key,
			className,
			...(hasContent
				? { dangerouslySetInnerHTML: { __html: html } }
				: { children: placeholder, style: { opacity: 0.5 } }),
		});
	};

	const elements = [];
	if (enableTitle) {
		elements.push(
			renderPreview(
				titleTag,
				cleanStrongTags(title),
				getTitleClasses(attributes),
				'title',
				__('Enter title…', 'codeweber-gutenberg-blocks')
			)
		);
	}
	if (enableSubtitle) {
		elements.push(
			renderPreview(
				subtitleTag,
				subtitle,
				getSubtitleClasses(attributes),
				'subtitle',
				__('Enter subtitle…', 'codeweber-gutenberg-blocks')
			)
		);
	}
	if (order === 'subtitle-first') {
		elements.reverse();
	}

	// Paragraph всегда после title и subtitle
	if (enableText) {
		elements.push(
			renderPreview(
				textTag,
				text,
				getParagraphClasses(attributes, ''),
				'text',
				__('Enter paragraph…', 'codeweber-gutenberg-blocks')
			)
		);
	}

	const tabs = [
		{
			name: 'content',
			title: (
				<TabIcon
					icon={edit}
					label={__('Content', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'typography',
			title: (
				<TabIcon
					icon={typography}
					label={__('Typography', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'align',
			title: (
				<TabIcon
					icon={positionCenter}
					label={__('Align', 'codeweber-gutenberg-blocks')}
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
			name: 'animation',
			title: (
				<TabIcon
					icon={update}
					label={__('Animation', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'wrapper',
			title: (
				<TabIcon
					icon={group}
					label={__('Wrapper', 'codeweber-gutenberg-blocks')}
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
							{tab.name === 'content' && (
								<div style={{ padding: '16px' }}>
									<HeadingContentControl
										attributes={attributes}
										setAttributes={setAttributes}
										htmlSource={true}
									/>
								</div>
							)}
							{tab.name === 'typography' && (
								<div style={{ padding: '16px' }}>
									<ButtonGroup
										style={{ marginBottom: '16px' }}
									>
										<Button
											isPressed={
												attributes.titleColor === '' &&
												attributes.subtitleColor ===
													'' &&
												attributes.textColor === ''
											}
											onClick={() =>
												setAttributes({
													titleColor: '',
													titleColorType: 'solid',
													subtitleColor: '',
													subtitleColorType: 'solid',
													textColor: '',
													textColorType: 'solid',
												})
											}
										>
											{__(
												'Default',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPressed={
												attributes.titleColor ===
													'white' &&
												attributes.subtitleColor ===
													'white' &&
												attributes.textColor ===
													'white'
											}
											onClick={() =>
												setAttributes({
													titleColor: 'white',
													titleColorType: 'solid',
													subtitleColor: 'white',
													subtitleColorType: 'solid',
													textColor: 'white',
													textColorType: 'solid',
												})
											}
										>
											{__(
												'Light',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
									</ButtonGroup>
									<HeadingTypographyControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
								</div>
							)}
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__(
											'Title Align',
											'codeweber-gutenberg-blocks'
										)}
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
								</div>
							)}
							{tab.name === 'spacing' && (
								<div style={{ padding: '16px' }}>
									<SpacingControl
										spacingType={spacingType}
										spacingXs={spacingXs}
										spacingSm={spacingSm}
										spacingMd={spacingMd}
										spacingLg={spacingLg}
										spacingXl={spacingXl}
										spacingXxl={spacingXxl}
										spacingXxxl={spacingXxxl}
										onChange={(key, value) =>
											setAttributes({ [key]: value })
										}
									/>
								</div>
							)}
							{tab.name === 'animation' && (
							<div style={{ padding: '16px' }}>
								<AnimationControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</div>
						)}
						{tab.name === 'settings' && (
								<div style={{ padding: '16px' }}>
									<ButtonGroup
										style={{ marginBottom: '16px' }}
									>
										<Button
											isPrimary={
												activeElement === 'title'
											}
											onClick={() =>
												setActiveElement('title')
											}
										>
											{__(
												'Title',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPrimary={
												activeElement === 'subtitle'
											}
											onClick={() =>
												setActiveElement('subtitle')
											}
										>
											{__(
												'Subtitle',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
										<Button
											isPrimary={
												activeElement === 'paragraph'
											}
											onClick={() =>
												setActiveElement('paragraph')
											}
										>
											{__(
												'Paragraph',
												'codeweber-gutenberg-blocks'
											)}
										</Button>
									</ButtonGroup>
									{activeElement === 'title' && (
										<BlockMetaFields
											attributes={attributes}
											setAttributes={setAttributes}
											fieldKeys={{
												classKey: 'titleClass',
												dataKey: 'titleData',
												idKey: 'titleId',
											}}
											labels={{
												classLabel: __(
													'Title CSS Class',
													'codeweber-gutenberg-blocks'
												),
												dataLabel: __(
													'Title Data Attributes',
													'codeweber-gutenberg-blocks'
												),
												idLabel: __(
													'Title ID',
													'codeweber-gutenberg-blocks'
												),
											}}
										/>
									)}
									{activeElement === 'subtitle' && (
										<BlockMetaFields
											attributes={attributes}
											setAttributes={setAttributes}
											fieldKeys={{
												classKey: 'subtitleClass',
												dataKey: 'subtitleData',
												idKey: 'subtitleId',
											}}
											labels={{
												classLabel: __(
													'Subtitle CSS Class',
													'codeweber-gutenberg-blocks'
												),
												dataLabel: __(
													'Subtitle Data Attributes',
													'codeweber-gutenberg-blocks'
												),
												idLabel: __(
													'Subtitle ID',
													'codeweber-gutenberg-blocks'
												),
											}}
										/>
									)}
									{activeElement === 'paragraph' && (
										<BlockMetaFields
											attributes={attributes}
											setAttributes={setAttributes}
											fieldKeys={{
												classKey: 'textClass',
												dataKey: 'textData',
												idKey: 'textId',
											}}
											labels={{
												classLabel: __(
													'Paragraph CSS Class',
													'codeweber-gutenberg-blocks'
												),
												dataLabel: __(
													'Paragraph Data Attributes',
													'codeweber-gutenberg-blocks'
												),
												idLabel: __(
													'Paragraph ID',
													'codeweber-gutenberg-blocks'
												),
											}}
										/>
									)}
								</div>
							)}
							{tab.name === 'wrapper' && (
								<div style={{ padding: '16px' }}>
									<TextControl
										label={__(
											'Wrapper CSS Class',
											'codeweber-gutenberg-blocks'
										)}
										value={wrapperClass || ''}
										placeholder={__(
											'custom-wrapper classes',
											'codeweber-gutenberg-blocks'
										)}
										help={__(
											'Added to the wrapper around all elements.',
											'codeweber-gutenberg-blocks'
										)}
										onChange={(value) =>
											setAttributes({
												wrapperClass: value,
											})
										}
									/>
									<TextControl
										label={__(
											'Wrapper ID',
											'codeweber-gutenberg-blocks'
										)}
										value={wrapperId || ''}
										placeholder={__(
											'custom-id',
											'codeweber-gutenberg-blocks'
										)}
										onChange={(value) =>
											setAttributes({
												wrapperId: value
													.replace(/^#/, '')
													.trim(),
											})
										}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				{elements.length > 0 ? (
					<div
					className={['d-flex', 'flex-column', wrapperClass]
						.filter(Boolean)
						.join(' ')}
					{...(wrapperId && { id: wrapperId })}
					{...(animationEnabled && animationType && {
						'data-cue': animationType,
						...(animationDuration && {
							'data-duration': animationDuration,
						}),
						...(animationDelay && {
							'data-delay': animationDelay,
						}),
					})}
				>
						{elements}
					</div>
				) : (
					<div>{__('Title Block', 'codeweber-gutenberg-blocks')}</div>
				)}
			</div>
		</>
	);
};

export default HeadingSubtitleEdit;
