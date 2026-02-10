/**
 * Top Header Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { TopHeaderSidebar } from './sidebar';

const TopHeaderPreview = ({ attributes, contactsData }) => {
	const {
		showAddress = true,
		showEmail = true,
		showPhone = true,
		phones = ['phone_01'],
		backgroundColor = 'primary',
		textColor = 'white',
	} = attributes;

	const hasContent = (showAddress && contactsData?.address?.actual) ||
		(showEmail && contactsData?.email) ||
		(showPhone && phones.some((k) => contactsData?.phones?.[k]));

	if (!hasContent) {
		return (
			<div className="codeweber-top-header-preview-empty" style={{ padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
				<p style={{ margin: 0 }}>
					{__('Top Header: configure contacts in Redux or enable items in the sidebar.', 'codeweber-gutenberg-blocks')}
				</p>
			</div>
		);
	}

	const bgClass = backgroundColor ? `bg-${backgroundColor}` : 'bg-primary';
	const textClass = textColor ? `text-${textColor}` : 'text-white';

	return (
		<div className={`codeweber-top-header-preview ${bgClass} ${textClass} fw-bold fs-15`} style={{ padding: '10px 0' }}>
			<div className="container d-flex flex-row justify-content-between flex-wrap gap-2">
				{showAddress && contactsData?.address?.actual && (
					<div className="d-flex flex-row align-items-center">
						<span className="icon mt-1 me-2"><i className="uil uil-location-pin-alt" /></span>
						<address className="mb-0">{contactsData.address.actual}</address>
					</div>
				)}
				{showEmail && contactsData?.email && (
					<div className="d-none d-md-flex flex-row align-items-center me-6 ms-auto">
						<span className="icon mt-1 me-2"><i className="uil uil-message" /></span>
						<p className="mb-0">
							<a href={`mailto:${contactsData.email}`} className="link-white hover">{contactsData.email}</a>
						</p>
					</div>
				)}
				{showPhone && (
					<div className="d-flex flex-row align-items-center">
						<span className="icon mt-1 me-2"><i className="uil uil-phone-volume" /></span>
						{phones.map((key) => {
							const p = contactsData?.phones?.[key];
							if (!p) return null;
							return (
								<a key={key} href={`tel:${p.clean}`} className="text-reset hover ms-2">{p.display}</a>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

const TopHeaderEdit = ({ attributes, setAttributes }) => {
	const { blockClass = '', blockId = '' } = attributes;
	const [contactsData, setContactsData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const blockProps = useBlockProps({
		className: ['codeweber-top-header-block', blockClass].filter(Boolean).join(' '),
		id: blockId || undefined,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const data = await apiFetch({ path: '/codeweber-gutenberg-blocks/v1/contacts' });
				setContactsData(data);
			} catch (e) {
				setContactsData({ address: { actual: '' }, email: '', phones: {} });
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<>
			<InspectorControls>
				<TopHeaderSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>
				{isLoading ? (
					<div style={{ padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
						{__('Loading...', 'codeweber-gutenberg-blocks')}
					</div>
				) : (
					<TopHeaderPreview attributes={attributes} contactsData={contactsData} />
				)}
			</div>
		</>
	);
};

export default TopHeaderEdit;
