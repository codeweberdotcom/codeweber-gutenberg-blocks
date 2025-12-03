import { __ } from '@wordpress/i18n';
import { TabPanel, PanelBody } from '@wordpress/components';
import { symbol, layout, brush, image as imageIcon, cog } from '@wordpress/icons';
import { ImageControl } from '../../components/image/ImageControl';
import { LayoutControl } from './controls/LayoutControl';
import { EffectsControl } from './controls/EffectsControl';
import { LightboxControl } from './controls/LightboxControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

export const ImageSidebar = ({ attributes, setAttributes }) => {
	return (
		<TabPanel
			className="cwgb-tab-panel"
			activeClass="is-active"
			tabs={[
				{
					name: 'images',
					title: __('Images', 'codeweber-blocks'),
					icon: imageIcon,
					className: 'cwgb-tab',
				},
				{
					name: 'layout',
					title: __('Layout', 'codeweber-blocks'),
					icon: layout,
					className: 'cwgb-tab',
				},
				{
					name: 'effects',
					title: __('Effects', 'codeweber-blocks'),
					icon: brush,
					className: 'cwgb-tab',
				},
				{
					name: 'lightbox',
					title: __('Lightbox', 'codeweber-blocks'),
					icon: symbol,
					className: 'cwgb-tab',
				},
				{
					name: 'settings',
					title: __('Settings', 'codeweber-blocks'),
					icon: cog,
					className: 'cwgb-tab',
				},
			]}
		>
			{(tab) => {
				if (tab.name === 'images') {
					return (
						<PanelBody>
							<ImageControl
								images={attributes.images}
								setAttributes={setAttributes}
							/>
						</PanelBody>
					);
				}

				if (tab.name === 'layout') {
					return (
						<PanelBody>
							<LayoutControl
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</PanelBody>
					);
				}

				if (tab.name === 'effects') {
					return (
						<PanelBody>
							<EffectsControl
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</PanelBody>
					);
				}

				if (tab.name === 'lightbox') {
					return (
						<PanelBody>
							<LightboxControl
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</PanelBody>
					);
				}

				if (tab.name === 'settings') {
					return (
						<PanelBody>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
								fieldKeys={{
									classKey: 'blockClass',
									dataKey: 'blockData',
									idKey: 'blockId',
								}}
							/>
						</PanelBody>
					);
				}

				return null;
			}}
		</TabPanel>
	);
};

