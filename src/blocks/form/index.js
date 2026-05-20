import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';
import './editor.scss';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { getGapClasses } from '../../components/grid-control';

registerBlockType(metadata, {
	edit: Edit,
	save: Save,
	deprecated: [
		{
			// Previous save: static HTML wrapper with InnerBlocks.Content
			attributes: metadata.attributes,
			save({ attributes }) {
				const {
					formId,
					formType,
					blockClass,
					blockData,
					blockId,
				} = attributes;

				const formIdAttr = formId || 'form-block';
				const blockProps = useBlockProps.save({
					className: 'codeweber-form-wrapper',
				});

				const formClasses = ['codeweber-form'];
				if (blockClass) formClasses.push(blockClass);

				const formElementId = blockId || `form-${formIdAttr}`;

				const getDataAttrs = () => {
					if (!blockData) return {};
					try {
						const parsed = JSON.parse(blockData);
						const out = {};
						Object.keys(parsed).forEach(
							(k) => (out[`data-${k}`] = parsed[k])
						);
						return out;
					} catch (e) {
						return { 'data-custom': blockData };
					}
				};

				const gapClasses = getGapClasses(attributes, 'form');
				const rowClasses = ['row', ...gapClasses].filter(Boolean);
				let rowClassName =
					rowClasses.length > 1
						? rowClasses.join(' ')
						: 'row g-4';

				const alignmentClasses = [];
				if (attributes.formAlignItems)
					alignmentClasses.push(
						attributes.formAlignItems.trim()
					);
				if (attributes.formJustifyContent) {
					alignmentClasses.push('d-flex');
					alignmentClasses.push(
						attributes.formJustifyContent.trim()
					);
				}
				if (attributes.formTextAlign)
					alignmentClasses.push(
						attributes.formTextAlign.trim()
					);
				if (attributes.formPosition)
					alignmentClasses.push(
						attributes.formPosition.trim()
					);

				rowClassName = [rowClassName, ...alignmentClasses]
					.filter(Boolean)
					.join(' ');

				return (
					<div {...blockProps}>
						<form
							id={formElementId}
							className={formClasses.join(' ')}
							data-form-id={formIdAttr}
							data-form-type={formType || 'form'}
							{...getDataAttrs()}
							method="post"
							encType="multipart/form-data"
						>
							<input
								type="hidden"
								name="form_id"
								value={formIdAttr}
							/>
							<div
								className="form-messages"
								style={{ display: 'none' }}
							></div>
							<div className={rowClassName}>
								<InnerBlocks.Content />
							</div>
						</form>
					</div>
				);
			},
		},
	],
});
