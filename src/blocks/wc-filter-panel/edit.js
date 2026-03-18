/**
 * WC Filter Panel — Edit component
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TabPanel,
	Button,
	SelectControl,
	ComboboxControl,
	ToggleControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { settings, trash as trashIcon } from '@wordpress/icons';
import { colors } from '../../utilities/colors';
import { shapes } from '../../utilities/shapes';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';

function generateId() {
	return 'item-' + Math.random().toString( 36 ).substr( 2, 9 );
}

const FILTER_TYPE_OPTIONS = [
	{ label: __( 'Цена (слайдер)', 'codeweber-gutenberg-blocks' ), value: 'price' },
	{ label: __( 'Категории', 'codeweber-gutenberg-blocks' ), value: 'categories' },
	{ label: __( 'Метки', 'codeweber-gutenberg-blocks' ), value: 'tags' },
	{ label: __( 'Рейтинг', 'codeweber-gutenberg-blocks' ), value: 'rating' },
	{ label: __( 'Наличие', 'codeweber-gutenberg-blocks' ), value: 'stock' },
	{ label: __( 'Атрибут WC', 'codeweber-gutenberg-blocks' ), value: 'attributes' },
];

const DISPLAY_MODE_OPTIONS = [
	{ label: __( 'Чекбоксы', 'codeweber-gutenberg-blocks' ), value: 'checkbox' },
	{ label: __( 'Радиокнопки', 'codeweber-gutenberg-blocks' ), value: 'radio' },
	{ label: __( 'Список ссылок', 'codeweber-gutenberg-blocks' ), value: 'list' },
	{ label: __( 'Кнопки', 'codeweber-gutenberg-blocks' ), value: 'button' },
];

// Only for attributes filterType — swatch display modes
const DISPLAY_MODE_OPTIONS_ATTR = [
	...DISPLAY_MODE_OPTIONS,
	{ label: __( 'Цветовые свотчи', 'codeweber-gutenberg-blocks' ), value: 'color' },
	{ label: __( 'Изображения (свотчи)', 'codeweber-gutenberg-blocks' ), value: 'image' },
];

const QUERY_TYPE_OPTIONS = [
	{ label: __( 'OR — любой из выбранных', 'codeweber-gutenberg-blocks' ), value: 'or' },
	{ label: __( 'AND — все из выбранных', 'codeweber-gutenberg-blocks' ), value: 'and' },
];

const EMPTY_BEHAVIOR_OPTIONS = [
	{ label: __( 'По умолчанию (показывать всё)', 'codeweber-gutenberg-blocks' ), value: 'default' },
	{ label: __( 'Скрывать отсутствующие', 'codeweber-gutenberg-blocks' ), value: 'hide' },
	{ label: __( 'Делать неактивными', 'codeweber-gutenberg-blocks' ), value: 'disable' },
	{ label: __( 'Неактивные, но кликабельные', 'codeweber-gutenberg-blocks' ), value: 'disable_clickable' },
	{ label: __( 'Скрыть блок (если все пусты)', 'codeweber-gutenberg-blocks' ), value: 'hide_block' },
];

const LIMIT_TYPE_OPTIONS = [
	{ label: __( 'Без ограничения', 'codeweber-gutenberg-blocks' ), value: 'none' },
	{ label: __( 'По количеству элементов', 'codeweber-gutenberg-blocks' ), value: 'count' },
	{ label: __( 'По высоте блока (px)', 'codeweber-gutenberg-blocks' ), value: 'height' },
];

const ITEM_TYPE_OPTIONS = [
	{ label: __( 'Фильтр', 'codeweber-gutenberg-blocks' ), value: 'filter' },
	{ label: __( 'Кнопка сброса', 'codeweber-gutenberg-blocks' ), value: 'reset_button' },
	{ label: __( 'Активные фильтры (чипы)', 'codeweber-gutenberg-blocks' ), value: 'active_chips' },
];

const FILTER_TYPE_LABELS = {
	price: __( 'Цена', 'codeweber-gutenberg-blocks' ),
	categories: __( 'Категории', 'codeweber-gutenberg-blocks' ),
	tags: __( 'Метки', 'codeweber-gutenberg-blocks' ),
	rating: __( 'Рейтинг', 'codeweber-gutenberg-blocks' ),
	stock: __( 'Наличие', 'codeweber-gutenberg-blocks' ),
	attributes: __( 'Атрибут WC', 'codeweber-gutenberg-blocks' ),
};

const ITEM_TYPE_LABELS = {
	filter: __( 'Фильтр', 'codeweber-gutenberg-blocks' ),
	reset_button: __( 'Кнопка сброса', 'codeweber-gutenberg-blocks' ),
	active_chips: __( 'Активные фильтры', 'codeweber-gutenberg-blocks' ),
};

const HEADING_TAG_OPTIONS = [
	{ label: 'h2', value: 'h2' },
	{ label: 'h3', value: 'h3' },
	{ label: 'h4', value: 'h4' },
	{ label: 'h5', value: 'h5' },
	{ label: 'h6', value: 'h6' },
	{ label: 'p', value: 'p' },
];

const SECTION_STYLE_OPTIONS = [
	{ label: __( 'Открытые секции (plain)', 'codeweber-gutenberg-blocks' ), value: 'plain' },
	{ label: __( 'Аккордеон (collapse)', 'codeweber-gutenberg-blocks' ), value: 'accordion' },
];

const CHECKBOX_SIZE_OPTIONS = [
	{ label: __( 'Стандартный', 'codeweber-gutenberg-blocks' ), value: '' },
	{ label: __( 'Маленький (form-check-sm)', 'codeweber-gutenberg-blocks' ), value: 'sm' },
];

const CHECKBOX_COLUMNS_OPTIONS = [
	{ label: __( '1 колонка', 'codeweber-gutenberg-blocks' ), value: 1 },
	{ label: __( '2 колонки', 'codeweber-gutenberg-blocks' ), value: 2 },
];

const ROW_STYLE = {
	display: 'flex',
	alignItems: 'center',
	gap: '4px',
	marginBottom: '4px',
	padding: '4px 8px',
	background: '#f9f9f9',
	borderRadius: '4px',
};

const ICON_BTN_STYLE = { padding: 0, minWidth: 0 };
const ACTION_BTN_STYLE = { fontSize: '16px' };

const TOGGLE_WRAP_STYLE = {
	flex: '1',
	minWidth: 0,
	marginBottom: 0,
};

const SVG_UP = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" focusable="false">
		<path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z" />
	</svg>
);

const SVG_DOWN = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true" focusable="false">
		<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" />
	</svg>
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		items,
		sectionStyle,
		sectionsOpen,
		wrapperClass,
		headingTag,
		headingClass,
		checkboxSize,
		checkboxItemClass,
		radioSize,
		radioItemClass,
		buttonSize,
		buttonStyle,
		buttonColor,
		buttonShape,
		buttonExtraClass,
		resetLabel,
	} = attributes;

	const [ wcAttributes, setWcAttributes ] = useState( [] );
	const [ expandedIndex, setExpandedIndex ] = useState( null );

	useEffect( () => {
		apiFetch( { path: '/codeweber-gutenberg-blocks/v1/wc-attributes' } )
			.then( ( data ) => setWcAttributes( data || [] ) )
			.catch( () => setWcAttributes( [] ) );
	}, [] );

	const blockProps = useBlockProps( {
		className: 'cwgb-wc-filter-panel cwgb-editor-preview',
	} );

	const taxonomyOptions = [
		{ label: __( '— выберите атрибут —', 'codeweber-gutenberg-blocks' ), value: '' },
		...wcAttributes.map( ( a ) => ( { label: a.name, value: a.slug } ) ),
	];

	function updateItem( index, updates ) {
		setAttributes( {
			items: items.map( ( item, i ) => ( i === index ? { ...item, ...updates } : item ) ),
		} );
	}

	function deleteItem( index ) {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
		if ( expandedIndex === index ) setExpandedIndex( null );
	}

	function moveItem( index, direction ) {
		const newItems = [ ...items ];
		const target = index + direction;
		if ( target < 0 || target >= newItems.length ) return;
		[ newItems[ index ], newItems[ target ] ] = [ newItems[ target ], newItems[ index ] ];
		setAttributes( { items: newItems } );
	}

	function addItem( type ) {
		const newItem = {
			id: generateId(),
			type,
			filterType: 'categories',
			label: '',
			displayMode: 'checkbox',
			queryType: 'or',
			taxonomy: '',
			showCount: true,
			checkboxColumns: 1,
			swatchColumns: 0,
			swatchItemClass: '',
			emptyBehavior: 'disable',
			itemClass: '',
			limitType: 'none',
			limitValue: 5,
			showMoreText: '',
			showLessText: '',
			enabled: true,
		};
		setAttributes( { items: [ ...items, newItem ] } );
		setExpandedIndex( items.length );
	}

	function getItemLabel( item ) {
		if ( item.type !== 'filter' ) return ITEM_TYPE_LABELS[ item.type ] || item.type;
		const typeLabel = FILTER_TYPE_LABELS[ item.filterType ] || item.filterType;
		return item.label ? `${ typeLabel } — ${ item.label }` : typeLabel;
	}

	return (
		<>
			<InspectorControls>
				<TabPanel
					tabs={ [
						{ name: 'filters', title: __( 'Фильтры', 'codeweber-gutenberg-blocks' ) },
						{ name: 'style',   title: __( 'Оформление', 'codeweber-gutenberg-blocks' ) },
					] }
				>
					{ ( tab ) => (
						<>
							{ tab.name === 'filters' && (
								<PanelBody initialOpen={ true }>
									{ items.length === 0 && (
										<p className="description">
											{ __( 'Добавьте хотя бы один элемент.', 'codeweber-gutenberg-blocks' ) }
										</p>
									) }

									{ items.map( ( item, index ) => {
										const isExpanded = expandedIndex === index;
										const showDisplayMode = [ 'categories', 'tags', 'attributes' ].includes( item.filterType );
										const isEnabled = item.enabled !== false;

										return (
											<div key={ item.id }>
												{ /* ── Item row ── */ }
												<div style={ ROW_STYLE }>
													<Button
														icon={ SVG_UP }
														style={ ICON_BTN_STYLE }
														disabled={ index === 0 }
														onClick={ () => moveItem( index, -1 ) }
														label={ __( 'Переместить вверх', 'codeweber-gutenberg-blocks' ) }
													/>
													<Button
														icon={ SVG_DOWN }
														style={ ICON_BTN_STYLE }
														disabled={ index === items.length - 1 }
														onClick={ () => moveItem( index, 1 ) }
														label={ __( 'Переместить вниз', 'codeweber-gutenberg-blocks' ) }
													/>
													<div style={ TOGGLE_WRAP_STYLE }>
														<ToggleControl
															label={ getItemLabel( item ) }
															checked={ isEnabled }
															onChange={ ( val ) => updateItem( index, { enabled: val } ) }
														/>
													</div>
													<Button
														icon={ settings }
														style={ ACTION_BTN_STYLE }
														isPressed={ isExpanded }
														onClick={ () => setExpandedIndex( isExpanded ? null : index ) }
														label={ __( 'Настройки', 'codeweber-gutenberg-blocks' ) }
													/>
													<Button
														icon={ trashIcon }
														style={ ACTION_BTN_STYLE }
														isDestructive
														onClick={ () => deleteItem( index ) }
														label={ __( 'Удалить', 'codeweber-gutenberg-blocks' ) }
													/>
												</div>

												{ /* ── Expanded settings ── */ }
												{ isExpanded && (
													<div style={ { padding: '8px 8px 12px', borderLeft: '2px solid #e0e0e0', marginBottom: '8px' } }>
														<SelectControl
															label={ __( 'Тип элемента', 'codeweber-gutenberg-blocks' ) }
															value={ item.type }
															options={ ITEM_TYPE_OPTIONS }
															onChange={ ( val ) => updateItem( index, { type: val } ) }
														/>
														{ item.type === 'filter' && (
															<>
																<SelectControl
																	label={ __( 'Что фильтруем', 'codeweber-gutenberg-blocks' ) }
																	value={ item.filterType }
																	options={ FILTER_TYPE_OPTIONS }
																	onChange={ ( val ) => updateItem( index, { filterType: val } ) }
																/>
																{ item.filterType === 'attributes' && (
																	<SelectControl
																		label={ __( 'Атрибут WC', 'codeweber-gutenberg-blocks' ) }
																		value={ item.taxonomy }
																		options={ taxonomyOptions }
																		onChange={ ( val ) => updateItem( index, { taxonomy: val } ) }
																	/>
																) }
																<TextControl
																	label={ __( 'Заголовок секции', 'codeweber-gutenberg-blocks' ) }
																	help={ __( 'Пусто — заголовок по умолчанию', 'codeweber-gutenberg-blocks' ) }
																	value={ item.label }
																	onChange={ ( val ) => updateItem( index, { label: val } ) }
																/>
																{ showDisplayMode && (
																	<>
																		<SelectControl
																			label={ __( 'Режим отображения', 'codeweber-gutenberg-blocks' ) }
																			value={ item.displayMode }
																			options={ item.filterType === 'attributes' ? DISPLAY_MODE_OPTIONS_ATTR : DISPLAY_MODE_OPTIONS }
																			onChange={ ( val ) => updateItem( index, { displayMode: val } ) }
																		/>
																		{ ( item.displayMode === 'color' || item.displayMode === 'image' ) && (
																			<>
																				<NumberControl
																					label={ __( 'Элементов в ряд (0 — авто)', 'codeweber-gutenberg-blocks' ) }
																					value={ item.swatchColumns ?? 0 }
																					min={ 0 }
																					max={ 20 }
																					onChange={ ( val ) => updateItem( index, { swatchColumns: Number( val ) } ) }
																				/>
																				<TextControl
																					label={ __( 'Доп. класс каждого свотча', 'codeweber-gutenberg-blocks' ) }
																					help={ __( 'Добавляется к каждому элементу-свотчу', 'codeweber-gutenberg-blocks' ) }
																					value={ item.swatchItemClass ?? '' }
																					onChange={ ( val ) => updateItem( index, { swatchItemClass: val } ) }
																				/>
																			</>
																		) }
																		<SelectControl
																			label={ __( 'Логика фильтра', 'codeweber-gutenberg-blocks' ) }
																			value={ item.queryType }
																			options={ QUERY_TYPE_OPTIONS }
																			onChange={ ( val ) => updateItem( index, { queryType: val } ) }
																		/>
																	</>
																) }
																{ item.filterType !== 'price' && (
																	<>
																		<ToggleControl
																			label={ __( 'Показывать кол-во товаров', 'codeweber-gutenberg-blocks' ) }
																			checked={ item.showCount }
																			onChange={ ( val ) => updateItem( index, { showCount: val } ) }
																		/>
																		{ ( ! showDisplayMode || item.displayMode === 'checkbox' ) && (
																			<SelectControl
																				label={ __( 'Колонки', 'codeweber-gutenberg-blocks' ) }
																				value={ item.checkboxColumns ?? 1 }
																				options={ CHECKBOX_COLUMNS_OPTIONS }
																				onChange={ ( val ) => updateItem( index, { checkboxColumns: Number( val ) } ) }
																			/>
																		) }
																		<SelectControl
																			label={ __( 'Отсутствующие элементы', 'codeweber-gutenberg-blocks' ) }
																			help={ __( 'Что делать с позициями, для которых нет подходящих товаров', 'codeweber-gutenberg-blocks' ) }
																			value={ item.emptyBehavior ?? 'disable' }
																			options={ EMPTY_BEHAVIOR_OPTIONS }
																			onChange={ ( val ) => updateItem( index, { emptyBehavior: val } ) }
																		/>
																	</>
																) }
															</>
														) }
														<TextControl
															label={ __( 'Класс обёртки', 'codeweber-gutenberg-blocks' ) }
															help={ __( 'CSS-класс добавляется к секции этого фильтра', 'codeweber-gutenberg-blocks' ) }
															value={ item.itemClass ?? '' }
															onChange={ ( val ) => updateItem( index, { itemClass: val } ) }
														/>
														<SelectControl
															label={ __( 'Ограничение списка', 'codeweber-gutenberg-blocks' ) }
															value={ item.limitType ?? 'none' }
															options={ LIMIT_TYPE_OPTIONS }
															onChange={ ( val ) => updateItem( index, { limitType: val } ) }
														/>
														{ ( item.limitType === 'count' || item.limitType === 'height' ) && (
															<>
																<NumberControl
																	label={ item.limitType === 'count'
																		? __( 'Макс. видимых элементов', 'codeweber-gutenberg-blocks' )
																		: __( 'Макс. высота (px)', 'codeweber-gutenberg-blocks' ) }
																	value={ item.limitValue ?? 5 }
																	min={ 1 }
																	onChange={ ( val ) => updateItem( index, { limitValue: Number( val ) } ) }
																/>
																<TextControl
																	label={ __( 'Текст кнопки «Показать ещё»', 'codeweber-gutenberg-blocks' ) }
																	help={ __( 'Пусто — значение по умолчанию', 'codeweber-gutenberg-blocks' ) }
																	value={ item.showMoreText ?? '' }
																	onChange={ ( val ) => updateItem( index, { showMoreText: val } ) }
																/>
																<TextControl
																	label={ __( 'Текст кнопки «Свернуть»', 'codeweber-gutenberg-blocks' ) }
																	help={ __( 'Пусто — значение по умолчанию', 'codeweber-gutenberg-blocks' ) }
																	value={ item.showLessText ?? '' }
																	onChange={ ( val ) => updateItem( index, { showLessText: val } ) }
																/>
															</>
														) }
													</div>
												) }
											</div>
										);
									} ) }

									<div className="cwgb-repeater-add">
										<Button variant="secondary" onClick={ () => addItem( 'filter' ) } icon="plus-alt">
											{ __( 'Добавить фильтр', 'codeweber-gutenberg-blocks' ) }
										</Button>
									</div>
								</PanelBody>
							) }

							{ tab.name === 'style' && (
								<>
									<PanelBody title={ __( 'Секции', 'codeweber-gutenberg-blocks' ) } initialOpen={ true }>
										<SelectControl
											label={ __( 'Стиль секций', 'codeweber-gutenberg-blocks' ) }
											value={ sectionStyle }
											options={ SECTION_STYLE_OPTIONS }
											onChange={ ( val ) => setAttributes( { sectionStyle: val } ) }
										/>
										{ sectionStyle === 'accordion' && (
											<ToggleControl
												label={ __( 'Секции раскрыты по умолчанию', 'codeweber-gutenberg-blocks' ) }
												checked={ sectionsOpen }
												onChange={ ( val ) => setAttributes( { sectionsOpen: val } ) }
											/>
										) }
										<TextControl
											label={ __( 'Класс обёртки секции', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Пример: widget', 'codeweber-gutenberg-blocks' ) }
											value={ wrapperClass }
											onChange={ ( val ) => setAttributes( { wrapperClass: val } ) }
										/>
										<SelectControl
											label={ __( 'Тег заголовка', 'codeweber-gutenberg-blocks' ) }
											value={ headingTag }
											options={ HEADING_TAG_OPTIONS }
											onChange={ ( val ) => setAttributes( { headingTag: val } ) }
										/>
										<TextControl
											label={ __( 'Класс заголовка', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Пример: widget-title mb-3', 'codeweber-gutenberg-blocks' ) }
											value={ headingClass }
											onChange={ ( val ) => setAttributes( { headingClass: val } ) }
										/>
									</PanelBody>

									<PanelBody title={ __( 'Чекбоксы', 'codeweber-gutenberg-blocks' ) } initialOpen={ false }>
										<SelectControl
											label={ __( 'Размер', 'codeweber-gutenberg-blocks' ) }
											value={ checkboxSize }
											options={ CHECKBOX_SIZE_OPTIONS }
											onChange={ ( val ) => setAttributes( { checkboxSize: val } ) }
										/>
										<TextControl
											label={ __( 'Доп. класс элемента', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Добавляется к каждому div.form-check', 'codeweber-gutenberg-blocks' ) }
											value={ checkboxItemClass }
											onChange={ ( val ) => setAttributes( { checkboxItemClass: val } ) }
										/>
									</PanelBody>

									<PanelBody title={ __( 'Радиокнопки', 'codeweber-gutenberg-blocks' ) } initialOpen={ false }>
										<SelectControl
											label={ __( 'Размер', 'codeweber-gutenberg-blocks' ) }
											value={ radioSize }
											options={ CHECKBOX_SIZE_OPTIONS }
											onChange={ ( val ) => setAttributes( { radioSize: val } ) }
										/>
										<TextControl
											label={ __( 'Доп. класс элемента', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Добавляется к каждому div.form-check', 'codeweber-gutenberg-blocks' ) }
											value={ radioItemClass }
											onChange={ ( val ) => setAttributes( { radioItemClass: val } ) }
										/>
									</PanelBody>

									<PanelBody title={ __( 'Кнопки', 'codeweber-gutenberg-blocks' ) } initialOpen={ false }>
										<SelectControl
											label={ __( 'Размер', 'codeweber-gutenberg-blocks' ) }
											value={ buttonSize }
											options={ [
												{ label: 'ExSm', value: 'btn-xs' },
												{ label: 'Sm', value: 'btn-sm' },
												{ label: 'Md', value: '' },
												{ label: 'Lg', value: 'btn-lg' },
											] }
											onChange={ ( val ) => setAttributes( { buttonSize: val } ) }
										/>
										<SelectControl
											label={ __( 'Стиль', 'codeweber-gutenberg-blocks' ) }
											value={ buttonStyle }
											options={ [
												{ label: 'Solid', value: 'solid' },
												{ label: 'Outline', value: 'outline' },
												{ label: 'Soft', value: 'soft' },
											] }
											onChange={ ( val ) => setAttributes( { buttonStyle: val } ) }
										/>
										<SelectControl
											label={ __( 'Форма', 'codeweber-gutenberg-blocks' ) }
											value={ buttonShape }
											options={ shapes }
											onChange={ ( val ) => setAttributes( { buttonShape: val } ) }
										/>
										<ComboboxControl
											label={ __( 'Цвет', 'codeweber-gutenberg-blocks' ) }
											value={ buttonColor }
											options={ colors }
											onChange={ ( val ) => setAttributes( { buttonColor: val || 'secondary' } ) }
										/>
										<TextControl
											label={ __( 'Доп. класс', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Добавляется каждой кнопке', 'codeweber-gutenberg-blocks' ) }
											value={ buttonExtraClass }
											onChange={ ( val ) => setAttributes( { buttonExtraClass: val } ) }
										/>
									</PanelBody>

									<PanelBody title={ __( 'Сброс', 'codeweber-gutenberg-blocks' ) } initialOpen={ false }>
										<TextControl
											label={ __( 'Текст кнопки «Сбросить»', 'codeweber-gutenberg-blocks' ) }
											help={ __( 'Пусто — текст по умолчанию', 'codeweber-gutenberg-blocks' ) }
											value={ resetLabel }
											onChange={ ( val ) => setAttributes( { resetLabel: val } ) }
										/>
									</PanelBody>
								</>
							) }
						</>
					) }
				</TabPanel>
			</InspectorControls>

			{ /* ── Editor preview (server-side render) ── */ }
			<div { ...blockProps }>
				<ServerSideRender
					block="codeweber-blocks/wc-filter-panel"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
