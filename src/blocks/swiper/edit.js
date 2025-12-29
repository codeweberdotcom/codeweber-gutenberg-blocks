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
import { useEffect, useRef } from '@wordpress/element';
import { PanelBody, ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import { getSwiperContainerClasses, getSwiperDataAttributes, getSwiperConfigFromAttributes } from '../../components/swiper';
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
	
	// Get container classes and data attributes for HTML output
	const containerClasses = `${getSwiperContainerClasses(swiperConfig)} mb-10 ${swiperClass || ''}`.trim();
	const dataAttrs = getSwiperDataAttributes(swiperConfig);

	// Get inner blocks to wrap them in swiper-slide
	const innerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId) || [],
		[clientId]
	);

	const wrapperRef = useRef(null);

	// Wrap each inner block in swiper-slide div and move them directly to swiper-wrapper
	useEffect(() => {
		// #region agent log
		const logData = {location:'swiper/edit.js:61',message:'useEffect triggered',data:{clientId,innerBlocksCount:innerBlocks.length,wrapperRefExists:!!wrapperRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logData, null, 2));
		window.swiperDebugLogs = window.swiperDebugLogs || [];
		window.swiperDebugLogs.push(logData);
		// #endregion

		if (!wrapperRef.current) {
			// #region agent log
			const logData = {location:'swiper/edit.js:66',message:'wrapperRef is null - early return',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
			console.log('[SWIPER DEBUG]', JSON.stringify(logData, null, 2));
			window.swiperDebugLogs.push(logData);
			// #endregion
			return;
		}

		const wrapper = wrapperRef.current;
		
		// #region agent log
		const logDataC = {location:'swiper/edit.js:72',message:'wrapper found, searching for blockListLayout',data:{wrapperClasses:wrapper.className,wrapperChildrenCount:wrapper.children.length,wrapperChildren:Array.from(wrapper.children).map(c=>({tag:c.tagName,classes:c.className}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logDataC, null, 2));
		window.swiperDebugLogs.push(logDataC);
		// #endregion

		const blockListLayout = wrapper.querySelector('.block-editor-block-list__layout');
		
		// #region agent log
		const logDataD = {location:'swiper/edit.js:77',message:'blockListLayout search result',data:{blockListLayoutFound:!!blockListLayout,blockListLayoutParent:blockListLayout?.parentElement?.className,wrapperHTML:wrapper.innerHTML.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logDataD, null, 2));
		window.swiperDebugLogs.push(logDataD);
		// #endregion
		
		if (!blockListLayout) {
			// #region agent log
			const logDataE = {location:'swiper/edit.js:82',message:'blockListLayout not found - early return',data:{wrapperDirectChildren:Array.from(wrapper.children).map(c=>({tag:c.tagName,classes:c.className,id:c.id}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'};
			console.log('[SWIPER DEBUG]', JSON.stringify(logDataE, null, 2));
			window.swiperDebugLogs.push(logDataE);
			// #endregion
			return;
		}

		// Find all direct block children (excluding appender)
		const blocks = Array.from(blockListLayout.children).filter(
			(child) => child.classList.contains('block-editor-block-list__block') && 
			           !child.classList.contains('block-list-appender')
		);

		// #region agent log
		const logDataF = {location:'swiper/edit.js:92',message:'Blocks found in layout',data:{blocksCount:blocks.length,blocksIds:blocks.map(b=>b.id),blockListLayoutChildrenCount:blockListLayout.children.length,allChildren:Array.from(blockListLayout.children).map(c=>({tag:c.tagName,classes:c.className}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logDataF, null, 2));
		window.swiperDebugLogs.push(logDataF);
		// #endregion

		blocks.forEach((block, index) => {
			// #region agent log
			const logDataG = {location:'swiper/edit.js:96',message:'Processing block',data:{blockIndex:index,blockId:block.id,blockParentClasses:block.parentElement?.className,alreadyWrapped:block.parentElement?.classList.contains('swiper-slide')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};
			console.log('[SWIPER DEBUG]', JSON.stringify(logDataG, null, 2));
			window.swiperDebugLogs.push(logDataG);
			// #endregion

			let slideWrapper;

			// Check if already wrapped
			if (block.parentElement.classList.contains('swiper-slide')) {
				slideWrapper = block.parentElement;
				// #region agent log
				const logDataH = {location:'swiper/edit.js:103',message:'Block already wrapped in swiper-slide',data:{slideWrapperParent:slideWrapper.parentElement?.className,slideWrapperParentIsWrapper:slideWrapper.parentElement === wrapper,slideWrapperParentTag:slideWrapper.parentElement?.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'};
				console.log('[SWIPER DEBUG]', JSON.stringify(logDataH, null, 2));
				window.swiperDebugLogs.push(logDataH);
				// #endregion
			} else {
				// Create swiper-slide wrapper
				slideWrapper = document.createElement('div');
				slideWrapper.className = 'swiper-slide';
				
				// Move block into wrapper
				slideWrapper.appendChild(block);
				// #region agent log
				const logDataI = {location:'swiper/edit.js:112',message:'Created new swiper-slide wrapper',data:{blockId:block.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'};
				console.log('[SWIPER DEBUG]', JSON.stringify(logDataI, null, 2));
				window.swiperDebugLogs.push(logDataI);
				// #endregion
			}

			// Move slide wrapper directly to swiper-wrapper if not already there
			if (slideWrapper.parentElement !== wrapper) {
				// #region agent log
				const logDataJ = {location:'swiper/edit.js:118',message:'Moving slideWrapper to wrapper',data:{currentParent:slideWrapper.parentElement?.className,currentParentTag:slideWrapper.parentElement?.tagName,willMove:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'};
				console.log('[SWIPER DEBUG]', JSON.stringify(logDataJ, null, 2));
				window.swiperDebugLogs.push(logDataJ);
				// #endregion
				// Find appender to insert before it
				const appender = wrapper.querySelector('.block-list-appender');
				if (appender && appender.parentElement === wrapper) {
					wrapper.insertBefore(slideWrapper, appender);
				} else {
					wrapper.appendChild(slideWrapper);
				}
				// #region agent log
				const logDataK = {location:'swiper/edit.js:125',message:'slideWrapper moved',data:{newParent:slideWrapper.parentElement?.className,newParentIsWrapper:slideWrapper.parentElement === wrapper,newParentTag:slideWrapper.parentElement?.tagName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'};
				console.log('[SWIPER DEBUG]', JSON.stringify(logDataK, null, 2));
				window.swiperDebugLogs.push(logDataK);
				// #endregion
			} else {
				// #region agent log
				const logDataL = {location:'swiper/edit.js:129',message:'slideWrapper already in correct position',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'L'};
				console.log('[SWIPER DEBUG]', JSON.stringify(logDataL, null, 2));
				window.swiperDebugLogs.push(logDataL);
				// #endregion
			}
		});

		// Cleanup: remove empty swiper-slide wrappers
		const slides = wrapper.querySelectorAll('.swiper-slide');
		// #region agent log
		const logDataM = {location:'swiper/edit.js:135',message:'Final state after processing',data:{totalSlides:slides.length,slidesInWrapper:Array.from(wrapper.children).filter(c=>c.classList.contains('swiper-slide')).length,wrapperDirectChildren:Array.from(wrapper.children).map(c=>({tag:c.tagName,classes:c.className,id:c.id}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logDataM, null, 2));
		window.swiperDebugLogs.push(logDataM);
		// #endregion

		slides.forEach((slide) => {
			if (!slide.querySelector('.block-editor-block-list__block')) {
				slide.remove();
			}
		});
	}, [innerBlocks.length, clientId]);

	// #region agent log
	useEffect(() => {
		const logDataN = {location:'swiper/edit.js:111',message:'blockProps configuration',data:{containerClasses,dataAttrsKeys:Object.keys(dataAttrs),swiperId,swiperData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'};
		console.log('[SWIPER DEBUG]', JSON.stringify(logDataN, null, 2));
		window.swiperDebugLogs = window.swiperDebugLogs || [];
		window.swiperDebugLogs.push(logDataN);
	}, [containerClasses, dataAttrs, swiperId, swiperData]);
	// #endregion

	const blockProps = useBlockProps({
		className: containerClasses,
		id: swiperId || undefined,
		...(swiperData ? { 'data-codeweber': swiperData } : {}),
		...dataAttrs,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Swiper Settings', 'codeweber-gutenberg-blocks')} initialOpen={true}>
					<TextControl
						label={__('Margin (px)', 'codeweber-gutenberg-blocks')}
						value={swiperMargin}
						onChange={(value) => setAttributes({ swiperMargin: value })}
					/>

					<ToggleControl
						label={__('Show Navigation', 'codeweber-gutenberg-blocks')}
						checked={swiperNav}
						onChange={(value) => setAttributes({ swiperNav: value })}
					/>

					<ToggleControl
						label={__('Show Dots', 'codeweber-gutenberg-blocks')}
						checked={swiperDots}
						onChange={(value) => setAttributes({ swiperDots: value })}
					/>

					<TextControl
						label={__('Items XL (≥1200px)', 'codeweber-gutenberg-blocks')}
						value={swiperItemsXl}
						onChange={(value) => setAttributes({ swiperItemsXl: value })}
					/>

					<TextControl
						label={__('Items MD (≥768px)', 'codeweber-gutenberg-blocks')}
						value={swiperItemsMd}
						onChange={(value) => setAttributes({ swiperItemsMd: value })}
					/>

					<TextControl
						label={__('Items XS (<576px)', 'codeweber-gutenberg-blocks')}
						value={swiperItemsXs}
						onChange={(value) => setAttributes({ swiperItemsXs: value })}
					/>

					<TextControl
						label={__('Items (default)', 'codeweber-gutenberg-blocks')}
						value={swiperItems}
						onChange={(value) => setAttributes({ swiperItems: value })}
					/>

					<SelectControl
						label={__('Effect', 'codeweber-gutenberg-blocks')}
						value={swiperEffect}
						options={[
							{ label: __('Slide', 'codeweber-gutenberg-blocks'), value: 'slide' },
							{ label: __('Fade', 'codeweber-gutenberg-blocks'), value: 'fade' },
							{ label: __('Cube', 'codeweber-gutenberg-blocks'), value: 'cube' },
							{ label: __('Coverflow', 'codeweber-gutenberg-blocks'), value: 'coverflow' },
							{ label: __('Flip', 'codeweber-gutenberg-blocks'), value: 'flip' },
						]}
						onChange={(value) => setAttributes({ swiperEffect: value })}
					/>

					<TextControl
						label={__('Speed (ms)', 'codeweber-gutenberg-blocks')}
						type="number"
						value={swiperSpeed}
						onChange={(value) => setAttributes({ swiperSpeed: parseInt(value) || 500 })}
					/>

					<ToggleControl
						label={__('Loop', 'codeweber-gutenberg-blocks')}
						checked={swiperLoop}
						onChange={(value) => setAttributes({ swiperLoop: value })}
					/>

					<ToggleControl
						label={__('Autoplay', 'codeweber-gutenberg-blocks')}
						checked={swiperAutoplay}
						onChange={(value) => setAttributes({ swiperAutoplay: value })}
					/>

					{swiperAutoplay && (
						<TextControl
							label={__('Autoplay Time (ms)', 'codeweber-gutenberg-blocks')}
							type="number"
							value={swiperAutoplayTime}
							onChange={(value) => setAttributes({ swiperAutoplayTime: parseInt(value) || 5000 })}
						/>
					)}

					<SelectControl
						label={__('Nav Style', 'codeweber-gutenberg-blocks')}
						value={swiperNavStyle}
						options={[
							{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'nav-dark' },
							{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'nav-light' },
						]}
						onChange={(value) => setAttributes({ swiperNavStyle: value })}
					/>

					<SelectControl
						label={__('Dots Style', 'codeweber-gutenberg-blocks')}
						value={swiperDotsStyle}
						options={[
							{ label: __('Over', 'codeweber-gutenberg-blocks'), value: 'dots-over' },
							{ label: __('Light', 'codeweber-gutenberg-blocks'), value: 'dots-light' },
							{ label: __('Dark', 'codeweber-gutenberg-blocks'), value: 'dots-dark' },
						]}
						onChange={(value) => setAttributes({ swiperDotsStyle: value })}
					/>
				</PanelBody>

				<PanelBody title={__('Advanced', 'codeweber-gutenberg-blocks')} initialOpen={false}>
					<BlockMetaFields
						attributes={attributes}
						setAttributes={setAttributes}
						fieldKeys={{
							classKey: 'swiperClass',
							dataKey: 'swiperData',
							idKey: 'swiperId',
						}}
						labels={{
							classLabel: __('Swiper Class', 'codeweber-gutenberg-blocks'),
							dataLabel: __('Swiper Data', 'codeweber-gutenberg-blocks'),
							idLabel: __('Swiper ID', 'codeweber-gutenberg-blocks'),
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="swiper">
					<div className="swiper-wrapper" ref={wrapperRef}>
						<InnerBlocks
							allowedBlocks={undefined}
							templateLock={false}
							renderAppender={InnerBlocks.ButtonBlockAppender}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SwiperEdit;

