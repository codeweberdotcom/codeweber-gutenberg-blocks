/**
 * Tabs Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

export const TabsSidebar = ({ attributes, setAttributes }) => {
	const { tabStyle, tabsClass, tabsData, tabsId } = attributes;

	const handleStyleChange = (style) => {
		setAttributes({ tabStyle: style });
	};

	return (
		<>
			<PanelBody
				title={__('Tabs Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				{/* Tab Style Selection */}
				<div className="component-sidebar-title">
					<label>{__('Tab Style', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<ButtonGroup>
					{[
						{ label: __('Basic', 'codeweber-gutenberg-blocks'), value: 'basic' },
						{ label: __('Pills', 'codeweber-gutenberg-blocks'), value: 'pills' },
					].map((styleOption) => (
						<Button
							key={styleOption.value}
							isPrimary={tabStyle === styleOption.value}
							onClick={() => handleStyleChange(styleOption.value)}
						>
							{styleOption.label}
						</Button>
					))}
				</ButtonGroup>
			</PanelBody>

			{/* Block Meta Fields */}
			<BlockMetaFields
				attributes={attributes}
				setAttributes={setAttributes}
				blockId={tabsId}
				blockIdLabel={__('Tabs ID', 'codeweber-gutenberg-blocks')}
				blockClass={tabsClass}
				blockClassLabel={__('Tabs Class', 'codeweber-gutenberg-blocks')}
				blockData={tabsData}
				blockDataLabel={__('Tabs Data', 'codeweber-gutenberg-blocks')}
			/>
		</>
	);
};
