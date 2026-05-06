/**
 * Tab Panel Block - Save Component
 *
 * Dynamic block: frontend rendered by render.php.
 * InnerBlocks.Content serialises nested blocks to the DB so render.php
 * receives them via $content.
 */

import { InnerBlocks } from '@wordpress/block-editor';

const TabPanelSave = () => {
	return <InnerBlocks.Content />;
};

export default TabPanelSave;
