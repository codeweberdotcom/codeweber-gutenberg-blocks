/**
 * Yandex Map Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { YandexMapSidebar } from './sidebar';

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
	const { height, blockClass, blockId, blockData } = attributes;

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
			<InspectorControls>
				<YandexMapSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div
				{...blockProps}
				{...dataAttributes}
				id={blockId || undefined}
				style={{ minHeight: `${height || 500}px` }}
			>
				<ServerSideRender
					block="codeweber-blocks/yandex-map"
					attributes={attributes}
					LoadingPlaceholder={() => (
						<div
							style={{
								height: `${height || 500}px`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								background: '#f0f0f0',
								borderRadius: '8px',
								color: '#666',
							}}
						>
							{__('Loading map…', 'codeweber-gutenberg-blocks')}
						</div>
					)}
				/>
			</div>
		</>
	);
};

export default Edit;
