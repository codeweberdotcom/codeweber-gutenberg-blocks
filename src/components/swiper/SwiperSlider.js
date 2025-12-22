/**
 * Swiper Slider Component
 * 
 * Universal component for rendering Swiper sliders
 * Can be used with any content (images, cards, etc.)
 * 
 * @package CodeWeber Gutenberg Blocks
 */

/**
 * Get Swiper container classes
 * 
 * @param {Object} config - Swiper configuration
 * @returns {string} Class names string
 */
export const getSwiperContainerClasses = (config = {}) => {
	const {
		containerType = '',
		navStyle = '',
		navPosition = '',
		dotsStyle = '',
		itemsAuto = false,
	} = config;

	const classes = ['swiper-container'];

	// Auto mode classes for continuous scrolling
	if (itemsAuto) {
		classes.push('swiper-auto');
		// Add responsive auto class if needed
		// classes.push('swiper-auto-xs');
	}

	// Container type
	if (containerType) {
		classes.push(containerType);
	}

	// Navigation style
	if (navStyle) {
		classes.push(navStyle);
	}

	// Navigation position
	if (navPosition) {
		const positions = navPosition.split(' ');
		classes.push(...positions);
	}

	// Dots style
	if (dotsStyle) {
		classes.push(dotsStyle);
	}

	return classes.join(' ');
};

/**
 * Get Swiper data attributes
 * 
 * @param {Object} config - Swiper configuration
 * @returns {Object} Data attributes object
 */
export const getSwiperDataAttributes = (config = {}) => {
	const {
		effect = 'slide',
		speed = 500,
		items = '3',
		itemsXs = '1',
		itemsSm = '',
		itemsMd = '2',
		itemsLg = '',
		itemsXl = '3',
		itemsXxl = '',
		itemsAuto = false,
		margin = '30',
		loop = false,
		centered = false,
		autoHeight = false,
		watchOverflow = false,
		updateResize = true,
		drag = true,
		reverse = false,
		autoplay = false,
		autoplayTime = 5000,
		nav = true,
		dots = true,
	} = config;

	const attrs = {};

	// Transition
	if (effect) {
		attrs['data-effect'] = effect;
	}
	if (typeof speed !== 'undefined') {
		attrs['data-speed'] = String(speed);
	}

	// Items per view
	attrs['data-items-auto'] = itemsAuto ? 'true' : 'false';
	if (!itemsAuto) {
		if (items) attrs['data-items'] = items;
		if (itemsXs) attrs['data-items-xs'] = itemsXs;
		if (itemsSm) attrs['data-items-sm'] = itemsSm;
		if (itemsMd) attrs['data-items-md'] = itemsMd;
		if (itemsLg) attrs['data-items-lg'] = itemsLg;
		if (itemsXl) attrs['data-items-xl'] = itemsXl;
		if (itemsXxl) attrs['data-items-xxl'] = itemsXxl;
	}

	// Spacing & Behavior
	if (margin || margin === 0) {
		attrs['data-margin'] = String(margin);
	}
	attrs['data-loop'] = loop ? 'true' : 'false';
	attrs['data-centered'] = centered ? 'true' : 'false';
	attrs['data-autoheight'] = autoHeight ? 'true' : 'false';
	attrs['data-watchoverflow'] = watchOverflow ? 'true' : 'false';
	attrs['data-resizeupdate'] = updateResize ? 'true' : 'false';
	attrs['data-drag'] = drag ? 'true' : 'false';
	attrs['data-reverse'] = reverse ? 'true' : 'false';

	// Autoplay
	attrs['data-autoplay'] = autoplay ? 'true' : 'false';
	if (typeof autoplayTime !== 'undefined') {
		attrs['data-autoplaytime'] = String(autoplayTime);
	}

	// Navigation
	attrs['data-nav'] = nav ? 'true' : 'false';
	attrs['data-dots'] = dots ? 'true' : 'false';

	return attrs;
};

/**
 * Initialize Swiper
 * Should be called after DOM changes
 * 
 * @param {string} selector - Optional CSS selector
 * @returns {boolean} Success status
 */
export const initSwiper = (selector = null) => {
	if (typeof window === 'undefined') {
		return false;
	}

	// Check if theme has Swiper initialization function (swiperSlider is the actual function name)
	if (typeof window.theme?.swiperSlider === 'function') {
		try {
			window.theme.swiperSlider(selector);
			return true;
		} catch (error) {
			console.error('Error initializing Swiper:', error);
			return false;
		}
	}

	// Fallback: log warning if Swiper is not available
	console.warn('Swiper initialization function not available. Please ensure theme.js is loaded.');
	return false;
};

/**
 * Cleanup Swiper instances
 * Should be called before unmounting or reinitializing
 * 
 * @param {string} selector - Optional CSS selector
 * @returns {boolean} Success status
 */
export const destroySwiper = (selector = null) => {
	if (typeof window === 'undefined') {
		return false;
	}

	// Try to find and destroy Swiper instances
	try {
		const swipers = selector
			? document.querySelectorAll(selector)
			: document.querySelectorAll('.swiper');

		swipers.forEach((swiperEl) => {
			// Check if element has Swiper instance
			if (swiperEl.swiper) {
				swiperEl.swiper.destroy(true, true);
			}
		});

		return true;
	} catch (error) {
		console.error('Error destroying Swiper:', error);
		return false;
	}
};

/**
 * SwiperSlider Component
 * Renders Swiper slider structure with slides
 * 
 * @param {Object} props - Component props
 * @param {Array} props.children - Slide content (array of React elements)
 * @param {Object} props.config - Swiper configuration
 * @param {string} props.className - Additional classes for container
 * @param {string} props.wrapperClassName - Additional classes for swiper-wrapper
 * @param {string} props.swiperClassName - Additional classes for swiper element
 * @param {string} props.uniqueKey - Unique key for forcing reinitialization
 * @returns {JSX.Element} Swiper structure
 */
export const SwiperSlider = ({
	children = [],
	config = {},
	className = '',
	wrapperClassName = '',
	swiperClassName = '',
	uniqueKey = '',
}) => {
	const containerClasses = `${getSwiperContainerClasses(config)} ${className}`.trim();
	const dataAttrs = getSwiperDataAttributes(config);
	
	// Add ticker class to wrapper for continuous scrolling when itemsAuto is enabled
	// Also add wrapperClassName from Settings tab
	let wrapperClasses = config.itemsAuto ? 'swiper-wrapper ticker' : 'swiper-wrapper';
	if (wrapperClassName) {
		wrapperClasses += ' ' + wrapperClassName;
	}
	wrapperClasses = wrapperClasses.trim();

	// Add classes to swiper element
	const swiperClasses = `swiper ${swiperClassName}`.trim();

	return (
		<div key={uniqueKey} className={containerClasses} {...dataAttrs}>
			<div className={swiperClasses}>
				<div className={wrapperClasses}>
					{children}
				</div>
			</div>
		</div>
	);
};

/**
 * SwiperSlide Component
 * Wrapper for individual slide content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Slide content
 * @param {string} props.className - Additional classes
 * @returns {JSX.Element} Slide wrapper
 */
export const SwiperSlide = ({ children, className = '', slideClassName = '' }) => {
	let slideClasses = 'swiper-slide';
	if (className) {
		slideClasses += ' ' + className;
	}
	if (slideClassName) {
		slideClasses += ' ' + slideClassName;
	}
	slideClasses = slideClasses.trim();
	
	return (
		<div className={slideClasses}>
			{children}
		</div>
	);
};

/**
 * Generate Swiper configuration from attributes
 * Helper function to create config object from block attributes
 * 
 * @param {Object} attributes - Block attributes
 * @returns {Object} Swiper configuration
 */
export const getSwiperConfigFromAttributes = (attributes) => {
	return {
		effect: attributes.swiperEffect,
		speed: attributes.swiperSpeed,
		items: attributes.swiperItems,
		itemsXs: attributes.swiperItemsXs,
		itemsSm: attributes.swiperItemsSm,
		itemsMd: attributes.swiperItemsMd,
		itemsLg: attributes.swiperItemsLg,
		itemsXl: attributes.swiperItemsXl,
		itemsXxl: attributes.swiperItemsXxl,
		itemsAuto: attributes.swiperItemsAuto,
		margin: attributes.swiperMargin,
		loop: attributes.swiperLoop,
		centered: attributes.swiperCentered,
		autoHeight: attributes.swiperAutoHeight,
		watchOverflow: attributes.swiperWatchOverflow,
		updateResize: attributes.swiperUpdateResize,
		drag: attributes.swiperDrag,
		reverse: attributes.swiperReverse,
		autoplay: attributes.swiperAutoplay,
		autoplayTime: attributes.swiperAutoplayTime,
		nav: attributes.swiperNav,
		dots: attributes.swiperDots,
		containerType: attributes.swiperContainerType,
		navStyle: attributes.swiperNavStyle,
		navPosition: attributes.swiperNavPosition,
		dotsStyle: attributes.swiperDotsStyle,
	};
};

