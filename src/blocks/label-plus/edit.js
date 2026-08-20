import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	TextControl,
	ToggleControl,
	RadioControl,
	ComboboxControl,
} from '@wordpress/components';
import {
	Icon,
	cog,
	typography,
	dragHandle,
	starFilled,
} from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { IconRender } from '../../components/icon';
import { IconControl } from '../../components/icon/IconControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { ButtonStyleControls } from '../../components/button-style/ButtonStyleControls';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';
import { getClassNames } from '../button/buttonclass';
import { getLabelPartClasses, getLabelPartTag } from './utils';
import { colors } from '../../utilities/colors';
import { useEffect } from '@wordpress/element';

const BUTTON_TYPES = [
	{ label: 'Solid', value: 'solid' },
	{ label: 'Icon', value: 'icon' },
];

const Edit = ({ attributes, setAttributes }) => {
	const {
		counterText,
		labelText,
		positionBottom,
		positionRight,
		cardRadiusClass,
		iconType,
		iconText,
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
		customSvgUrl,
		customSvgId,
		customSvgSize,
		showCounterClass,
		blockClass,
		blockData,
		blockId,
		displayType,
		badgeColor,
		cardAbsolute,
		enableIcon,
		enableTitle,
		enableText,
		titleTag,
		textTag,
		ButtonType,
		ButtonIconPosition,
		LeftIcon,
		RightIcon,
	} = attributes;

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

	const contentTab = {
		name: 'content',
		title: (
			<TabIcon
				icon={typography}
				label={__('Content', 'codeweber-gutenberg-blocks')}
			/>
		),
	};
	const positionTab = {
		name: 'position',
		title: (
			<TabIcon
				icon={dragHandle}
				label={__('Position', 'codeweber-gutenberg-blocks')}
			/>
		),
	};
	const typographyTab = {
		name: 'typography',
		title: (
			<TabIcon
				icon={typography}
				label={__('Typography', 'codeweber-gutenberg-blocks')}
			/>
		),
	};
	const iconTab = {
		name: 'icon',
		title: (
			<TabIcon
				icon={starFilled}
				label={__('Icon', 'codeweber-gutenberg-blocks')}
			/>
		),
	};
	const styleTab = {
		name: 'style',
		title: (
			<TabIcon
				icon={starFilled}
				label={__('Style', 'codeweber-gutenberg-blocks')}
			/>
		),
	};
	const settingsTab = {
		name: 'settings',
		title: (
			<TabIcon
				icon={cog}
				label={__('Settings', 'codeweber-gutenberg-blocks')}
			/>
		),
	};

	// Position only carries the offsets, so it is pointless without absolute.
	const cardTabs = [contentTab, typographyTab];
	if (cardAbsolute) {
		cardTabs.push(positionTab);
	}
	cardTabs.push(iconTab, settingsTab);

	const tabs =
		displayType === 'card'
			? cardTabs
			: displayType === 'button'
				? [contentTab, styleTab, settingsTab]
				: [contentTab, settingsTab];

	const blockProps = useBlockProps({
		className: 'cw-label-plus position-relative',
		id: blockId || undefined,
	});

	useEffect(() => {
		if (cardRadiusClass) return;
		apiFetch({ path: '/codeweber/v1/styles' })
			.then((res) => {
				if (res?.card_radius_class !== undefined) {
					setAttributes({ cardRadiusClass: res.card_radius_class });
				}
			})
			.catch(() => {});
	}, [cardRadiusClass, setAttributes]);

	const cardStyle = cardAbsolute
		? {
				bottom: positionBottom || undefined,
				right: positionRight || undefined,
			}
		: undefined;

	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	// Button-type preview classes
	const btnPreviewClasses = getClassNames(attributes);

	const renderPreview = () => {
		if (displayType === 'badge') {
			return (
				<span className={`badge bg-${badgeColor || 'primary'} rounded-pill`}>
					<RichText
						tagName="span"
						value={labelText}
						onChange={(value) => setAttributes({ labelText: value })}
						placeholder={__(
							'Label',
							'codeweber-gutenberg-blocks'
						)}
						aria-label={__(
							'Label',
							'codeweber-gutenberg-blocks'
						)}
					/>
				</span>
			);
		}

		if (displayType === 'button') {
			const hasLeftIcon =
				ButtonType === 'icon' &&
				ButtonIconPosition === 'left' &&
				LeftIcon;
			const hasRightIcon =
				ButtonType === 'icon' &&
				ButtonIconPosition === 'right' &&
				RightIcon;
			return (
				<span className={btnPreviewClasses}>
					{hasLeftIcon && <i className={LeftIcon}></i>}
					<RichText
						tagName="span"
						value={labelText}
						onChange={(value) => setAttributes({ labelText: value })}
						placeholder={__(
							'Label',
							'codeweber-gutenberg-blocks'
						)}
						aria-label={__(
							'Label',
							'codeweber-gutenberg-blocks'
						)}
					/>
					{hasRightIcon && <i className={RightIcon}></i>}
				</span>
			);
		}

		// card (default)
		const cardPreviewClasses = [
			'card',
			'shadow-lg',
			cardAbsolute ? 'position-absolute' : '',
			'p-0',
			cardRadiusClass,
			blockClass,
		]
			.filter(Boolean)
			.join(' ');

		const titlePreviewClasses = [
			getLabelPartClasses(attributes, 'title'),
			showCounterClass ? 'counter' : '',
		]
			.filter(Boolean)
			.join(' ');

		return (
			<div className={cardPreviewClasses} style={cardStyle}>
				<div className="card-body py-4 px-5">
					<div className="d-flex flex-row align-items-center">
						{enableIcon && (
						<div>
							<IconRender
								iconType={iconType}
								iconText={iconText}
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
								iconWrapperClass="pe-none mx-auto me-3"
								customSvgUrl={customSvgUrl}
								customSvgId={customSvgId}
								customSvgSize={customSvgSize}
								isEditor={true}
							/>
						</div>
						)}
						{(enableTitle || enableText) && (
						<div>
							{enableTitle && (
								<RichText
									tagName={getLabelPartTag(titleTag, 'div')}
									className={titlePreviewClasses}
									value={counterText}
									onChange={(value) =>
										setAttributes({ counterText: value })
									}
									placeholder={__(
										'25000+',
										'codeweber-gutenberg-blocks'
									)}
									aria-label={__(
										'Title',
										'codeweber-gutenberg-blocks'
									)}
								/>
							)}
							{enableText && (
								<RichText
									tagName={getLabelPartTag(textTag, 'p')}
									className={getLabelPartClasses(
										attributes,
										'text'
									)}
									value={labelText}
									onChange={(value) =>
										setAttributes({ labelText: value })
									}
									placeholder={__(
										'Happy Clients',
										'codeweber-gutenberg-blocks'
									)}
									aria-label={__(
										'Label',
										'codeweber-gutenberg-blocks'
									)}
								/>
							)}
						</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				<TabPanel
					key={`${displayType}-${cardAbsolute ? 'abs' : 'flow'}`}
					tabs={tabs}
				>
					{(tab) => (
						<>
							{/* CONTENT TAB */}
							{tab.name === 'content' && (
								<PanelBody>
									<RadioControl
										label={__(
											'Display Type',
											'codeweber-gutenberg-blocks'
										)}
										options={[
											{
												label: __(
													'Card',
													'codeweber-gutenberg-blocks'
												),
												value: 'card',
											},
											{
												label: __(
													'Badge',
													'codeweber-gutenberg-blocks'
												),
												value: 'badge',
											},
											{
												label: __(
													'Button',
													'codeweber-gutenberg-blocks'
												),
												value: 'button',
											},
										]}
										selected={displayType}
										onChange={(value) =>
											setAttributes({ displayType: value })
										}
									/>
									{displayType === 'card' && (
										<>
											<ToggleControl
												label={__(
													'Absolute Position',
													'codeweber-gutenberg-blocks'
												)}
												help={__(
													'Off — the card sits in the normal flow instead of floating over the parent.',
													'codeweber-gutenberg-blocks'
												)}
												checked={cardAbsolute}
												onChange={(value) =>
													setAttributes({
														cardAbsolute: value,
													})
												}
											/>
											<ToggleControl
												label={__(
													'Enable Icon',
													'codeweber-gutenberg-blocks'
												)}
												checked={enableIcon}
												onChange={(value) =>
													setAttributes({
														enableIcon: value,
													})
												}
											/>
											<ToggleControl
												label={__(
													'Enable Title',
													'codeweber-gutenberg-blocks'
												)}
												checked={enableTitle}
												onChange={(value) =>
													setAttributes({
														enableTitle: value,
													})
												}
											/>
											<ToggleControl
												label={__(
													'Enable Paragraph',
													'codeweber-gutenberg-blocks'
												)}
												checked={enableText}
												onChange={(value) =>
													setAttributes({
														enableText: value,
													})
												}
											/>
											{enableTitle && (
												<>
													<TextControl
														label={__(
															'Title',
															'codeweber-gutenberg-blocks'
														)}
														value={counterText}
														onChange={(value) =>
															setAttributes({
																counterText:
																	value,
															})
														}
													/>
													<ToggleControl
														label={__(
															'Add "counter" class',
															'codeweber-gutenberg-blocks'
														)}
														checked={
															showCounterClass
														}
														onChange={(value) =>
															setAttributes({
																showCounterClass:
																	value,
															})
														}
													/>
												</>
											)}
										</>
									)}
									{(displayType !== 'card' || enableText) && (
										<TextControl
											label={__(
												'Label',
												'codeweber-gutenberg-blocks'
											)}
											value={labelText}
											onChange={(value) =>
												setAttributes({
													labelText: value,
												})
											}
										/>
									)}
									{displayType === 'badge' && (
										<ComboboxControl
											label={__(
												'Badge Color',
												'codeweber-gutenberg-blocks'
											)}
											value={badgeColor}
											options={colors}
											onChange={(value) =>
												setAttributes({
													badgeColor: value,
												})
											}
										/>
									)}
								</PanelBody>
							)}

							{/* POSITION TAB (card only, absolute only) */}
							{tab.name === 'position' && (
								<PanelBody>
									<TextControl
										label={__(
											'Bottom',
											'codeweber-gutenberg-blocks'
										)}
										value={positionBottom}
										help={__(
											'Use CSS units, e.g. 10% or 20px',
											'codeweber-gutenberg-blocks'
										)}
										onChange={(value) =>
											setAttributes({
												positionBottom: value,
											})
										}
									/>
									<TextControl
										label={__(
											'Right',
											'codeweber-gutenberg-blocks'
										)}
										value={positionRight}
										help={__(
											'Use CSS units, e.g. -3% or 0',
											'codeweber-gutenberg-blocks'
										)}
										onChange={(value) =>
											setAttributes({
												positionRight: value,
											})
										}
									/>
								</PanelBody>
							)}

							{/* TYPOGRAPHY TAB (card only) */}
							{tab.name === 'typography' && (
								<PanelBody>
									<HeadingTypographyControl
										attributes={attributes}
										setAttributes={setAttributes}
										hideSubtitle={true}
										hideText={!enableText}
									/>
								</PanelBody>
							)}

							{/* ICON TAB (card only) */}
							{tab.name === 'icon' && (
								<PanelBody>
									<IconControl
										attributes={attributes}
										setAttributes={setAttributes}
										prefix=""
										label={__(
											'Icon Settings',
											'codeweber-gutenberg-blocks'
										)}
										allowSvg={true}
										allowFont={true}
										allowCustom={true}
										showWrapper={true}
										showMargin={false}
										initialOpen={true}
									/>
								</PanelBody>
							)}

							{/* STYLE TAB (button only) */}
							{tab.name === 'style' && (
								<PanelBody>
									<ButtonStyleControls
										attributes={attributes}
										setAttributes={setAttributes}
										types={BUTTON_TYPES}
									/>
								</PanelBody>
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
												'Block Class',
												'codeweber-gutenberg-blocks'
											),
											dataLabel: __(
												'Block Data',
												'codeweber-gutenberg-blocks'
											),
											idLabel: __(
												'Block ID',
												'codeweber-gutenberg-blocks'
											),
										}}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps} {...dataAttributes}>
				{renderPreview()}
			</div>
		</>
	);
};

export default Edit;
