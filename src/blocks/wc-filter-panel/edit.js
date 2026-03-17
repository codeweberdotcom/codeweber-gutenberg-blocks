/**
 * WC Filter Panel — Edit component
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function Edit( { attributes, setAttributes } ) {
	const {
		showPrice,
		showCategories,
		attributes: selectedAttributes,
		showRating,
		showStock,
		displayMode,
		showCount,
		title,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'cwgb-wc-filter-panel cwgb-editor-preview',
	} );

	// Load WC attribute taxonomies from REST API
	const wcAttributes = useSelect( ( select ) => {
		const taxonomies = select( coreStore ).getTaxonomies( { per_page: -1 } );
		if ( ! taxonomies ) return [];
		return taxonomies
			.filter( ( tax ) => tax.slug && tax.slug.startsWith( 'pa_' ) )
			.map( ( tax ) => ( { label: tax.name, value: tax.slug } ) );
	}, [] );

	function toggleAttribute( taxSlug ) {
		const current = selectedAttributes || [];
		if ( current.includes( taxSlug ) ) {
			setAttributes( { attributes: current.filter( ( s ) => s !== taxSlug ) } );
		} else {
			setAttributes( { attributes: [ ...current, taxSlug ] } );
		}
	}

	// Preview labels
	const activeFilters = [
		showPrice && __( 'Цена', 'codeweber-gutenberg-blocks' ),
		showCategories && __( 'Категории', 'codeweber-gutenberg-blocks' ),
		...( selectedAttributes || [] ).map( ( s ) => s.replace( 'pa_', '' ) ),
		showRating && __( 'Рейтинг', 'codeweber-gutenberg-blocks' ),
		showStock && __( 'Наличие', 'codeweber-gutenberg-blocks' ),
	].filter( Boolean );

	return (
		<>
			<InspectorControls>

				{ /* ── General ─────────────────────────────────── */ }
				<PanelBody
					title={ __( 'Настройки', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Заголовок панели', 'codeweber-gutenberg-blocks' ) }
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>

					<SelectControl
						label={ __( 'Отображение терминов', 'codeweber-gutenberg-blocks' ) }
						value={ displayMode }
						options={ [
							{ label: __( 'Чекбоксы', 'codeweber-gutenberg-blocks' ), value: 'checkbox' },
							{ label: __( 'Список ссылок', 'codeweber-gutenberg-blocks' ), value: 'list' },
							{ label: __( 'Кнопки', 'codeweber-gutenberg-blocks' ), value: 'button' },
						] }
						onChange={ ( val ) => setAttributes( { displayMode: val } ) }
					/>

					<ToggleControl
						label={ __( 'Показывать кол-во товаров', 'codeweber-gutenberg-blocks' ) }
						checked={ showCount }
						onChange={ ( val ) => setAttributes( { showCount: val } ) }
					/>
				</PanelBody>

				{ /* ── Filters to show ─────────────────────────── */ }
				<PanelBody
					title={ __( 'Фильтры', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Цена (слайдер)', 'codeweber-gutenberg-blocks' ) }
						checked={ showPrice }
						onChange={ ( val ) => setAttributes( { showPrice: val } ) }
					/>

					<ToggleControl
						label={ __( 'Категории', 'codeweber-gutenberg-blocks' ) }
						checked={ showCategories }
						onChange={ ( val ) => setAttributes( { showCategories: val } ) }
					/>

					<ToggleControl
						label={ __( 'Рейтинг', 'codeweber-gutenberg-blocks' ) }
						checked={ showRating }
						onChange={ ( val ) => setAttributes( { showRating: val } ) }
					/>

					<ToggleControl
						label={ __( 'Наличие', 'codeweber-gutenberg-blocks' ) }
						checked={ showStock }
						onChange={ ( val ) => setAttributes( { showStock: val } ) }
					/>
				</PanelBody>

				{ /* ── WC Attributes ───────────────────────────── */ }
				<PanelBody
					title={ __( 'Атрибуты товаров', 'codeweber-gutenberg-blocks' ) }
					initialOpen={ false }
				>
					{ wcAttributes.length === 0 && (
						<p className="description">
							{ __( 'Атрибуты WooCommerce не найдены.', 'codeweber-gutenberg-blocks' ) }
						</p>
					) }
					{ wcAttributes.map( ( tax ) => (
						<CheckboxControl
							key={ tax.value }
							label={ tax.label }
							checked={ ( selectedAttributes || [] ).includes( tax.value ) }
							onChange={ () => toggleAttribute( tax.value ) }
						/>
					) ) }
				</PanelBody>

			</InspectorControls>

			{ /* ── Editor preview ─────────────────────────────── */ }
			<div { ...blockProps }>
				<div className="cwgb-wc-filter-panel-placeholder">
					<span className="cwgb-wc-filter-panel-placeholder__icon dashicons dashicons-filter" />
					<strong>{ __( 'WC Filter Panel', 'codeweber-gutenberg-blocks' ) }</strong>
					{ activeFilters.length > 0 ? (
						<div className="cwgb-wc-filter-panel-placeholder__filters">
							{ activeFilters.map( ( f ) => (
								<span key={ f } className="cwgb-wc-filter-panel-placeholder__chip">
									{ f }
								</span>
							) ) }
						</div>
					) : (
						<p className="description">
							{ __( 'Выберите фильтры в настройках блока →', 'codeweber-gutenberg-blocks' ) }
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
