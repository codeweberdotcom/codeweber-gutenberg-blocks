/**
 * Contacts Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { ContactsSidebar } from './sidebar';
import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';
import { IconRender } from '../../components/icon/IconRender';

const SCHED_ORDER = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
];

// Editor-side port of OpeningHours::buildDisplay (preview only).
const buildScheduleDisplay = (rows, dayNames, today, opts) => {
	if (!rows) {
		return [];
	}
	const dayFormat = opts.dayFormat || 'short';
	const breakMode = opts.breakMode || 'both';
	const group = !!opts.groupSameDays;
	const sepKey = opts.separator || 'ndash';
	const sepMap = {
		mdash: ' \u2014 ',
		to: ` ${__('to', 'codeweber-gutenberg-blocks')} `,
		ndash: ' \u2013 ',
	};
	const sep = sepMap[sepKey] || sepMap.ndash;
	const dayoff = opts.dayoffLabel ?? __('Day off', 'codeweber-gutenberg-blocks');
	const names = (dayNames && dayNames[dayFormat]) || {};
	const fmt = (r) => {
		if (!r || r.closed) {
			return { closed: true, lines: [dayoff] };
		}
		const end1 = r.c1 !== '' ? r.c1 : r.c2;
		if (breakMode === 'range') {
			const end = r.c2 !== '' ? r.c2 : r.c1;
			return { closed: false, lines: [`${r.o1}${sep}${end}`] };
		}
		const first = `${r.o1}${sep}${end1}`;
		const hasSecond = r.o2 !== '' && r.c2 !== '';
		if (!hasSecond) {
			return { closed: false, lines: [first] };
		}
		const second = `${r.o2}${sep}${r.c2}`;
		if (breakMode === 'second-line') {
			return { closed: false, lines: [first, second] };
		}
		return { closed: false, lines: [`${first}, ${second}`] };
	};
	const formatted = {};
	SCHED_ORDER.forEach((d) => {
		formatted[d] = fmt(rows[d]);
	});
	const display = [];
	let i = 0;
	while (i < SCHED_ORDER.length) {
		const d = SCHED_ORDER[i];
		const sig = formatted[d].lines.join('|') + (formatted[d].closed ? 'C' : 'O');
		let j = i;
		if (group) {
			while (j + 1 < SCHED_ORDER.length) {
				const nd = SCHED_ORDER[j + 1];
				const nsig = formatted[nd].lines.join('|') + (formatted[nd].closed ? 'C' : 'O');
				if (nsig === sig) {
					j += 1;
				} else {
					break;
				}
			}
		}
		let label = names[SCHED_ORDER[i]] || SCHED_ORDER[i];
		if (j > i) {
			label += `\u2013${names[SCHED_ORDER[j]] || SCHED_ORDER[j]}`;
		}
		let isToday = false;
		for (let k = i; k <= j; k += 1) {
			if (SCHED_ORDER[k] === today) {
				isToday = true;
				break;
			}
		}
		display.push({
			label,
			lines: formatted[SCHED_ORDER[i]].lines,
			closed: formatted[SCHED_ORDER[i]].closed,
			is_today: isToday,
			single: j === i,
		});
		i = j + 1;
	}
	return display;
};

const ContactsPreview = ({
	items,
	contactsData,
	format = 'simple',
	attributes = {},
}) => {
	const {
		titleTag = 'div',
		titleColor = '',
		titleColorType = 'solid',
		titleSize = 'h5',
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
		iconWrapperClass = 'mb-3',
		iconGradientColor = 'gradient-1',
		customSvgUrl = '',
		customSvgSize = 0,
		itemClass = '',
		theme = 'default',
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

	// default = без text-light/text-dark; dark = text-dark; light = text-light
	const themeColorClass =
		theme === 'dark' ? 'text-dark' : theme === 'light' ? 'text-light' : null;

	// Генерируем классы для заголовка (при default не добавляем text-light/text-dark)
	const getTitleClasses = () => {
		const classes = ['mb-1'];
		if (themeColorClass) {
			classes.push(themeColorClass);
		} else if (theme === 'default') {
			// Тема по умолчанию — цвет из вкладки Текст, но без text-light/text-dark
			const colorClass = generateColorClass(titleColor, titleColorType, 'text');
			if (colorClass && colorClass !== 'text-light' && colorClass !== 'text-dark') {
				classes.push(colorClass);
			}
		} else {
			classes.push(generateColorClass(titleColor, titleColorType, 'text'));
		}
		classes.push(...generateTypographyClasses(attributes, 'title'));
		if (titleClass) {
			classes.push(titleClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	// Генерируем классы для текста (при default не добавляем text-light/text-dark)
	const getTextClasses = () => {
		const classes = [];
		if (themeColorClass) {
			classes.push(themeColorClass);
		} else if (theme === 'default') {
			const colorClass = generateColorClass(textColor, textColorType, 'text');
			if (colorClass && colorClass !== 'text-light' && colorClass !== 'text-dark') {
				classes.push(colorClass);
			}
		} else {
			classes.push(generateColorClass(textColor, textColorType, 'text'));
		}
		classes.push(...generateTypographyClasses(attributes, 'text'));
		if (textClass) {
			classes.push(textClass);
		}
		return classes.filter(Boolean).join(' ');
	};

	const titleClasses = getTitleClasses();
	let textClasses = getTextClasses();
	// Добавляем mb-0 для address
	if (textTag === 'address') {
		textClasses = textClasses ? `${textClasses} mb-0` : 'mb-0';
	}

	// Функция для рендеринга иконки контакта (для формата 'icon' - обёртка работает, но без mt-n1)
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

		// Для формата 'icon':
		// - если iconWrapper = true: только me-4 (без mt-n1) - классы передаются в IconRender
		// - если iconWrapper = false: me-4 mt-n1 - нужно обернуть в div, т.к. IconRender не создаёт обёртку
		if (iconWrapper) {
			// С обёрткой - классы передаются в IconRender через iconWrapperClass
			const wrapperClassForIcon = iconWrapperClass
				? `${iconWrapperClass} me-4`
				: 'me-4';
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
					iconWrapperClass={wrapperClassForIcon}
					iconGradientColor={iconGradientColor}
					customSvgUrl={customSvgUrlToUse}
					customSvgSize={customSvgSize}
					isEditor={true}
				/>
			);
		} else {
			// Без обёртки - оборачиваем в div с классами me-4 mt-n1
			const wrapperClassForIcon = iconWrapperClass
				? `${iconWrapperClass} me-4 mt-n1`
				: 'me-4 mt-n1';
			return (
				<div className={wrapperClassForIcon}>
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
						iconWrapper={false}
						iconWrapperStyle=""
						iconBtnSize=""
						iconBtnVariant="soft"
						iconWrapperClass=""
						iconGradientColor={iconGradientColor}
						customSvgUrl={customSvgUrlToUse}
						customSvgSize={customSvgSize}
						isEditor={true}
					/>
				</div>
			);
		}
	};

	// Функция для рендеринга простой иконки (без обёртки, только иконка с классом me-2)
	const renderSimpleIcon = (iconNameForContact) => {
		// Если пользователь выбрал иконку - используем её, иначе используем предустановленную для типа контакта
		let iconNameToUse = iconName || iconNameForContact;
		let svgIconToUse = svgIcon;
		let customSvgUrlToUse = customSvgUrl;

		// Если тип иконки none или нет данных - не показываем
		if (iconType === 'none') return null;

		// Для font иконок: если пользователь не выбрал, используем предустановленную
		if (iconType === 'font') {
			if (!iconNameToUse) return null;
			// Простая font иконка без обёртки (Font Size применяется)
			const iconClasses = ['uil', `uil-${iconNameToUse}`, 'me-2'];
			if (iconFontSize) {
				iconClasses.push(iconFontSize);
			}
			if (iconColor) {
				iconClasses.push(`text-${iconColor}`);
			}
			if (iconClass) {
				iconClasses.push(iconClass);
			}
			return <i className={iconClasses.filter(Boolean).join(' ')}></i>;
		}

		// Для SVG иконок
		if (iconType === 'svg' && svgIconToUse) {
			// Для SVG используем IconRender, но без обёртки
			return (
				<IconRender
					iconType={iconType}
					iconName=""
					svgIcon={svgIconToUse}
					svgStyle={svgStyle}
					iconSize={iconSize}
					iconFontSize={iconFontSize}
					iconColor={iconColor}
					iconColor2={iconColor2}
					iconClass={`${iconClass} me-2`}
					iconWrapper={false}
					iconWrapperStyle=""
					iconBtnSize=""
					iconBtnVariant="soft"
					iconWrapperClass=""
					iconGradientColor={iconGradientColor}
					customSvgUrl=""
					isEditor={true}
				/>
			);
		}

		// Для custom иконок
		if (iconType === 'custom' && customSvgUrlToUse) {
			return (
				<IconRender
					iconType={iconType}
					iconName=""
					svgIcon=""
					svgStyle="lineal"
					iconSize={iconSize}
					iconFontSize={iconFontSize}
					iconColor={iconColor}
					iconColor2=""
					iconClass={`${iconClass} me-2`}
					iconWrapper={false}
					iconWrapperStyle=""
					iconBtnSize=""
					iconBtnVariant="soft"
					iconWrapperClass=""
					iconGradientColor={iconGradientColor}
					customSvgUrl={customSvgUrlToUse}
					customSvgSize={customSvgSize}
					isEditor={true}
				/>
			);
		}

		return null;
	};

	return (
		<div className="codeweber-contacts-preview">
			{enabledItems.map((item, index) => (
				<div
					key={index}
					className={[
						'codeweber-contacts-preview-item',
						itemClass || '',
					]
						.filter(Boolean)
						.join(' ')}
				>
					{item.type === 'address' &&
						(() => {
							const addressType = item.addressType || 'legal';
							const address =
								contactsData?.address?.[addressType] || '';
							if (!address) {
								return (
									<div>
										{format === 'icon' ? (
											<div
												className={`d-flex flex-row ${iconWrapperClass || ''}`}
											>
												<div>
													{renderContactIcon(
														'location-pin-alt'
													)}
												</div>
												<div>
													{React.createElement(
														titleTag || 'div',
														{
															className:
																titleClasses,
														},
														__(
															'Address',
															'codeweber-gutenberg-blocks'
														)
													)}
													{React.createElement(
														textTag || 'address',
														{
															className:
																textClasses,
														},
														__(
															'Address will be displayed here',
															'codeweber-gutenberg-blocks'
														)
													)}
												</div>
											</div>
										) : format === 'icon-simple' ? (
											<div>
												{React.createElement(
													textTag || 'address',
													{ className: textClasses },
													<>
														{renderSimpleIcon(
															'location-pin-alt'
														)}
														<span>
															{__(
																'Address will be displayed here',
																'codeweber-gutenberg-blocks'
															)}
														</span>
													</>
												)}
											</div>
										) : (
											<div>
												{React.createElement(
													textTag || 'address',
													{
														className: `pe-xl-15 pe-xxl-17 ${textClasses}`,
													},
													__(
														'Address will be displayed here',
														'codeweber-gutenberg-blocks'
													)
												)}
											</div>
										)}
									</div>
								);
							}

							return (
								<div>
									{format === 'icon' ? (
										<div
											className={`d-flex flex-row ${iconWrapperClass || ''}`}
										>
											<div>
												{renderContactIcon(
													'location-pin-alt'
												)}
											</div>
											<div>
												{React.createElement(
													titleTag || 'div',
													{ className: titleClasses },
													__(
														'Address',
														'codeweber-gutenberg-blocks'
													)
												)}
												{React.createElement(
													textTag || 'address',
													{ className: textClasses },
													address
												)}
											</div>
										</div>
									) : format === 'icon-simple' ? (
										<div>
											{React.createElement(
												textTag || 'address',
												{ className: textClasses },
												<>
													{renderSimpleIcon(
														'location-pin-alt'
													)}
													<span>{address}</span>
												</>
											)}
										</div>
									) : (
										<div>
											<address
												className={`pe-xl-15 pe-xxl-17 ${textClasses}`}
											>
												{address}
											</address>
										</div>
									)}
								</div>
							);
						})()}

					{item.type === 'email' &&
						(() => {
							const email = contactsData?.email || '';
							if (!email) {
								return (
									<div>
										{format === 'icon' ? (
											<div
												className={`d-flex flex-row ${iconWrapperClass || ''}`}
											>
												<div>
													{renderContactIcon(
														'envelope'
													)}
												</div>
												<div>
													{React.createElement(
														titleTag || 'h5',
														{
															className:
																titleClasses,
														},
														__(
															'E-mail',
															'codeweber-gutenberg-blocks'
														)
													)}
													<p className="mb-0">
														<a
															href="mailto:#"
															className={`link-body ${textClasses}`}
														>
															{__(
																'Email will be displayed here',
																'codeweber-gutenberg-blocks'
															)}
														</a>
													</p>
												</div>
											</div>
										) : format === 'icon-simple' ? (
											<div>
												<a
													href="mailto:#"
													className={`d-flex align-items-center ${textClasses}`}
												>
													{renderSimpleIcon(
														'envelope'
													)}
													<span>
														{__(
															'Email will be displayed here',
															'codeweber-gutenberg-blocks'
														)}
													</span>
												</a>
											</div>
										) : (
											<div>
												<a
													href="mailto:#"
													className={textClasses}
												>
													{__(
														'Email will be displayed here',
														'codeweber-gutenberg-blocks'
													)}
												</a>
											</div>
										)}
									</div>
								);
							}

							return (
								<div>
									{format === 'icon' ? (
										<div
											className={`d-flex flex-row ${iconWrapperClass || ''}`}
										>
											<div>
												{renderContactIcon('envelope')}
											</div>
											<div>
												{React.createElement(
													titleTag || 'h5',
													{ className: titleClasses },
													__(
														'E-mail',
														'codeweber-gutenberg-blocks'
													)
												)}
												<p className="mb-0">
													<a
														href={`mailto:${email}`}
														className={`link-body ${textClasses}`}
													>
														{email}
													</a>
												</p>
											</div>
										</div>
									) : format === 'icon-simple' ? (
										<div>
											<a
												href={`mailto:${email}`}
												className={`d-flex align-items-center ${textClasses}`}
											>
												{renderSimpleIcon('envelope')}
												<span>{email}</span>
											</a>
										</div>
									) : (
										<div>
											<a
												href={`mailto:${email}`}
												className={textClasses}
											>
												{email}
											</a>
										</div>
									)}
								</div>
							);
						})()}

					{item.type === 'phone' &&
						(() => {
							const phones = item.phones || [];
							const phoneData = phones
								.map(
									(phoneKey) =>
										contactsData?.phones?.[phoneKey]
								)
								.filter(Boolean);

							if (phoneData.length === 0) {
								return (
									<div>
										{format === 'icon' ? (
											<div className="d-flex flex-row">
												<div>
													{renderContactIcon(
														'phone-volume'
													)}
												</div>
												<div>
													{React.createElement(
														titleTag || 'h5',
														{
															className:
																titleClasses,
														},
														__(
															'Phone',
															'codeweber-gutenberg-blocks'
														)
													)}
													<a
														href="tel:#"
														className={textClasses}
													>
														{__(
															'Phone will be displayed here',
															'codeweber-gutenberg-blocks'
														)}
													</a>
												</div>
											</div>
										) : format === 'icon-simple' ? (
											<div>
												<a
													href="tel:#"
													className={`d-flex align-items-center ${textClasses}`}
												>
													{renderSimpleIcon(
														'phone-volume'
													)}
													<span>
														{__(
															'Phone will be displayed here',
															'codeweber-gutenberg-blocks'
														)}
													</span>
												</a>
											</div>
										) : (
											<div>
												<a
													href="tel:#"
													className={textClasses}
												>
													{__(
														'Phone will be displayed here',
														'codeweber-gutenberg-blocks'
													)}
												</a>
											</div>
										)}
									</div>
								);
							}

							return (
								<div>
									{format === 'icon' ? (
										<div
											className={`d-flex flex-row ${iconWrapperClass || ''}`}
										>
											<div>
												{renderContactIcon(
													'phone-volume'
												)}
											</div>
											<div>
												{React.createElement(
													titleTag || 'h5',
													{ className: titleClasses },
													__(
														'Phone',
														'codeweber-gutenberg-blocks'
													)
												)}
												{phoneData.map(
													(phone, phoneIndex) => (
														<span key={phoneIndex}>
															<a
																href={`tel:${phone.clean}`}
																className={
																	textClasses
																}
															>
																{phone.display}
															</a>
														</span>
													)
												)}
											</div>
										</div>
									) : format === 'icon-simple' ? (
										<div>
											{phoneData.map(
												(phone, phoneIndex) => (
													<span key={phoneIndex}>
														<a
															href={`tel:${phone.clean}`}
															className={`d-flex align-items-center ${textClasses}`}
														>
															{renderSimpleIcon(
																'phone-volume'
															)}
															<span>
																{phone.display}
															</span>
														</a>
													</span>
												)
											)}
										</div>
									) : (
										<div>
											{phoneData.map(
												(phone, phoneIndex) => (
													<span key={phoneIndex}>
														<a
															href={`tel:${phone.clean}`}
															className={
																textClasses
															}
														>
															{phone.display}
														</a>
													</span>
												)
											)}
										</div>
									)}
								</div>
							);
						})()}
					{item.type === 'schedule' &&
						(() => {
							const sched = contactsData?.schedule;
							const display = buildScheduleDisplay(
								sched?.rows,
								sched?.dayNames,
								sched?.today,
								{
									dayFormat: item.dayFormat,
									breakMode: item.breakMode,
									groupSameDays: item.groupSameDays,
									separator: item.timeSeparator,
									dayoffLabel: item.dayoffLabel ?? __('Day off', 'codeweber-gutenberg-blocks'),
								}
							);
							const isOpen = !!sched?.isOpen;
							const highlight = item.highlightToday !== false;
							const todayLabel = item.todayLabel ?? '';
							const showStatus = !!item.showStatus;
							const titleText = item.title ?? __('Opening hours', 'codeweber-gutenberg-blocks');
							const statusText = isOpen
								? item.openLabel ?? __('Open now', 'codeweber-gutenberg-blocks')
								: item.closedLabel ?? __('Closed', 'codeweber-gutenberg-blocks');
							const statusBadge = showStatus ? (
								<span className={isOpen ? 'text-success' : 'text-danger'}>
									{` \u2014 ${statusText}`}
								</span>
							) : null;
							const list = (
								<div className={`cwgb-oh-list ${textClasses}`}>
									{display.map((row, i) => {
										const rowToday = highlight && row.is_today;
										return (
											<div
												key={i}
												className={`d-flex justify-content-between${rowToday ? ' fw-bold' : ''}`}
											>
												<span className="cwgb-oh-day pe-3">
													{row.label}
													{rowToday && row.single && todayLabel
														? ` ${todayLabel}`
														: ''}
												</span>
												<span className={`cwgb-oh-time${row.closed ? ' text-muted' : ''}`}>
													{(row.lines || []).map((ln, k) => (
														<React.Fragment key={k}>
															{k > 0 && <br />}
															{ln}
														</React.Fragment>
													))}
												</span>
											</div>
										);
									})}
								</div>
							);
							if (!display.length) {
								return (
									<div className={textClasses}>
										{__('Opening hours will be displayed here', 'codeweber-gutenberg-blocks')}
									</div>
								);
							}
							const titleEl =
								titleText || statusBadge
									? React.createElement(
										titleTag || 'div',
										{ className: titleClasses },
										<>
											{titleText}
											{statusBadge}
										</>
									)
									: null;
							let body;
							if (format === 'icon') {
								body = (
									<div className={`d-flex flex-row ${iconWrapperClass || ''}`}>
										<div>{renderContactIcon('clock')}</div>
										<div>
											{titleEl}
											{list}
										</div>
									</div>
								);
							} else if (format === 'icon-simple') {
								body = (
									<div>
										<div className={`d-flex align-items-center ${textClasses}`}>
											{renderSimpleIcon('clock')}
											<span>
												{titleText}
												{statusBadge}
											</span>
										</div>
										{list}
									</div>
								);
							} else {
								body = (
									<div>
										{titleEl}
										{list}
									</div>
								);
							}
							return <div>{body}</div>;
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
		blockClass = '',
		blockId = '',
		blockData = '',
		theme = 'default',
	} = attributes;
	const [contactsData, setContactsData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Parse data attributes (key=value,key2=value2)
	const getDataAttributes = () => {
		if (!blockData) return {};
		const dataAttrs = {};
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s?.trim());
			if (key && value) dataAttrs[`data-${key}`] = value;
		});
		return dataAttrs;
	};

	const themeClass =
		theme === 'dark' ? 'text-dark' : theme === 'light' ? 'text-light' : '';
	const blockProps = useBlockProps({
		className: [
			'codeweber-contacts-block',
			blockClass,
			themeClass,
		]
			.filter(Boolean)
			.join(' '),
		id: blockId || undefined,
		...getDataAttributes(),
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
				<ContactsSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>
				{isLoading || !contactsData ? (
					<div className="codeweber-contacts-preview-empty">
						<p>
							{__(
								'Loading contacts data...',
								'codeweber-gutenberg-blocks'
							)}
						</p>
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
