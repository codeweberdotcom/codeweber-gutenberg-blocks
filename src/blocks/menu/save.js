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
		itemClass,
		enableWidget,
		enableTitle,
		title,
		titleTag,
		titleClass,
		titleColor,
		titleColorType,
		titleSize,
		titleWeight,
		titleTransform,
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
		// Если listType === 'none', не добавляем никаких классов списка

		// Bullet color (только если не 'none' и listType не 'none')
		if (listType !== 'none' && bulletColor && bulletColor !== 'none') {
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
		id: menuId || undefined,
	});

	// Parse data attributes
	const getDataAttributes = () => {
		if (!menuData) return {};
		const dataAttrs = {};
		const pairs = menuData.split(',');
		pairs.forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttrs[`data-${key}`] = value;
			}
		});
		return dataAttrs;
	};

	// Generate title classes
	const getTitleClasses = () => {
		const classes = ['widget-title'];

		// Color classes
		let hasColorClass = false;
		if (titleColor) {
			const colorClass = generateColorClass(
				titleColor,
				titleColorType,
				'text'
			);
			if (colorClass) {
				classes.push(colorClass);
				hasColorClass = true;
			}
		}

		// Add theme color class only if no custom color is set
		if (!hasColorClass) {
			if (theme === 'dark') {
				classes.push('text-white');
			} else {
				classes.push('text-dark');
			}
		}

		// Typography classes
		const typographyClasses = generateTypographyClasses(
			attributes,
			'title'
		);
		classes.push(...typographyClasses);

		// Custom class
		if (titleClass) {
			classes.push(titleClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	const content = (
		<ul className={getListClasses()}>
			{items.map((item) => (
				<li key={item.id} className={itemClass || ''}>
					{listType === 'icon' && (
						<span>
							<i
								className={iconClass || 'uil uil-arrow-right'}
							></i>
						</span>
					)}
					<span
						className={
							theme === 'dark' ? 'text-white' : 'text-dark'
						}
					>
						<a href={item.url || '#'}>
							<RichText.Content
								tagName="span"
								value={item.text}
							/>
						</a>
					</span>
				</li>
			))}
		</ul>
	);

	return (
		<div {...blockProps} {...getDataAttributes()}>
			{enableWidget ? (
				<div className="widget">
					{enableTitle && title && (
						<RichText.Content
							tagName={titleTag || 'h4'}
							value={title}
							className={getTitleClasses()}
						/>
					)}
					{content}
				</div>
			) : (
				content
			)}
		</div>
	);
};

export default MenuSave;
