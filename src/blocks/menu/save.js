/**
 * Menu Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';

const MenuSave = ({ attributes }) => {
	const {
		mode,
		theme,
		listType,
		bulletColor,
		bulletBg,
		iconClass,
		textColor,
		items,
		menuClass,
		menuId,
		menuData,
	} = attributes;

	// Если режим "WP Menu", возвращаем null - будет использоваться PHP render
	if (mode === 'wp-menu') {
		return null;
	}

	// Get list classes
	const getListClasses = () => {
		const classes = [];

		// Base classes from menuClass attribute
		if (menuClass) {
			classes.push(...menuClass.split(' '));
		}

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

		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		className: theme === 'dark' ? 'menu-dark' : 'menu-light',
		id: menuId || undefined,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!menuData) return {};
		const dataAttrs = {};
		const pairs = menuData.split(',');
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
							<a href={item.url || '#'}>
								<RichText.Content tagName="span" value={item.text} />
							</a>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default MenuSave;

