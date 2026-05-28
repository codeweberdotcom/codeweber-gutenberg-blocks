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

// Атрибуты без columnsFlexMd + с columnsReverseOnMd (boolean)
const { columnsFlexMd: _removed, ...baseAttrs } = metadata.attributes;
const deprecatedV1Attributes = {
	...baseAttrs,
	columnsReverseOnMd: { type: 'boolean', default: false },
};

const deprecated = [
	{
		// columnsReverseOnMd (boolean) → columnsFlexMd (string)
		attributes: deprecatedV1Attributes,
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
