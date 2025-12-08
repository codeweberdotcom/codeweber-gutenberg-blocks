/**
 * Accordion Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

const AccordionSave = ({ attributes }) => {
	const { accordionStyle, allowMultiple, items, accordionId, iconPosition, iconType } = attributes;

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

	const blockProps = useBlockProps.save({
		className: getAccordionClasses(),
		id: accordionId,
	});

	return (
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
								dangerouslySetInnerHTML={{
									__html: `${accordionStyle === 'icon' && item.icon ? `<span><i class="${item.icon}"></i></span>` : ''}${item.title}`
								}}
							/>
						</div>
						<div
							id={collapseId}
							className={getCollapseClasses(item, index)}
							aria-labelledby={headingId}
							{...(!allowMultiple && {
								'data-bs-parent': `#${accordionId}`,
							})}
						>
							<div className="card-body">
								<RichText.Content tagName="p" value={item.content} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AccordionSave;
