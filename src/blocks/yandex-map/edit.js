/**
 * Yandex Map Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { mapMarker } from '@wordpress/icons';
import { YandexMapSidebar } from './sidebar';

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
	const {
		dataSource,
		height,
		blockClass,
		blockId,
		blockData,
	} = attributes;

	const blockProps = useBlockProps({
		className: 'cwgb-yandex-map-block-edit',
	});

	// Парсим data-атрибуты
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	return (
		<>
			{/* Inspector Controls */}
			<InspectorControls>
				<YandexMapSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			{/* Preview */}
			<div {...blockProps} {...dataAttributes} id={blockId || undefined}>
				<Placeholder
					icon={mapMarker}
					label={__('Yandex Map', 'codeweber-gutenberg-blocks')}
					instructions={__(
						dataSource === 'offices'
							? 'Map will display offices from CPT. Configure settings in the sidebar.'
							: 'Map will display custom markers. Add markers in the sidebar.',
						'codeweber-gutenberg-blocks'
					)}
				>
					<div
						style={{
							width: '100%',
							height: `${height || 500}px`,
							backgroundColor: '#f0f0f0',
							border: '2px dashed #ccc',
							borderRadius: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
							gap: '10px',
						}}
					>
						<span style={{ fontSize: '48px' }}>🗺️</span>
						<p style={{ margin: 0, color: '#666' }}>
							{dataSource === 'offices'
								? __('Offices Map Preview', 'codeweber-gutenberg-blocks')
								: __('Custom Markers Map Preview', 'codeweber-gutenberg-blocks')}
						</p>
						<p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
							{__('Map will be rendered on the frontend', 'codeweber-gutenberg-blocks')}
						</p>
					</div>
				</Placeholder>
			</div>
		</>
	);
};

export default Edit;

