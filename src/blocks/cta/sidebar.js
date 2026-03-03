import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TabPanel } from '@wordpress/components';
import { Icon, layout as layoutIcon, cog } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

const TabIcon = ({ icon, label }) => (
	<span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Icon icon={icon} size={20} />
	</span>
);

const CTA_TYPES = [
	{ label: __('CTA 1', 'codeweber-gutenberg-blocks'), value: 'cta-1' },
	{ label: __('CTA 2', 'codeweber-gutenberg-blocks'), value: 'cta-2' },
	{ label: __('CTA 3', 'codeweber-gutenberg-blocks'), value: 'cta-3' },
];

export const CTASidebar = ({ attributes, setAttributes }) => {
	const { ctaType, ctaTheme, ctaAlign, blockClass, blockId } = attributes;

	const tabs = [
		{
			name: 'layout',
			title: <TabIcon icon={layoutIcon} label={__('Layout', 'codeweber-gutenberg-blocks')} />,
		},
		{
			name: 'settings',
			title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} />,
		},
	];

	return (
		<TabPanel tabs={tabs} initialTabName="layout">
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody title={__('Layout', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('CTA Template', 'codeweber-gutenberg-blocks')}
								value={ctaType}
								options={CTA_TYPES}
								onChange={(value) => {
									const attrs = { ctaType: value };
									if (value === 'cta-3') attrs.ctaTheme = 'light';
									setAttributes(attrs);
								}}
							/>
							<SelectControl
								label={__('Тема', 'codeweber-gutenberg-blocks')}
								value={ctaTheme || 'dark'}
								options={[
									{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
									{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
								]}
								onChange={(value) => setAttributes({ ctaTheme: value })}
							/>
							<SelectControl
								label={__('Выравнивание текста', 'codeweber-gutenberg-blocks')}
								value={ctaAlign || 'center'}
								options={[
									{ label: __('Left', 'codeweber-gutenberg-blocks'), value: 'left' },
									{ label: __('Center', 'codeweber-gutenberg-blocks'), value: 'center' },
									{ label: __('Right', 'codeweber-gutenberg-blocks'), value: 'right' },
								]}
								onChange={(value) => setAttributes({ ctaAlign: value })}
							/>
						</PanelBody>
					)}
					{tab.name === 'settings' && (
						<PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')}>
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
	);
};
