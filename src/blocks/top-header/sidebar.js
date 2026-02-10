/**
 * Top Header Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl, CheckboxControl } from '@wordpress/components';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { colors } from '../../utilities/colors';

const phoneOptions = [
	{ label: __('Phone 01', 'codeweber-gutenberg-blocks'), value: 'phone_01' },
	{ label: __('Phone 02', 'codeweber-gutenberg-blocks'), value: 'phone_02' },
	{ label: __('Phone 03', 'codeweber-gutenberg-blocks'), value: 'phone_03' },
	{ label: __('Phone 04', 'codeweber-gutenberg-blocks'), value: 'phone_04' },
	{ label: __('Phone 05', 'codeweber-gutenberg-blocks'), value: 'phone_05' },
];

const bgOptions = colors.map((c) => ({
	label: __(c.label, 'codeweber-gutenberg-blocks'),
	value: c.value,
}));

const textOptions = colors.map((c) => ({
	label: __(c.label, 'codeweber-gutenberg-blocks'),
	value: c.value,
}));

export const TopHeaderSidebar = ({ attributes, setAttributes }) => {
	const {
		showAddress = true,
		showEmail = true,
		showPhone = true,
		phones = ['phone_01'],
		backgroundColor = 'primary',
		textColor = 'white',
	} = attributes;

	return (
		<>
			<PanelBody title={__('Top Header Items', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<ToggleControl
					label={__('Show Address', 'codeweber-gutenberg-blocks')}
					checked={showAddress}
					onChange={(v) => setAttributes({ showAddress: v })}
				/>
				<ToggleControl
					label={__('Show Email', 'codeweber-gutenberg-blocks')}
					checked={showEmail}
					onChange={(v) => setAttributes({ showEmail: v })}
				/>
				<ToggleControl
					label={__('Show Phone', 'codeweber-gutenberg-blocks')}
					checked={showPhone}
					onChange={(v) => setAttributes({ showPhone: v })}
				/>
				{showPhone && (
					<div style={{ marginTop: 12 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
							{__('Phones', 'codeweber-gutenberg-blocks')}
						</label>
						{phoneOptions.map((opt) => (
							<CheckboxControl
								key={opt.value}
								label={opt.label}
								checked={(phones || []).includes(opt.value)}
								onChange={(checked) => {
									const next = checked
										? [...(phones || []), opt.value]
										: (phones || []).filter((p) => p !== opt.value);
									setAttributes({ phones: next.length ? next : ['phone_01'] });
								}}
							/>
						))}
					</div>
				)}
			</PanelBody>
			<PanelBody title={__('Styling', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Background Color', 'codeweber-gutenberg-blocks')}
					value={backgroundColor}
					options={bgOptions}
					onChange={(v) => setAttributes({ backgroundColor: v })}
				/>
				<SelectControl
					label={__('Text Color', 'codeweber-gutenberg-blocks')}
					value={textColor}
					options={textOptions}
					onChange={(v) => setAttributes({ textColor: v })}
				/>
			</PanelBody>
			<PanelBody title={__('Block Settings', 'codeweber-gutenberg-blocks')} initialOpen={false}>
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
		</>
	);
};
