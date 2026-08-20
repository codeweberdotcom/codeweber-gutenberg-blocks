/**
 * Switcher Block - Edit Component
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { SwitcherSidebar } from './sidebar';
import { getContainerClasses, getItemClasses, ALIGN_CLASSES } from './utils';

const SwitcherEdit = ({ attributes, setAttributes }) => {
	const {
		items,
		switchStyle,
		switchColor,
		switchSize,
		alignment,
		activeIndex,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	const blockProps = useBlockProps({
		className: `d-flex ${ALIGN_CLASSES[alignment] || ALIGN_CLASSES.start}`,
	});

	const containerClasses = getContainerClasses({
		switchStyle,
		switchColor,
		blockClass,
	});

	// The editor cannot know which page is being viewed, so the preview always
	// highlights the configured item — auto matching happens in render.php.
	const renderItem = (item, index) => {
		const classes = getItemClasses({
			switchStyle,
			switchColor,
			switchSize,
			isActive: index === activeIndex,
			isLast: index === items.length - 1,
		});

		return (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<span key={item.id || index} className={classes}>
				{item.label || __('Untitled', 'codeweber-gutenberg-blocks')}
			</span>
		);
	};

	return (
		<>
			<InspectorControls>
				<SwitcherSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{switchStyle === 'segmented' ? (
					<div
						className={containerClasses}
						id={blockId || undefined}
						role="group"
						{...dataAttributes}
					>
						{items.map(renderItem)}
					</div>
				) : (
					<ul
						className={containerClasses}
						id={blockId || undefined}
						{...dataAttributes}
					>
						{items.map((item, index) => (
							<li className="nav-item" key={item.id || index}>
								{renderItem(item, index)}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};

export default SwitcherEdit;
