import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'cwgb-inline-text-editor-placeholder',
	} );

	return (
		<div { ...blockProps }>
			<span className="dashicons dashicons-edit-page" aria-hidden="true"></span>
			<div>
				<strong>
					{ __( 'Inline Text Editor', 'codeweber-gutenberg-blocks' ) }
				</strong>
				<p>
					{ __(
						'No output for visitors. On the frontend, logged-in editors see a button that opens a drawer to edit texts of Codeweber blocks on this page.',
						'codeweber-gutenberg-blocks'
					) }
				</p>
			</div>
		</div>
	);
}
