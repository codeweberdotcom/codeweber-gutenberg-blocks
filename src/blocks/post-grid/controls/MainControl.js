import { __ } from '@wordpress/i18n';
import {
	Button,
	RangeControl,
	SelectControl,
	Spinner,
	TextControl,
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

// Manual post selection: search by title and reorder with up/down arrows.
const ManualPostsSection = ( { postType, manualPosts = [], setAttributes } ) => {
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );
	const [ isSearching, setIsSearching ] = useState( false );

	useEffect( () => {
		if ( ! searchQuery || searchQuery.length < 2 ) {
			setSearchResults( [] );
			return;
		}
		const timer = setTimeout( async () => {
			setIsSearching( true );
			try {
				let endpoint = postType === 'post' ? 'posts' : postType;
				try {
					const typeData = await apiFetch( {
						path: `/wp/v2/types/${ postType }`,
					} );
					if ( typeData?.rest_base ) endpoint = typeData.rest_base;
				} catch ( _e ) {}

				const results = await apiFetch( {
					path: addQueryArgs( `/wp/v2/${ endpoint }`, {
						search: searchQuery,
						per_page: 10,
						_fields: 'id,title',
					} ),
				} );
				setSearchResults( Array.isArray( results ) ? results : [] );
			} catch ( _e ) {
				setSearchResults( [] );
			} finally {
				setIsSearching( false );
			}
		}, 400 );
		return () => clearTimeout( timer );
	}, [ searchQuery, postType ] );

	const decodeTitle = ( rendered ) => {
		if ( ! rendered ) return '';
		const div = document.createElement( 'div' );
		div.innerHTML = rendered;
		return div.textContent || div.innerText || '';
	};

	const addPost = ( post ) => {
		const already = manualPosts.some( ( p ) => p.id === post.id );
		if ( ! already ) {
			setAttributes( {
				manualPosts: [
					...manualPosts,
					{
						id: post.id,
						title: decodeTitle( post.title?.rendered ),
					},
				],
			} );
		}
		setSearchQuery( '' );
		setSearchResults( [] );
	};

	const removePost = ( idx ) =>
		setAttributes( {
			manualPosts: manualPosts.filter( ( _, i ) => i !== idx ),
		} );

	const movePost = ( idx, dir ) => {
		const newIdx = idx + dir;
		if ( newIdx < 0 || newIdx >= manualPosts.length ) return;
		const arr = [ ...manualPosts ];
		const [ removed ] = arr.splice( idx, 1 );
		arr.splice( newIdx, 0, removed );
		setAttributes( { manualPosts: arr } );
	};

	return (
		<div style={ { marginTop: '16px' } }>
			<TextControl
				label={ __( 'Search posts', 'codeweber-gutenberg-blocks' ) }
				value={ searchQuery }
				onChange={ setSearchQuery }
				placeholder={ __(
					'Type to search…',
					'codeweber-gutenberg-blocks'
				) }
				__nextHasNoMarginBottom
			/>

			{ isSearching && (
				<p style={ { marginTop: 6 } }>
					<Spinner />
				</p>
			) }

			{ ! isSearching && searchResults.length > 0 && (
				<div
					style={ {
						border: '1px solid #ddd',
						borderRadius: 4,
						marginTop: 4,
						marginBottom: 8,
						maxHeight: 200,
						overflowY: 'auto',
					} }
				>
					{ searchResults.map( ( post ) => (
						<button
							key={ post.id }
							style={ {
								display: 'block',
								width: '100%',
								textAlign: 'left',
								padding: '6px 10px',
								background: 'none',
								border: 'none',
								borderBottom: '1px solid #eee',
								cursor: 'pointer',
								fontSize: 12,
							} }
							onClick={ () => addPost( post ) }
						>
							{ decodeTitle( post.title?.rendered ) ||
								`#${ post.id }` }
						</button>
					) ) }
				</div>
			) }

			{ manualPosts.length === 0 ? (
				<p
					style={ {
						color: '#757575',
						fontSize: 12,
						margin: '8px 0',
					} }
				>
					{ __(
						'No posts selected. Search above to add.',
						'codeweber-gutenberg-blocks'
					) }
				</p>
			) : (
				<div style={ { marginTop: 8 } }>
					{ manualPosts.map( ( post, idx ) => (
						<div
							key={ post.id || idx }
							style={ {
								display: 'flex',
								alignItems: 'center',
								gap: 6,
								marginBottom: 4,
								padding: '4px 8px',
								background: '#f9f9f9',
								borderRadius: 4,
								border: '1px solid #e0e0e0',
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
									onClick={ () => movePost( idx, -1 ) }
									label={ __(
										'Move up',
										'codeweber-gutenberg-blocks'
									) }
								/>
								<Button
									icon={ chevronDown }
									iconSize={ 14 }
									disabled={ idx === manualPosts.length - 1 }
									onClick={ () => movePost( idx, 1 ) }
									label={ __(
										'Move down',
										'codeweber-gutenberg-blocks'
									) }
								/>
							</div>
							<span
								style={ {
									flex: 1,
									fontSize: 12,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								} }
							>
								{ post.title || `#${ post.id }` }
							</span>
							<Button
								isSmall
								isDestructive
								onClick={ () => removePost( idx ) }
								style={ { flexShrink: 0 } }
							>
								✕
							</Button>
						</div>
					) ) }
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
