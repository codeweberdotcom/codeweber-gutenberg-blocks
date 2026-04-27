/**
 * InnerBlocks templates for each Blog layout type.
 * Applied via replaceInnerBlocks on layout change.
 */

export const LAYOUT_OPTIONS = [
	{ value: 'text-only',    label: 'Text Only' },
	{ value: 'image-left',   label: 'Image + Text' },
	{ value: 'image-right',  label: 'Text + Image' },
	{ value: 'slider-left',  label: 'Slider + Text' },
	{ value: 'slider-right', label: 'Text + Slider' },
	{ value: 'quote',        label: 'Quote' },
	{ value: 'callout',      label: 'Callout' },
];

const colAttrs = ( colMd ) => ( { columnColMd: String( colMd ) } );

const columnsAttrs = {
	columnsCount: 2,
	columnsGap: '5',
	columnsAlignItems: 'align-items-center',
};

const imageBlock = [ 'codeweber-blocks/image-simple', { imageSize: 'cw_square_xl' } ];

const sliderBlock = [
	'codeweber-blocks/image-simple',
	{
		imageSize: 'cw_square_xl',
		displayMode: 'swiper',
		swiperNav: true,
		swiperDots: false,
		swiperLoop: true,
		swiperItems: '1',
		swiperNavStyle: 'nav-dark',
	},
];

const headingBlock = [ 'codeweber-gutenberg-blocks/heading-subtitle', {} ];
const buttonBlock  = [ 'codeweber-blocks/button', {} ];
const blockquoteBlock = [ 'codeweber-blocks/blockquote', {} ];

export const LAYOUT_TEMPLATES = {
	'text-only': [ headingBlock ],

	'image-left': [
		[
			'codeweber-blocks/columns',
			columnsAttrs,
			[
				[ 'codeweber-blocks/column', colAttrs( 5 ), [ imageBlock ] ],
				[ 'codeweber-blocks/column', colAttrs( 7 ), [ headingBlock ] ],
			],
		],
	],

	'image-right': [
		[
			'codeweber-blocks/columns',
			columnsAttrs,
			[
				[ 'codeweber-blocks/column', colAttrs( 7 ), [ headingBlock ] ],
				[ 'codeweber-blocks/column', colAttrs( 5 ), [ imageBlock ] ],
			],
		],
	],

	'slider-left': [
		[
			'codeweber-blocks/columns',
			columnsAttrs,
			[
				[ 'codeweber-blocks/column', colAttrs( 6 ), [ sliderBlock ] ],
				[ 'codeweber-blocks/column', colAttrs( 6 ), [ headingBlock ] ],
			],
		],
	],

	'slider-right': [
		[
			'codeweber-blocks/columns',
			columnsAttrs,
			[
				[ 'codeweber-blocks/column', colAttrs( 6 ), [ headingBlock ] ],
				[ 'codeweber-blocks/column', colAttrs( 6 ), [ sliderBlock ] ],
			],
		],
	],

	quote: [ blockquoteBlock ],

	callout: [ headingBlock, buttonBlock ],
};
