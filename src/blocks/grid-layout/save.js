import { InnerBlocks } from '@wordpress/block-editor';
import {
	generateGridStyles,
	getGridLayoutClassNames,
	normalizeGridId,
	normalizeGridData,
} from './utils';

export default function Save( { attributes } ) {
	const { gridId, gridHtmlId, gridData } = attributes;

	// eslint-disable-next-line react/no-danger
	const css = generateGridStyles( attributes, gridId );
	const className = getGridLayoutClassNames( attributes );
	const id = normalizeGridId( gridHtmlId ) || undefined;

	return (
		<>
			{ css && (
				// eslint-disable-next-line react/no-danger
				<style dangerouslySetInnerHTML={ { __html: css } } />
			) }
			<div
				className={ className }
				id={ id }
				{ ...normalizeGridData( gridData ) }
			>
				<InnerBlocks.Content />
			</div>
		</>
	);
}
