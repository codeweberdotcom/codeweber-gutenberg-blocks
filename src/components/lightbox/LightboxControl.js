import { __ } from '@wordpress/i18n';
import { ToggleControl, TextControl } from '@wordpress/components';

/**
 * LightboxControl Component
 *
 * Universal control for lightbox settings
 * Can be used in any block that supports lightbox functionality
 *
 * @package CodeWeber Gutenberg Blocks
 */
export const LightboxControl = ({ attributes, setAttributes }) => {
	const { enableLightbox, lightboxGallery, lightboxShowDesc } = attributes;

	return (
		<>
			<ToggleControl
				label={__('Enable Lightbox', 'codeweber-gutenberg-blocks')}
				checked={enableLightbox}
				onChange={(value) => setAttributes({ enableLightbox: value })}
			/>

			{enableLightbox && (
				<>
					<ToggleControl
						label={__(
							'Show title & description',
							'codeweber-gutenberg-blocks'
						)}
						help={__(
							'Shows image title and description in the lightbox caption if filled in.',
							'codeweber-gutenberg-blocks'
						)}
						checked={lightboxShowDesc || false}
						onChange={(value) =>
							setAttributes({ lightboxShowDesc: value })
						}
					/>
					<TextControl
						label={__(
							'Gallery Name',
							'codeweber-gutenberg-blocks'
						)}
						value={lightboxGallery}
						onChange={(value) =>
							setAttributes({ lightboxGallery: value })
						}
					/>
				</>
			)}
		</>
	);
};
