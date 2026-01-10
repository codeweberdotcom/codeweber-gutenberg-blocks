import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, image, grid, cog, search, starFilled } from '@wordpress/icons';
import { ImageControl } from '../../components/image/ImageControl';
import { LayoutControl } from './controls/LayoutControl';
import { LightboxControl } from '../../components/lightbox/LightboxControl';
import { BorderRadiusControl } from '../../components/border-radius';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { ImageHoverControl } from '../../components/image-hover/ImageHoverControl';
import { LoadMoreControl } from '../../components/load-more';

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

export const ImageSimpleSidebar = ({ attributes, setAttributes }) => {
	const tabs = [
		{
			name: 'images',
			title: (
				<TabIcon
					icon={image}
					label={__('Images', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'layout',
			title: (
				<TabIcon
					icon={grid}
					label={__('Layout', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'effects',
			title: (
				<TabIcon
					icon={starFilled}
					label={__('Effects', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'lightbox',
			title: (
				<TabIcon
					icon={search}
					label={__('Lightbox', 'codeweber-gutenberg-blocks')}
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
	];

	return (
		<InspectorControls>
			<TabPanel tabs={tabs}>
				{(tab) => (
					<>
						{/* IMAGES TAB */}
						{tab.name === 'images' && (
							<PanelBody>
								<div className="mb-3">
									<div className="component-sidebar-title">
										<label>
											{__(
												'Render Type',
												'codeweber-gutenberg-blocks'
											)}
										</label>
									</div>
									<ButtonGroup>
										<button
											className={`components-button ${attributes.imageRenderType === 'img' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imageRenderType: 'img',
												})
											}
										>
											{__(
												'Image Tag',
												'codeweber-gutenberg-blocks'
											)}
										</button>
										<button
											className={`components-button ${attributes.imageRenderType === 'background' ? 'is-primary' : 'is-secondary'}`}
											onClick={() =>
												setAttributes({
													imageRenderType:
														'background',
												})
											}
										>
											{__(
												'Background',
												'codeweber-gutenberg-blocks'
											)}
										</button>
									</ButtonGroup>
								</div>
								<ImageControl
									images={attributes.images}
									imageSize={attributes.imageSize}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* LAYOUT TAB */}
						{tab.name === 'layout' && (
							<PanelBody>
								<LayoutControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>

								{/* Load More - только для Grid режима */}
								{attributes.displayMode === 'grid' && (
									<div
										style={{
											marginTop: '24px',
											paddingTop: '24px',
											borderTop: '1px solid #ddd',
										}}
									>
										<PanelBody
											title={__(
												'Load More',
												'codeweber-gutenberg-blocks'
											)}
											initialOpen={false}
										>
											<LoadMoreControl
												attributes={attributes}
												setAttributes={setAttributes}
												attributePrefix="loadMore"
											/>
										</PanelBody>
									</div>
								)}

								<div style={{ marginTop: '16px' }}>
									<BorderRadiusControl
										value={attributes.borderRadius}
										onChange={(value) =>
											setAttributes({
												borderRadius: value,
											})
										}
									/>
								</div>
							</PanelBody>
						)}

						{/* EFFECTS TAB */}
						{tab.name === 'effects' && (
							<PanelBody>
								<ImageHoverControl
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</PanelBody>
						)}

						{/* LIGHTBOX TAB */}
						{tab.name === 'lightbox' && (
							<PanelBody>
								<LightboxControl
									attributes={attributes}
									setAttributes={setAttributes}
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
	);
};
