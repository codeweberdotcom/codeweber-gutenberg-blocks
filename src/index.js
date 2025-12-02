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
    ];

    await Promise.all(blocks);
};

// Load blocks when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
    loadBlocks();
}


