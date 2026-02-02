/**
 * Nav Menu Block - Edit Component
 *
 * Container block for navigation. Accepts any inner blocks (Menu, buttons, etc.)
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl, SelectControl } from '@wordpress/components';

const TEMPLATE = [];

const NavMenuEdit = ({ attributes, setAttributes }) => {
	const {
		offcanvasTitle,
		showOffcanvasHeader,
		offcanvasTheme,
		bodyClass,
		navClass,
	} = attributes;

	const blockProps = useBlockProps({
		className: 'navbar-collapse offcanvas offcanvas-nav offcanvas-start ' + (offcanvasTheme === 'dark' ? 'offcanvas-dark' : 'offcanvas-light'),
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Mobile Menu', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Show offcanvas header', 'codeweber-gutenberg-blocks')}
						checked={showOffcanvasHeader}
						onChange={(value) => setAttributes({ showOffcanvasHeader: value })}
					/>
					{showOffcanvasHeader && (
						<TextControl
							label={__('Offcanvas title', 'codeweber-gutenberg-blocks')}
							value={offcanvasTitle}
							onChange={(value) => setAttributes({ offcanvasTitle: value })}
							help={__('Shown on mobile only', 'codeweber-gutenberg-blocks')}
						/>
					)}
					<SelectControl
						label={__('Mobile menu theme', 'codeweber-gutenberg-blocks')}
						value={offcanvasTheme}
						options={[
							{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dark' },
							{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'light' },
						]}
						onChange={(value) => setAttributes({ offcanvasTheme: value })}
					/>
				</PanelBody>
				<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<TextControl
						label={__('Body CSS classes', 'codeweber-gutenberg-blocks')}
						value={bodyClass}
						onChange={(value) => setAttributes({ bodyClass: value })}
					/>
					<TextControl
						label={__('Nav CSS classes', 'codeweber-gutenberg-blocks')}
						value={navClass}
						onChange={(value) => setAttributes({ navClass: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{showOffcanvasHeader && (
					<div className="offcanvas-header d-lg-none">
						{offcanvasTitle ? (
							<h3 className="text-white fs-30 mb-0">{offcanvasTitle}</h3>
						) : (
							<span className="text-white fs-30 mb-0">{__('Menu', 'codeweber-gutenberg-blocks')}</span>
						)}
						<button
							type="button"
							className={'btn-close ' + (offcanvasTheme === 'dark' ? 'btn-close-white' : '')}
							data-bs-dismiss="offcanvas"
							aria-label={__('Close', 'codeweber-gutenberg-blocks')}
						/>
					</div>
				)}
				<div className={'offcanvas-body ' + (bodyClass || '').trim()}>
					<InnerBlocks
						template={TEMPLATE}
						templateLock={false}
						renderAppender={InnerBlocks.ButtonBlockAppender}
					/>
				</div>
			</div>
		</>
	);
};

export default NavMenuEdit;
