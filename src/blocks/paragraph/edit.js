/**
 * Paragraph Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	TabPanel,
	SelectControl,
	ComboboxControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';
import { Icon, typography, cog } from '@wordpress/icons';

import { ColorTypeControl } from '../../components/colors/ColorTypeControl';
import { TagControl } from '../../components/tag';
import { colors } from '../../utilities/colors';
import {
	createSizeOptions,
	createWeightOptions,
	createTransformOptions,
} from '../heading-subtitle/utils';
import { getParagraphClasses } from '../../components/paragraph/ParagraphRender';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span
		title={label}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Icon icon={icon} size={20} />
	</span>
);

/**
 * Edit Component
 */
const Edit = ({ attributes, setAttributes }) => {
	const {
		text,
		textTag,
		textColor,
		textColorType,
		textSize,
		textWeight,
		textTransform,
		textClass,
	} = attributes;

	const tabs = [
		{
			name: 'typography',
			title: (
				<TabIcon
					icon={typography}
					label={__('Typography', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
		{
			name: 'settings',
			title: (
				<TabIcon
					icon={cog}
					label={__('Settings', 'codeweber-gutenberg-blocks')}
				/>
			),
		},
	];

	const paragraphClasses = getParagraphClasses(attributes, '');
	const blockProps = useBlockProps();

	return (
		<>
			{/* Inspector Controls */}
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{tab.name === 'typography' && (
								<div style={{ padding: '16px' }}>
									<TagControl
										label={__(
											'Paragraph Tag',
											'codeweber-gutenberg-blocks'
										)}
										value={textTag}
										onChange={(value) =>
											setAttributes({ textTag: value })
										}
										type="text"
									/>
									<ColorTypeControl
										label={__(
											'Color Type',
											'codeweber-gutenberg-blocks'
										)}
										value={textColorType}
										onChange={(value) =>
											setAttributes({
												textColorType: value,
											})
										}
										options={[
											{
												value: 'solid',
												label: __(
													'Solid',
													'codeweber-gutenberg-blocks'
												),
											},
											{
												value: 'soft',
												label: __(
													'Soft',
													'codeweber-gutenberg-blocks'
												),
											},
											{
												value: 'pale',
												label: __(
													'Pale',
													'codeweber-gutenberg-blocks'
												),
											},
										]}
									/>
									<ComboboxControl
										label={__(
											'Color',
											'codeweber-gutenberg-blocks'
										)}
										value={textColor}
										options={colors}
										onChange={(value) =>
											setAttributes({ textColor: value })
										}
									/>
									<SelectControl
										label={__(
											'Size',
											'codeweber-gutenberg-blocks'
										)}
										value={textSize}
										options={createSizeOptions()}
										onChange={(value) =>
											setAttributes({ textSize: value })
										}
									/>
									<SelectControl
										label={__(
											'Weight',
											'codeweber-gutenberg-blocks'
										)}
										value={textWeight}
										options={createWeightOptions()}
										onChange={(value) =>
											setAttributes({ textWeight: value })
										}
									/>
									<SelectControl
										label={__(
											'Transform',
											'codeweber-gutenberg-blocks'
										)}
										value={textTransform}
										options={createTransformOptions()}
										onChange={(value) =>
											setAttributes({
												textTransform: value,
											})
										}
									/>
								</div>
							)}

							{tab.name === 'settings' && (
								<div style={{ padding: '16px' }}>
									<BlockMetaFields
										attributes={attributes}
										setAttributes={setAttributes}
										fieldKeys={{
											classKey: 'textClass',
											dataKey: 'textData',
											idKey: 'textId',
										}}
										labels={{
											classLabel: __(
												'Paragraph Class',
												'codeweber-gutenberg-blocks'
											),
											dataLabel: __(
												'Paragraph Data',
												'codeweber-gutenberg-blocks'
											),
											idLabel: __(
												'Paragraph ID',
												'codeweber-gutenberg-blocks'
											),
										}}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>

			{/* Editable text in main area */}
			<RichText
				{...blockProps}
				tagName={textTag}
				value={text}
				onChange={(value) => setAttributes({ text: value })}
				placeholder={__(
					'Enter paragraph text...',
					'codeweber-gutenberg-blocks'
				)}
				className={paragraphClasses}
			/>
		</>
	);
};

export default Edit;
