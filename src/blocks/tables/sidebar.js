/**
 * Tables Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export const TablesSidebar = ({ attributes, setAttributes }) => {
	const {
		tableDark,
		tableStriped,
		tableBordered,
		tableBorderless,
		tableHover,
		responsive,
	} = attributes;

	return (
		<>
			<PanelBody
				title={__('Table Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				{/* Table Style Modifiers - можно комбинировать */}
				<div className="component-sidebar-title">
					<label>
						{__('Table classes', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<ToggleControl
					label={__('table-dark', 'codeweber-gutenberg-blocks')}
					checked={tableDark === true}
					onChange={(v) => setAttributes({ tableDark: v })}
				/>
				<ToggleControl
					label={__('table-striped', 'codeweber-gutenberg-blocks')}
					checked={tableStriped === true}
					onChange={(v) => setAttributes({ tableStriped: v })}
				/>
				<ToggleControl
					label={__('table-bordered', 'codeweber-gutenberg-blocks')}
					checked={tableBordered === true}
					onChange={(v) => setAttributes({ tableBordered: v })}
				/>
				<ToggleControl
					label={__('table-borderless', 'codeweber-gutenberg-blocks')}
					checked={tableBorderless === true}
					onChange={(v) => setAttributes({ tableBorderless: v })}
				/>
				<ToggleControl
					label={__('table-hover', 'codeweber-gutenberg-blocks')}
					checked={tableHover === true}
					onChange={(v) => setAttributes({ tableHover: v })}
				/>

				{/* Responsive Toggle */}
				<div style={{ marginTop: '16px' }}>
					<ToggleControl
						label={__('Responsive', 'codeweber-gutenberg-blocks')}
						help={__(
							'Wrap table in table-responsive for horizontal scroll on small screens.',
							'codeweber-gutenberg-blocks'
						)}
						checked={responsive === true}
						onChange={(enabled) =>
							setAttributes({ responsive: enabled })
						}
					/>
				</div>
			</PanelBody>
		</>
	);
};
