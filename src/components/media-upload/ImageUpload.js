import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

/**
 * ImageUpload - универсальный компонент для загрузки изображения
 * 
 * @param {Object} props
 * @param {Object} props.image - Объект изображения { id, url, alt, ... }
 * @param {Function} props.onChange - Callback при выборе изображения
 * @param {string} props.label - Заголовок (опционально)
 * @param {boolean} props.showPreview - Показывать превью (по умолчанию true)
 * @param {string} props.buttonText - Текст кнопки (опционально)
 * @param {string} props.buttonVariant - Вариант кнопки (по умолчанию 'primary')
 */
export const ImageUpload = ({
	image,
	onChange,
	label,
	showPreview = true,
	buttonText,
	buttonVariant = 'primary',
}) => {
	// Обработка выбора изображения
	const handleSelectImage = async (media) => {
		let title = '';
		let description = '';
		let sizes = {};

		// Запрашиваем полные данные из REST API
		try {
			const response = await fetch(`/wp-json/wp/v2/media/${media.id}`);
			if (response.ok) {
				const fullData = await response.json();
				title = fullData.title?.rendered || '';

				// Description может содержать HTML
				let descriptionHtml = fullData.description?.rendered || '';
				if (descriptionHtml) {
					const tempDiv = document.createElement('div');
					tempDiv.innerHTML = descriptionHtml;
					description = tempDiv.textContent || tempDiv.innerText || '';
					description = description.trim();
				}

				// Получаем все размеры
				if (fullData.media_details?.sizes) {
					sizes = fullData.media_details.sizes;
				}
			}
		} catch (error) {
			console.warn('Failed to fetch full media data:', error);
		}

		onChange({
			id: media.id,
			url: media.url,
			sizes: sizes,
			alt: media.alt || '',
			title: title,
			caption: media.caption || '',
			description: description,
		});
	};

	const defaultButtonText = image?.url
		? __('Change Image', 'codeweber-gutenberg-blocks')
		: __('Add Image', 'codeweber-gutenberg-blocks');

	return (
		<div className="cwgb-image-upload">
			{label && (
				<div className="component-sidebar-title" style={{ marginBottom: '8px' }}>
					<label>{label}</label>
				</div>
			)}

			<MediaUploadCheck>
				<MediaUpload
					onSelect={handleSelectImage}
					allowedTypes={['image']}
					value={image?.id || 0}
					render={({ open }) => (
						<>
							{!image?.url ? (
								// Placeholder когда нет изображения (только placeholder, без кнопки)
								<div
									onClick={open}
									style={{
										padding: '40px 20px',
										textAlign: 'center',
										background: '#f9f9f9',
										border: '2px dashed #ccc',
										borderRadius: '4px',
										cursor: 'pointer',
										marginBottom: '12px',
									}}
								>
									<div style={{ fontSize: '48px', color: '#8b5cf6', marginBottom: '8px' }}>
										📷
									</div>
									<div style={{ color: '#666', fontSize: '14px' }}>
										{buttonText || defaultButtonText}
									</div>
								</div>
							) : (
								// Preview и кнопки когда изображение выбрано
								<>
									{showPreview && (
										<div style={{ marginBottom: '12px' }}>
											<img
												src={image.url}
												alt={image.alt || ''}
												style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
											/>
										</div>
									)}

									<div style={{ display: 'flex', gap: '8px' }}>
										<Button onClick={open} variant={buttonVariant}>
											{buttonText || __('Change Image', 'codeweber-gutenberg-blocks')}
										</Button>

										<Button
											onClick={() =>
												onChange({ id: 0, url: '', sizes: {}, alt: '', title: '', caption: '', description: '' })
											}
											isDestructive
										>
											{__('Remove', 'codeweber-gutenberg-blocks')}
										</Button>
									</div>
								</>
							)}
						</>
					)}
				/>
			</MediaUploadCheck>
		</div>
	);
};

