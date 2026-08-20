/**
 * Switcher Sidebar Settings
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	BaseControl,
	ButtonGroup,
	Button,
	TextControl,
	ComboboxControl,
	SelectControl,
} from '@wordpress/components';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { colors } from '../../utilities/colors';

const STYLE_OPTIONS = [
	{ label: __('Pill', 'codeweber-gutenberg-blocks'), value: 'pill' },
	{
		label: __('Segmented', 'codeweber-gutenberg-blocks'),
		value: 'segmented',
	},
];

const SIZE_OPTIONS = [
	{ label: __('S', 'codeweber-gutenberg-blocks'), value: 'sm' },
	{ label: __('M', 'codeweber-gutenberg-blocks'), value: 'md' },
	{ label: __('L', 'codeweber-gutenberg-blocks'), value: 'lg' },
];

const ALIGN_OPTIONS = [
	{ label: __('Left', 'codeweber-gutenberg-blocks'), value: 'start' },
	{ label: __('Center', 'codeweber-gutenberg-blocks'), value: 'center' },
	{ label: __('Right', 'codeweber-gutenberg-blocks'), value: 'end' },
];

export const SwitcherSidebar = ({ attributes, setAttributes }) => {
	const {
		items,
		switchStyle,
		switchColor,
		switchSize,
		alignment,
		activeMode,
		activeIndex,
	} = attributes;

	const updateItem = (index, key, value) => {
		const next = items.map((item, i) =>
			i === index ? { ...item, [key]: value } : item
		);
		setAttributes({ items: next });
	};

	const addItem = () => {
		setAttributes({
			items: [
				...items,
				{
					id: `item-${items.length + 1}-${Math.random()
						.toString(36)
						.slice(2, 7)}`,
					label: __('New item', 'codeweber-gutenberg-blocks'),
					url: '',
				},
			],
		});
	};

	const removeItem = (index) => {
		const next = items.filter((item, i) => i !== index);
		setAttributes({
			items: next,
			// Keep the manual selection inside the shortened list.
			activeIndex: Math.min(activeIndex, Math.max(0, next.length - 1)),
		});
	};

	return (
		<>
			<PanelBody
				title={__('Items', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				{items.map((item, index) => (
					<div
						key={item.id || index}
						style={{
							marginBottom: '16px',
							paddingBottom: '12px',
							borderBottom: '1px solid #e0e0e0',
						}}
					>
						<TextControl
							label={__('Label', 'codeweber-gutenberg-blocks')}
							value={item.label || ''}
							onChange={(value) =>
								updateItem(index, 'label', value)
							}
						/>
						<TextControl
							label={__('URL', 'codeweber-gutenberg-blocks')}
							value={item.url || ''}
							placeholder="/business/"
							onChange={(value) =>
								updateItem(index, 'url', value)
							}
						/>
						{items.length > 2 && (
							<Button
								isDestructive
								variant="link"
								onClick={() => removeItem(index)}
							>
								{__('Remove', 'codeweber-gutenberg-blocks')}
							</Button>
						)}
					</div>
				))}
				<Button variant="secondary" onClick={addItem}>
					{__('Add item', 'codeweber-gutenberg-blocks')}
				</Button>
			</PanelBody>

			<PanelBody
				title={__('Switcher Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
			>
				<BaseControl
					id="cw-switcher-style"
					label={__('Style', 'codeweber-gutenberg-blocks')}
					__nextHasNoMarginBottom
				>
					<ButtonGroup>
						{STYLE_OPTIONS.map((option) => (
							<Button
								key={option.value}
								isPrimary={switchStyle === option.value}
								onClick={() =>
									setAttributes({ switchStyle: option.value })
								}
							>
								{option.label}
							</Button>
						))}
					</ButtonGroup>
				</BaseControl>

				<BaseControl
					id="cw-switcher-size"
					label={__('Size', 'codeweber-gutenberg-blocks')}
					__nextHasNoMarginBottom
				>
					<ButtonGroup>
						{SIZE_OPTIONS.map((option) => (
							<Button
								key={option.value}
								isPrimary={switchSize === option.value}
								onClick={() =>
									setAttributes({ switchSize: option.value })
								}
							>
								{option.label}
							</Button>
						))}
					</ButtonGroup>
				</BaseControl>

				<BaseControl
					id="cw-switcher-align"
					label={__('Alignment', 'codeweber-gutenberg-blocks')}
					__nextHasNoMarginBottom
				>
					<ButtonGroup>
						{ALIGN_OPTIONS.map((option) => (
							<Button
								key={option.value}
								isPrimary={alignment === option.value}
								onClick={() =>
									setAttributes({ alignment: option.value })
								}
							>
								{option.label}
							</Button>
						))}
					</ButtonGroup>
				</BaseControl>

				<div style={{ marginTop: '16px' }}>
					<ComboboxControl
						label={__('Color', 'codeweber-gutenberg-blocks')}
						value={switchColor}
						options={colors}
						onChange={(value) =>
							setAttributes({ switchColor: value || 'primary' })
						}
					/>
				</div>

				<SelectControl
					label={__('Active item', 'codeweber-gutenberg-blocks')}
					value={activeMode}
					options={[
						{
							label: __(
								'Match current page',
								'codeweber-gutenberg-blocks'
							),
							value: 'auto',
						},
						{
							label: __('Fixed', 'codeweber-gutenberg-blocks'),
							value: 'manual',
						},
					]}
					help={__(
						'Match current page — the item whose URL matches the page being viewed is highlighted.',
						'codeweber-gutenberg-blocks'
					)}
					onChange={(value) => setAttributes({ activeMode: value })}
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={
						'auto' === activeMode
							? __('Fallback item', 'codeweber-gutenberg-blocks')
							: __('Highlighted', 'codeweber-gutenberg-blocks')
					}
					value={String(activeIndex)}
					options={items.map((item, index) => ({
						label: item.label || `#${index + 1}`,
						value: String(index),
					}))}
					help={
						'auto' === activeMode
							? __(
									'Used when no URL matches the current page.',
									'codeweber-gutenberg-blocks'
								)
							: undefined
					}
					onChange={(value) =>
						setAttributes({ activeIndex: parseInt(value, 10) || 0 })
					}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				title={__('Block Settings', 'codeweber-gutenberg-blocks')}
				initialOpen={false}
				className="custom-panel-body"
			>
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
						idLabel: __('Block ID', 'codeweber-gutenberg-blocks'),
					}}
				/>
			</PanelBody>
		</>
	);
};

export default SwitcherSidebar;
