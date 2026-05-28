import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';

import metadata from './block.json';

import Edit from './edit';
import Save from './save';
import {
	getColumnsClassNames,
	normalizeColumnsId,
	normalizeColumnsData,
} from './utils';

const deprecated = [
	{
		// columnsReverseOnMd (boolean) → columnsFlexMd (string)
		attributes: {
			...metadata.attributes,
			columnsReverseOnMd: { type: 'boolean', default: false },
			columnsFlexMd: undefined,
		},
		migrate( attributes ) {
			const { columnsReverseOnMd, ...rest } = attributes;
			return {
				...rest,
				columnsFlexMd: columnsReverseOnMd ? 'row-reverse' : '',
			};
		},
		save( { attributes } ) {
			const { columnsId, columnsData } = attributes;
			const blockProps = {
				className: getColumnsClassNames(
					{ ...attributes, columnsFlexMd: attributes.columnsReverseOnMd ? 'row-reverse' : '' },
					'save'
				),
				id: normalizeColumnsId( columnsId ) || undefined,
			};
			return (
				<div { ...blockProps } { ...normalizeColumnsData( columnsData ) }>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	deprecated,
});
