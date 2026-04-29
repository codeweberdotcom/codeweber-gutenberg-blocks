import { __ } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	RangeControl,
	SelectControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { chevronUp, chevronDown } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { ImageSizeControl } from '../../../components/image-size';
import { PostSortControl } from '../../../components/post-sort';
import { PostGridTemplateControl } from '../../../components/post-grid-template';
import { PostTypeTaxonomyControl } from '../../../components/post-type-taxonomy/PostTypeTaxonomyControl';
import { SchemaTypeNotice } from '../../../components/schema-type';

const decodeTitle = ( rendered ) => {
	if ( ! rendered ) return '';
	const div = document.createElement( 'div' );
	div.innerHTML = rendered;
	return div.textContent || div.innerText || '';
};

// Manual post selection with HTML block injection support.
const ManualPostsSection = ( { postType, manualPosts = [], manualItems = [], setAttributes } ) => {
	const [ postTypes, setPostTypes ] = useState( [] );
	const [ typesLoading, setTypesLoading ] = useState( true );
	const [ allPosts, setAllPosts ] = useState( [] );
	const [ postsLoading, setPostsLoading ] = useState( false );
	const [ selectedPostId, setSelectedPostId ] = useState( '' );
	const [ htmlBlocks, setHtmlBlocks ] = useState( [] );
	const [ htmlBlocksLoading, setHtmlBlocksLoading ] = useState( false );
	const [ selectedHtmlBlockId, setSelectedHtmlBlockId ] = useState( '' );
	const [ showHtmlPicker, setShowHtmlPicker ] = useState( false );

	// Migrate legacy manualPosts → manualItems on first render.
	useEffect( () => {
		if ( manualItems.length === 0 && manualPosts.length > 0 ) {
			const migrated = manualPosts.map( ( p ) => ( { type: 'post', id: p.id, title: p.title } ) );
			setAttributes( { manualItems: migrated, manualPosts: [] } );
		}
	}, [] ); // eslint-disable-line react-hooks/exhaustive-deps

	// Fetch available post types once.
	useEffect( () => {
		let cancelled = false;
		apiFetch( { path: '/wp/v2/types' } )
			.then( ( data ) => {
				if ( cancelled ) return;
				const list = Object.values( data || {} )
					.filter( ( t ) => t.rest_base && t.viewable !== false )
					.map( ( t ) => ( { value: t.slug, label: t.name, restBase: t.rest_base } ) )
					.sort( ( a, b ) => a.label.localeCompare( b.label ) );
				setPostTypes( list );
				setTypesLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setTypesLoading( false );
			} );
		return () => { cancelled = true; };
	}, [] );

	// Fetch all posts for the selected CPT.
	useEffect( () => {
		if ( ! postType ) return;
		let cancelled = false;
		setPostsLoading( true );
		setAllPosts( [] );
		setSelectedPostId( '' );

		const typeInfo = postTypes.find( ( t ) => t.value === postType );
		const restBase = typeInfo?.restBase || ( postType === 'post' ? 'posts' : postType );

		apiFetch( {
			path: addQueryArgs( `/wp/v2/${ restBase }`, {
				per_page: 100,
				_fields: 'id,title',
				orderby: 'title',
				order: 'asc',
				status: 'publish',
			} ),
		} )
			.then( ( data ) => {
				if ( cancelled ) return;
				setAllPosts( Array.isArray( data ) ? data : [] );
				setPostsLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setAllPosts( [] );
				setPostsLoading( false );
			} );
		return () => { cancelled = true; };
	}, [ postType, postTypes ] );

	const handleCptChange = ( value ) => setAttributes( { postType: value } );

	// Fetch html_blocks CPT when picker is opened.
	useEffect( () => {
		if ( ! showHtmlPicker || htmlBlocks.length > 0 ) return;
		let cancelled = false;
		setHtmlBlocksLoading( true );
		apiFetch( {
			path: addQueryArgs( '/wp/v2/html_blocks', {
				per_page: 100,
				_fields: 'id,title',
				orderby: 'title',
				order: 'asc',
				status: 'publish',
			} ),
		} )
			.then( ( data ) => {
				if ( cancelled ) return;
				setHtmlBlocks( Array.isArray( data ) ? data : [] );
				setHtmlBlocksLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setHtmlBlocks( [] );
				setHtmlBlocksLoading( false );
			} );
		return () => { cancelled = true; };
	}, [ showHtmlPicker ] ); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAddPost = () => {
		const id = parseInt( selectedPostId, 10 );
		if ( ! id ) return;
		const already = manualItems.some( ( p ) => p.type === 'post' && p.id === id );
		if ( already ) return;
		const found = allPosts.find( ( p ) => p.id === id );
		const title = found ? decodeTitle( found.title?.rendered ) : `#${ id }`;
		setAttributes( { manualItems: [ ...manualItems, { type: 'post', id, title } ] } );
		setSelectedPostId( '' );
	};

	const handleAddHtmlBlock = () => {
		const id = parseInt( selectedHtmlBlockId, 10 );
		if ( ! id ) return;
		const already = manualItems.some( ( p ) => p.type === 'html' && p.id === id );
		if ( already ) return;
		const found = htmlBlocks.find( ( p ) => p.id === id );
		const title = found ? decodeTitle( found.title?.rendered ) : `#${ id }`;
		setAttributes( { manualItems: [ ...manualItems, { type: 'html', id, title } ] } );
		setSelectedHtmlBlockId( '' );
		setShowHtmlPicker( false );
	};

	const removeItem = ( idx ) =>
		setAttributes( { manualItems: manualItems.filter( ( _, i ) => i !== idx ) } );

	const moveItem = ( idx, dir ) => {
		const newIdx = idx + dir;
		if ( newIdx < 0 || newIdx >= manualItems.length ) return;
		const arr = [ ...manualItems ];
		const [ removed ] = arr.splice( idx, 1 );
		arr.splice( newIdx, 0, removed );
		setAttributes( { manualItems: arr } );
	};

	const postOptions = [
		{ value: '', label: __( '— Select post —', 'codeweber-gutenberg-blocks' ) },
		...allPosts.map( ( p ) => ( {
			value: String( p.id ),
			label: decodeTitle( p.title?.rendered ) || `#${ p.id }`,
		} ) ),
	];

	const cptOptions = [
		{ value: '', label: __( '— Select type —', 'codeweber-gutenberg-blocks' ) },
		...postTypes.map( ( t ) => ( { value: t.value, label: t.label } ) ),
	];

	return (
		<div style={ { marginTop: '16px' } }>
			{ typesLoading ? (
				<Spinner />
			) : (
				<SelectControl
					label={ __( 'Post Type', 'codeweber-gutenberg-blocks' ) }
					value={ postType || '' }
					options={ cptOptions }
					onChange={ handleCptChange }
					__nextHasNoMarginBottom
				/>
			) }

			{ postType && (
				<div style={ { marginTop: 12 } }>
					{ postsLoading ? (
						<Spinner />
					) : (
						<div style={ { display: 'flex', gap: 8, alignItems: 'flex-end' } }>
							<div style={ { flex: 1 } }>
								<SelectControl
									label={ __( 'Post', 'codeweber-gutenberg-blocks' ) }
									value={ selectedPostId }
									options={ postOptions }
									onChange={ setSelectedPostId }
									__nextHasNoMarginBottom
								/>
							</div>
							<Button
								variant="primary"
								onClick={ handleAddPost }
								disabled={ ! selectedPostId }
								style={ { marginBottom: 1 } }
							>
								{ __( 'Add', 'codeweber-gutenberg-blocks' ) }
							</Button>
						</div>
					) }
				</div>
			) }

			{ /* HTML Block CPT picker */ }
			<div style={ { marginTop: 8 } }>
				{ ! showHtmlPicker ? (
					<Button
						variant="secondary"
						onClick={ () => setShowHtmlPicker( true ) }
						style={ { width: '100%' } }
					>
						{ __( '+ Add HTML Block', 'codeweber-gutenberg-blocks' ) }
					</Button>
				) : (
					<div
						style={ {
							padding: '10px',
							background: '#f0f4ff',
							borderRadius: 4,
							border: '1px solid #c5d0e6',
						} }
					>
						{ htmlBlocksLoading ? (
							<Spinner />
						) : (
							<div style={ { display: 'flex', gap: 8, alignItems: 'flex-end' } }>
								<div style={ { flex: 1 } }>
									<SelectControl
										label={ __( 'HTML Block', 'codeweber-gutenberg-blocks' ) }
										value={ selectedHtmlBlockId }
										options={ [
											{ value: '', label: __( '— Select block —', 'codeweber-gutenberg-blocks' ) },
											...htmlBlocks.map( ( p ) => ( {
												value: String( p.id ),
												label: decodeTitle( p.title?.rendered ) || `#${ p.id }`,
											} ) ),
										] }
										onChange={ setSelectedHtmlBlockId }
										__nextHasNoMarginBottom
									/>
								</div>
								<Button
									variant="primary"
									onClick={ handleAddHtmlBlock }
									disabled={ ! selectedHtmlBlockId }
									style={ { marginBottom: 1 } }
								>
									{ __( 'Add', 'codeweber-gutenberg-blocks' ) }
								</Button>
							</div>
						) }
						<Button
							variant="tertiary"
							onClick={ () => { setShowHtmlPicker( false ); setSelectedHtmlBlockId( '' ); } }
							style={ { marginTop: 6 } }
						>
							{ __( 'Cancel', 'codeweber-gutenberg-blocks' ) }
						</Button>
					</div>
				) }
			</div>

			{ manualItems.length === 0 ? (
				<p style={ { color: '#757575', fontSize: 12, margin: '12px 0 0' } }>
					{ __( 'No items selected.', 'codeweber-gutenberg-blocks' ) }
				</p>
			) : (
				<div style={ { marginTop: 12 } }>
					{ manualItems.map( ( item, idx ) => {
						const isHtml = item.type === 'html';
						return (
							<div
								key={ item.id || idx }
								style={ {
									marginBottom: 4,
									borderRadius: 4,
									border: '1px solid #e0e0e0',
									background: isHtml ? '#f0f4ff' : '#f9f9f9',
									overflow: 'hidden',
								} }
							>
								<div
									style={ {
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										padding: '4px 8px',
									} }
								>
									<div style={ { display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 } }>
										<Button
											icon={ chevronUp }
											iconSize={ 14 }
											disabled={ idx === 0 }
											onClick={ () => moveItem( idx, -1 ) }
											label={ __( 'Move up', 'codeweber-gutenberg-blocks' ) }
										/>
										<Button
											icon={ chevronDown }
											iconSize={ 14 }
											disabled={ idx === manualItems.length - 1 }
											onClick={ () => moveItem( idx, 1 ) }
											label={ __( 'Move down', 'codeweber-gutenberg-blocks' ) }
										/>
									</div>
									<span
										style={ {
											flex: 1,
											fontSize: 12,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											color: isHtml ? '#3c5a99' : 'inherit',
										} }
									>
										{ isHtml
											? `⟨/⟩ ${ item.title || __( 'HTML Block', 'codeweber-gutenberg-blocks' ) }`
											: item.title || `#${ item.id }` }
									</span>
									<Button
										isSmall
										isDestructive
										onClick={ () => removeItem( idx ) }
										style={ { flexShrink: 0 } }
									>
										✕
									</Button>
								</div>
							</div>
						);
					} ) }
				</div>
			) }
		</div>
	);
};

// Image Tag picker for projects — fetches terms from the 'image_tag' taxonomy.
const ProjectImageTagSection = ({
	filterByImageTag,
	filterImageTagId,
	setAttributes,
}) => {
	const [terms, setTerms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!filterByImageTag) return;
		setIsLoading(true);
		apiFetch({
			path: addQueryArgs('/wp/v2/image_tag', { per_page: 100 }),
		})
			.then((data) => {
				if (cancelled) return;
				setTerms(Array.isArray(data) ? data : []);
				setIsLoading(false);
			})
			.catch(() => {
				if (cancelled) return;
				setTerms([]);
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [filterByImageTag]);

	const options = [
		{
			value: 0,
			label: __('— Select tag —', 'codeweber-gutenberg-blocks'),
		},
		...terms.map((t) => ({ value: t.id, label: t.name })),
	];

	return (
		<div
			style={{
				marginTop: '16px',
				paddingTop: '16px',
				borderTop: '1px solid #e0e0e0',
			}}
		>
			<div
				style={{
					fontSize: '11px',
					fontWeight: '500',
					textTransform: 'uppercase',
					color: '#757575',
					marginBottom: '12px',
				}}
			>
				{__('Projects Options', 'codeweber-gutenberg-blocks')}
			</div>

			<ToggleControl
				label={__(
					'Preview image by tag',
					'codeweber-gutenberg-blocks'
				)}
				checked={!!filterByImageTag}
				onChange={(value) =>
					setAttributes({ filterByImageTag: value })
				}
				help={__(
					'Pick the first image from the project gallery that has the selected Image Tag. Falls back to featured image if no match.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{filterByImageTag &&
				(isLoading ? (
					<Spinner />
				) : (
					<SelectControl
						label={__(
							'Image Tag',
							'codeweber-gutenberg-blocks'
						)}
						value={Number(filterImageTagId) || 0}
						options={options}
						onChange={(value) =>
							setAttributes({
								filterImageTagId: parseInt(value, 10) || 0,
							})
						}
					/>
				))}
		</div>
	);
};

// Manual taxonomy term selection with HTML block injection support.
const ManualTermsSection = ( { manualTermItems = [], setAttributes } ) => {
	const [ taxonomies, setTaxonomies ] = useState( [] );
	const [ taxLoading, setTaxLoading ] = useState( true );
	const [ taxRestBases, setTaxRestBases ] = useState( {} );
	const [ selectedTaxSlug, setSelectedTaxSlug ] = useState( '' );
	const [ terms, setTerms ] = useState( [] );
	const [ termsLoading, setTermsLoading ] = useState( false );
	const [ selectedTermId, setSelectedTermId ] = useState( '' );
	const [ htmlBlocks, setHtmlBlocks ] = useState( [] );
	const [ htmlBlocksLoading, setHtmlBlocksLoading ] = useState( false );
	const [ selectedHtmlBlockId, setSelectedHtmlBlockId ] = useState( '' );
	const [ showHtmlPicker, setShowHtmlPicker ] = useState( false );

	useEffect( () => {
		let cancelled = false;
		apiFetch( { path: '/wp/v2/taxonomies' } )
			.then( ( data ) => {
				if ( cancelled ) return;
				const restBases = {};
				const list = Object.values( data || {} )
					.map( ( t ) => {
						restBases[ t.slug ] = t.rest_base;
						const types = Array.isArray( t.types ) && t.types.length
							? ` (${ t.types.join( ', ' ) })`
							: '';
						return { value: t.slug, label: ( t.name || t.slug ) + types };
					} )
					.sort( ( a, b ) => a.label.localeCompare( b.label ) );
				setTaxonomies( list );
				setTaxRestBases( restBases );
				setTaxLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setTaxLoading( false );
			} );
		return () => { cancelled = true; };
	}, [] );

	useEffect( () => {
		if ( ! selectedTaxSlug ) {
			setTerms( [] );
			setSelectedTermId( '' );
			return;
		}
		const restBase = taxRestBases[ selectedTaxSlug ];
		if ( ! restBase ) return;
		let cancelled = false;
		setTermsLoading( true );
		setTerms( [] );
		setSelectedTermId( '' );
		apiFetch( {
			path: addQueryArgs( `/wp/v2/${ restBase }`, {
				per_page: 100,
				_fields: 'id,name',
				orderby: 'name',
				order: 'asc',
			} ),
		} )
			.then( ( data ) => {
				if ( cancelled ) return;
				setTerms( Array.isArray( data ) ? data : [] );
				setTermsLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setTerms( [] );
				setTermsLoading( false );
			} );
		return () => { cancelled = true; };
	}, [ selectedTaxSlug, taxRestBases ] );

	useEffect( () => {
		if ( ! showHtmlPicker || htmlBlocks.length > 0 ) return;
		let cancelled = false;
		setHtmlBlocksLoading( true );
		apiFetch( {
			path: addQueryArgs( '/wp/v2/html_blocks', {
				per_page: 100,
				_fields: 'id,title',
				orderby: 'title',
				order: 'asc',
				status: 'publish',
			} ),
		} )
			.then( ( data ) => {
				if ( cancelled ) return;
				setHtmlBlocks( Array.isArray( data ) ? data : [] );
				setHtmlBlocksLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setHtmlBlocks( [] );
				setHtmlBlocksLoading( false );
			} );
		return () => { cancelled = true; };
	}, [ showHtmlPicker ] ); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAddTerm = () => {
		const id = parseInt( selectedTermId, 10 );
		if ( ! id || ! selectedTaxSlug ) return;
		const already = manualTermItems.some(
			( p ) => p.type === 'term' && p.id === id && p.taxonomy === selectedTaxSlug
		);
		if ( already ) return;
		const found = terms.find( ( t ) => t.id === id );
		const name = found ? found.name : `#${ id }`;
		setAttributes( {
			manualTermItems: [
				...manualTermItems,
				{ type: 'term', taxonomy: selectedTaxSlug, id, name },
			],
		} );
		setSelectedTermId( '' );
	};

	const handleAddHtmlBlock = () => {
		const id = parseInt( selectedHtmlBlockId, 10 );
		if ( ! id ) return;
		const already = manualTermItems.some( ( p ) => p.type === 'html' && p.id === id );
		if ( already ) return;
		const found = htmlBlocks.find( ( p ) => p.id === id );
		const name = found ? decodeTitle( found.title?.rendered ) : `#${ id }`;
		setAttributes( {
			manualTermItems: [ ...manualTermItems, { type: 'html', id, name } ],
		} );
		setSelectedHtmlBlockId( '' );
		setShowHtmlPicker( false );
	};

	const removeItem = ( idx ) =>
		setAttributes( { manualTermItems: manualTermItems.filter( ( _, i ) => i !== idx ) } );

	const moveItem = ( idx, dir ) => {
		const newIdx = idx + dir;
		if ( newIdx < 0 || newIdx >= manualTermItems.length ) return;
		const arr = [ ...manualTermItems ];
		const [ removed ] = arr.splice( idx, 1 );
		arr.splice( newIdx, 0, removed );
		setAttributes( { manualTermItems: arr } );
	};

	const taxOptions = [
		{ value: '', label: __( '— Select taxonomy —', 'codeweber-gutenberg-blocks' ) },
		...taxonomies,
	];
	const termOptions = [
		{ value: '', label: __( '— Select term —', 'codeweber-gutenberg-blocks' ) },
		...terms.map( ( t ) => ( { value: String( t.id ), label: t.name || `#${ t.id }` } ) ),
	];

	return (
		<div style={ { marginTop: '16px' } }>
			{ taxLoading ? (
				<Spinner />
			) : (
				<SelectControl
					label={ __( 'Taxonomy', 'codeweber-gutenberg-blocks' ) }
					value={ selectedTaxSlug }
					options={ taxOptions }
					onChange={ setSelectedTaxSlug }
					__nextHasNoMarginBottom
				/>
			) }

			{ selectedTaxSlug && (
				<div style={ { marginTop: 12 } }>
					{ termsLoading ? (
						<Spinner />
					) : (
						<div style={ { display: 'flex', gap: 8, alignItems: 'flex-end' } }>
							<div style={ { flex: 1 } }>
								<SelectControl
									label={ __( 'Term', 'codeweber-gutenberg-blocks' ) }
									value={ selectedTermId }
									options={ termOptions }
									onChange={ setSelectedTermId }
									__nextHasNoMarginBottom
								/>
							</div>
							<Button
								variant="primary"
								onClick={ handleAddTerm }
								disabled={ ! selectedTermId }
								style={ { marginBottom: 1 } }
							>
								{ __( 'Add', 'codeweber-gutenberg-blocks' ) }
							</Button>
						</div>
					) }
				</div>
			) }

			{ /* HTML Block picker */ }
			<div style={ { marginTop: 8 } }>
				{ ! showHtmlPicker ? (
					<Button
						variant="secondary"
						onClick={ () => setShowHtmlPicker( true ) }
						style={ { width: '100%' } }
					>
						{ __( '+ Add HTML Block', 'codeweber-gutenberg-blocks' ) }
					</Button>
				) : (
					<div
						style={ {
							padding: '10px',
							background: '#f0f4ff',
							borderRadius: 4,
							border: '1px solid #c5d0e6',
						} }
					>
						{ htmlBlocksLoading ? (
							<Spinner />
						) : (
							<div style={ { display: 'flex', gap: 8, alignItems: 'flex-end' } }>
								<div style={ { flex: 1 } }>
									<SelectControl
										label={ __( 'HTML Block', 'codeweber-gutenberg-blocks' ) }
										value={ selectedHtmlBlockId }
										options={ [
											{
												value: '',
												label: __( '— Select block —', 'codeweber-gutenberg-blocks' ),
											},
											...htmlBlocks.map( ( p ) => ( {
												value: String( p.id ),
												label: decodeTitle( p.title?.rendered ) || `#${ p.id }`,
											} ) ),
										] }
										onChange={ setSelectedHtmlBlockId }
										__nextHasNoMarginBottom
									/>
								</div>
								<Button
									variant="primary"
									onClick={ handleAddHtmlBlock }
									disabled={ ! selectedHtmlBlockId }
									style={ { marginBottom: 1 } }
								>
									{ __( 'Add', 'codeweber-gutenberg-blocks' ) }
								</Button>
							</div>
						) }
						<Button
							variant="tertiary"
							onClick={ () => {
								setShowHtmlPicker( false );
								setSelectedHtmlBlockId( '' );
							} }
							style={ { marginTop: 6 } }
						>
							{ __( 'Cancel', 'codeweber-gutenberg-blocks' ) }
						</Button>
					</div>
				) }
			</div>

			{ manualTermItems.length === 0 ? (
				<p style={ { color: '#757575', fontSize: 12, margin: '12px 0 0' } }>
					{ __( 'No items selected.', 'codeweber-gutenberg-blocks' ) }
				</p>
			) : (
				<div style={ { marginTop: 12 } }>
					{ manualTermItems.map( ( item, idx ) => {
						const isHtml = item.type === 'html';
						return (
							<div
								key={ `${ item.type }-${ item.id }-${ idx }` }
								style={ {
									marginBottom: 4,
									borderRadius: 4,
									border: '1px solid #e0e0e0',
									background: isHtml ? '#f0f4ff' : '#f9f9f9',
									overflow: 'hidden',
								} }
							>
								<div
									style={ {
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										padding: '4px 8px',
									} }
								>
									<div
										style={ {
											display: 'flex',
											flexDirection: 'column',
											gap: 2,
											flexShrink: 0,
										} }
									>
										<Button
											icon={ chevronUp }
											iconSize={ 14 }
											disabled={ idx === 0 }
											onClick={ () => moveItem( idx, -1 ) }
											label={ __( 'Move up', 'codeweber-gutenberg-blocks' ) }
										/>
										<Button
											icon={ chevronDown }
											iconSize={ 14 }
											disabled={ idx === manualTermItems.length - 1 }
											onClick={ () => moveItem( idx, 1 ) }
											label={ __( 'Move down', 'codeweber-gutenberg-blocks' ) }
										/>
									</div>
									<span
										style={ {
											flex: 1,
											fontSize: 12,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											color: isHtml ? '#3c5a99' : 'inherit',
										} }
									>
										{ isHtml
											? `⟨/⟩ ${ item.name || __( 'HTML Block', 'codeweber-gutenberg-blocks' ) }`
											: `${ item.name || `#${ item.id }` }${ item.taxonomy ? ` [${ item.taxonomy }]` : '' }` }
									</span>
									<Button
										isSmall
										isDestructive
										onClick={ () => removeItem( idx ) }
										style={ { flexShrink: 0 } }
									>
										✕
									</Button>
								</div>
							</div>
						);
					} ) }
				</div>
			) }
		</div>
	);
};

// Taxonomy source section: picks taxonomy and configures ordering.
const TaxonomySourceSection = ( { attributes, setAttributes } ) => {
	const {
		sourceTaxonomy,
		taxonomyParent,
		taxonomyHideEmpty,
		taxonomyOrderBy,
		taxonomyOrder,
		postsPerPage,
	} = attributes;

	const [ taxonomies, setTaxonomies ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		let cancelled = false;
		setIsLoading( true );
		apiFetch( { path: '/wp/v2/taxonomies' } )
			.then( ( data ) => {
				if ( cancelled ) return;
				const list = Object.values( data || {} )
					.map( ( t ) => {
						const types = Array.isArray( t.types ) && t.types.length
							? ` (${ t.types.join( ', ' ) })`
							: '';
						return { value: t.slug, label: ( t.name || t.slug ) + types };
					} )
					.sort( ( a, b ) => a.label.localeCompare( b.label ) );
				setTaxonomies( list );
				setIsLoading( false );
			} )
			.catch( () => {
				if ( cancelled ) return;
				setIsLoading( false );
			} );
		return () => { cancelled = true; };
	}, [] );

	const taxOptions = [
		{ value: '', label: __( '— Select taxonomy —', 'codeweber-gutenberg-blocks' ) },
		...taxonomies,
	];

	return (
		<div style={ { marginTop: '12px' } }>
			{ isLoading ? (
				<Spinner />
			) : (
				<SelectControl
					label={ __( 'Taxonomy', 'codeweber-gutenberg-blocks' ) }
					value={ sourceTaxonomy || '' }
					options={ taxOptions }
					onChange={ ( value ) => setAttributes( { sourceTaxonomy: value } ) }
				/>
			) }

			<RangeControl
				label={ __( 'Terms Per Page', 'codeweber-gutenberg-blocks' ) }
				value={ postsPerPage }
				onChange={ ( value ) => setAttributes( { postsPerPage: value } ) }
				min={ 1 }
				max={ 100 }
				initialPosition={ 6 }
			/>

			<SelectControl
				label={ __( 'Order By', 'codeweber-gutenberg-blocks' ) }
				value={ taxonomyOrderBy || 'name' }
				options={ [
					{ value: 'name',    label: __( 'Name', 'codeweber-gutenberg-blocks' ) },
					{ value: 'count',   label: __( 'Count', 'codeweber-gutenberg-blocks' ) },
					{ value: 'term_id', label: __( 'ID', 'codeweber-gutenberg-blocks' ) },
					{ value: 'slug',    label: __( 'Slug', 'codeweber-gutenberg-blocks' ) },
				] }
				onChange={ ( value ) => setAttributes( { taxonomyOrderBy: value } ) }
			/>

			<SelectControl
				label={ __( 'Order', 'codeweber-gutenberg-blocks' ) }
				value={ taxonomyOrder || 'asc' }
				options={ [
					{ value: 'asc',  label: __( 'ASC', 'codeweber-gutenberg-blocks' ) },
					{ value: 'desc', label: __( 'DESC', 'codeweber-gutenberg-blocks' ) },
				] }
				onChange={ ( value ) => setAttributes( { taxonomyOrder: value } ) }
			/>

			<ToggleControl
				label={ __( 'Hide Empty Terms', 'codeweber-gutenberg-blocks' ) }
				checked={ taxonomyHideEmpty !== false }
				onChange={ ( value ) => setAttributes( { taxonomyHideEmpty: value } ) }
			/>

			<div style={ { marginTop: '8px' } }>
				<RangeControl
					label={ __( 'Parent Term ID', 'codeweber-gutenberg-blocks' ) }
					value={ taxonomyParent || 0 }
					onChange={ ( value ) => setAttributes( { taxonomyParent: value } ) }
					min={ 0 }
					max={ 9999 }
					initialPosition={ 0 }
					help={ __( '0 = top-level terms only (for hierarchical taxonomies).', 'codeweber-gutenberg-blocks' ) }
				/>
			</div>
		</div>
	);
};

export const MainControl = ( { attributes, setAttributes } ) => {
	const {
		postType,
		postsPerPage,
		imageSize,
		orderBy,
		order,
		template,
		enableLink,
		selectedTaxonomies,
		simpleEffect,
		filterByImageTag,
		filterImageTagId,
		manualMode = false,
		manualPosts = [],
		manualItems = [],
		sourceType = 'post',
		manualTermMode = false,
		manualTermItems = [],
	} = attributes;

	const isTaxonomyMode = sourceType === 'taxonomy';

	return (
		<>
			{ /* Source type switcher */ }
			<div style={ { marginBottom: '16px' } }>
				<div style={ { marginBottom: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#757575' } }>
					{ __( 'Source', 'codeweber-gutenberg-blocks' ) }
				</div>
				<ButtonGroup>
					<Button
						variant={ ! isTaxonomyMode ? 'primary' : 'secondary' }
						onClick={ () => setAttributes( { sourceType: 'post' } ) }
					>
						{ __( 'Posts', 'codeweber-gutenberg-blocks' ) }
					</Button>
					<Button
						variant={ isTaxonomyMode ? 'primary' : 'secondary' }
						onClick={ () => setAttributes( { sourceType: 'taxonomy' } ) }
					>
						{ __( 'Taxonomy', 'codeweber-gutenberg-blocks' ) }
					</Button>
				</ButtonGroup>
			</div>

			{ isTaxonomyMode ? (
				<>
					<ToggleControl
						label={ __( 'Manual term selection', 'codeweber-gutenberg-blocks' ) }
						checked={ !! manualTermMode }
						onChange={ ( value ) => setAttributes( { manualTermMode: value } ) }
						help={ __(
							'Pick and order terms manually instead of a query.',
							'codeweber-gutenberg-blocks'
						) }
						__nextHasNoMarginBottom
					/>

					{ ! manualTermMode && (
						<TaxonomySourceSection
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
					) }

					{ manualTermMode && (
						<ManualTermsSection
							manualTermItems={ manualTermItems }
							setAttributes={ setAttributes }
						/>
					) }

					<div style={ { marginTop: '16px' } }>
						<PostGridTemplateControl
							postType="taxonomy"
							sourceType="taxonomy"
							value={ template || 'overlay-5' }
							onChange={ ( value ) => setAttributes( { template: value } ) }
						/>
					</div>
				</>
			) : (
				<>
					<ToggleControl
						label={ __(
							'Manual post selection',
							'codeweber-gutenberg-blocks'
						) }
						checked={ !! manualMode }
						onChange={ ( value ) =>
							setAttributes( { manualMode: value } )
						}
						help={ __(
							'Pick and order posts manually instead of a query.',
							'codeweber-gutenberg-blocks'
						) }
						__nextHasNoMarginBottom
					/>

					{ ! manualMode && (
						<PostTypeTaxonomyControl
							postType={ postType }
							selectedTaxonomies={ selectedTaxonomies }
							onPostTypeChange={ ( value ) =>
								setAttributes( { postType: value } )
							}
							onTaxonomyChange={ ( value ) =>
								setAttributes( { selectedTaxonomies: value } )
							}
						/>
					) }

					{ manualMode && (
						<ManualPostsSection
							postType={ postType }
							manualPosts={ manualPosts }
							manualItems={ manualItems }
							setAttributes={ setAttributes }
						/>
					) }

					<div style={ { marginTop: '16px' } }>
						<PostGridTemplateControl
							value={ template }
							onChange={ ( value ) =>
								setAttributes( { template: value } )
							}
							postType={ postType || 'post' }
						/>
						{ postType === 'clients' && (
							<div style={ { marginTop: '16px' } }>
								<ToggleControl
									label={ __(
										'Enable Links',
										'codeweber-gutenberg-blocks'
									) }
									checked={ enableLink || false }
									onChange={ ( value ) =>
										setAttributes( { enableLink: value } )
									}
									help={ __(
										'Enable links to client posts (disabled by default)',
										'codeweber-gutenberg-blocks'
									) }
								/>
							</div>
						) }
					</div>

					{ ! manualMode && postType === 'projects' && (
						<ProjectImageTagSection
							filterByImageTag={ filterByImageTag }
							filterImageTagId={ filterImageTagId }
							setAttributes={ setAttributes }
						/>
					) }

					<SchemaTypeNotice mode="post" postType={ postType || '' } />

					{ ! manualMode && (
						<RangeControl
							label={ __(
								'Posts Per Page',
								'codeweber-gutenberg-blocks'
							) }
							value={ postsPerPage }
							onChange={ ( value ) =>
								setAttributes( { postsPerPage: value } )
							}
							min={ 1 }
							max={ 50 }
							initialPosition={ 6 }
							help={ __(
								'Number of posts to display',
								'codeweber-gutenberg-blocks'
							) }
						/>
					) }
				</>
			) }

			<div style={ { marginTop: '16px' } }>
				<ImageSizeControl
					value={ imageSize || 'full' }
					onChange={ ( value ) =>
						setAttributes( { imageSize: value } )
					}
					label={ __( 'Image Size', 'codeweber-gutenberg-blocks' ) }
					help={ __(
						'Select the size for featured images.',
						'codeweber-gutenberg-blocks'
					) }
					postType={ postType }
				/>
			</div>

			{ ! isTaxonomyMode && ! manualMode && (
				<div style={ { marginTop: '16px' } }>
					<PostSortControl
						orderBy={ orderBy || 'date' }
						order={ order || 'desc' }
						onOrderByChange={ ( value ) =>
							setAttributes( { orderBy: value } )
						}
						onOrderChange={ ( value ) =>
							setAttributes( { order: value } )
						}
					/>
				</div>
			) }

			<div style={ { marginTop: '16px' } }>
				<ToggleControl
					label={ __(
						'Lift hover effect',
						'codeweber-gutenberg-blocks'
					) }
					checked={ simpleEffect === 'lift' }
					onChange={ ( value ) =>
						setAttributes( {
							simpleEffect: value ? 'lift' : 'none',
						} )
					}
					help={ __(
						'Card lifts on hover.',
						'codeweber-gutenberg-blocks'
					) }
				/>
			</div>
		</>
	);
};
