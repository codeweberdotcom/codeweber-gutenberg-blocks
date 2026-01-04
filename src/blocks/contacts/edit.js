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
import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { ContactsSidebar } from './sidebar';
import { generateColorClass, generateTypographyClasses } from '../../utilities/class-generators';
import { IconRender } from '../../components/icon/IconRender';

const ContactsPreview = ({ items, contactsData, format = 'simple', attributes = {} }) => {
	const {
		titleTag = 'h5',
		titleColor = '',
		titleColorType = 'solid',
		titleSize = '',
		titleWeight = '',
		titleTransform = '',
		titleClass = '',
		textTag = 'address',
		textColor = '',
		textColorType = 'solid',
		textSize = '',
		textWeight = '',
		textTransform = '',
		textClass = '',
		iconType = 'font',
		iconName = '',
		svgIcon = '',
		svgStyle = 'lineal',
		iconSize = 'xs',
		iconFontSize = 'fs-28',
		iconColor = 'primary',
		iconColor2 = '',
		iconClass = '',
		iconWrapper = false,
		iconWrapperStyle = '',
		iconBtnSize = '',
		iconBtnVariant = 'soft',
		iconWrapperClass = '',
		iconGradientColor = 'gradient-1',
		customSvgUrl = '',
	} = attributes;
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

	// Генерируем классы для заголовка
	const getTitleClasses = () => {
		const classes = ['mb-1'];
		classes.push(generateColorClass(titleColor, titleColorType, 'text'));
		classes.push(...generateTypographyClasses(attributes, 'title'));
		if (titleClass) {
			classes.push(titleClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	// Генерируем классы для текста
	const getTextClasses = () => {
		const classes = [];
		classes.push(generateColorClass(textColor, textColorType, 'text'));
		classes.push(...generateTypographyClasses(attributes, 'text'));
		if (textClass) {
			classes.push(textClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	const titleClasses = getTitleClasses();
	const textClasses = getTextClasses();

	// Функция для рендеринга иконки контакта
	const renderContactIcon = (iconNameForContact) => {
		// Если пользователь выбрал иконку - используем её, иначе используем предустановленную для типа контакта
		let iconNameToUse = iconName || iconNameForContact;
		let svgIconToUse = svgIcon;
		let customSvgUrlToUse = customSvgUrl;
		
		// Если тип иконки none или нет данных - не показываем
		if (iconType === 'none') return null;
		
		// Для font иконок: если пользователь не выбрал, используем предустановленную
		if (iconType === 'font') {
			if (!iconNameToUse) return null;
		}
		
		// Для SVG иконок: если пользователь не выбрал, не показываем
		if (iconType === 'svg' && !svgIconToUse) return null;
		
		// Для custom иконок: если пользователь не выбрал, не показываем
		if (iconType === 'custom' && !customSvgUrlToUse) return null;
		
		return (
			<IconRender
				iconType={iconType}
				iconName={iconNameToUse}
				svgIcon={svgIconToUse}
				svgStyle={svgStyle}
				iconSize={iconSize}
				iconFontSize={iconFontSize}
				iconColor={iconColor}
				iconColor2={iconColor2}
				iconClass={iconClass}
				iconWrapper={iconWrapper}
				iconWrapperStyle={iconWrapperStyle}
				iconBtnSize={iconBtnSize}
				iconBtnVariant={iconBtnVariant}
				iconWrapperClass={iconWrapperClass ? `${iconWrapperClass} me-6 mt-n1` : 'me-6 mt-n1'}
				iconGradientColor={iconGradientColor}
				customSvgUrl={customSvgUrlToUse}
				isEditor={true}
			/>
		);
	};

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
									{format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												{renderContactIcon('location-pin-alt')}
											</div>
											<div>
												{React.createElement(titleTag || 'h5', { className: titleClasses }, __('Address', 'codeweber-gutenberg-blocks'))}
												{React.createElement(textTag || 'address', { className: textClasses }, __('Address will be displayed here', 'codeweber-gutenberg-blocks'))}
											</div>
										</div>
								) : (
									<div>
										{React.createElement(textTag || 'address', { className: `pe-xl-15 pe-xxl-17 ${textClasses}` }, __('Address will be displayed here', 'codeweber-gutenberg-blocks'))}
									</div>
								)}
								</div>
							);
						}

						return (
							<div>
								{format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											{renderContactIcon('location-pin-alt')}
										</div>
										<div>
											{React.createElement(titleTag || 'h5', { className: titleClasses }, __('Address', 'codeweber-gutenberg-blocks'))}
											{React.createElement(textTag || 'address', { className: textClasses }, address)}
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
									{format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												{renderContactIcon('envelope')}
											</div>
											<div>
												{React.createElement(titleTag || 'h5', { className: titleClasses }, __('E-mail', 'codeweber-gutenberg-blocks'))}
												<p className="mb-0">
													<a href="mailto:#" className={`link-body ${textClasses}`}>
														{__('Email will be displayed here', 'codeweber-gutenberg-blocks')}
													</a>
												</p>
											</div>
										</div>
									) : (
										<div>
											<a href="mailto:#" className={textClasses}>
												{__('Email will be displayed here', 'codeweber-gutenberg-blocks')}
											</a>
										</div>
									)}
								</div>
							);
						}

						return (
							<div>
								{format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											{renderContactIcon('envelope')}
										</div>
										<div>
											{React.createElement(titleTag || 'h5', { className: titleClasses }, __('E-mail', 'codeweber-gutenberg-blocks'))}
											<p className="mb-0">
												<a href={`mailto:${email}`} className={`link-body ${textClasses}`}>
													{email}
												</a>
											</p>
										</div>
									</div>
								) : (
									<div>
										<a href={`mailto:${email}`} className={textClasses}>{email}</a>
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
									{format === 'icon' ? (
										<div className="d-flex flex-row">
											<div>
												{renderContactIcon('phone-volume')}
											</div>
											<div>
												{React.createElement(titleTag || 'h5', { className: titleClasses }, __('Phone', 'codeweber-gutenberg-blocks'))}
												<a href="tel:#" className={textClasses}>
													{__('Phone will be displayed here', 'codeweber-gutenberg-blocks')}
												</a>
											</div>
										</div>
									) : (
										<div>
											<a href="tel:#" className={textClasses}>
												{__('Phone will be displayed here', 'codeweber-gutenberg-blocks')}
											</a>
										</div>
									)}
								</div>
							);
						}

						return (
							<div>
								{format === 'icon' ? (
									<div className="d-flex flex-row">
										<div>
											{renderContactIcon('phone-volume')}
										</div>
										<div>
											{React.createElement(titleTag || 'h5', { className: titleClasses }, __('Phone', 'codeweber-gutenberg-blocks'))}
											{phoneData.map((phone, phoneIndex) => (
												<span key={phoneIndex}>
													<a href={`tel:${phone.clean}`} className={textClasses}>
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
												<a href={`tel:${phone.clean}`} className={textClasses}>
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
	const { 
		items = [], 
		format = 'simple',
		textColor = '',
		textColorType = 'solid',
		iconColor = 'primary',
		iconFontSize = 'fs-28',
		iconSize = 'md',
	} = attributes;
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
					<ContactsPreview 
						items={items} 
						contactsData={contactsData} 
						format={format}
						attributes={attributes}
					/>
				)}
			</div>
		</>
	);
};

export default ContactsEdit;

