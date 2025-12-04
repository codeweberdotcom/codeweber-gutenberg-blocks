import { __ } from '@wordpress/i18n';
import { ToggleControl, TextControl } from '@wordpress/components';

export const LightboxControl = ({ attributes, setAttributes }) => {
	const { enableLightbox, lightboxGallery } = attributes;

	return (
		<>
			<ToggleControl
				label={__('Enable Lightbox', 'codeweber-blocks')}
				checked={enableLightbox}
				onChange={(value) => setAttributes({ enableLightbox: value })}
				help={__(
					'Open images in fullscreen lightbox on click',
					'codeweber-blocks'
				)}
			/>

			{enableLightbox && (
				<TextControl
					label={__('Gallery Name', 'codeweber-blocks')}
					value={lightboxGallery}
					onChange={(value) => setAttributes({ lightboxGallery: value })}
					help={__(
						'Images with the same gallery name will be grouped together',
						'codeweber-blocks'
					)}
				/>
			)}
		</>
	);
};


