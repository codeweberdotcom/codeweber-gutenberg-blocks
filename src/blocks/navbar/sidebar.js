import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	TabPanel,
	TextControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
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
	{ label: __('Auto (follow navbar)', 'codeweber-gutenberg-blocks'), value: 'auto' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
];

const LOGO_COLOR_OPTIONS = [
	{ label: __('Auto (follow navbar)', 'codeweber-gutenberg-blocks'), value: 'auto' },
	{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
	{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
	{ label: __('Both', 'codeweber-gutenberg-blocks'), value: 'both' },
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
		stickyNavbar,
		transparentOnTop,
		wrapperClass,
		navClass,
		blockClass,
		blockId,
		homeLink,
		showOffcanvasInPreview,
	} = attributes;

	const tabs = [
		{ name: 'layout', title: __('Layout', 'codeweber-gutenberg-blocks') },
		{ name: 'menu', title: __('Menu', 'codeweber-gutenberg-blocks') },
		{ name: 'style', title: __('Style', 'codeweber-gutenberg-blocks') },
		{ name: 'settings', title: __('Settings', 'codeweber-gutenberg-blocks') },
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

					{tab.name === 'style' && (
						<PanelBody title={__('Style', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<SelectControl
								label={__('Navbar Color', 'codeweber-gutenberg-blocks')}
								value={navbarColor || 'light'}
								options={COLOR_OPTIONS}
								onChange={(value) => setAttributes({ navbarColor: value || 'light' })}
								help={__('Navbar background theme: light/dark', 'codeweber-gutenberg-blocks')}
							/>
							<SelectControl
								label={__('Logo Color', 'codeweber-gutenberg-blocks')}
								value={logoColor || 'auto'}
								options={LOGO_COLOR_OPTIONS}
								onChange={(value) => setAttributes({ logoColor: value || 'auto' })}
								help={__('Auto: dark navbar → light logo, light navbar → dark logo. Or override manually.', 'codeweber-gutenberg-blocks')}
							/>
							{(navbarType === 'navbar-4' || navbarType === 'navbar-5' || navbarType === 'navbar-6') && (
								<SelectControl
									label={__('Center Bar Theme', 'codeweber-gutenberg-blocks')}
									value={centerBarTheme || 'auto'}
									options={CENTER_BAR_OPTIONS}
									onChange={(value) => setAttributes({ centerBarTheme: value || 'auto' })}
									help={__('Fancy types: background of the bar where logo and menu sit. Auto = follow Navbar Color.', 'codeweber-gutenberg-blocks')}
								/>
							)}
							<SelectControl
								label={__('Mobile Offcanvas Theme', 'codeweber-gutenberg-blocks')}
								value={mobileOffcanvasTheme || 'light'}
								options={COLOR_OPTIONS}
								onChange={(value) => setAttributes({ mobileOffcanvasTheme: value || 'light' })}
								help={__('Offcanvas menu background on mobile', 'codeweber-gutenberg-blocks')}
							/>
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
						</PanelBody>
					)}

					{tab.name === 'settings' && (
						<PanelBody title={__('Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
							<ToggleControl
								label={__('Show offcanvas in preview', 'codeweber-gutenberg-blocks')}
								checked={!!showOffcanvasInPreview}
								onChange={(value) => setAttributes({ showOffcanvasInPreview: value })}
								help={__('Display offcanvas panel (info/search) in the editor preview.', 'codeweber-gutenberg-blocks')}
							/>
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
							<TextControl
								label={__('Home Link Override', 'codeweber-gutenberg-blocks')}
								value={homeLink || ''}
								onChange={(value) => setAttributes({ homeLink: value || '' })}
								placeholder={__('Leave empty for site URL', 'codeweber-gutenberg-blocks')}
								help={__('Custom URL for logo/home link', 'codeweber-gutenberg-blocks')}
							/>
						</PanelBody>
					)}
				</>
			)}
		</TabPanel>
	);
};
