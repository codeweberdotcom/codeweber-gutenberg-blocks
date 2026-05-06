/**
 * Tab Panel Block - Edit Component
 */

import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/image',
	'core/list',
	'core/quote',
	'core/code',
	'core/preformatted',
	'core/table',
	'core/columns',
	'core/group',
	'core/spacer',
	'core/separator',
	'core/embed',
	'core/video',
	'core/audio',
	'core/file',
	'core/gallery',
	'core/cover',
	'core/media-text',
	'core/buttons',
	'core/shortcode',
	'codeweber-blocks/accordion',
	'codeweber-blocks/button',
	'codeweber-blocks/section',
	'codeweber-blocks/column',
	'codeweber-blocks/columns',
	'codeweber-blocks/heading-subtitle',
	'codeweber-blocks/icon',
	'codeweber-blocks/lists',
	'codeweber-blocks/media',
	'codeweber-blocks/paragraph',
	'codeweber-blocks/card',
	'codeweber-blocks/feature',
	'codeweber-blocks/image-simple',
	'codeweber-blocks/post-grid',
	'codeweber-blocks/tabs',
];

const TabPanelEdit = ({ attributes, setAttributes }) => {
	const { tabTitle, tabIcon, panelId } = attributes;

	// Generate stable panelId once
	useEffect(() => {
		if (!panelId) {
			const randomId = Math.random().toString(36).substr(2, 9);
			setAttributes({ panelId: `panel-${randomId}` });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const blockProps = useBlockProps({ className: 'cwgb-tab-panel-editor' });

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Tab Settings', 'codeweber-gutenberg-blocks')}
					initialOpen
				>
					<TextControl
						label={__('Tab Title', 'codeweber-gutenberg-blocks')}
						value={tabTitle}
						onChange={(value) => setAttributes({ tabTitle: value })}
					/>
					<TextControl
						label={__('Tab Icon Class', 'codeweber-gutenberg-blocks')}
						value={tabIcon}
						onChange={(value) => setAttributes({ tabIcon: value })}
						placeholder="uil uil-star"
						help={__('Optional icon class, e.g. uil uil-star', 'codeweber-gutenberg-blocks')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="cwgb-tab-panel-label">
					{tabIcon && <i className={tabIcon} />}
					<span className="cwgb-tab-panel-label-text">
						{tabTitle || __('Tab', 'codeweber-gutenberg-blocks')}
					</span>
				</div>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					templateLock={false}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>
		</>
	);
};

export default TabPanelEdit;
