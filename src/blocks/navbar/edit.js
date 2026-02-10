/**
 * Navbar Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef, useLayoutEffect } from '@wordpress/element';
import { createPortal } from 'react-dom';
import apiFetch from '@wordpress/api-fetch';
import { NavbarSidebar } from './sidebar';

const NavbarEdit = ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps();
	const [html, setHtml] = useState('');
	const [loading, setLoading] = useState(true);
	const [portalTarget, setPortalTarget] = useState(null);
	const previewRef = useRef(null);

	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams({
			navbarType: attributes.navbarType || 'navbar-1',
			menuLocation: attributes.menuLocation || '',
			menuLocationRight: attributes.menuLocationRight || '',
			menuDepth: String(attributes.menuDepth ?? 4),
			navbarColor: attributes.navbarColor || 'light',
			logoColor: attributes.logoColor || 'auto',
			centerBarTheme: attributes.centerBarTheme || 'auto',
			mobileOffcanvasTheme: attributes.mobileOffcanvasTheme || 'light',
			stickyNavbar: attributes.stickyNavbar ? '1' : '0',
			transparentOnTop: attributes.transparentOnTop ? '1' : '0',
			wrapperClass: attributes.wrapperClass || '',
			navClass: attributes.navClass || '',
			blockClass: attributes.blockClass || '',
			blockId: attributes.blockId || '',
			homeLink: attributes.homeLink || '',
			_t: String(Date.now()),
		});
		apiFetch({
			path: `/codeweber-gutenberg-blocks/v1/navbar-preview?${params.toString()}`,
		})
			.then((res) => {
				setHtml(res?.html || '');
			})
			.catch(() => {
				setHtml('');
			})
			.finally(() => {
				setLoading(false);
			});
		}, [
		attributes.navbarType,
		attributes.menuLocation,
		attributes.menuLocationRight,
		attributes.menuDepth,
		attributes.navbarColor,
		attributes.logoColor,
		attributes.centerBarTheme,
		attributes.mobileOffcanvasTheme,
		attributes.stickyNavbar,
		attributes.transparentOnTop,
		attributes.wrapperClass,
		attributes.navClass,
		attributes.blockClass,
		attributes.blockId,
		attributes.homeLink,
	]);

	useLayoutEffect(() => {
		if (html && previewRef.current) {
			const target = previewRef.current.querySelector('#navbar-other-innerblocks');
			setPortalTarget(target);
		} else {
			setPortalTarget(null);
		}
	}, [html]);

	const NAVBAR_OTHER_TEMPLATE = [
		['codeweber-blocks/social-icons'],
	];

	const innerBlocksContent = portalTarget
		? createPortal(
				<InnerBlocks
					template={NAVBAR_OTHER_TEMPLATE}
					templateLock={false}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>,
				portalTarget
			)
		: null;

	return (
		<>
			<InspectorControls>
				<NavbarSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div {...blockProps}>
				{loading ? (
					<div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
						{__('Loading navbar...', 'codeweber-gutenberg-blocks')}
					</div>
				) : html ? (
					<>
						<div
							ref={previewRef}
							className="navbar-block-preview"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
						{innerBlocksContent}
						{!portalTarget && (
							<div className="navbar-other-innerblocks-fallback" style={{ marginTop: 12, padding: 12, border: '1px dashed #ccc', background: '#f9f9f9', borderRadius: 4 }}>
								<p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
									{__('Blocks for navbar right area', 'codeweber-gutenberg-blocks')}
								</p>
								<InnerBlocks
									template={NAVBAR_OTHER_TEMPLATE}
									templateLock={false}
									renderAppender={InnerBlocks.ButtonBlockAppender}
								/>
							</div>
						)}
					</>
				) : (
					<div style={{ padding: '20px', background: '#f0f0f0', border: '1px dashed #ccc', textAlign: 'center', color: '#666' }}>
						{__('Navbar preview', 'codeweber-gutenberg-blocks')}
					</div>
				)}
			</div>
		</>
	);
};

export default NavbarEdit;
