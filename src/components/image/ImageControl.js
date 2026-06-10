import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { ImageSizeControl } from '../image-size';

export const ImageControl = ({ images, setAttributes, imageSize }) => {
	// Подгружаем sizes из WordPress store для всех текущих изображений.
	// useSelect использует аутентифицированные запросы — не падает на 401.
	const imageIds = ( images || [] ).map( ( img ) => img.id ).filter( Boolean ).join( ',' );
	const freshSizes = useSelect(
		( select ) => {
			if ( ! imageIds ) return {};
			const getMedia = select( 'core' ).getMedia;
			return imageIds.split( ',' ).reduce( ( acc, idStr ) => {
				const id = parseInt( idStr, 10 );
				const media = getMedia( id );
				if ( media?.media_details?.sizes ) {
					acc[ id ] = media.media_details.sizes;
				}
				return acc;
			}, {} );
		},
		[ imageIds ]
	);

	// Обработка выбора изображений
	const handleSelectImages = async ( media ) => {
		const newImages = await Promise.all(
			media.map( async ( item ) => {
				// MediaUpload передаёт item.sizes в формате {url, width, height} —
				// используем как основу, не зависим от REST API для размеров.
				let sizes = item.sizes || {};
				let title = item.title || '';
				let description = '';

				// REST API нужен только для title (rendered) и description.
				// Если доступен — также берём media_details.sizes (source_url формат).
				try {
					const response = await fetch( `/wp-json/wp/v2/media/${ item.id }` );
					if ( response.ok ) {
						const fullData = await response.json();
						title = fullData.title?.rendered || title;

						const descriptionHtml = fullData.description?.rendered || '';
						if ( descriptionHtml ) {
							const tempDiv = document.createElement( 'div' );
							tempDiv.innerHTML = descriptionHtml;
							description = ( tempDiv.textContent || tempDiv.innerText || '' ).trim();
						}

						if ( fullData.media_details?.sizes ) {
							sizes = fullData.media_details.sizes;
						}
					}
				} catch ( error ) {
					// Fallback: item.sizes от MediaUpload уже в sizes
				}

				return {
					id: item.id,
					url: item.url,
					sizes,
					alt: item.alt || '',
					title,
					caption: item.caption || '',
					description,
					linkUrl: '',
				};
			} )
		);

		setAttributes( { images: newImages } );
	};

	// Смена размера: обновляет images с sizes из WP store (без REST API fetch)
	const handleSizeChange = ( value ) => {
		const needsRefresh = images.some(
			( img ) => ! img.sizes || ! img.sizes[ value ]
		);
		if ( ! needsRefresh ) {
			setAttributes( { imageSize: value } );
			return;
		}
		const updatedImages = images.map( ( image ) => {
			if ( image.sizes && image.sizes[ value ] ) {
				return image;
			}
			const storeSizes = freshSizes[ image.id ];
			if ( storeSizes ) {
				return { ...image, sizes: storeSizes };
			}
			return image;
		} );
		setAttributes( { imageSize: value, images: updatedImages } );
	};

	// Удаление изображения
	const handleRemoveImage = ( index ) => {
		const newImages = [ ...images ];
		newImages.splice( index, 1 );
		setAttributes( { images: newImages } );
	};

	// Перемещение изображения вверх
	const handleMoveUp = ( index ) => {
		if ( index === 0 ) return;
		const newImages = [ ...images ];
		[ newImages[ index - 1 ], newImages[ index ] ] = [
			newImages[ index ],
			newImages[ index - 1 ],
		];
		setAttributes( { images: newImages } );
	};

	// Перемещение изображения вниз
	const handleMoveDown = ( index ) => {
		if ( index === images.length - 1 ) return;
		const newImages = [ ...images ];
		[ newImages[ index ], newImages[ index + 1 ] ] = [
			newImages[ index + 1 ],
			newImages[ index ],
		];
		setAttributes( { images: newImages } );
	};

	return (
		<div className="cwgb-image-control">
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ handleSelectImages }
					allowedTypes={ [ 'image' ] }
					multiple={ true }
					gallery={ true }
					value={ images.map( ( img ) => img.id ) }
					render={ ( { open } ) => (
						<Button
							onClick={ open }
							variant="primary"
							className="mb-3"
						>
							{ images.length > 0
								? __(
										'Edit Images',
										'codeweber-gutenberg-blocks'
									)
								: __(
										'Add Images',
										'codeweber-gutenberg-blocks'
									) }
						</Button>
					) }
				/>
			</MediaUploadCheck>

			{ images && images.length > 0 && (
				<>
					{ /* Image Size Control */ }
					<div style={ { marginBottom: '16px' } }>
						<ImageSizeControl
							value={ imageSize }
							onChange={ handleSizeChange }
							label={ __(
								'Image Size',
								'codeweber-gutenberg-blocks'
							) }
							help={ __(
								'Choose image size for display',
								'codeweber-gutenberg-blocks'
							) }
						/>
					</div>

					<div className="cwgb-image-list">
						<p className="components-base-control__label">
							{ __(
								'Selected Images:',
								'codeweber-gutenberg-blocks'
							) }{ ' ' }
							{ images.length }
						</p>
						{ images.map( ( image, index ) => (
							<div key={ index } className="cwgb-image-item">
								<img
									src={ image.url }
									alt={ image.alt || '' }
									className="cwgb-image-thumbnail"
								/>
								<div className="cwgb-image-actions">
									<Button
										icon="arrow-up-alt2"
										onClick={ () => handleMoveUp( index ) }
										disabled={ index === 0 }
										label={ __(
											'Move Up',
											'codeweber-gutenberg-blocks'
										) }
										isSmall
									/>
									<Button
										icon="arrow-down-alt2"
										onClick={ () => handleMoveDown( index ) }
										disabled={ index === images.length - 1 }
										label={ __(
											'Move Down',
											'codeweber-gutenberg-blocks'
										) }
										isSmall
									/>
									<Button
										icon="trash"
										onClick={ () => handleRemoveImage( index ) }
										label={ __(
											'Remove',
											'codeweber-gutenberg-blocks'
										) }
										isDestructive
										isSmall
									/>
								</div>
							</div>
						) ) }
					</div>
				</>
			) }
		</div>
	);
};
