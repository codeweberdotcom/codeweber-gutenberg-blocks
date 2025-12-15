/**
 * Lists Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { PostTypeTaxonomyControl } from '../../components/post-type-taxonomy/PostTypeTaxonomyControl';
import { PostSortControl } from '../../components/post-sort/PostSortControl';
import { IconPicker } from '../../components/icon/IconPicker';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { colors } from '../../utilities/colors';

export const ListsSidebar = ({ attributes, setAttributes }) => {
	const {
		mode,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		postType,
		selectedTaxonomies,
		enableLinks,
		postsPerPage,
		orderBy,
		order,
	} = attributes;

	const [iconPickerOpen, setIconPickerOpen] = useState(false);

	// Extract icon name from class (e.g., "uil uil-arrow-right" -> "arrow-right")
	const getIconName = (iconClass) => {
		if (!iconClass) return '';
		const match = iconClass.match(/uil-([^\s]+)/);
		return match ? match[1] : '';
	};

	return (
		<>
			<PanelBody
				title={__('Lists Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
				initialOpen={true}
			>
				{/* Mode Selection */}
				<div className="component-sidebar-title">
					<label>{__('Data Source', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-group-sidebar_33">
					{[
						{ label: __('Custom', 'codeweber-gutenberg-blocks'), value: 'custom' },
						{ label: __('Post', 'codeweber-gutenberg-blocks'), value: 'post' },
					].map((modeOption) => (
						<Button
							key={modeOption.value}
							isPrimary={(mode || 'custom') === modeOption.value}
							onClick={() => setAttributes({ mode: modeOption.value })}
						>
							{modeOption.label}
						</Button>
					))}
				</div>

				{/* Post Type Selection - показываем только в режиме Post */}
				{mode === 'post' && (
					<div style={{ marginTop: '16px' }}>
						<PostTypeTaxonomyControl
							postType={postType || ''}
							selectedTaxonomies={selectedTaxonomies || {}}
							onPostTypeChange={(value) => setAttributes({ postType: value })}
							onTaxonomyChange={(value) => setAttributes({ selectedTaxonomies: value })}
							help={__('Select the post type to generate list items from', 'codeweber-gutenberg-blocks')}
						/>
					</div>
				)}

				{/* Post Settings - только в режиме Post */}
				{mode === 'post' && (
					<>
						<div style={{ marginTop: '16px' }}>
							<PostSortControl
								orderBy={orderBy || 'date'}
								order={order || 'desc'}
								onOrderByChange={(value) => setAttributes({ orderBy: value })}
								onOrderChange={(value) => setAttributes({ order: value })}
							/>
						</div>

						<div style={{ marginTop: '16px' }}>
							<RangeControl
								label={__('Posts Per Page', 'codeweber-gutenberg-blocks')}
								value={postsPerPage || 10}
								onChange={(value) => setAttributes({ postsPerPage: value })}
								min={1}
								max={50}
								initialPosition={10}
								help={__('Number of posts to display', 'codeweber-gutenberg-blocks')}
							/>
						</div>

						<div style={{ marginTop: '16px' }}>
							<ToggleControl
								label={__('Enable Links', 'codeweber-gutenberg-blocks')}
								checked={enableLinks || false}
								onChange={(value) => setAttributes({ enableLinks: value })}
								help={__('Enable links to post pages', 'codeweber-gutenberg-blocks')}
							/>
						</div>
					</>
				)}

				{/* List Type */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('List Type', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-group-sidebar_50">
					{[
						{ label: __('Unordered', 'codeweber-gutenberg-blocks'), value: 'unordered' },
						{ label: __('Icon', 'codeweber-gutenberg-blocks'), value: 'icon' },
					].map((type) => (
						<Button
							key={type.value}
							isPrimary={(listType || 'unordered') === type.value}
							onClick={() => setAttributes({ listType: type.value })}
						>
							{type.label}
						</Button>
					))}
				</div>

				{/* Bullet Color */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('Bullet Color', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={bulletColor || 'primary'}
					options={[
						{ label: __('Primary', 'codeweber-gutenberg-blocks'), value: 'primary' },
						{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
						{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
						{ label: __('White', 'codeweber-gutenberg-blocks'), value: 'white' },
					]}
					onChange={(value) => setAttributes({ bulletColor: value })}
				/>

				{/* Bullet Background - только для icon-list */}
				{listType === 'icon' && (
					<div style={{ marginTop: '16px' }}>
						<ToggleControl
							label={__('Bullet Background', 'codeweber-gutenberg-blocks')}
							checked={bulletBg || false}
							onChange={(value) => setAttributes({ bulletBg: value })}
							help={__('Enable background color for bullet icons', 'codeweber-gutenberg-blocks')}
						/>
					</div>
				)}

				{/* Icon Class - только для icon-list */}
				{listType === 'icon' && (
					<div style={{ marginTop: '16px' }}>
						<div className="component-sidebar-title">
							<label>{__('Icon', 'codeweber-gutenberg-blocks')}</label>
						</div>
						<Button
							isPrimary
							onClick={() => setIconPickerOpen(true)}
							style={{ width: '100%', marginBottom: '12px' }}
						>
							{__('Select Icon', 'codeweber-gutenberg-blocks')}
						</Button>
						{iconClass && (
							<div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f1', borderRadius: '4px', fontSize: '12px' }}>
								<strong>{__('Current icon:', 'codeweber-gutenberg-blocks')}</strong> {iconClass}
							</div>
						)}
						<IconPicker
							isOpen={iconPickerOpen}
							onClose={() => setIconPickerOpen(false)}
							onSelect={(result) => {
								const iconClass = result.iconName ? `uil uil-${result.iconName}` : '';
								setAttributes({ iconClass });
							}}
							selectedIcon={getIconName(iconClass)}
							selectedType="font"
							initialTab="font"
							allowFont={true}
							allowSvgLineal={false}
							allowSvgSolid={false}
						/>
					</div>
				)}

				{/* Text Color */}
				<div className="component-sidebar-title" style={{ marginTop: '16px' }}>
					<label>{__('Text Color', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<SelectControl
					value={textColor || ''}
					options={[
						{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
						...colors.map(color => ({
							label: color.label,
							value: color.value,
						})),
					]}
					onChange={(value) => setAttributes({ textColor: value })}
				/>
			</PanelBody>

			{/* Block Meta Fields */}
			<PanelBody
				title={__('Block Settings', 'codeweber-gutenberg-blocks')}
				className="custom-panel-body"
				initialOpen={false}
			>
				<BlockMetaFields
					attributes={attributes}
					setAttributes={setAttributes}
					fieldKeys={{
						classKey: 'listClass',
						dataKey: 'listData',
						idKey: 'listId',
					}}
				/>
			</PanelBody>
		</>
	);
};








