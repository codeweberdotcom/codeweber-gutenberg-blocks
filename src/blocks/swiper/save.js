/**
 * Swiper Block - Save Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getSwiperContainerClasses, getSwiperDataAttributes } from '../../components/swiper';

const SwiperSave = ({ attributes }) => {
	const { swiperClass, swiperId, swiperData } = attributes;
	
	const swiperConfig = {
		margin: attributes.swiperMargin,
		nav: attributes.swiperNav,
		dots: attributes.swiperDots,
		itemsXl: attributes.swiperItemsXl,
		itemsMd: attributes.swiperItemsMd,
		itemsXs: attributes.swiperItemsXs,
		items: attributes.swiperItems,
		itemsSm: attributes.swiperItemsSm,
		itemsLg: attributes.swiperItemsLg,
		itemsXxl: attributes.swiperItemsXxl,
		effect: attributes.swiperEffect,
		speed: attributes.swiperSpeed,
		loop: attributes.swiperLoop,
		autoplay: attributes.swiperAutoplay,
		autoplayTime: attributes.swiperAutoplayTime,
		containerType: attributes.swiperContainerType,
		navStyle: attributes.swiperNavStyle,
		navPosition: attributes.swiperNavPosition,
		dotsStyle: attributes.swiperDotsStyle,
	};

	const containerClasses = `${getSwiperContainerClasses(swiperConfig)} mb-10 ${swiperClass || ''}`.trim();
	const dataAttrs = getSwiperDataAttributes(swiperConfig);

	const blockProps = useBlockProps.save({
		className: containerClasses,
		id: swiperId || undefined,
		...(swiperData ? { 'data-codeweber': swiperData } : {}),
		...dataAttrs,
	});

	// Note: Individual inner blocks will be wrapped in swiper-slide by render.php
	// This save function preserves the structure for editor preview
	return (
		<div {...blockProps}>
			<div className="swiper">
				<div className="swiper-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
};

export default SwiperSave;

