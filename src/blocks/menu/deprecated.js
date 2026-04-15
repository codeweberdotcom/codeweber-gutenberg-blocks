/**
 * Menu Block - Deprecated Save Components
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, RichText } from '@wordpress/block-editor';
import {
	generateColorClass,
	generateTypographyClasses,
} from '../../utilities/class-generators';

/**
 * v1 — horizontal used flex-row (before flex-md-row)
 */
const MenuSaveV1 = ({ attributes }) => {
	const {
		mode,
		orientation,
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
		linkClass,
		enableWidget,
		enableMegaMenu,
		columns,
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

	if (mode === 'wp-menu') {
		return null;
	}

	const getListClasses = () => {
		if (enableMegaMenu) {
			const cols = columns ?? 1;
			const ccClass = cols === 2 ? 'cc-2' : cols === 3 ? 'cc-3' : '';
			return ['list-unstyled', ccClass, 'pb-lg-1'].filter(Boolean).join(' ');
		}
		const classes = [];

		if (menuClass) {
			classes.push(...menuClass.split(' '));
		}

		if (listType === 'unordered') {
			classes.push('unordered-list');
		} else if (listType === 'icon') {
			classes.push('icon-list');
		}

		if (listType !== 'none' && bulletColor && bulletColor !== 'none') {
			classes.push(`bullet-${bulletColor}`);
		}

		if (listType === 'icon' && bulletBg) {
			classes.push('bullet-bg');
			if (bulletColor && bulletColor !== 'none') {
				classes.push(`bullet-soft-${bulletColor}`);
			}
		}

		if (textColor) {
			classes.push(`text-${textColor}`);
		}

		classes.push('d-flex');
		classes.push((orientation || 'horizontal') === 'vertical' ? 'flex-column' : 'flex-row');

		return classes.join(' ');
	};

	const blockProps = useBlockProps.save({
		id: menuId || undefined,
	});

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

	const getTitleClasses = () => {
		const classes = [];
		if (enableWidget) classes.push('widget-title');
		if (enableMegaMenu) classes.push('dropdown-header');

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

		if (!hasColorClass) {
			if ((theme || 'light') === 'dark') {
				classes.push('text-white');
			} else {
				classes.push('text-dark');
			}
		}

		const typographyAttrs = enableMegaMenu
			? { ...attributes, titleSize: 'h6' }
			: attributes;
		const typographyClasses = generateTypographyClasses(
			typographyAttrs,
			'title'
		);
		classes.push(...typographyClasses);

		if (titleClass) {
			classes.push(titleClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	const liClasses = [itemClass || ''].filter(Boolean).join(' ');

	const content = (
		<ul className={getListClasses()}>
			{items.map((item) =>
				enableMegaMenu ? (
					<li key={item.id} className={liClasses}>
						<a href={item.url || '#'} className="dropdown-item">
							<RichText.Content tagName="span" value={item.text} />
						</a>
					</li>
				) : (
					<li key={item.id} className={liClasses}>
						{listType === 'icon' && (
							<span>
								<i
									className={iconClass || 'uil uil-arrow-right'}
								></i>
							</span>
						)}
						<span className="">
							<a
								href={item.url || '#'}
								className={
								[ linkClass || '' ]
										.filter(Boolean)
										.join(' ')
								}
							>
								<RichText.Content
									tagName="span"
									value={item.text}
								/>
							</a>
						</span>
					</li>
				)
			)}
		</ul>
	);

	return (
		<div {...blockProps} {...getDataAttributes()}>
			{enableWidget ? (
				<div className="widget">
					{enableTitle && title && (
						<RichText.Content
							tagName={enableMegaMenu ? 'div' : (titleTag || 'h4')}
							value={title}
							className={getTitleClasses()}
						/>
					)}
					{content}
				</div>
			) : (
				<>
					{enableTitle && title && (
						<RichText.Content
							tagName={enableMegaMenu ? 'div' : (titleTag || 'h4')}
							value={title}
							className={getTitleClasses()}
						/>
					)}
					{content}
				</>
			)}
		</div>
	);
};

export default [
	{
		save: MenuSaveV1,
	},
];
