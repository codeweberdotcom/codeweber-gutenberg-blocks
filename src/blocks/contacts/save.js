/**
 * Contacts Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps } from '@wordpress/block-editor';

const ContactsSave = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: 'codeweber-contacts-block',
	});

	// Блок использует PHP render, поэтому возвращаем пустой div
	return <div {...blockProps}></div>;
};

export default ContactsSave;

