import { registerBlockType } from '@wordpress/blocks';
import './editor.scss';
import './style.scss';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { ImageSimpleRender } from '../../components/image/ImageSimpleRender';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
} from '../../components/swiper/SwiperSlider';
import {
	getRowColsClasses,
	getGapClasses,
} from '../../components/grid-control';
import { buildLinkAttrs } from '../../utilities/buildLinkAttrs';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
	deprecated: [
		{
			// Animation wrapper was <span> (inline element) — transforms didn't apply
			attributes: metadata.attributes,
			save( { attributes } ) {
				const {
					displayMode,
					images,
					imageSize,
					gridType,
					gridColumns,
					gridRowCols,
					gridGapX,
					gridGapY,
					swiperEffect,
					swiperItems,
					swiperItemsXs,
					swiperItemsSm,
					swiperItemsMd,
					swiperItemsLg,
					swiperItemsXl,
					swiperItemsXxl,
					swiperSpeed,
					swiperAutoplay,
					swiperAutoplayTime,
					swiperAutoHeight,
					swiperWatchOverflow,
					swiperMargin,
					swiperLoop,
					swiperNav,
					swiperDots,
					swiperDrag,
					swiperReverse,
					swiperUpdateResize,
					swiperNavStyle,
					swiperNavPosition,
					swiperDotsStyle,
					swiperContainerType,
					swiperItemsAuto,
					swiperCentered,
					borderRadius,
					enableLightbox,
					lightboxGallery,
					lightboxShowDesc,
					simpleEffect,
					effectType,
					tooltipStyle,
					overlayStyle,
					overlayGradient,
					overlayColor,
					cursorStyle,
					blockClass,
					blockId,
					blockData,
					loadMoreEnable,
					loadMoreInitialCount,
					loadMoreLoadMoreCount,
					loadMoreText,
					loadMoreType,
					loadMoreButtonSize,
					loadMoreButtonStyle,
					imageRenderType = 'img',
					animationEnabled,
					animationType,
					animationDuration,
					animationDelay,
				} = attributes;

				const getContainerClasses = () => {
					if ( displayMode === 'grid' ) {
						const currentGridType = gridType || 'classic';
						if ( currentGridType === 'columns-grid' ) {
							const rowColsClasses = getRowColsClasses( attributes, 'grid', gridColumns );
							const gapClasses = getGapClasses( attributes, 'grid' );
							let gapClassesStr = gapClasses.join( ' ' );
							if ( ! gapClassesStr && ( gridGapX || gridGapY ) ) {
								const oldGapClasses = [];
								if ( gridGapY ) oldGapClasses.push( `gy-${ gridGapY }` );
								if ( gridGapX ) oldGapClasses.push( `gx-${ gridGapX }` );
								gapClassesStr = oldGapClasses.join( ' ' );
							}
							return `row ${ gapClassesStr } ${ rowColsClasses.join( ' ' ) }`;
						} else {
							const gapClasses = getGapClasses( attributes, 'grid' );
							let gapClassesStr = gapClasses.join( ' ' );
							if ( ! gapClassesStr && ( gridGapX || gridGapY ) ) {
								const oldGapClasses = [];
								if ( gridGapY ) oldGapClasses.push( `gy-${ gridGapY }` );
								if ( gridGapX ) oldGapClasses.push( `gx-${ gridGapX }` );
								gapClassesStr = oldGapClasses.join( ' ' );
							}
							return `row ${ gapClassesStr }`.trim();
						}
					}
					return '';
				};

				const getColClasses = () => {
					if ( displayMode !== 'grid' || gridType !== 'classic' ) return '';
					const colClasses = [];
					const {
						gridColumns: colsDefault,
						gridColumnsXs: colsXs,
						gridColumnsSm: colsSm,
						gridColumnsMd: colsMd,
						gridColumnsLg: colsLg,
						gridColumnsXl: colsXl,
						gridColumnsXxl: colsXxl,
						gridColumnsXxxl: colsXxxl,
					} = attributes;
					if ( colsDefault ) colClasses.push( `col-${ colsDefault }` );
					if ( colsXs ) colClasses.push( `col-${ colsXs }` );
					if ( colsSm ) colClasses.push( `col-sm-${ colsSm }` );
					if ( colsMd ) colClasses.push( `col-md-${ colsMd }` );
					if ( colsLg ) colClasses.push( `col-lg-${ colsLg }` );
					if ( colsXl ) colClasses.push( `col-xl-${ colsXl }` );
					if ( colsXxl ) colClasses.push( `col-xxl-${ colsXxl }` );
					if ( colsXxxl ) colClasses.push( `col-xxxl-${ colsXxxl }` );
					return colClasses.join( ' ' );
				};

				const swiperConfig = getSwiperConfigFromAttributes( attributes );

				const getDataAttributes = () => {
					const dataAttrs = {};
					if ( blockData ) {
						blockData.split( ',' ).forEach( ( pair ) => {
							const [ key, value ] = pair.split( '=' ).map( ( s ) => s.trim() );
							if ( key && value ) dataAttrs[ `data-${ key }` ] = value;
						} );
					}
					return dataAttrs;
				};

				if ( images.length === 0 ) return null;

				const linkBuildResult = buildLinkAttrs( attributes );
				const activeLinkProps = linkBuildResult ? linkBuildResult.linkProps : null;
				const shouldRemoveWrapper = imageRenderType === 'background';

				const blockProps = shouldRemoveWrapper
					? null
					: useBlockProps.save( {
							className: `cwgb-image-simple-block ${ blockClass }`,
							...( blockId && { id: blockId } ),
							...getDataAttributes(),
					  } );

				const renderContent = () => {
					if ( displayMode === 'single' ) {
						return (
							<ImageSimpleRender
								image={ images[ 0 ] }
								imageSize={ imageSize }
								borderRadius={ borderRadius }
								enableLightbox={ enableLightbox }
								lightboxGallery={ lightboxGallery }
								lightboxShowDesc={ lightboxShowDesc }
								simpleEffect={ simpleEffect }
								effectType={ effectType }
								tooltipStyle={ tooltipStyle }
								overlayStyle={ overlayStyle }
								overlayGradient={ overlayGradient }
								overlayColor={ overlayColor }
								cursorStyle={ cursorStyle }
								imageRenderType={ imageRenderType }
								isEditor={ false }
								linkProps={ activeLinkProps }
							/>
						);
					} else if ( displayMode === 'grid' ) {
						return ( () => {
							const shouldLimitImages = loadMoreEnable && loadMoreInitialCount > 0;
							const initialImages = shouldLimitImages ? images.slice( 0, loadMoreInitialCount ) : images;
							const hasMoreImages = shouldLimitImages && images.length > loadMoreInitialCount;

							if ( loadMoreEnable ) {
								const blockDataJson = JSON.stringify( {
									images, imageSize, gridType, borderRadius,
									enableLightbox, lightboxGallery, simpleEffect, effectType,
									tooltipStyle, overlayStyle, overlayGradient, overlayColor,
									cursorStyle, gridColumns,
									gridColumnsXs: attributes.gridColumnsXs,
									gridColumnsSm: attributes.gridColumnsSm,
									gridColumnsMd: attributes.gridColumnsMd,
									gridColumnsLg: attributes.gridColumnsLg,
									gridColumnsXl: attributes.gridColumnsXl,
									gridColumnsXxl: attributes.gridColumnsXxl,
								} );
								return (
									<div
										className="cwgb-load-more-container"
										data-block-id={ blockId || 'image-simple-block' }
										data-block-type="image-simple"
										data-current-offset={ loadMoreInitialCount }
										data-load-count={ loadMoreLoadMoreCount || 6 }
										data-post-id=""
										data-block-attributes={ blockDataJson }
									>
										<div className={ `cwgb-load-more-items ${ getContainerClasses() }` }>
											{ initialImages.map( ( image, index ) => (
												<div key={ index } className={ gridType === 'classic' ? getColClasses() : '' }>
													<ImageSimpleRender
														image={ image } imageSize={ imageSize }
														borderRadius={ borderRadius } enableLightbox={ enableLightbox }
														lightboxGallery={ lightboxGallery } simpleEffect={ simpleEffect }
														effectType={ effectType } tooltipStyle={ tooltipStyle }
														overlayStyle={ overlayStyle } overlayGradient={ overlayGradient }
														overlayColor={ overlayColor } cursorStyle={ cursorStyle }
														imageRenderType={ imageRenderType } isEditor={ false }
														linkProps={ activeLinkProps }
													/>
												</div>
											) ) }
										</div>
										{ hasMoreImages && ( () => {
											const loadMoreTexts = {
												'show-more': 'Show More', 'load-more': 'Load More',
												'show-more-items': 'Show More Items', 'more-posts': 'More Posts',
												'view-all': 'View All', 'show-all': 'Show All',
											};
											const lmTextKey = loadMoreText || 'show-more';
											const lmTextValue = loadMoreTexts[ lmTextKey ] || loadMoreTexts[ 'show-more' ];
											const lmType = loadMoreType || 'button';
											const loadingText = 'Loading...';
											const btnClasses = [ 'btn', 'cwgb-load-more-btn' ];
											if ( loadMoreButtonStyle === 'outline' ) btnClasses.push( 'btn-outline-primary' );
											else btnClasses.push( 'btn-primary' );
											if ( loadMoreButtonSize ) btnClasses.push( loadMoreButtonSize );
											return (
												<div className="text-center mt-5">
													{ lmType === 'link' ? (
														<a href="#" className="hover cwgb-load-more-btn" data-load-more="true" data-loading-text={ loadingText }>{ lmTextValue }</a>
													) : (
														<button className={ btnClasses.join( ' ' ) } type="button" data-loading-text={ loadingText }>{ lmTextValue }</button>
													) }
												</div>
											);
										} )() }
									</div>
								);
							}
							return (
								<div className={ getContainerClasses() }>
									{ images.map( ( image, index ) => (
										<div key={ index } className={ gridType === 'classic' ? getColClasses() : '' }>
											<ImageSimpleRender
												image={ image } imageSize={ imageSize }
												borderRadius={ borderRadius } enableLightbox={ enableLightbox }
												lightboxGallery={ lightboxGallery } lightboxShowDesc={ lightboxShowDesc }
												simpleEffect={ simpleEffect } effectType={ effectType }
												tooltipStyle={ tooltipStyle } overlayStyle={ overlayStyle }
												overlayGradient={ overlayGradient } overlayColor={ overlayColor }
												cursorStyle={ cursorStyle } imageRenderType={ imageRenderType }
												isEditor={ false } linkProps={ activeLinkProps }
											/>
										</div>
									) ) }
								</div>
							);
						} )();
					} else if ( displayMode === 'swiper' ) {
						const swiperClassName = imageRenderType === 'background' ? 'h-100' : '';
						const swiperContainerClassName = imageRenderType === 'background' ? 'h-100' : '';
						return (
							<SwiperSlider config={ swiperConfig } className={ swiperContainerClassName } swiperClassName={ swiperClassName }>
								{ images.map( ( image, index ) => (
									<SwiperSlide key={ index }>
										<ImageSimpleRender
											image={ image } imageSize={ imageSize }
											borderRadius={ borderRadius } enableLightbox={ enableLightbox }
											lightboxGallery={ lightboxGallery } lightboxShowDesc={ lightboxShowDesc }
											simpleEffect={ simpleEffect } effectType={ effectType }
											tooltipStyle={ tooltipStyle } overlayStyle={ overlayStyle }
											overlayGradient={ overlayGradient } overlayColor={ overlayColor }
											cursorStyle={ cursorStyle } imageRenderType={ imageRenderType }
											isEditor={ false } linkProps={ activeLinkProps }
										/>
									</SwiperSlide>
								) ) }
							</SwiperSlider>
						);
					}
					return null;
				};

				const content = renderContent();

				const hiddenIframeEl = linkBuildResult?.videoFrameId ? (
					<div id={ linkBuildResult.videoFrameId } style={ { display: 'none' } }>
						<iframe
							src={ linkBuildResult.videoFrameSrc }
							allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write;"
							frameBorder="0"
							allowFullScreen
							style={ { width: '100%', height: '100%', aspectRatio: '16/9' } }
						/>
					</div>
				) : null;

				const wrapAnimation = ( el ) => {
					if ( animationEnabled && animationType ) {
						return (
							<span
								data-cue={ animationType }
								{ ...( animationDuration && { 'data-duration': animationDuration } ) }
								{ ...( animationDelay && { 'data-delay': animationDelay } ) }
							>
								{ el }
							</span>
						);
					}
					return el;
				};

				if ( shouldRemoveWrapper ) {
					const inner = hiddenIframeEl ? <>{ hiddenIframeEl }{ content }</> : content;
					return wrapAnimation( inner );
				}
				return wrapAnimation( <div { ...blockProps }>{ hiddenIframeEl }{ content }</div> );
			},
		},
	],
});
