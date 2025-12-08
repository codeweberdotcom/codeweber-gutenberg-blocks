/**
 * IconPicker - Модальное окно выбора иконки
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import {
	Modal,
	Button,
	TextControl,
	TabPanel,
	Spinner,
} from '@wordpress/components';

import { fontIcons } from '../../utilities/font_icon';
import { svgIconsLineal, svgIconsSolid, getSvgIconPath } from '../../utilities/svg_icons';
import { InlineSvg } from './InlineSvg';

/**
 * Компонент превью Font Icon
 */
const FontIconPreview = ({ iconName, isSelected, onClick }) => (
	<button
		type="button"
		className={`icon-picker-item ${isSelected ? 'is-selected' : ''}`}
		onClick={onClick}
		title={iconName}
	>
		<i className={`uil uil-${iconName}`}></i>
		<span className="icon-picker-item-label">{iconName}</span>
	</button>
);

/**
 * Компонент превью SVG Icon
 * Используем InlineSvg для корректного отображения
 */
const SvgIconPreview = ({ iconName, style, isSelected, onClick }) => (
	<button
		type="button"
		className={`icon-picker-item ${isSelected ? 'is-selected' : ''}`}
		onClick={onClick}
		title={iconName}
	>
		<InlineSvg
			src={getSvgIconPath(iconName, style)}
			className="icon-svg icon-svg-xs"
			alt={iconName}
		/>
		<span className="icon-picker-item-label">{iconName}</span>
	</button>
);

/**
 * IconPicker Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Открыто ли модальное окно
 * @param {Function} props.onClose - Callback закрытия
 * @param {Function} props.onSelect - Callback выбора иконки
 * @param {string} props.selectedIcon - Текущая выбранная иконка
 * @param {string} props.selectedType - Тип: 'font', 'svg-lineal', 'svg-solid'
 * @param {string} props.initialTab - Начальная вкладка
 * @param {boolean} props.allowFont - Разрешить вкладку Font Icons (по умолчанию true)
 * @param {boolean} props.allowSvgLineal - Разрешить вкладку SVG Lineal (по умолчанию true)
 * @param {boolean} props.allowSvgSolid - Разрешить вкладку SVG Solid (по умолчанию true)
 */
export const IconPicker = ({
	isOpen,
	onClose,
	onSelect,
	selectedIcon = '',
	selectedType = 'font',
	initialTab = 'font',
	allowFont = true,
	allowSvgLineal = true,
	allowSvgSolid = true,
}) => {
	// Убеждаемся, что initialTab соответствует одной из разрешенных вкладок
	const getValidInitialTab = () => {
		const allTabs = [
			{ name: 'font', allowed: allowFont },
			{ name: 'svg-lineal', allowed: allowSvgLineal },
			{ name: 'svg-solid', allowed: allowSvgSolid },
		];
		const allowedTabs = allTabs.filter(tab => tab.allowed);
		if (allowedTabs.length === 0) return 'font'; // Fallback
		const validTab = allowedTabs.find(tab => tab.name === initialTab);
		return validTab ? validTab.name : allowedTabs[0].name;
	};
	
	const [searchTerm, setSearchTerm] = useState('');
	const [activeTab, setActiveTab] = useState(getValidInitialTab());

	// Фильтрация Font Icons
	const filteredFontIcons = useMemo(() => {
		if (!searchTerm) {
			return fontIcons.slice(0, 200); // Показываем первые 200 по умолчанию
		}
		const term = searchTerm.toLowerCase();
		return fontIcons.filter(
			(icon) =>
				icon.label.toLowerCase().includes(term) ||
				icon.value.toLowerCase().includes(term)
		);
	}, [searchTerm]);

	// Фильтрация SVG Lineal Icons
	const filteredLinealIcons = useMemo(() => {
		if (!searchTerm) {
			return svgIconsLineal;
		}
		const term = searchTerm.toLowerCase();
		return svgIconsLineal.filter(
			(icon) =>
				icon.label.toLowerCase().includes(term) ||
				icon.value.toLowerCase().includes(term)
		);
	}, [searchTerm]);

	// Фильтрация SVG Solid Icons
	const filteredSolidIcons = useMemo(() => {
		if (!searchTerm) {
			return svgIconsSolid;
		}
		const term = searchTerm.toLowerCase();
		return svgIconsSolid.filter(
			(icon) =>
				icon.label.toLowerCase().includes(term) ||
				icon.value.toLowerCase().includes(term)
		);
	}, [searchTerm]);

	// Обработчик выбора иконки
	const handleSelect = (iconValue, type) => {
		onSelect({
			iconType: type === 'font' ? 'font' : 'svg',
			iconName: type === 'font' ? iconValue : '',
			svgIcon: type !== 'font' ? iconValue : '',
			svgStyle: type === 'svg-solid' ? 'solid' : 'lineal',
		});
		onClose();
	};

	// Табы
	const tabs = [
		{
			name: 'font',
			title: __('Font Icons', 'codeweber-gutenberg-blocks'),
			className: 'icon-picker-tab',
		},
		{
			name: 'svg-lineal',
			title: __('SVG Lineal', 'codeweber-gutenberg-blocks'),
			className: 'icon-picker-tab',
		},
		{
			name: 'svg-solid',
			title: __('SVG Solid', 'codeweber-gutenberg-blocks'),
			className: 'icon-picker-tab',
		},
	];

	if (!isOpen) {
		return null;
	}
	// Если нет доступных вкладок, показываем сообщение
	if (tabs.length === 0) {
		return (
			<Modal
				title={__('Select Icon', 'codeweber-gutenberg-blocks')}
				onRequestClose={onClose}
				className="icon-picker-modal"
				isFullScreen={false}
			>
				<p>{__('No icon tabs available', 'codeweber-gutenberg-blocks')}</p>
				<div className="icon-picker-footer">
					<Button variant="tertiary" onClick={onClose}>
						{__('Close', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>
			</Modal>
		);
	}


	return (
		<Modal
			title={__('Select Icon', 'codeweber-gutenberg-blocks')}
			onRequestClose={onClose}
			className="icon-picker-modal"
			isFullScreen={false}
		>
			<div className="icon-picker-search">
				<TextControl
					placeholder={__('Search icon...', 'codeweber-gutenberg-blocks')}
					value={searchTerm}
					onChange={setSearchTerm}
					__nextHasNoMarginBottom
				/>
			</div>

			<TabPanel
				className="icon-picker-tabs"
				tabs={tabs}
				initialTabName={activeTab}
				onSelect={setActiveTab}
			>
				{(tab) => (
					<div className="icon-picker-grid">
						{tab.name === 'font' && (
							<>
								{filteredFontIcons.length === 0 ? (
									<p className="icon-picker-no-results">
										{__('No icons found', 'codeweber-gutenberg-blocks')}
									</p>
								) : (
									filteredFontIcons.map((icon) => (
										<FontIconPreview
											key={icon.value}
											iconName={icon.value.replace('uil-', '')}
											isSelected={
												selectedType === 'font' &&
												selectedIcon === icon.value.replace('uil-', '')
											}
											onClick={() =>
												handleSelect(icon.value.replace('uil-', ''), 'font')
											}
										/>
									))
								)}
								{!searchTerm && filteredFontIcons.length === 200 && (
									<p className="icon-picker-hint">
										{__('Enter search query to display all icons', 'codeweber-gutenberg-blocks')}
									</p>
								)}
							</>
						)}

						{tab.name === 'svg-lineal' && (
							<>
								{filteredLinealIcons.length === 0 ? (
									<p className="icon-picker-no-results">
										{__('No icons found', 'codeweber-gutenberg-blocks')}
									</p>
								) : (
									filteredLinealIcons.map((icon) => (
										<SvgIconPreview
											key={icon.value}
											iconName={icon.value}
											style="lineal"
											isSelected={
												selectedType === 'svg-lineal' &&
												selectedIcon === icon.value
											}
											onClick={() => handleSelect(icon.value, 'svg-lineal')}
										/>
									))
								)}
							</>
						)}

						{tab.name === 'svg-solid' && (
							<>
								{filteredSolidIcons.length === 0 ? (
									<p className="icon-picker-no-results">
										{__('No icons found', 'codeweber-gutenberg-blocks')}
									</p>
								) : (
									filteredSolidIcons.map((icon) => (
										<SvgIconPreview
											key={icon.value}
											iconName={icon.value}
											style="solid"
											isSelected={
												selectedType === 'svg-solid' &&
												selectedIcon === icon.value
											}
											onClick={() => handleSelect(icon.value, 'svg-solid')}
										/>
									))
								)}
							</>
						)}
					</div>
				)}
			</TabPanel>

			<div className="icon-picker-footer">
				<Button
					variant="secondary"
					onClick={() => {
						onSelect({
							iconType: 'none',
							iconName: '',
							svgIcon: '',
							svgStyle: 'lineal',
						});
						onClose();
					}}
				>
					{__('Remove Icon', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button variant="tertiary" onClick={onClose}>
					{__('Cancel', 'codeweber-gutenberg-blocks')}
				</Button>
			</div>
		</Modal>
	);
};

export default IconPicker;

