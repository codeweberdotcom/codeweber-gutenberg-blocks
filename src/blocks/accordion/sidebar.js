/**
 * Accordion Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	ButtonGroup,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { PostTypeTaxonomyControl } from '../../components/post-type-taxonomy/PostTypeTaxonomyControl';
import { PostSortControl } from '../../components/post-sort/PostSortControl';

export const AccordionSidebar = ({ attributes, setAttributes }) => {
	const {
		accordionStyle,
		allowMultiple,
		iconPosition,
		iconType,
		firstItemOpen,
		mode,
		postType,
		selectedTaxonomies,
		orderBy,
		order,
		theme,
	} = attributes;

	const handleStyleChange = (style) => {
		setAttributes({ accordionStyle: style });
	};

	const handleAllowMultipleChange = (value) => {
		setAttributes({ allowMultiple: value });
	};

	return (
		<PanelBody
			title={__('Accordion Settings', 'codeweber-gutenberg-blocks')}
			className="custom-panel-body"
		>
			{/* Mode Selection */}
			<div className="component-sidebar-title">
				<label>{__('Data Source', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{
						label: __('Custom', 'codeweber-gutenberg-blocks'),
						value: 'custom',
					},
					{
						label: __('Post', 'codeweber-gutenberg-blocks'),
						value: 'post',
					},
				].map((modeOption) => (
					<Button
						key={modeOption.value}
						isPrimary={(mode || 'custom') === modeOption.value}
						onClick={() =>
							setAttributes({ mode: modeOption.value })
						}
					>
						{modeOption.label}
					</Button>
				))}
			</div>

			{/* Post Type Selection - показываем только в режиме Post */}
			{mode === 'post' && (
				<>
					<div style={{ marginTop: '16px' }}>
						<PostTypeTaxonomyControl
							postType={postType || ''}
							selectedTaxonomies={selectedTaxonomies || {}}
							onPostTypeChange={(value) =>
								setAttributes({ postType: value })
							}
							onTaxonomyChange={(value) =>
								setAttributes({ selectedTaxonomies: value })
							}
							help={__(
								'Select the post type to generate accordion items from',
								'codeweber-gutenberg-blocks'
							)}
						/>
					</div>

					{/* Post Sort - показываем только в режиме Post */}
					<div style={{ marginTop: '16px' }}>
						<PostSortControl
							orderBy={orderBy || 'date'}
							order={order || 'desc'}
							onOrderByChange={(value) =>
								setAttributes({ orderBy: value })
							}
							onOrderChange={(value) =>
								setAttributes({ order: value })
							}
						/>
					</div>
				</>
			)}

			{/* Accordion Style */}
			<div className="component-sidebar-title">
				<label>
					{__('Accordion Style', 'codeweber-gutenberg-blocks')}
				</label>
			</div>
			<div className="accordion-style-controls button-group-sidebar_33">
				{[
					{
						label: __('Simple', 'codeweber-gutenberg-blocks'),
						value: 'simple',
					},
					{
						label: __('Card', 'codeweber-gutenberg-blocks'),
						value: 'background',
					},
					{
						label: __('Icon', 'codeweber-gutenberg-blocks'),
						value: 'icon',
					},
				].map((style) => (
					<Button
						key={style.value}
						isPrimary={accordionStyle === style.value}
						onClick={() => handleStyleChange(style.value)}
					>
						{style.label}
					</Button>
				))}
			</div>

			{/* Icon Position */}
			<div className="component-sidebar-title">
				<label>
					{__('Icon Position', 'codeweber-gutenberg-blocks')}
				</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{
						label: __('Left', 'codeweber-gutenberg-blocks'),
						value: 'left',
					},
					{
						label: __('Right', 'codeweber-gutenberg-blocks'),
						value: 'right',
					},
				].map((pos) => (
					<Button
						key={pos.value}
						isPrimary={(iconPosition || 'left') === pos.value}
						onClick={() =>
							setAttributes({ iconPosition: pos.value })
						}
					>
						{pos.label}
					</Button>
				))}
			</div>

			{/* Icon Type - показываем только если стиль не Icon */}
			{accordionStyle !== 'icon' && (
				<>
					<div className="component-sidebar-title">
						<label>
							{__('Icon Type', 'codeweber-gutenberg-blocks')}
						</label>
					</div>
					<div className="button-group-sidebar_33">
						{[
							{
								label: __(
									'Type 1',
									'codeweber-gutenberg-blocks'
								),
								value: 'type-1',
							},
							{
								label: __(
									'Type 2',
									'codeweber-gutenberg-blocks'
								),
								value: 'type-2',
							},
							{
								label: __(
									'Type 3',
									'codeweber-gutenberg-blocks'
								),
								value: 'type-3',
							},
						].map((type) => (
							<Button
								key={type.value}
								isPrimary={
									(iconType || 'type-1') === type.value
								}
								onClick={() =>
									setAttributes({ iconType: type.value })
								}
							>
								{type.label}
							</Button>
						))}
					</div>
				</>
			)}

			{/* Allow Multiple Open */}
			<ToggleControl
				label={__(
					'Allow Multiple Items Open',
					'codeweber-gutenberg-blocks'
				)}
				checked={allowMultiple}
				onChange={handleAllowMultipleChange}
				help={__(
					'When enabled, multiple accordion items can be open at the same time.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{/* First item open by default */}
			<ToggleControl
				label={__(
					'Open first item by default',
					'codeweber-gutenberg-blocks'
				)}
				checked={firstItemOpen}
				onChange={(value) => setAttributes({ firstItemOpen: value })}
				help={__(
					'When enabled, the first item is forced open (others closed).',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{/* Theme Selection */}
			<div
				className="component-sidebar-title"
				style={{ marginTop: '16px' }}
			>
				<label>{__('Theme', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<div className="button-group-sidebar_33">
				{[
					{
						label: __('Light', 'codeweber-gutenberg-blocks'),
						value: 'light',
					},
					{
						label: __('Dark', 'codeweber-gutenberg-blocks'),
						value: 'dark',
					},
				].map((themeOption) => (
					<Button
						key={themeOption.value}
						isPrimary={(theme || 'light') === themeOption.value}
						onClick={() =>
							setAttributes({ theme: themeOption.value })
						}
					>
						{themeOption.label}
					</Button>
				))}
			</div>
		</PanelBody>
	);
};
