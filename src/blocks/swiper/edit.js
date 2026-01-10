/**
 * Swiper Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import {
	SwiperSlider,
	SwiperSlide,
	getSwiperConfigFromAttributes,
	initSwiper,
	destroySwiper,
} from '../../components/swiper';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { useSelect } from '@wordpress/data';

const SwiperEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		swiperMargin,
		swiperNav,
		swiperDots,
		swiperItemsXl,
		swiperItemsMd,
		swiperItemsXs,
		swiperItems,
		swiperItemsSm,
		swiperItemsLg,
		swiperItemsXxl,
		swiperEffect,
		swiperSpeed,
		swiperLoop,
		swiperAutoplay,
		swiperAutoplayTime,
		swiperContainerType,
		swiperNavStyle,
		swiperNavPosition,
		swiperDotsStyle,
		swiperClass,
		swiperId,
		swiperData,
	} = attributes;

	// Get Swiper configuration from attributes
	const swiperConfig = getSwiperConfigFromAttributes(attributes);

	// Get inner blocks count for re-initialization
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	// Initialize Swiper in editor
	useEffect(() => {
		if (typeof window === 'undefined') return;

		destroySwiper(`.swiper-block-${clientId} .swiper`);

		const timer = setTimeout(() => {
			initSwiper(`.swiper-block-${clientId} .swiper`);
		}, 300);

		return () => {
			clearTimeout(timer);
			destroySwiper(`.swiper-block-${clientId} .swiper`);
		};
	}, [
		clientId,
		swiperEffect,
		swiperSpeed,
		swiperItems,
		swiperItemsXs,
		swiperItemsMd,
		swiperItemsXl,
		swiperMargin,
		swiperNav,
		swiperDots,
		swiperLoop,
		swiperAutoplay,
		innerBlocks.length,
	]);

	const blockProps = useBlockProps({
		className:
			`swiper-block swiper-block-${clientId} ${swiperClass || ''}`.trim(),
		id: swiperId || undefined,
		...(swiperData ? { 'data-codeweber': swiperData } : {}),
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Swiper Settings', 'codeweber-gutenberg-blocks')}
					initialOpen={true}
				>
					<TextControl
						label={__('Margin (px)', 'codeweber-gutenberg-blocks')}
						value={swiperMargin}
						onChange={(value) =>
							setAttributes({ swiperMargin: value })
						}
					/>

					<ToggleControl
						label={__(
							'Show Navigation',
							'codeweber-gutenberg-blocks'
						)}
						checked={swiperNav}
						onChange={(value) =>
							setAttributes({ swiperNav: value })
						}
					/>

					<ToggleControl
						label={__('Show Dots', 'codeweber-gutenberg-blocks')}
						checked={swiperDots}
						onChange={(value) =>
							setAttributes({ swiperDots: value })
						}
					/>

					<TextControl
						label={__(
							'Items XL (≥1200px)',
							'codeweber-gutenberg-blocks'
						)}
						value={swiperItemsXl}
						onChange={(value) =>
							setAttributes({ swiperItemsXl: value })
						}
					/>

					<TextControl
						label={__(
							'Items MD (≥768px)',
							'codeweber-gutenberg-blocks'
						)}
						value={swiperItemsMd}
						onChange={(value) =>
							setAttributes({ swiperItemsMd: value })
						}
					/>

					<TextControl
						label={__(
							'Items XS (<576px)',
							'codeweber-gutenberg-blocks'
						)}
						value={swiperItemsXs}
						onChange={(value) =>
							setAttributes({ swiperItemsXs: value })
						}
					/>

					<TextControl
						label={__(
							'Items (default)',
							'codeweber-gutenberg-blocks'
						)}
						value={swiperItems}
						onChange={(value) =>
							setAttributes({ swiperItems: value })
						}
					/>

					<SelectControl
						label={__('Effect', 'codeweber-gutenberg-blocks')}
						value={swiperEffect}
						options={[
							{
								label: __(
									'Slide',
									'codeweber-gutenberg-blocks'
								),
								value: 'slide',
							},
							{
								label: __('Fade', 'codeweber-gutenberg-blocks'),
								value: 'fade',
							},
							{
								label: __('Cube', 'codeweber-gutenberg-blocks'),
								value: 'cube',
							},
							{
								label: __(
									'Coverflow',
									'codeweber-gutenberg-blocks'
								),
								value: 'coverflow',
							},
							{
								label: __('Flip', 'codeweber-gutenberg-blocks'),
								value: 'flip',
							},
						]}
						onChange={(value) =>
							setAttributes({ swiperEffect: value })
						}
					/>

					<TextControl
						label={__('Speed (ms)', 'codeweber-gutenberg-blocks')}
						type="number"
						value={swiperSpeed}
						onChange={(value) =>
							setAttributes({
								swiperSpeed: parseInt(value) || 500,
							})
						}
					/>

					<ToggleControl
						label={__('Loop', 'codeweber-gutenberg-blocks')}
						checked={swiperLoop}
						onChange={(value) =>
							setAttributes({ swiperLoop: value })
						}
					/>

					<ToggleControl
						label={__('Autoplay', 'codeweber-gutenberg-blocks')}
						checked={swiperAutoplay}
						onChange={(value) =>
							setAttributes({ swiperAutoplay: value })
						}
					/>

					{swiperAutoplay && (
						<TextControl
							label={__(
								'Autoplay Time (ms)',
								'codeweber-gutenberg-blocks'
							)}
							type="number"
							value={swiperAutoplayTime}
							onChange={(value) =>
								setAttributes({
									swiperAutoplayTime: parseInt(value) || 5000,
								})
							}
						/>
					)}

					<SelectControl
						label={__('Nav Style', 'codeweber-gutenberg-blocks')}
						value={swiperNavStyle}
						options={[
							{
								label: __('Dark', 'codeweber-gutenberg-blocks'),
								value: 'nav-dark',
							},
							{
								label: __(
									'Light',
									'codeweber-gutenberg-blocks'
								),
								value: 'nav-light',
							},
						]}
						onChange={(value) =>
							setAttributes({ swiperNavStyle: value })
						}
					/>

					<SelectControl
						label={__('Dots Style', 'codeweber-gutenberg-blocks')}
						value={swiperDotsStyle}
						options={[
							{
								label: __('Over', 'codeweber-gutenberg-blocks'),
								value: 'dots-over',
							},
							{
								label: __(
									'Light',
									'codeweber-gutenberg-blocks'
								),
								value: 'dots-light',
							},
							{
								label: __('Dark', 'codeweber-gutenberg-blocks'),
								value: 'dots-dark',
							},
						]}
						onChange={(value) =>
							setAttributes({ swiperDotsStyle: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Advanced', 'codeweber-gutenberg-blocks')}
					initialOpen={false}
				>
					<BlockMetaFields
						attributes={attributes}
						setAttributes={setAttributes}
						fieldKeys={{
							classKey: 'swiperClass',
							dataKey: 'swiperData',
							idKey: 'swiperId',
						}}
						labels={{
							classLabel: __(
								'Swiper Class',
								'codeweber-gutenberg-blocks'
							),
							dataLabel: __(
								'Swiper Data',
								'codeweber-gutenberg-blocks'
							),
							idLabel: __(
								'Swiper ID',
								'codeweber-gutenberg-blocks'
							),
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<SwiperSlider
					config={swiperConfig}
					className="mb-10"
					uniqueKey={`swiper-${clientId}`}
				>
					<InnerBlocks
						allowedBlocks={undefined}
						templateLock={false}
						renderAppender={InnerBlocks.ButtonBlockAppender}
					/>
				</SwiperSlider>
			</div>
		</>
	);
};

export default SwiperEdit;
