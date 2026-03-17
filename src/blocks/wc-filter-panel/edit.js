/**
 * WC Filter Panel — Edit component (repeater)
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	SelectControl,
	ToggleControl,
	TextControl,
} from '@wordpress/components';
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
	{ label: __( 'Список ссылок', 'codeweber-gutenberg-blocks' ), value: 'list' },
	{ label: __( 'Кнопки', 'codeweber-gutenberg-blocks' ), value: 'button' },
];

const QUERY_TYPE_OPTIONS = [
	{ label: __( 'OR — любой из выбранных', 'codeweber-gutenberg-blocks' ), value: 'or' },
	{ label: __( 'AND — все из выбранных', 'codeweber-gutenberg-blocks' ), value: 'and' },
];

const ITEM_TYPE_OPTIONS = [
	{ label: __( 'Фильтр', 'codeweber-gutenberg-blocks' ), value: 'filter' },
	{ label: __( 'Кнопка сброса', 'codeweber-gutenberg-blocks' ), value: 'reset_button' },
	{ label: __( 'Активные фильтры (чипы)', 'codeweber-gutenberg-blocks' ), value: 'active_chips' },
];

const ITEM_TYPE_LABELS = {
	filter: __( 'Фильтр', 'codeweber-gutenberg-blocks' ),
	reset_button: __( 'Кнопка сброса', 'codeweber-gutenberg-blocks' ),
	active_chips: __( 'Активные фильтры', 'codeweber-gutenberg-blocks' ),
};

const FILTER_TYPE_LABELS = {
	price: __( 'Цена', 'codeweber-gutenberg-blocks' ),
	categories: __( 'Категории', 'codeweber-gutenberg-blocks' ),
	tags: __( 'Метки', 'codeweber-gutenberg-blocks' ),
	rating: __( 'Рейтинг', 'codeweber-gutenberg-blocks' ),
	stock: __( 'Наличие', 'codeweber-gutenberg-blocks' ),
	attributes: __( 'Атрибут WC', 'codeweber-gutenberg-blocks' ),
};

export default function Edit( { attributes, setAttributes } ) {
	const { items } = attributes;
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
		if ( expandedIndex === index ) {
			setExpandedIndex( null );
		}
	}

	function moveItem( index, direction ) {
		const newItems = [ ...items ];
		const target = index + direction;
		if ( target < 0 || target >= newItems.length ) return;
		[ newItems[ index ], newItems[ target ] ] = [ newItems[ target ], newItems[ index ] ];
		setAttributes( { items: newItems } );
		setExpandedIndex( target );
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
		};
		setAttributes( { items: [ ...items, newItem ] } );
		setExpandedIndex( items.length );
	}

	function getItemSummary( item ) {
		if ( item.type !== 'filter' ) {
			return ITEM_TYPE_LABELS[ item.type ] || item.type;
		}
		const typeLabel = FILTER_TYPE_LABELS[ item.filterType ] || item.filterType;
		const customLabel = item.label ? ` — ${ item.label }` : '';
		return `${ typeLabel }${ customLabel }`;
	}

	const previewChips = items.map( ( item ) => {
		if ( item.type === 'filter' ) {
			return item.label || FILTER_TYPE_LABELS[ item.filterType ] || item.filterType;
		}
		if ( item.type === 'reset_button' )
			return __( '[Сбросить]', 'codeweber-gutenberg-blocks' );
		if ( item.type === 'active_chips' )
			return __( '[Активные]', 'codeweber-gutenberg-blocks' );
		return '';
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Элементы панели фильтров', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					{ items.length === 0 && (
						<p className="description">
							{ __( 'Добавьте хотя бы один элемент.', 'codeweber-gutenberg-blocks' ) }
						</p>
					) }

					{ items.map( ( item, index ) => {
						const isExpanded = expandedIndex === index;
						const showDisplayMode = [ 'categories', 'tags', 'attributes' ].includes(
							item.filterType
						);
						const showQueryType = [ 'categories', 'tags', 'attributes' ].includes(
							item.filterType
						);

						return (
							<div key={ item.id } className="cwgb-repeater-item">
								{ /* ── Item header (collapsed summary) ── */ }
								<div
									className={ `cwgb-repeater-item__header${ isExpanded ? ' is-expanded' : '' }` }
								>
									<button
										type="button"
										className="cwgb-repeater-item__toggle"
										onClick={ () =>
											setExpandedIndex( isExpanded ? null : index )
										}
									>
										{ getItemSummary( item ) }
									</button>
									<div className="cwgb-repeater-item__actions">
										<Button
											icon="arrow-up-alt2"
											size="small"
											disabled={ index === 0 }
											onClick={ () => moveItem( index, -1 ) }
											label={ __( 'Вверх', 'codeweber-gutenberg-blocks' ) }
										/>
										<Button
											icon="arrow-down-alt2"
											size="small"
											disabled={ index === items.length - 1 }
											onClick={ () => moveItem( index, 1 ) }
											label={ __( 'Вниз', 'codeweber-gutenberg-blocks' ) }
										/>
										<Button
											icon="trash"
											size="small"
											isDestructive
											onClick={ () => deleteItem( index ) }
											label={ __( 'Удалить', 'codeweber-gutenberg-blocks' ) }
										/>
									</div>
								</div>

								{ /* ── Item settings (expanded) ── */ }
								{ isExpanded && (
									<div className="cwgb-repeater-item__body">
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
													onChange={ ( val ) =>
														updateItem( index, { filterType: val } )
													}
												/>

												{ item.filterType === 'attributes' && (
													<SelectControl
														label={ __( 'Атрибут WC', 'codeweber-gutenberg-blocks' ) }
														value={ item.taxonomy }
														options={ taxonomyOptions }
														onChange={ ( val ) =>
															updateItem( index, { taxonomy: val } )
														}
													/>
												) }

												<TextControl
													label={ __( 'Заголовок секции', 'codeweber-gutenberg-blocks' ) }
													help={ __(
														'Оставьте пустым — будет использован заголовок по умолчанию',
														'codeweber-gutenberg-blocks'
													) }
													value={ item.label }
													onChange={ ( val ) =>
														updateItem( index, { label: val } )
													}
												/>

												{ showDisplayMode && (
													<SelectControl
														label={ __( 'Режим отображения', 'codeweber-gutenberg-blocks' ) }
														value={ item.displayMode }
														options={ DISPLAY_MODE_OPTIONS }
														onChange={ ( val ) =>
															updateItem( index, { displayMode: val } )
														}
													/>
												) }

												{ showQueryType && (
													<SelectControl
														label={ __( 'Логика фильтра', 'codeweber-gutenberg-blocks' ) }
														value={ item.queryType }
														options={ QUERY_TYPE_OPTIONS }
														onChange={ ( val ) =>
															updateItem( index, { queryType: val } )
														}
													/>
												) }

												{ item.filterType !== 'price' && (
													<ToggleControl
														label={ __(
															'Показывать кол-во товаров',
															'codeweber-gutenberg-blocks'
														) }
														checked={ item.showCount }
														onChange={ ( val ) =>
															updateItem( index, { showCount: val } )
														}
													/>
												) }
											</>
										) }
									</div>
								) }
							</div>
						);
					} ) }

					{ /* ── Add buttons ── */ }
					<div className="cwgb-repeater-add">
						<Button
							variant="secondary"
							onClick={ () => addItem( 'filter' ) }
							icon="plus-alt"
						>
							{ __( 'Добавить фильтр', 'codeweber-gutenberg-blocks' ) }
						</Button>
						<Button
							variant="secondary"
							onClick={ () => addItem( 'reset_button' ) }
							icon="update"
						>
							{ __( 'Кнопка сброса', 'codeweber-gutenberg-blocks' ) }
						</Button>
						<Button
							variant="secondary"
							onClick={ () => addItem( 'active_chips' ) }
							icon="tag"
						>
							{ __( 'Активные фильтры', 'codeweber-gutenberg-blocks' ) }
						</Button>
					</div>
				</PanelBody>
			</InspectorControls>

			{ /* ── Editor preview ── */ }
			<div { ...blockProps }>
				<div className="cwgb-wc-filter-panel-placeholder">
					<span className="cwgb-wc-filter-panel-placeholder__icon dashicons dashicons-filter" />
					<strong>{ __( 'WC Filter Panel', 'codeweber-gutenberg-blocks' ) }</strong>
					{ previewChips.length > 0 ? (
						<div className="cwgb-wc-filter-panel-placeholder__filters">
							{ previewChips.map( ( f, i ) => (
								<span
									key={ i }
									className="cwgb-wc-filter-panel-placeholder__chip"
								>
									{ f }
								</span>
							) ) }
						</div>
					) : (
						<p className="description">
							{ __( 'Добавьте элементы в настройках блока →', 'codeweber-gutenberg-blocks' ) }
						</p>
					) }
					<p className="description">
						{ __( 'Отображается на странице каталога WooCommerce.', 'codeweber-gutenberg-blocks' ) }
					</p>
				</div>
			</div>
		</>
	);
}
