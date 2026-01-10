/**
 * Logo Block - Sidebar Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TextControl,
	BaseControl,
	ToggleControl,
	TabPanel,
} from '@wordpress/components';
import { Icon, cog, siteLogo, arrowRight } from '@wordpress/icons';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { AnimationControl } from '../../components/animation/Animation';

export const LogoSidebar = ({ attributes, setAttributes }) => {
	const { logoType, logoSize, enableLink, logoUrl } = attributes;

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

	const tabs = [
		{
			name: 'logo',
			title: (
				<TabIcon
					icon={siteLogo}
					label={__('Logo', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'animation',
			title: (
				<TabIcon
					icon={arrowRight}
					label={__('Animation', 'codeweber-gutenberg-blocks')}
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
					{tab.name === 'logo' && (
						<PanelBody
							title={__(
								'Logo Settings',
								'codeweber-gutenberg-blocks'
							)}
							initialOpen={true}
						>
							<SelectControl
								label={__(
									'Logo Type',
									'codeweber-gutenberg-blocks'
								)}
								value={logoType}
								options={[
									{
										label: __(
											'Both (Light & Dark)',
											'codeweber-gutenberg-blocks'
										),
										value: 'both',
									},
									{
										label: __(
											'Light',
											'codeweber-gutenberg-blocks'
										),
										value: 'light',
									},
									{
										label: __(
											'Dark',
											'codeweber-gutenberg-blocks'
										),
										value: 'dark',
									},
								]}
								onChange={(value) =>
									setAttributes({ logoType: value })
								}
								help={__(
									'Select logo variant: both shows light/dark based on theme, light or dark shows specific variant.',
									'codeweber-gutenberg-blocks'
								)}
							/>

							<BaseControl
								label={__(
									'Logo Size',
									'codeweber-gutenberg-blocks'
								)}
								help={__(
									'Set logo size (e.g., 150px, 200px, 50%, auto). Leave empty for default size.',
									'codeweber-gutenberg-blocks'
								)}
							>
								<TextControl
									value={logoSize}
									onChange={(value) =>
										setAttributes({ logoSize: value })
									}
									placeholder={__(
										'e.g., 150px',
										'codeweber-gutenberg-blocks'
									)}
								/>
							</BaseControl>

							<ToggleControl
								label={__(
									'Enable Link',
									'codeweber-gutenberg-blocks'
								)}
								help={__(
									'Wrap logo in a link (like in header)',
									'codeweber-gutenberg-blocks'
								)}
								checked={enableLink}
								onChange={(value) =>
									setAttributes({ enableLink: value })
								}
								__nextHasNoMarginBottom
							/>

							{enableLink && (
								<TextControl
									label={__(
										'Link URL',
										'codeweber-gutenberg-blocks'
									)}
									value={logoUrl}
									onChange={(value) =>
										setAttributes({ logoUrl: value })
									}
									placeholder={__(
										'e.g., / or https://example.com',
										'codeweber-gutenberg-blocks'
									)}
									help={__(
										'Leave empty to use home URL',
										'codeweber-gutenberg-blocks'
									)}
								/>
							)}
						</PanelBody>
					)}

					{tab.name === 'animation' && (
						<div style={{ padding: '16px' }}>
							<AnimationControl
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						</div>
					)}

					{tab.name === 'settings' && (
						<div style={{ padding: '16px' }}>
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
						</div>
					)}
				</>
			)}
		</TabPanel>
	);
};
