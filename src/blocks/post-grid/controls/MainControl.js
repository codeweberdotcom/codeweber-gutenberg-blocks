import { __ } from '@wordpress/i18n';
import {
	Button,
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
	} = attributes;

	return (
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

			{ ! manualMode && (
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
