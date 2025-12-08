/**
 * Lists Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

const ListsSave = ({ attributes }) => {
	const {
		mode,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		items,
		listClass,
		listId,
		listData,
	} = attributes;

	// Если режим "Post", возвращаем null - будет использоваться PHP render
	if (mode === 'post') {
		return null;
	}

	// Get list classes
	const getListClasses = () => {
		const classes = [];

		if (listType === 'unordered') {
			classes.push('unordered-list');
		} else if (listType === 'icon') {
			classes.push('icon-list');
		}

		// Bullet color
		if (bulletColor && bulletColor !== 'none') {
			classes.push(`bullet-${bulletColor}`);
		}

		// Bullet background (only for icon-list)
		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
			// Add soft color class if bulletColor is set
			if (bulletColor && bulletColor !== 'none') {
				classes.push(`bullet-soft-${bulletColor}`);
			}
		}

		// Text color
		if (textColor) {
			classes.push(`text-${textColor}`);
		}

		// Custom class
		if (listClass) {
			classes.push(listClass);
		}

		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		className: '',
		id: listId || undefined,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!listData) return {};
		const dataAttrs = {};
		const pairs = listData.split(',');
		pairs.forEach(pair => {
			const [key, value] = pair.split('=').map(s => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

	return (
		<div {...blockProps} {...getDataAttributes()}>
			<ul className={getListClasses()}>
				{items.map((item) => (
					<li key={item.id}>
						{listType === 'icon' && (
							<span><i className={iconClass || 'uil uil-arrow-right'}></i></span>
						)}
						<span>
							<RichText.Content tagName="span" value={item.text} />
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListsSave;

