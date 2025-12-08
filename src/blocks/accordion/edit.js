/**
 * Accordion Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button, SelectControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { AccordionSidebar } from './sidebar';
import { fontIcons } from '../../utilities/font_icon';

const AccordionEdit = ({ attributes, setAttributes, clientId }) => {
	const { accordionStyle, allowMultiple, items, accordionId, iconPosition, iconType, firstItemOpen } = attributes;

	// Generate unique accordion ID if not set
	useEffect(() => {
		if (!accordionId) {
			const uniqueId = `accordion-${clientId.replace(/[^a-z0-9]/gi, '')}`;
			setAttributes({ accordionId: uniqueId });
		}
	}, [clientId, accordionId, setAttributes]);

	// Ensure first item open (others closed) when option enabled
	useEffect(() => {
		if (!firstItemOpen || !items?.length) return;
		const updated = items.map((item, idx) => ({
			...item,
			isOpen: idx === 0,
		}));
		setAttributes({ items: updated });
	}, [firstItemOpen, items, setAttributes]);

	const updateItem = (index, field, value) => {
		const newItems = [...items];
		newItems[index] = {
			...newItems[index],
			[field]: value,
		};
		setAttributes({ items: newItems });
	};

	const addItem = () => {
		const newItem = {
			id: `item-${Date.now()}`,
			title: __('New Item', 'codeweber-gutenberg-blocks'),
			content: __('Add your content here...', 'codeweber-gutenberg-blocks'),
			icon: '',
			isOpen: false,
		};
		setAttributes({ items: [...items, newItem] });
	};

	const removeItem = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setAttributes({ items: newItems });
	};

	const moveItem = (index, direction) => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === items.length - 1)
		) {
			return;
		}

		const newItems = [...items];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		[newItems[index], newItems[targetIndex]] = [
			newItems[targetIndex],
			newItems[index],
		];
		setAttributes({ items: newItems });
	};

	const toggleItem = (index) => {
		if (!allowMultiple) {
			// Close all other items
			const newItems = items.map((item, i) => ({
				...item,
				isOpen: i === index ? !item.isOpen : false,
			}));
			setAttributes({ items: newItems });
		} else {
			// Toggle only this item
			updateItem(index, 'isOpen', !items[index].isOpen);
		}
	};

	// Get accordion classes
	const getAccordionClasses = () => {
		const classes = ['accordion', 'accordion-wrapper'];
		// Добавляем класс только для правой позиции (по умолчанию иконка слева)
		if (iconPosition === 'right') {
			classes.push('icon-right');
		}
		// Тип иконок
		if (iconType === 'type-2') classes.push('type-2');
		else if (iconType === 'type-3') classes.push('type-3');
		else classes.push('type-1');
		return classes.join(' ');
	};

	// Get item classes
	const getItemClasses = (item, index) => {
		const classes = ['card', 'accordion-item'];
		if (accordionStyle === 'simple') {
			classes.push('plain');
		} else if (accordionStyle === 'icon') {
			classes.push('icon');
		}
		return classes.join(' ');
	};

	// Get button classes
	const getButtonClasses = (item, index) => {
		const classes = ['accordion-button'];
		if (!item.isOpen) {
			classes.push('collapsed');
		}
		return classes.join(' ');
	};

	// Get collapse classes
	const getCollapseClasses = (item, index) => {
		const classes = ['accordion-collapse', 'collapse'];
		if (item.isOpen) {
			classes.push('show');
		}
		return classes.join(' ');
	};

	const blockProps = useBlockProps({
		className: getAccordionClasses(),
		id: accordionId,
	});

	return (
		<>
			<InspectorControls>
				<AccordionSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div {...blockProps}>
				{items.map((item, index) => {
					const headingId = `heading-${item.id}`;
					const collapseId = `collapse-${item.id}`;

					return (
						<div key={item.id} className={getItemClasses(item, index)}>
							<div className="card-header" id={headingId}>
								<button
									className={getButtonClasses(item, index)}
									type="button"
									data-bs-toggle="collapse"
									data-bs-target={`#${collapseId}`}
									aria-expanded={item.isOpen}
									aria-controls={collapseId}
									onClick={(e) => {
										e.preventDefault();
										toggleItem(index);
									}}
									style={{ pointerEvents: 'auto', cursor: 'pointer' }}
								>
									{accordionStyle === 'icon' && item.icon && (
										<span>
											<i className={item.icon}></i>
										</span>
									)}
									<RichText
										tagName="span"
										value={item.title}
										onChange={(value) => updateItem(index, 'title', value)}
										placeholder={__('Enter title...', 'codeweber-gutenberg-blocks')}
										withoutInteractiveFormatting
									/>
								</button>
							</div>
							<div
								id={collapseId}
								className={getCollapseClasses(item, index)}
								aria-labelledby={headingId}
								data-bs-parent={!allowMultiple ? `#${accordionId}` : undefined}
							>
								<div className="card-body">
									<RichText
										tagName="p"
										value={item.content}
										onChange={(value) => updateItem(index, 'content', value)}
										placeholder={__(
											'Enter content...',
											'codeweber-gutenberg-blocks'
										)}
									/>
								</div>
							</div>

							{/* Item Controls */}
							<div
								style={{
									display: 'flex',
									gap: '8px',
									marginTop: '8px',
									padding: '8px',
									background: '#f0f0f0',
									borderRadius: '4px',
								}}
							>
								{accordionStyle === 'icon' && (
									<SelectControl
										label={__('Icon', 'codeweber-gutenberg-blocks')}
										value={item.icon}
										options={[
											{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
											...fontIcons,
										]}
										onChange={(value) => updateItem(index, 'icon', value)}
										style={{ flex: 1 }}
									/>
								)}
								<Button
									isSmall
									onClick={() => moveItem(index, 'up')}
									disabled={index === 0}
								>
									↑
								</Button>
								<Button
									isSmall
									onClick={() => moveItem(index, 'down')}
									disabled={index === items.length - 1}
								>
									↓
								</Button>
								<Button
									isSmall
									isDestructive
									onClick={() => removeItem(index)}
									disabled={items.length === 1}
								>
									{__('Remove', 'codeweber-gutenberg-blocks')}
								</Button>
							</div>
						</div>
					);
				})}

				{/* Add Item Button */}
				<div style={{ marginTop: '16px' }}>
					<Button isPrimary onClick={addItem}>
						{__('+ Add Accordion Item', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default AccordionEdit;
