/**
 * Includes all blocks root files with lazy loading
 */

const loadBlocks = async () => {
	const blocks = [
		import('./blocks/button/index'),
		import('./blocks/column/index'),
		import('./blocks/columns/index'),
		import('./blocks/heading-subtitle/index'),
		import('./blocks/icon/index'),
		import('./blocks/paragraph/index'),
		import('./blocks/blockquote/index'),
		import('./blocks/dropcap/index'),
		import('./blocks/code/index'),
		import('./blocks/card/index'),
		import('./blocks/feature/index'),
		import('./blocks/media/index'),
		import('./blocks/image-simple/index'),
		import('./blocks/accordion/index'),
		import('./blocks/label-plus/index'),
		import('./blocks/form/index'),
		import('./blocks/form-field/index'),
		import('./blocks/submit-button/index'),
		import('./blocks/banner/index'),
		import('./blocks/banners/index'),
		import('./blocks/yandex-map/index'),
		import('./blocks/swiper/index'),
		import('./blocks/group-button/index'),
		import('./blocks/social-wrapper/index'),
		import('./blocks/menu/index'),
		import('./blocks/widget/index'),
		import('./blocks/contacts/index'),
		import('./blocks/post-grid/index'),
		import('./blocks/cta/index'),
		import('./blocks/navbar/index'),
		import('./blocks/header-widgets/index'),
		import('./blocks/search/index'),
		import('./blocks/blog-category-widget/index'),
		import('./blocks/blog-post-widget/index'),
		import('./blocks/blog-tag-widget/index'),
		import('./blocks/blog-year-widget/index'),
		import('./blocks/social-icons/index'),
		import('./blocks/tables/index'),
		import('./blocks/tabulator/index'),
		import('./blocks/top-header/index'),
	];

	await Promise.all(blocks);
};

// Load blocks when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
	loadBlocks();
}
