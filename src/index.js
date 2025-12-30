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
    ];

    await Promise.all(blocks);
};

// Load blocks when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
    loadBlocks();
}


