import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { ImageSizeControl } from '../image-size';

export const ImageControl = ({ images, setAttributes, imageSize }) => {
	// Обработка выбора изображений
	const handleSelectImages = async (media) => {
		// Получаем полные данные через REST API
		const newImages = await Promise.all(
			media.map(async (item) => {
				let title = '';
				let description = '';
				let sizes = {};

				// Запрашиваем полные данные из REST API для получения title, description и sizes
				try {
					const response = await fetch(
						`/wp-json/wp/v2/media/${item.id}`
					);
					if (response.ok) {
						const fullData = await response.json();
						title = fullData.title?.rendered || '';

						// Description может содержать HTML - извлекаем только текст
						let descriptionHtml =
							fullData.description?.rendered || '';
						if (descriptionHtml) {
							// Создаем временный элемент для парсинга HTML
							const tempDiv = document.createElement('div');
							tempDiv.innerHTML = descriptionHtml;
							description =
								tempDiv.textContent || tempDiv.innerText || '';
							description = description.trim();
						}

						// Получаем все доступные размеры
						if (fullData.media_details?.sizes) {
							sizes = fullData.media_details.sizes;
						}
					}
				} catch (error) {
					console.warn('Failed to fetch full media data:', error);
				}

				return {
					id: item.id,
					url: item.url, // Full size URL
					sizes: sizes, // Все доступные размеры
					alt: item.alt || '',
					title: title,
					caption: item.caption || '',
					description: description,
					linkUrl: '', // Пока пустая ссылка
				};
			})
		);

		setAttributes({ images: newImages });
	};

	// Удаление изображения
	const handleRemoveImage = (index) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setAttributes({ images: newImages });
	};

	// Перемещение изображения вверх
	const handleMoveUp = (index) => {
		if (index === 0) return;
		const newImages = [...images];
		[newImages[index - 1], newImages[index]] = [
			newImages[index],
			newImages[index - 1],
		];
		setAttributes({ images: newImages });
	};

	// Перемещение изображения вниз
	const handleMoveDown = (index) => {
		if (index === images.length - 1) return;
		const newImages = [...images];
		[newImages[index], newImages[index + 1]] = [
			newImages[index + 1],
			newImages[index],
		];
		setAttributes({ images: newImages });
	};

	return (
		<div className="cwgb-image-control">
			<MediaUploadCheck>
				<MediaUpload
					onSelect={handleSelectImages}
					allowedTypes={['image']}
					multiple={true}
					gallery={true}
					value={images.map((img) => img.id)}
					render={({ open }) => (
						<Button
							onClick={open}
							variant="primary"
							className="mb-3"
						>
							{images.length > 0
								? __(
										'Edit Images',
										'codeweber-gutenberg-blocks'
									)
								: __(
										'Add Images',
										'codeweber-gutenberg-blocks'
									)}
						</Button>
					)}
				/>
			</MediaUploadCheck>

			{images && images.length > 0 && (
				<>
					{/* Image Size Control - в самом верху */}
					<div style={{ marginBottom: '16px' }}>
						<ImageSizeControl
							value={imageSize}
							onChange={(value) =>
								setAttributes({ imageSize: value })
							}
							label={__(
								'Image Size',
								'codeweber-gutenberg-blocks'
							)}
							help={__(
								'Choose image size for display',
								'codeweber-gutenberg-blocks'
							)}
						/>
					</div>

					<div className="cwgb-image-list">
						<p className="components-base-control__label">
							{__(
								'Selected Images:',
								'codeweber-gutenberg-blocks'
							)}{' '}
							{images.length}
						</p>
						{images.map((image, index) => (
							<div key={index} className="cwgb-image-item">
								<img
									src={image.url}
									alt={image.alt || ''}
									className="cwgb-image-thumbnail"
								/>
								<div className="cwgb-image-actions">
									<Button
										icon="arrow-up-alt2"
										onClick={() => handleMoveUp(index)}
										disabled={index === 0}
										label={__(
											'Move Up',
											'codeweber-gutenberg-blocks'
										)}
										isSmall
									/>
									<Button
										icon="arrow-down-alt2"
										onClick={() => handleMoveDown(index)}
										disabled={index === images.length - 1}
										label={__(
											'Move Down',
											'codeweber-gutenberg-blocks'
										)}
										isSmall
									/>
									<Button
										icon="trash"
										onClick={() => handleRemoveImage(index)}
										label={__(
											'Remove',
											'codeweber-gutenberg-blocks'
										)}
										isDestructive
										isSmall
									/>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};
