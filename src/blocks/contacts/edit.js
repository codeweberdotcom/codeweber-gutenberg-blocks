/**
 * Contacts Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { ContactsSidebar } from './sidebar';

const ContactsPreview = ({ items, contactsData }) => {
	if (!items || items.length === 0) {
		return (
			<div className="codeweber-contacts-preview-empty">
				<p>
					{__(
						'No contact items configured. Use the sidebar to add contact information.',
						'codeweber-gutenberg-blocks'
					)}
				</p>
			</div>
		);
	}

	const enabledItems = items.filter((item) => item.enabled);

	if (enabledItems.length === 0) {
		return (
			<div className="codeweber-contacts-preview-empty">
				<p>
					{__(
						'All contact items are disabled. Enable items in the sidebar.',
						'codeweber-gutenberg-blocks'
					)}
				</p>
			</div>
		);
	}

	return (
		<div className="codeweber-contacts-preview">
			{enabledItems.map((item, index) => (
				<div key={index} className="codeweber-contacts-preview-item">
					{item.type === 'address' && (() => {
						const addressType = item.addressType || 'legal';
						const address = contactsData?.address?.[addressType] || '';
						if (!address) {
							return (
								<div>
									{item.format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												<div className="icon text-primary fs-28 me-6 mt-n1">
													<i className="uil uil-location-pin-alt"></i>
												</div>
											</div>
											<div>
												<h5 className="mb-1">
													{__('Address', 'codeweber-gutenberg-blocks')}
												</h5>
												<address>
													{__('Address will be displayed here', 'codeweber-gutenberg-blocks')}
												</address>
											</div>
										</div>
									) : (
										<div>
											<address className="pe-xl-15 pe-xxl-17">
												{__('Address will be displayed here', 'codeweber-gutenberg-blocks')}
											</address>
										</div>
									)}
								</div>
							);
						}

						return (
							<div>
								{item.format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											<div className="icon text-primary fs-28 me-6 mt-n1">
												<i className="uil uil-location-pin-alt"></i>
											</div>
										</div>
										<div>
											<h5 className="mb-1">
												{__('Address', 'codeweber-gutenberg-blocks')}
											</h5>
											<address>{address}</address>
										</div>
									</div>
								) : (
									<div>
										<address className="pe-xl-15 pe-xxl-17">{address}</address>
									</div>
								)}
							</div>
						);
					})()}

					{item.type === 'email' && (() => {
						const email = contactsData?.email || '';
						if (!email) {
							return (
								<div>
									{item.format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												<div className="icon text-primary fs-28 me-6 mt-n1">
													<i className="uil uil-envelope"></i>
												</div>
											</div>
											<div>
												<h5 className="mb-1">
													{__('E-mail', 'codeweber-gutenberg-blocks')}
												</h5>
												<p className="mb-0">
													<a href="mailto:#" className="link-body">
														{__('Email will be displayed here', 'codeweber-gutenberg-blocks')}
													</a>
												</p>
											</div>
										</div>
									) : (
										<div>
											<a href="mailto:#">
												{__('Email will be displayed here', 'codeweber-gutenberg-blocks')}
											</a>
										</div>
									)}
								</div>
							);
						}

						return (
							<div>
								{item.format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											<div className="icon text-primary fs-28 me-6 mt-n1">
												<i className="uil uil-envelope"></i>
											</div>
										</div>
										<div>
											<h5 className="mb-1">
												{__('E-mail', 'codeweber-gutenberg-blocks')}
											</h5>
											<p className="mb-0">
												<a href={`mailto:${email}`} className="link-body">
													{email}
												</a>
											</p>
										</div>
									</div>
								) : (
									<div>
										<a href={`mailto:${email}`}>{email}</a>
									</div>
								)}
							</div>
						);
					})()}

					{item.type === 'phone' && (() => {
						const phones = item.phones || [];
						const phoneData = phones
							.map((phoneKey) => contactsData?.phones?.[phoneKey])
							.filter(Boolean);

						if (phoneData.length === 0) {
							return (
								<div>
									{item.format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												<div className="icon text-primary fs-28 me-6 mt-n1">
													<i className="uil uil-phone-volume"></i>
												</div>
											</div>
											<div>
												<h5 className="mb-1">
													{__('Phone', 'codeweber-gutenberg-blocks')}
												</h5>
												<a href="tel:#">
													{__('Phone will be displayed here', 'codeweber-gutenberg-blocks')}
												</a>
											</div>
										</div>
									) : (
										<div>
											<a href="tel:#">
												{__('Phone will be displayed here', 'codeweber-gutenberg-blocks')}
											</a>
										</div>
									)}
								</div>
							);
						}

						return (
							<div>
								{item.format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											<div className="icon text-primary fs-28 me-6 mt-n1">
												<i className="uil uil-phone-volume"></i>
											</div>
										</div>
										<div>
											<h5 className="mb-1">
												{__('Phone', 'codeweber-gutenberg-blocks')}
											</h5>
											{phoneData.map((phone, phoneIndex) => (
												<span key={phoneIndex}>
													<a href={`tel:${phone.clean}`}>
														{phone.display}
													</a>
													{phoneIndex < phoneData.length - 1 && <br />}
												</span>
											))}
										</div>
									</div>
								) : (
									<div>
										{phoneData.map((phone, phoneIndex) => (
											<span key={phoneIndex}>
												<a href={`tel:${phone.clean}`}>
													{phone.display}
												</a>
												{phoneIndex < phoneData.length - 1 && <br />}
											</span>
										))}
									</div>
								)}
							</div>
						);
					})()}
				</div>
			))}
		</div>
	);
};

const ContactsEdit = ({ attributes, setAttributes }) => {
	const { items = [] } = attributes;
	const [contactsData, setContactsData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const blockProps = useBlockProps({
		className: 'codeweber-contacts-block',
	});

	useEffect(() => {
		const fetchContactsData = async () => {
			try {
				setIsLoading(true);
				const data = await apiFetch({
					path: '/codeweber-gutenberg-blocks/v1/contacts',
				});
				console.log('Contacts data loaded:', data);
				setContactsData(data);
			} catch (error) {
				console.error('Error fetching contacts data:', error);
				setContactsData({
					address: { legal: '', actual: '' },
					email: '',
					phones: {},
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchContactsData();
	}, []);

	return (
		<>
			<InspectorControls>
				<ContactsSidebar attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>
			<div {...blockProps}>
				{isLoading || !contactsData ? (
					<div className="codeweber-contacts-preview-empty">
						<p>{__('Loading contacts data...', 'codeweber-gutenberg-blocks')}</p>
					</div>
				) : (
					<ContactsPreview items={items} contactsData={contactsData} />
				)}
			</div>
		</>
	);
};

export default ContactsEdit;

