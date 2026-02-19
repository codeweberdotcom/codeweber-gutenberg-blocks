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
		bulletColorType,
		bulletBg,
		iconClass,
		textColor,
		textColorType,
		items,
		listClass,
		listId,
		listData,
		columns,
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

		// Bullet/icon color (soft or solid)
		if (bulletColor && bulletColor !== 'none') {
			const bulletPrefix = bulletColorType === 'soft' ? 'bullet-soft-' : 'bullet-';
			classes.push(`${bulletPrefix}${bulletColor}`);
		}

		// Bullet background (only for icon-list)
		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
		}

		// Columns (1 = no class, 2 = cc-2, 3 = cc-3)
		if (columns === '2') {
			classes.push('cc-2');
		} else if (columns === '3') {
			classes.push('cc-3');
		}

		// Text color (soft or solid)
		if (textColor) {
			const textPrefix = textColorType === 'soft' ? 'text-soft-' : 'text-';
			classes.push(`${textPrefix}${textColor}`);
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
		pairs.forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
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
							<span>
								<i
									className={
										iconClass || 'uil uil-arrow-right'
									}
								></i>
							</span>
						)}
						<span>
							<RichText.Content
								tagName="span"
								value={item.text}
							/>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListsSave;
