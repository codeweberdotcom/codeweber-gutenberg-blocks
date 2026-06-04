import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	BaseControl,
	ButtonGroup,
	Button,
	TextareaControl,
} from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import {
	createHeadingTagOptions,
	createSubtitleTagOptions,
} from '../../blocks/heading-subtitle/utils';

export const HeadingContentControl = ({
	attributes,
	setAttributes,
	hideSubtitle = false,
	hideText = false,
	hideTitle = false,
	htmlSource = false,
}) => {
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
		subtitleLineType = 'default',
	} = attributes;

	return (
		<>
			{!hideTitle && (
				<ToggleControl
					label={__('Enable Title', 'codeweber-gutenberg-blocks')}
					checked={enableTitle}
					onChange={(value) => setAttributes({ enableTitle: value })}
				/>
			)}
			{!hideSubtitle && (
				<>
					<ToggleControl
						label={__(
							'Enable Subtitle',
							'codeweber-gutenberg-blocks'
						)}
						checked={enableSubtitle}
						onChange={(value) =>
							setAttributes({ enableSubtitle: value })
						}
					/>
				</>
			)}
			{!hideText && (
				<ToggleControl
					label={__('Enable Paragraph', 'codeweber-gutenberg-blocks')}
					checked={enableText}
					onChange={(value) => setAttributes({ enableText: value })}
				/>
			)}
			{!hideSubtitle && (
				<>
					<ToggleControl
						label={__(
							'Reverse',
							'codeweber-gutenberg-blocks'
						)}
						checked={order === 'subtitle-first'}
						onChange={(value) =>
							setAttributes({
								order: value ? 'subtitle-first' : 'title-first',
							})
						}
					/>
					{enableSubtitle && (
						<BaseControl
							label={__(
								'Line type',
								'codeweber-gutenberg-blocks'
							)}
							className="mb-3"
						>
							<ButtonGroup>
								<Button
									isPressed={subtitleLineType === 'default'}
									onClick={() =>
										setAttributes({
											subtitleLineType: 'default',
										})
									}
								>
									{__('Default', 'codeweber-gutenberg-blocks')}
								</Button>
								<Button
									isPressed={subtitleLineType === 'line'}
									onClick={() =>
										setAttributes({
											subtitleLineType: 'line',
										})
									}
								>
									{__('Type 1', 'codeweber-gutenberg-blocks')}
								</Button>
								<Button
									isPressed={subtitleLineType === 'primary'}
									onClick={() =>
										setAttributes({
											subtitleLineType: 'primary',
										})
									}
								>
									{__('Type 2', 'codeweber-gutenberg-blocks')}
								</Button>
								<Button
									isPressed={subtitleLineType === 'full'}
									onClick={() =>
										setAttributes({
											subtitleLineType: 'full',
										})
									}
								>
									{__('Type 3', 'codeweber-gutenberg-blocks')}
								</Button>
							</ButtonGroup>
						</BaseControl>
					)}
				</>
			)}
			{enableTitle &&
				(htmlSource ? (
					<TextareaControl
						label={__(
							'Title Text (HTML)',
							'codeweber-gutenberg-blocks'
						)}
						help={__(
							'Raw HTML is allowed and rendered on the front end.',
							'codeweber-gutenberg-blocks'
						)}
						value={title}
						onChange={(value) => setAttributes({ title: value })}
						rows={2}
					/>
				) : (
					<BaseControl
						label={__('Title Text', 'codeweber-gutenberg-blocks')}
						className="mb-3"
					>
						<div
							style={{
								border: '1px solid #ccc',
								borderRadius: '4px',
								padding: '8px',
								minHeight: '40px',
								backgroundColor: '#fff',
								fontSize: '13px',
							}}
						>
							<RichText
								tagName="div"
								value={title}
								onChange={(value) =>
									setAttributes({ title: value })
								}
								placeholder={__(
									'Enter title...',
									'codeweber-gutenberg-blocks'
								)}
								allowedFormats={[]}
								__unstableAllowHtml={true}
								withoutInteractiveFormatting
							/>
						</div>
					</BaseControl>
				))}
			{!hideSubtitle &&
				enableSubtitle &&
				(htmlSource ? (
					<TextareaControl
						label={__(
							'Subtitle Text (HTML)',
							'codeweber-gutenberg-blocks'
						)}
						value={subtitle}
						onChange={(value) => setAttributes({ subtitle: value })}
						rows={2}
					/>
				) : (
					<BaseControl
						label={__('Subtitle Text', 'codeweber-gutenberg-blocks')}
						className="mb-3"
					>
						<div
							style={{
								border: '1px solid #ccc',
								borderRadius: '4px',
								padding: '8px',
								minHeight: '40px',
								backgroundColor: '#fff',
								fontSize: '13px',
							}}
						>
							<RichText
								tagName="div"
								value={subtitle}
								onChange={(value) =>
									setAttributes({ subtitle: value })
								}
								placeholder={__(
									'Enter subtitle...',
									'codeweber-gutenberg-blocks'
								)}
								allowedFormats={[]}
								__unstableAllowHtml={true}
							/>
						</div>
					</BaseControl>
				))}
			{enableText &&
				(htmlSource ? (
					<TextareaControl
						label={__(
							'Paragraph Text (HTML)',
							'codeweber-gutenberg-blocks'
						)}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						rows={4}
					/>
				) : (
					<BaseControl
						label={__('Paragraph Text', 'codeweber-gutenberg-blocks')}
						className="mb-3"
					>
						<div
							style={{
								border: '1px solid #ccc',
								borderRadius: '4px',
								padding: '8px',
								minHeight: '80px',
								backgroundColor: '#fff',
								fontSize: '13px',
							}}
						>
							<RichText
								tagName="div"
								value={text}
								onChange={(value) =>
									setAttributes({ text: value })
								}
								placeholder={__(
									'Enter paragraph...',
									'codeweber-gutenberg-blocks'
								)}
								allowedFormats={[]}
								__unstableAllowHtml={true}
							/>
						</div>
					</BaseControl>
				))}
		</>
	);
};
