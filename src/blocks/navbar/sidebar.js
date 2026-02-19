import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	TextControl,
	TextareaControl,
	ToggleControl,
	RangeControl,
	ButtonGroup,
	Button,
	CheckboxControl,
	Spinner,
} from '@wordpress/components';
import { chevronUp, chevronDown } from '@wordpress/icons';
import { colors } from '../../utilities/colors';

/** Default mobile menu (offcanvas) elements — same set as Header Widgets "Info in offcanvas" */
const DEFAULT_MOBILE_MENU_ELEMENTS = [
	{ id: 'description', label: __('Description', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'phones', label: __('Phones', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'email', label: __('Email', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'map', label: __('Map', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'socials', label: __('Socials', 'codeweber-gutenberg-blocks'), enabled: true },
	{ id: 'menu', label: __('Menu', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'actual_address', label: __('Address', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'legal_address', label: __('Legal address', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'requisites', label: __('Requisites', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_1', label: __('Widget 1', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_2', label: __('Widget 2', 'codeweber-gutenberg-blocks'), enabled: false },
	{ id: 'widget_offcanvas_3', label: __('Widget 3', 'codeweber-gutenberg-blocks'), enabled: false },
];

const getMobileMenuElements = (attributes) => {
	const saved = Array.isArray(attributes.mobileMenuElements) ? attributes.mobileMenuElements : [];
	if (saved.length === 0) {
		return DEFAULT_MOBILE_MENU_ELEMENTS.map((el) => ({ ...el }));
	}
	const list = saved.map((s) => {
		const d = DEFAULT_MOBILE_MENU_ELEMENTS.find((x) => String(x.id || '').toLowerCase() === String(s.id || '').toLowerCase());
		return { id: s.id, label: d ? d.label : (s.label || s.id), enabled: !!s.enabled };
	});
	const ids = new Set(list.map((el) => String(el.id || '').toLowerCase()));
	DEFAULT_MOBILE_MENU_ELEMENTS.forEach((d) => {
		if (!ids.has(String(d.id || '').toLowerCase())) list.push({ ...d });
	});
	return list;
};
const NAVBAR_TYPES = [
	{ label: __('Navbar 1 - Classic (Center Nav)', 'codeweber-gutenberg-blocks'), value: 'navbar-1' },
	{ label: __('Navbar 2 - Classic (Right Nav)', 'codeweber-gutenberg-blocks'), value: 'navbar-2' },
	{ label: __('Navbar 3 - Center Logo', 'codeweber-gutenberg-blocks'), value: 'navbar-3' },
	{ label: __('Navbar 4 - Fancy', 'codeweber-gutenberg-blocks'), value: 'navbar-4' },
	{ label: __('Navbar 5 - Fancy (Center Nav)', 'codeweber-gutenberg-blocks'), value: 'navbar-5' },
	{ label: __('Navbar 6 - Fancy Center Logo', 'codeweber-gutenberg-blocks'), value: 'navbar-6' },
	{ label: __('Navbar 7 - Extended', 'codeweber-gutenberg-blocks'), value: 'navbar-7' },
	{ label: __('Navbar 8 - Extended Center Logo', 'codeweber-gutenberg-blocks'), value: 'navbar-8' },
];

const MENU_LOCATION_OPTIONS = [
	{ label: __('Theme default (header_1)', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Header Menu 1', 'codeweber-gutenberg-blocks'), value: 'header_1' },
	{ label: __('Header Menu', 'codeweber-gutenberg-blocks'), value: 'header' },
	{ label: __('Offcanvas Menu', 'codeweber-gutenberg-blocks'), value: 'offcanvas' },
	{ label: __('Footer Menu', 'codeweber-gutenberg-blocks'), value: 'footer' },
];

const MENU_LOCATION_RIGHT_OPTIONS = [
	{ label: __('Theme default (header)', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Header Menu', 'codeweber-gutenberg-blocks'), value: 'header' },
	{ label: __('Header Menu 1', 'codeweber-gutenberg-blocks'), value: 'header_1' },
	{ label: __('Offcanvas Menu', 'codeweber-gutenberg-blocks'), value: 'offcanvas' },
];

const COLOR_OPTIONS = [
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
];

const CENTER_BAR_OPTIONS = [
	{ label: __('Auto', 'codeweber-gutenberg-blocks'), value: 'auto' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
];

const LOGO_COLOR_OPTIONS = [
	{ label: __('Auto', 'codeweber-gutenberg-blocks'), value: 'auto' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	{ label: __('Both', 'codeweber-gutenberg-blocks'), value: 'both' },
];

const LOGO_WIDTH_OPTIONS = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	...Array.from({ length: 15 }, (_, i) => ({ label: `w-${i + 1}`, value: `w-${i + 1}` })),
];

const HEADER_BG_OPTIONS = [
	{ label: __('Default', 'codeweber-gutenberg-blocks'), value: '' },
	...colors.map((c) => ({
		label: __(c.label, 'codeweber-gutenberg-blocks'),
		value: c.value,
	})),
];

const HEADER_BG_STYLE_OPTIONS = [
	{ label: __('Solid', 'codeweber-gutenberg-blocks'), value: 'solid' },
	{ label: __('Soft', 'codeweber-gutenberg-blocks'), value: 'soft' },
];

const SOCIAL_STYLE_OPTIONS = [
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

const SOCIAL_SIZE_OPTIONS = [
	{ label: 'ExSm', value: 'xs' },
	{ label: 'Sm', value: 'sm' },
	{ label: 'Md', value: 'md' },
	{ label: 'Lg', value: 'lg' },
	{ label: 'ExLg', value: 'elg' },
];

export const NavbarSidebar = ({ attributes, setAttributes }) => {
	const {
		navbarType,
		menuLocation,
		menuLocationRight,
		menuDepth,
		navbarColor,
		logoColor,
		centerBarTheme,
		mobileOffcanvasTheme,
		mobileMenuElements = [],
		mobileMenuOffcanvasTheme,
		mobileMenuSocialType,
		mobileMenuSocialSize,
		mobileMenuSocialStyle,
		stickyNavbar,
		transparentOnTop,
		wrapperClass,
		navClass,
		blockClass,
		blockId,
		homeLink,
		logoWidth,
		logoHtmlEnabled,
		logoHtml,
		headerBackground,
		headerBackgroundStyle,
		socialFromTheme,
		socialStyleType,
		socialSize,
		socialButtonColor,
		socialButtonStyle,
		socialButtonForm,
		socialNavClass,
		socialThemeEnabledSlugs = [],
	} = attributes;

	const mobileMenuList = getMobileMenuElements(attributes);
	const setMobileMenuElements = (list) => setAttributes({ mobileMenuElements: list });
	const moveMobileMenuElement = (idx, direction) => {
		const newIdx = idx + direction;
		if (newIdx < 0 || newIdx >= mobileMenuList.length) return;
		const arr = [...mobileMenuList];
		const [removed] = arr.splice(idx, 1);
		arr.splice(newIdx, 0, removed);
		setMobileMenuElements(arr);
	};
	const toggleMobileMenuElement = (elemId, enabled) => {
		const arr = mobileMenuList.map((el) => (el.id === elemId ? { ...el, enabled } : el));
		setMobileMenuElements(arr);
	};

	const [themeSocialsList, setThemeSocialsList] = useState([]);
	const [themeSocialsLoading, setThemeSocialsLoading] = useState(false);
	useEffect(() => {
		if (!socialFromTheme) return;
		setThemeSocialsLoading(true);
		apiFetch({ path: '/codeweber-gutenberg-blocks/v1/social-icons-list' })
			.then((res) => {
				setThemeSocialsList(res?.socials && Array.isArray(res.socials) ? res.socials : []);
			})
			.catch(() => setThemeSocialsList([]))
			.finally(() => setThemeSocialsLoading(false));
	}, [socialFromTheme]);

	const allSocialSlugs = themeSocialsList.map((s) => s.slug);
	const isSocialSlugEnabled = (slug) =>
		!socialThemeEnabledSlugs?.length || socialThemeEnabledSlugs.includes(slug);
	const toggleSocialSlug = (slug) => {
		const enabled = isSocialSlugEnabled(slug);
		const next = enabled
			? (socialThemeEnabledSlugs.length === 0 ? allSocialSlugs : socialThemeEnabledSlugs).filter((s) => s !== slug)
			: [...(socialThemeEnabledSlugs || []), slug];
		setAttributes({ socialThemeEnabledSlugs: next.length === allSocialSlugs.length ? [] : next });
	};

	const tabs = [
		{ name: 'layout', title: __('Layout', 'codeweber-gutenberg-blocks') },
		{ name: 'logo', title: __('Logo', 'codeweber-gutenberg-blocks') },
		{ name: 'menu', title: __('Menu', 'codeweber-gutenberg-blocks') },
		{ name: 'mobile', title: __('Mobile', 'codeweber-gutenberg-blocks') },
		{ name: 'style', title: __('Style', 'codeweber-gutenberg-blocks') },
	];

	return (
		<TabPanel tabs={tabs}>
			{(tab) => (
				<>
					{tab.name === 'layout' && (
						<PanelBody title={__('Layout', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Navbar Template', 'codeweber-gutenberg-blocks')}
								value={navbarType}
								options={NAVBAR_TYPES}
								onChange={(value) => setAttributes({ navbarType: value })}
							/>
							<div style={{ marginTop: 16 }}>
								<div className="component-sidebar-title" style={{ marginBottom: 8 }}>
									<label>{__('Settings', 'codeweber-gutenberg-blocks')}</label>
								</div>
								<TextControl
									label={__('Block Class', 'codeweber-gutenberg-blocks')}
									value={blockClass || ''}
									onChange={(value) => setAttributes({ blockClass: value || '' })}
									placeholder={__('custom-wrapper classes', 'codeweber-gutenberg-blocks')}
									help={__('Extra CSS classes for block wrapper', 'codeweber-gutenberg-blocks')}
								/>
								<TextControl
									label={__('Block ID', 'codeweber-gutenberg-blocks')}
									value={blockId || ''}
									onChange={(value) => setAttributes({ blockId: (value || '').replace(/^#/, '').trim() })}
									placeholder={__('custom-id', 'codeweber-gutenberg-blocks')}
									help={__('ID for block wrapper (without #)', 'codeweber-gutenberg-blocks')}
								/>
							</div>
						</PanelBody>
					)}

					{tab.name === 'logo' && (
						<PanelBody title={__('Logo', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Logo Color', 'codeweber-gutenberg-blocks')}
								value={logoColor || 'auto'}
								options={LOGO_COLOR_OPTIONS}
								onChange={(value) => setAttributes({ logoColor: value || 'auto' })}
								help={__('Auto: dark navbar → light logo, light navbar → dark logo. Or override manually.', 'codeweber-gutenberg-blocks')}
							/>
							<SelectControl
								label={__('Logo Width', 'codeweber-gutenberg-blocks')}
								value={logoWidth || ''}
								options={LOGO_WIDTH_OPTIONS}
								onChange={(value) => setAttributes({ logoWidth: value || '' })}
								help={__('Width class for logo wrapper. Default: no extra class.', 'codeweber-gutenberg-blocks')}
							/>
							<ToggleControl
								label={__('Enable HTML', 'codeweber-gutenberg-blocks')}
								checked={!!logoHtmlEnabled}
								onChange={(value) => setAttributes({ logoHtmlEnabled: value })}
								help={__('Add custom HTML after the logo link inside the brand block.', 'codeweber-gutenberg-blocks')}
							/>
							{!!logoHtmlEnabled && (
								<TextareaControl
									label={__('HTML', 'codeweber-gutenberg-blocks')}
									value={logoHtml || ''}
									onChange={(value) => setAttributes({ logoHtml: value || '' })}
									placeholder={__('Custom HTML after logo link…', 'codeweber-gutenberg-blocks')}
									help={__('Inserted after the logo link. Wrapper gets d-flex when this has content.', 'codeweber-gutenberg-blocks')}
									rows={4}
								/>
							)}
							<TextControl
								label={__('Home Link Override', 'codeweber-gutenberg-blocks')}
								value={homeLink || ''}
								onChange={(value) => setAttributes({ homeLink: value || '' })}
								placeholder={__('Leave empty for site URL', 'codeweber-gutenberg-blocks')}
								help={__('Custom URL for logo/home link', 'codeweber-gutenberg-blocks')}
							/>
						</PanelBody>
					)}

					{tab.name === 'menu' && (
						<PanelBody title={__('Menu', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Menu Location (Primary)', 'codeweber-gutenberg-blocks')}
								value={menuLocation || ''}
								options={MENU_LOCATION_OPTIONS}
								onChange={(value) => setAttributes({ menuLocation: value || '' })}
								help={__('Theme location for main menu', 'codeweber-gutenberg-blocks')}
							/>
							<SelectControl
								label={__('Menu Location (Right)', 'codeweber-gutenberg-blocks')}
								value={menuLocationRight || ''}
								options={MENU_LOCATION_RIGHT_OPTIONS}
								onChange={(value) => setAttributes({ menuLocationRight: value || '' })}
								help={__('For center-logo templates: second menu on the right', 'codeweber-gutenberg-blocks')}
							/>
							<RangeControl
								label={__('Menu Depth (levels)', 'codeweber-gutenberg-blocks')}
								value={menuDepth ?? 4}
								onChange={(value) => setAttributes({ menuDepth: value ?? 4 })}
								min={1}
								max={5}
								help={__('Submenu depth: 1 = top only, 4 = 4 levels', 'codeweber-gutenberg-blocks')}
							/>
						</PanelBody>
					)}

					{tab.name === 'mobile' && (
						<PanelBody title={__('Mobile', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<p style={{ marginBottom: 12, fontSize: 12, color: '#555' }}>
								{__('Choose which elements to show in the mobile offcanvas panel. If none are enabled here, the panel uses the first Header Widget "Offcanvas Info" config.', 'codeweber-gutenberg-blocks')}
							</p>
							<SelectControl
								label={__('Offcanvas theme', 'codeweber-gutenberg-blocks')}
								value={mobileMenuOffcanvasTheme || 'light'}
								options={[
									{ value: 'light', label: __('Light', 'codeweber-gutenberg-blocks') },
									{ value: 'dark', label: __('Dark', 'codeweber-gutenberg-blocks') },
								]}
								onChange={(v) => setAttributes({ mobileMenuOffcanvasTheme: v || 'light' })}
							/>
							<p style={{ marginTop: 12, marginBottom: 6, fontSize: 12, fontWeight: 600 }}>
								{__('Social icons (offcanvas)', 'codeweber-gutenberg-blocks')}
							</p>
							<SelectControl
								label={__('Social icon type', 'codeweber-gutenberg-blocks')}
								value={mobileMenuSocialType || ''}
								options={[
									{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
									{ value: 'type1', label: __('Type 1', 'codeweber-gutenberg-blocks') },
									{ value: 'type2', label: __('Type 2', 'codeweber-gutenberg-blocks') },
									{ value: 'type3', label: __('Type 3', 'codeweber-gutenberg-blocks') },
									{ value: 'type4', label: __('Type 4', 'codeweber-gutenberg-blocks') },
									{ value: 'type5', label: __('Type 5', 'codeweber-gutenberg-blocks') },
									{ value: 'type6', label: __('Type 6', 'codeweber-gutenberg-blocks') },
									{ value: 'type7', label: __('Type 7', 'codeweber-gutenberg-blocks') },
									{ value: 'type8', label: __('Type 8', 'codeweber-gutenberg-blocks') },
									{ value: 'type9', label: __('Type 9', 'codeweber-gutenberg-blocks') },
								]}
								onChange={(v) => setAttributes({ mobileMenuSocialType: v || '' })}
							/>
							<SelectControl
								label={__('Social button size', 'codeweber-gutenberg-blocks')}
								value={mobileMenuSocialSize || ''}
								options={[
									{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
									{ value: 'sm', label: __('Small', 'codeweber-gutenberg-blocks') },
									{ value: 'md', label: __('Medium', 'codeweber-gutenberg-blocks') },
									{ value: 'lg', label: __('Large', 'codeweber-gutenberg-blocks') },
								]}
								onChange={(v) => setAttributes({ mobileMenuSocialSize: v || '' })}
							/>
							<SelectControl
								label={__('Social button style', 'codeweber-gutenberg-blocks')}
								value={mobileMenuSocialStyle || ''}
								options={[
									{ value: '', label: __('Theme default', 'codeweber-gutenberg-blocks') },
									{ value: 'circle', label: __('Circle', 'codeweber-gutenberg-blocks') },
									{ value: 'block', label: __('Block', 'codeweber-gutenberg-blocks') },
								]}
								onChange={(v) => setAttributes({ mobileMenuSocialStyle: v || '' })}
							/>
							<p style={{ marginTop: 12, marginBottom: 8, fontSize: 12, fontWeight: 600 }}>
								{__('Order items in side menu', 'codeweber-gutenberg-blocks')}
							</p>
							<p style={{ marginBottom: 8, fontSize: 11, color: '#666' }}>
								{__('Enable/disable and reorder. Only enabled items are shown in the offcanvas panel.', 'codeweber-gutenberg-blocks')}
							</p>
							{mobileMenuList.map((el, idx) => (
								<div
									key={el.id}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 8,
										marginBottom: 6,
										padding: '6px 8px',
										background: el.enabled ? '#f9f9f9' : '#f0f0f0',
										borderRadius: 4,
									}}
								>
									<Button
										icon={chevronUp}
										iconSize={16}
										disabled={idx === 0}
										onClick={() => moveMobileMenuElement(idx, -1)}
										label={__('Move up', 'codeweber-gutenberg-blocks')}
									/>
									<Button
										icon={chevronDown}
										iconSize={16}
										disabled={idx === mobileMenuList.length - 1}
										onClick={() => moveMobileMenuElement(idx, 1)}
										label={__('Move down', 'codeweber-gutenberg-blocks')}
									/>
									<ToggleControl
										label={el.label || el.id}
										checked={!!el.enabled}
										onChange={(v) => toggleMobileMenuElement(el.id, v)}
									/>
								</div>
							))}
						</PanelBody>
					)}

					{tab.name === 'style' && (
						<PanelBody title={__('Style', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<div className="component-sidebar-title" style={{ marginBottom: 8 }}>
								<label>{__('Background style', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<ButtonGroup className="button-group-sidebar_33" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
								{HEADER_BG_STYLE_OPTIONS.map((opt) => (
									<Button
										key={opt.value}
										isPrimary={(headerBackgroundStyle || 'solid') === opt.value}
										onClick={() => setAttributes({ headerBackgroundStyle: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</ButtonGroup>
							<SelectControl
								label={__('Header Background', 'codeweber-gutenberg-blocks')}
								value={headerBackground || ''}
								options={HEADER_BG_OPTIONS}
								onChange={(value) => setAttributes({ headerBackground: value || '' })}
								help={__('Add bg-* class to header wrapper. Default: no class.', 'codeweber-gutenberg-blocks')}
							/>
							<div className="component-sidebar-title" style={{ marginTop: 12, marginBottom: 8 }}>
								<label>{__('Navbar Color', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<ButtonGroup className="button-group-sidebar_33" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
								{COLOR_OPTIONS.map((opt) => (
									<Button
										key={opt.value}
										isPrimary={(navbarColor || 'light') === opt.value}
										onClick={() => setAttributes({ navbarColor: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</ButtonGroup>
							{(navbarType === 'navbar-4' || navbarType === 'navbar-5' || navbarType === 'navbar-6') && (
								<>
									<div className="component-sidebar-title" style={{ marginTop: 12, marginBottom: 8 }}>
										<label>{__('Center Bar Theme', 'codeweber-gutenberg-blocks')}</label>
									</div>
									<ButtonGroup className="button-group-sidebar_33" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
										{CENTER_BAR_OPTIONS.map((opt) => (
											<Button
												key={opt.value}
												isPrimary={(centerBarTheme || 'auto') === opt.value}
												onClick={() => setAttributes({ centerBarTheme: opt.value })}
											>
												{opt.label}
											</Button>
										))}
									</ButtonGroup>
								</>
							)}
							<div className="component-sidebar-title" style={{ marginTop: 12, marginBottom: 8 }}>
								<label>{__('Mobile Offcanvas Theme', 'codeweber-gutenberg-blocks')}</label>
							</div>
							<ButtonGroup className="button-group-sidebar_33" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
								{COLOR_OPTIONS.map((opt) => (
									<Button
										key={opt.value}
										isPrimary={(mobileOffcanvasTheme || 'light') === opt.value}
										onClick={() => setAttributes({ mobileOffcanvasTheme: opt.value })}
									>
										{opt.label}
									</Button>
								))}
							</ButtonGroup>
							<ToggleControl
								label={__('Sticky Navbar', 'codeweber-gutenberg-blocks')}
								checked={stickyNavbar || false}
								onChange={(value) => setAttributes({ stickyNavbar: value })}
								help={__('Fix navbar on scroll', 'codeweber-gutenberg-blocks')}
							/>
							<ToggleControl
								label={__('Transparent on Top', 'codeweber-gutenberg-blocks')}
								checked={transparentOnTop || false}
								onChange={(value) => setAttributes({ transparentOnTop: value })}
								help={__('Transparent navbar at page top', 'codeweber-gutenberg-blocks')}
							/>
							<TextControl
								label={__('Wrapper Class', 'codeweber-gutenberg-blocks')}
								value={wrapperClass || ''}
								onChange={(value) => setAttributes({ wrapperClass: value || '' })}
								placeholder="wrapper"
								help={__('Extra classes for header wrapper', 'codeweber-gutenberg-blocks')}
							/>
							<TextControl
								label={__('Nav Class', 'codeweber-gutenberg-blocks')}
								value={navClass || ''}
								onChange={(value) => setAttributes({ navClass: value || '' })}
								placeholder="navbar"
								help={__('Extra classes for nav element', 'codeweber-gutenberg-blocks')}
							/>

							<ToggleControl
								label={__('Social icons from theme', 'codeweber-gutenberg-blocks')}
								help={__('Show social links from Redux/theme settings in navbar (e.g. second row for Extended).', 'codeweber-gutenberg-blocks')}
								checked={!!socialFromTheme}
								onChange={(value) => setAttributes({ socialFromTheme: value })}
							/>
							{socialFromTheme && (
								<>
									<SelectControl
										label={__('Social style', 'codeweber-gutenberg-blocks')}
										value={socialStyleType || 'type1'}
										options={SOCIAL_STYLE_OPTIONS}
										onChange={(value) => setAttributes({ socialStyleType: value || 'type1' })}
									/>
									<div className="component-sidebar-title" style={{ marginBottom: 8 }}>
										<label>{__('Social size', 'codeweber-gutenberg-blocks')}</label>
									</div>
									<ButtonGroup style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
										{SOCIAL_SIZE_OPTIONS.map((opt) => (
											<Button
												key={opt.value}
												isPrimary={(socialSize || 'sm') === opt.value}
												onClick={() => setAttributes({ socialSize: opt.value })}
											>
												{opt.label}
											</Button>
										))}
									</ButtonGroup>
									<SelectControl
										label={__('Button form', 'codeweber-gutenberg-blocks')}
										value={socialButtonForm || 'circle'}
										options={[
											{ value: 'circle', label: __('Circle', 'codeweber-gutenberg-blocks') },
											{ value: 'block', label: __('Block', 'codeweber-gutenberg-blocks') },
										]}
										onChange={(value) => setAttributes({ socialButtonForm: value || 'circle' })}
									/>
									{(socialStyleType === 'type8' || socialStyleType === 'type9') && (
										<>
											<SelectControl
												label={__('Button color', 'codeweber-gutenberg-blocks')}
												value={socialButtonColor || 'primary'}
												options={colors}
												onChange={(value) => setAttributes({ socialButtonColor: value })}
											/>
											<SelectControl
												label={__('Button style', 'codeweber-gutenberg-blocks')}
												value={socialButtonStyle || 'solid'}
												options={[
													{ value: 'solid', label: __('Solid', 'codeweber-gutenberg-blocks') },
													{ value: 'outline', label: __('Outline', 'codeweber-gutenberg-blocks') },
												]}
												onChange={(value) => setAttributes({ socialButtonStyle: value || 'solid' })}
											/>
										</>
									)}
									<TextControl
										label={__('Social nav class', 'codeweber-gutenberg-blocks')}
										value={socialNavClass || ''}
										placeholder="justify-content-end text-end"
										onChange={(value) => setAttributes({ socialNavClass: value || '' })}
									/>
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
													checked={isSocialSlugEnabled(item.slug)}
													onChange={() => toggleSocialSlug(item.slug)}
													style={{ marginBottom: 4 }}
												/>
											))}
											<p style={{ marginTop: 8, color: '#757575', fontSize: 11 }}>
												{__('Uncheck to hide a network. Empty selection = show all.', 'codeweber-gutenberg-blocks')}
											</p>
										</div>
									)}
								</>
							)}
						</PanelBody>
					)}

				</>
			)}
		</TabPanel>
	);
};
