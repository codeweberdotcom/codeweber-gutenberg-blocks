/**
 * Widget Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
} from '@wordpress/components';
import { Icon, typography, cog } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { HeadingContentControl } from '../../components/heading/HeadingContentControl';
import { HeadingTypographyControl } from '../../components/heading/HeadingTypographyControl';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span 
		title={label}
		style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
	>
		<Icon icon={icon} size={20} />
	</span>
);

export const WidgetSidebar = ({ attributes, setAttributes }) => {
	// Define tabs
	const tabs = [
		{ name: 'title', title: <TabIcon icon={typography} label={__('Title', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{/* TITLE TAB */}
					{tab.name === 'title' && (
						<PanelBody title={__('Title Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<HeadingContentControl
								attributes={{
									...attributes,
									enableSubtitle: false,
									enableText: false,
								}}
								setAttributes={setAttributes}
								hideSubtitle={true}
								hideText={true}
								hideTitle={true}
							/>
							<div style={{ marginTop: '16px' }}>
								<HeadingTypographyControl
									attributes={attributes}
									setAttributes={setAttributes}
									hideSubtitle={true}
									hideText={true}
								/>
							</div>
						</PanelBody>
					)}

					{/* SETTINGS TAB */}
					{tab.name === 'settings' && (
						<PanelBody title={__('Block Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
								fieldKeys={{
									classKey: 'widgetClass',
									dataKey: 'widgetData',
									idKey: 'widgetId',
								}}
							/>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};

