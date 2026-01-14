import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TabPanel } from '@wordpress/components';
import { Icon, layout as layoutIcon, image, cog } from '@wordpress/icons';
import BackgroundSettingsPanel from '../../components/background/BackgroundSettingsPanel';

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

const CTA_TYPES = [
	{ label: __('CTA 1', 'codeweber-gutenberg-blocks'), value: 'cta-1' },
	{ label: __('CTA 2', 'codeweber-gutenberg-blocks'), value: 'cta-2' },
	{ label: __('CTA 3', 'codeweber-gutenberg-blocks'), value: 'cta-3' },
	{ label: __('CTA 4', 'codeweber-gutenberg-blocks'), value: 'cta-4' },
	{ label: __('CTA 5', 'codeweber-gutenberg-blocks'), value: 'cta-5' },
	{ label: __('CTA 6', 'codeweber-gutenberg-blocks'), value: 'cta-6' },
];

export const CTASidebar = ({ attributes, setAttributes }) => {
	const {
		ctaType,
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageId,
		backgroundImageUrl,
		backgroundImageSize,
		backgroundSize,
		backgroundOverlay,
		backgroundPatternUrl,
		sectionClass,
		containerClass,
		blockClass,
		blockId,
	} = attributes;

	const tabs = [
		{
			name: 'layout',
			title: (
				<TabIcon
					icon={layoutIcon}
					label={__('Layout', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'background',
			title: (
				<TabIcon
					icon={image}
					label={__('Background', 'codeweber-gutenberg-blocks')}
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
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody title={__('Layout', 'codeweber-gutenberg-blocks')}>
							<SelectControl
								label={__('CTA Template', 'codeweber-gutenberg-blocks')}
								value={ctaType}
								options={CTA_TYPES}
								onChange={(value) => setAttributes({ ctaType: value })}
							/>
						</PanelBody>
					)}

					{tab.name === 'background' && (
						<PanelBody>
							<BackgroundSettingsPanel
								attributes={attributes}
								setAttributes={setAttributes}
								allowVideo={false}
							/>
						</PanelBody>
					)}

					{tab.name === 'settings' && (
						<PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')}>
							{/* Дополнительные настройки можно добавить здесь */}
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};

