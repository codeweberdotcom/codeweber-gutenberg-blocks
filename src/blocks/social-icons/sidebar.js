/**
 * Social Icons Block - Sidebar
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ComboboxControl,
	Button,
	CheckboxControl,
	Spinner,
} from '@wordpress/components';
import { fontIconsSocial } from '../../utilities/font_icon_social';
import { colors } from '../../utilities/colors';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

const STYLE_OPTIONS = [
	{ value: 'type1', label: __('Colored circles', 'codeweber-gutenberg-blocks') },
	{ value: 'type2', label: __('Muted icons', 'codeweber-gutenberg-blocks') },
	{ value: 'type3', label: __('Colored icons', 'codeweber-gutenberg-blocks') },
	{ value: 'type4', label: __('White icons', 'codeweber-gutenberg-blocks') },
	{ value: 'type5', label: __('Dark circles', 'codeweber-gutenberg-blocks') },
	{ value: 'type6', label: __('Wide with labels', 'codeweber-gutenberg-blocks') },
	{ value: 'type7', label: __('Colored wide', 'codeweber-gutenberg-blocks') },
	{ value: 'type8', label: __('Custom color/style', 'codeweber-gutenberg-blocks') },
	{ value: 'type9', label: __('Outline primary', 'codeweber-gutenberg-blocks') },
];

const SIZE_OPTIONS = [
	{ label: 'ExSm', value: 'xs' },
	{ label: 'Sm', value: 'sm' },
	{ label: 'Md', value: 'md' },
	{ label: 'Lg', value: 'lg' },
	{ label: 'ExLg', value: 'elg' },
];

const DATA_SOURCE_OPTIONS = [
	{ value: 'theme', label: __('From theme settings', 'codeweber-gutenberg-blocks') },
	{ value: 'custom', label: __('Custom links', 'codeweber-gutenberg-blocks') },
];

export const SocialIconsSidebar = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		styleType,
		size,
		buttonColor,
		buttonStyle,
		buttonForm,
		navClass,
		themeEnabledSlugs = [],
		items,
	} = attributes;

	const [themeSocialsList, setThemeSocialsList] = useState([]);
	const [themeSocialsLoading, setThemeSocialsLoading] = useState(false);

	// Fetch theme socials when in theme mode
	useEffect(() => {
		if (dataSource !== 'theme') return;
		setThemeSocialsLoading(true);
		apiFetch({ path: '/codeweber-gutenberg-blocks/v1/social-icons-list' })
			.then((res) => {
				if (res && Array.isArray(res.socials)) {
					setThemeSocialsList(res.socials);
				} else {
					setThemeSocialsList([]);
				}
			})
			.catch(() => setThemeSocialsList([]))
			.finally(() => setThemeSocialsLoading(false));
	}, [dataSource]);

	const allSlugs = themeSocialsList.map((s) => s.slug);
	const isThemeSlugEnabled = (slug) =>
		!themeEnabledSlugs || themeEnabledSlugs.length === 0 || themeEnabledSlugs.includes(slug);
	const toggleThemeSlug = (slug) => {
		const enabled = isThemeSlugEnabled(slug);
		let next;
		if (enabled) {
			next = (themeEnabledSlugs.length === 0 ? allSlugs : themeEnabledSlugs).filter((s) => s !== slug);
			setAttributes({ themeEnabledSlugs: next.length === allSlugs.length ? [] : next });
		} else {
			next = [...(themeEnabledSlugs || []), slug];
			setAttributes({ themeEnabledSlugs: next.length === allSlugs.length ? [] : next });
		}
	};

	const updateItem = (index, updates) => {
		const newItems = [...items];
		newItems[index] = { ...(newItems[index] || {}), ...updates };
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const id = 'item-' + Date.now();
		setAttributes({
			items: [...items, { id, icon: 'facebook-f', url: '#', label: 'Facebook' }],
		});
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	return (
		<>
			<PanelBody title={__('Social Icons', 'codeweber-gutenberg-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Data source', 'codeweber-gutenberg-blocks')}
					value={dataSource}
					options={DATA_SOURCE_OPTIONS}
					onChange={(value) => setAttributes({ dataSource: value })}
				/>

				<SelectControl
					label={__('Style', 'codeweber-gutenberg-blocks')}
					value={styleType}
					options={STYLE_OPTIONS}
					onChange={(value) => setAttributes({ styleType: value })}
				/>

				<div className="component-sidebar-title">
					<label>{__('Size', 'codeweber-gutenberg-blocks')}</label>
				</div>
				<div className="button-size-controls button-group-sidebar_33">
					{SIZE_OPTIONS.map((opt) => (
						<Button
							key={opt.value}
							isPrimary={size === opt.value}
							onClick={() => setAttributes({ size: opt.value })}
						>
							{opt.label}
						</Button>
					))}
				</div>

				{(styleType === 'type8' || styleType === 'type9') && (
					<>
						<SelectControl
							label={__('Button color', 'codeweber-gutenberg-blocks')}
							value={buttonColor}
							options={colors}
							onChange={(value) => setAttributes({ buttonColor: value })}
						/>
						<SelectControl
							label={__('Button style', 'codeweber-gutenberg-blocks')}
							value={buttonStyle}
							options={[
								{ value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
								{ value: 'outline', label: __('Outline', 'codeweber-gutenberg-blocks') },
							]}
							onChange={(value) => setAttributes({ buttonStyle: value })}
						/>
					</>
				)}

				<SelectControl
					label={__('Button form', 'codeweber-gutenberg-blocks')}
					value={buttonForm}
					options={[
						{ value: 'circle', label: __('Circle', 'codeweber-gutenberg-blocks') },
						{ value: 'block', label: __('Block', 'codeweber-gutenberg-blocks') },
					]}
					onChange={(value) => setAttributes({ buttonForm: value })}
				/>

				<TextControl
					label={__('Nav class', 'codeweber-gutenberg-blocks')}
					value={navClass}
					placeholder="gap-3"
					onChange={(value) => setAttributes({ navClass: value })}
				/>

				{dataSource === 'theme' && (
					<>
						<div className="component-sidebar-title" style={{ marginTop: 12 }}>
							<label>{__('Show social networks', 'codeweber-gutenberg-blocks')}</label>
						</div>
						{themeSocialsLoading ? (
							<p style={{ margin: '8px 0' }}>
								<Spinner /> {__('Loading…', 'codeweber-gutenberg-blocks')}
							</p>
						) : themeSocialsList.length === 0 ? (
							<p style={{ margin: '8px 0', color: '#757575', fontSize: 12 }}>
								{__('No social links in theme settings or theme not active.', 'codeweber-gutenberg-blocks')}
							</p>
						) : (
							<div style={{ marginTop: 8 }}>
								{themeSocialsList.map((item) => (
									<CheckboxControl
										key={item.slug}
										label={item.label}
										checked={isThemeSlugEnabled(item.slug)}
										onChange={() => toggleThemeSlug(item.slug)}
										style={{ marginBottom: 4 }}
									/>
								))}
								<p style={{ marginTop: 8, color: '#757575', fontSize: 11 }}>
									{__('Uncheck to hide a network in this block. Empty selection = show all.', 'codeweber-gutenberg-blocks')}
								</p>
							</div>
						)}
					</>
				)}

				{dataSource === 'custom' && (
					<>
						<div className="component-sidebar-title" style={{ marginTop: 12 }}>
							<label>{__('Links', 'codeweber-gutenberg-blocks')}</label>
						</div>
						{items.map((item, index) => (
							<div
								key={item.id}
								style={{
									border: '1px solid #ddd',
									padding: 10,
									marginBottom: 8,
									borderRadius: 4,
								}}
							>
								<ComboboxControl
									label={__('Icon', 'codeweber-gutenberg-blocks')}
									value={item.icon || 'link'}
									options={fontIconsSocial}
									onChange={(value) => updateItem(index, { icon: value })}
								/>
								<TextControl
									label={__('URL', 'codeweber-gutenberg-blocks')}
									value={item.url || ''}
									onChange={(value) => updateItem(index, { url: value })}
								/>
								<TextControl
									label={__('Label', 'codeweber-gutenberg-blocks')}
									value={item.label || ''}
									onChange={(value) => updateItem(index, { label: value })}
								/>
								<Button
									isDestructive
									isSmall
									onClick={() => removeItem(index)}
									style={{ marginTop: 4 }}
								>
									{__('Remove', 'codeweber-gutenberg-blocks')}
								</Button>
							</div>
						))}
						<Button isSecondary isSmall onClick={addItem} style={{ marginTop: 4 }}>
							{__('Add link', 'codeweber-gutenberg-blocks')}
						</Button>
					</>
				)}
			</PanelBody>

			<PanelBody title={__('Block', 'codeweber-gutenberg-blocks')} initialOpen={false}>
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
