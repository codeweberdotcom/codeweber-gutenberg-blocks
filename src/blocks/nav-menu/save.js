/**
 * Nav Menu Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const NavMenuSave = ({ attributes }) => {
	const {
		offcanvasTitle,
		showOffcanvasHeader,
		offcanvasTheme,
		bodyClass,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'navbar-collapse offcanvas offcanvas-nav offcanvas-start ' + (offcanvasTheme === 'dark' ? 'offcanvas-dark' : 'offcanvas-light'),
	});

	return (
		<div {...blockProps}>
			{showOffcanvasHeader && (
				<div className="offcanvas-header d-lg-none">
					{offcanvasTitle ? (
						<h3 className="text-white fs-30 mb-0">{offcanvasTitle}</h3>
					) : (
						<span className="text-white fs-30 mb-0">Menu</span>
					)}
					<button
						type="button"
						className={'btn-close ' + (offcanvasTheme === 'dark' ? 'btn-close-white' : '')}
						data-bs-dismiss="offcanvas"
						aria-label="Close"
					/>
				</div>
			)}
			<div className={'offcanvas-body ' + (bodyClass || '').trim()}>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default NavMenuSave;
