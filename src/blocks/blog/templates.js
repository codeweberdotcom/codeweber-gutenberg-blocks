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
	columnsGap: '6',
	columnsGapMd: '10',
	columnsAlignItems: 'align-items-center',
};

const columnsAttrsReverse = {
	...columnsAttrs,
	columnsReverseOnMobile: true,
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
		swiperItemsXs: '',
		swiperItemsSm: '',
		swiperItemsMd: '',
		swiperItemsLg: '',
		swiperItemsXl: '',
		swiperItemsXxl: '',
		swiperItemsXxxl: '',
		swiperNavStyle: 'nav-dark',
	},
];

const LOREM_TITLE = 'Lorem Ipsum';
const LOREM_TEXT =
	"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const headingBlock = [
	'codeweber-gutenberg-blocks/heading-subtitle',
	{
		enableTitle: true,
		enableSubtitle: false,
		enableText: true,
		title: LOREM_TITLE,
		text: LOREM_TEXT,
	},
];
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
			columnsAttrsReverse,
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
