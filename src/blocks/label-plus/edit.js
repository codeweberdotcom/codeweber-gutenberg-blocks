import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { TabPanel, PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Icon, cog, typography, dragHandle, starFilled } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { IconRender } from '../../components/icon';
import { IconControl } from '../../components/icon/IconControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { useEffect } from '@wordpress/element';

const Edit = ({ attributes, setAttributes }) => {
	const {
		counterText,
		labelText,
		positionBottom,
		positionRight,
		cardRadiusClass,
		iconType,
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
		showCounterClass,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// Tab icon with native title tooltip
	const TabIcon = ({ icon, label }) => (
		<span 
			title={label}
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Icon icon={icon} size={20} />
		</span>
	);

	const tabs = [
		{ name: 'content', title: <TabIcon icon={typography} label={__('Content', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'position', title: <TabIcon icon={dragHandle} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'icon', title: <TabIcon icon={starFilled} label={__('Icon', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	const blockProps = useBlockProps({
		className: 'cw-label-plus position-relative',
		id: blockId || undefined,
	});

	// Fetch theme card radius class once and store in attributes
	useEffect(() => {
		if (cardRadiusClass) return;
		apiFetch({ path: '/codeweber/v1/styles' })
			.then((res) => {
				// Debug: log card radius from API
				if (process.env.NODE_ENV !== 'production') {
					// eslint-disable-next-line no-console
					console.log('Label+ card radius from API:', res?.card_radius_class);
				}
				if (res?.card_radius_class !== undefined) {
					setAttributes({ cardRadiusClass: res.card_radius_class });
				}
			})
			.catch(() => {});
	}, [cardRadiusClass, setAttributes]);

	const cardStyle = {
		bottom: positionBottom || undefined,
		right: positionRight || undefined,
	};

	// Parse data attributes
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{/* CONTENT TAB */}
							{tab.name === 'content' && (
								<PanelBody>
									<TextControl
										label={__('Title', 'codeweber-gutenberg-blocks')}
										value={counterText}
										onChange={(value) => setAttributes({ counterText: value })}
									/>
									<ToggleControl
										label={__('Add "counter" class', 'codeweber-gutenberg-blocks')}
										checked={showCounterClass}
										onChange={(value) => setAttributes({ showCounterClass: value })}
									/>
									<TextControl
										label={__('Label', 'codeweber-gutenberg-blocks')}
										value={labelText}
										onChange={(value) => setAttributes({ labelText: value })}
									/>
								</PanelBody>
							)}

							{/* POSITION TAB */}
							{tab.name === 'position' && (
								<PanelBody>
									<TextControl
										label={__('Bottom', 'codeweber-gutenberg-blocks')}
										value={positionBottom}
										help={__('Use CSS units, e.g. 10% or 20px', 'codeweber-gutenberg-blocks')}
										onChange={(value) => setAttributes({ positionBottom: value })}
									/>
									<TextControl
										label={__('Right', 'codeweber-gutenberg-blocks')}
										value={positionRight}
										help={__('Use CSS units, e.g. -3% or 0', 'codeweber-gutenberg-blocks')}
										onChange={(value) => setAttributes({ positionRight: value })}
									/>
								</PanelBody>
							)}

							{/* ICON TAB */}
							{tab.name === 'icon' && (
								<PanelBody>
									<IconControl
										attributes={attributes}
										setAttributes={setAttributes}
										prefix=""
										label={__('Icon Settings', 'codeweber-gutenberg-blocks')}
										allowSvg={true}
										allowFont={true}
										allowCustom={true}
										showWrapper={true}
										showMargin={false}
										initialOpen={true}
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
											classLabel: __('Block Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Block Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Block ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
								</PanelBody>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			<div {...blockProps} {...dataAttributes}>
				<div
					className={`card shadow-lg position-absolute p-0${cardRadiusClass ? ' ' + cardRadiusClass : ''}${blockClass ? ' ' + blockClass : ''}`}
					style={cardStyle}
				>
					<div className="card-body py-4 px-5">
						<div className="d-flex flex-row align-items-center">
							<div>
								<IconRender
									iconType={iconType}
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
									isEditor={true}
								/>
							</div>
							<div>
								<RichText
									tagName="div"
									className={`h3 mb-0 text-nowrap${showCounterClass ? ' counter' : ''}`}
									value={counterText}
									onChange={(value) => setAttributes({ counterText: value })}
									placeholder={__('25000+', 'codeweber-gutenberg-blocks')}
									aria-label={__('Title', 'codeweber-gutenberg-blocks')}
								/>
								<RichText
									tagName="p"
									className="fs-14 lh-sm mb-0 text-nowrap"
									value={labelText}
									onChange={(value) => setAttributes({ labelText: value })}
									placeholder={__('Happy Clients', 'codeweber-gutenberg-blocks')}
									aria-label={__('Label', 'codeweber-gutenberg-blocks')}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;

