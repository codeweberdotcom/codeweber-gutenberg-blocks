/**
 * Dropcap Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { PanelBody, Button, SelectControl } from '@wordpress/components';
import { colors } from '../../utilities/colors';

export const DropcapSidebar = ({ attributes, setAttributes }) => {
	const { style, color, colorType, circleBgType } = attributes;

	const colorOptions = [
		{ label: __('Primary', 'codeweber-gutenberg-blocks'), value: 'primary' },
		{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
		{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
		{ label: __('White', 'codeweber-gutenberg-blocks'), value: 'white' },
		...colors
			.filter((c) =>
				['aqua', 'green', 'leaf', 'navy', 'orange', 'pink', 'purple', 'red', 'violet', 'yellow', 'fuchsia', 'sky', 'grape', 'blue', 'muted'].includes(c.value)
			)
			.map((c) => ({ label: c.label, value: c.value })),
	];

	return (
		<PanelBody
			title={__('Dropcap Settings', 'codeweber-gutenberg-blocks')}
			initialOpen={true}
		>
			<div className="component-sidebar-title" style={{ marginTop: '16px', marginBottom: '8px' }}>
				<label>{__('Style', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{ label: __('Simple', 'codeweber-gutenberg-blocks'), value: 'simple' },
					{ label: __('Colored', 'codeweber-gutenberg-blocks'), value: 'colored' },
					{ label: __('Circle', 'codeweber-gutenberg-blocks'), value: 'circle' },
				].map((opt) => (
					<Button
						key={opt.value}
						isPrimary={style === opt.value}
						onClick={() => setAttributes({ style: opt.value })}
					>
						{opt.label}
					</Button>
				))}
			</div>

			{/* Colors */}
			<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
				<label>{__('Colors', 'codeweber-gutenberg-blocks')}</label>
			</div>

			<div style={{ marginTop: '12px' }}>
				<label className="component-sidebar-title" style={{ display: 'block', marginBottom: '8px' }}>
					{__('Text color', 'codeweber-gutenberg-blocks')}
				</label>
				<SelectControl
					value={color || 'dark'}
					options={colorOptions}
					onChange={(value) => setAttributes({ color: value })}
				/>
				<div className="button-group-sidebar_50" style={{ marginTop: '8px' }}>
					{[
						{ label: __('Solid', 'codeweber-gutenberg-blocks'), value: 'solid' },
						{ label: __('Soft', 'codeweber-gutenberg-blocks'), value: 'soft' },
						{ label: __('Pale', 'codeweber-gutenberg-blocks'), value: 'pale' },
					].map((opt) => (
						<Button
							key={opt.value}
							isPrimary={(colorType || 'solid') === opt.value}
							onClick={() => setAttributes({ colorType: opt.value })}
						>
							{opt.label}
						</Button>
					))}
				</div>
			</div>

			{style === 'circle' && (
				<div style={{ marginTop: '16px' }}>
					<label className="component-sidebar-title" style={{ display: 'block', marginBottom: '8px' }}>
						{__('Circle background', 'codeweber-gutenberg-blocks')}
					</label>
					<div className="button-group-sidebar_50">
						{[
							{ label: __('Pale', 'codeweber-gutenberg-blocks'), value: 'pale' },
							{ label: __('Soft', 'codeweber-gutenberg-blocks'), value: 'soft' },
							{ label: __('Solid', 'codeweber-gutenberg-blocks'), value: 'solid' },
						].map((opt) => (
							<Button
								key={opt.value}
								isPrimary={(circleBgType || 'pale') === opt.value}
								onClick={() => setAttributes({ circleBgType: opt.value })}
							>
								{opt.label}
							</Button>
						))}
					</div>
				</div>
			)}
		</PanelBody>
	);
};
