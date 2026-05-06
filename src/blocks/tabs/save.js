/**
 * Tabs Block - Save Component
 *
 * Dynamic block: frontend is rendered by render.php.
 * InnerBlocks.Content is required so inner tab-panel blocks are
 * serialised to the database and available to render.php via $content.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { InnerBlocks } from '@wordpress/block-editor';

const TabsSave = () => {
	return <InnerBlocks.Content />;
};

export default TabsSave;
