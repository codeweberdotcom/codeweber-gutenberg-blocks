/**
 * Yandex Map v3 Block - Edit Component
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { YandexMapV3Sidebar } from './sidebar';

const Edit = ({ attributes, setAttributes }) => {
	const { height } = attributes;

	const blockProps = useBlockProps({
		className: 'cwgb-yandex-map-v3-block-edit',
	});

	return (
		<>
			<InspectorControls>
				<YandexMapV3Sidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div
				{...blockProps}
				style={{ minHeight: `${height || 500}px` }}
			>
				<ServerSideRender
					block="codeweber-blocks/yandex-map-v3"
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
