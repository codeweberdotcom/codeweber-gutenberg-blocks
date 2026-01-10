/**
 * Html Blocks Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import apiFetch from '@wordpress/api-fetch';

const HtmlBlocksEdit = ({ attributes, setAttributes, clientId }) => {
	const { selectedBlockId, blockClass, blockData, blockId } = attributes;

	const [htmlBlocks, setHtmlBlocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedBlockContent, setSelectedBlockContent] = useState('');
	const [isLoadingContent, setIsLoadingContent] = useState(false);

	// Загружаем список HTML блоков из CPT
	useEffect(() => {
		const fetchHtmlBlocks = async () => {
			setIsLoading(true);
			try {
				// Получаем список постов из CPT html_blocks
				const posts = await apiFetch({
					path: '/wp/v2/html_blocks?per_page=100&status=publish',
				});

				const options = [
					{
						label: __(
							'-- Select Block --',
							'codeweber-gutenberg-blocks'
						),
						value: 0,
					},
					...posts.map((post) => ({
						label: post.title?.rendered || `#${post.id}`,
						value: post.id,
					})),
				];

				setHtmlBlocks(options);
			} catch (error) {
				console.error('Error fetching HTML blocks:', error);
				setHtmlBlocks([
					{
						label: __(
							'-- Select Block --',
							'codeweber-gutenberg-blocks'
						),
						value: 0,
					},
				]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchHtmlBlocks();
	}, []);

	// Загружаем контент выбранного блока
	useEffect(() => {
		if (!selectedBlockId || selectedBlockId === 0) {
			setSelectedBlockContent('');
			return;
		}

		const fetchBlockContent = async () => {
			setIsLoadingContent(true);
			try {
				const post = await apiFetch({
					path: `/wp/v2/html_blocks/${selectedBlockId}`,
				});

				// Получаем контент поста
				const content = post.content?.rendered || '';
				setSelectedBlockContent(content);
			} catch (error) {
				console.error('Error fetching block content:', error);
				setSelectedBlockContent(
					__('Error loading content', 'codeweber-gutenberg-blocks')
				);
			} finally {
				setIsLoadingContent(false);
			}
		};

		fetchBlockContent();
	}, [selectedBlockId]);

	const blockProps = useBlockProps({
		className: `codeweber-html-blocks ${blockClass || ''}`.trim(),
		...(blockId && { id: blockId }),
	});

	// Парсим data атрибуты
	const getDataAttributes = () => {
		const dataAttrs = {};
		if (blockData) {
			blockData.split(',').forEach((pair) => {
				const [key, value] = pair.split('=').map((s) => s.trim());
				if (key && value) {
					dataAttrs[`data-${key}`] = value;
				}
			});
		}
		return dataAttrs;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__(
						'HTML Block Settings',
						'codeweber-gutenberg-blocks'
					)}
					initialOpen={true}
				>
					{isLoading ? (
						<div style={{ padding: '10px', textAlign: 'center' }}>
							<Spinner />
							<p>
								{__(
									'Loading blocks...',
									'codeweber-gutenberg-blocks'
								)}
							</p>
						</div>
					) : (
						<SelectControl
							label={__(
								'Select HTML Block',
								'codeweber-gutenberg-blocks'
							)}
							value={selectedBlockId || 0}
							options={htmlBlocks}
							onChange={(value) =>
								setAttributes({
									selectedBlockId: parseInt(value) || 0,
								})
							}
							help={__(
								'Select a block from html_blocks CPT to display',
								'codeweber-gutenberg-blocks'
							)}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__(
						'Additional Settings',
						'codeweber-gutenberg-blocks'
					)}
				>
					<BlockMetaFields
						attributes={attributes}
						setAttributes={setAttributes}
						fieldKeys={{
							classKey: 'blockClass',
							dataKey: 'blockData',
							idKey: 'blockId',
						}}
						labels={{
							classLabel: __(
								'CSS Class',
								'codeweber-gutenberg-blocks'
							),
							dataLabel: __(
								'Data Attributes',
								'codeweber-gutenberg-blocks'
							),
							idLabel: __(
								'Element ID',
								'codeweber-gutenberg-blocks'
							),
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps} {...getDataAttributes()}>
				{!selectedBlockId || selectedBlockId === 0 ? (
					<Placeholder
						icon="code"
						label={__('Html Blocks', 'codeweber-gutenberg-blocks')}
						instructions={__(
							'Select an HTML block from the settings list',
							'codeweber-gutenberg-blocks'
						)}
					/>
				) : isLoadingContent ? (
					<div style={{ padding: '20px', textAlign: 'center' }}>
						<Spinner />
						<p>
							{__(
								'Loading content...',
								'codeweber-gutenberg-blocks'
							)}
						</p>
					</div>
				) : (
					<div
						className="html-blocks-content"
						dangerouslySetInnerHTML={{
							__html: selectedBlockContent,
						}}
					/>
				)}
			</div>
		</>
	);
};

export default HtmlBlocksEdit;
