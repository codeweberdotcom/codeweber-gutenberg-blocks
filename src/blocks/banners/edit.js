import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { BannersSidebar } from './sidebar';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	Banner34,
	Banner3,
	Banner14,
	Banner23,
	Banner24,
	Banner25,
	Banner1,
	Banner2,
	Banner4,
	Banner6,
	Banner7,
	Banner8,
	Banner10,
	Banner11,
	Banner15,
	Banner16,
	Banner18,
	Banner20,
	Banner27,
	Banner29,
	Banner30,
	Banner32,
} from './banners';

const BannersEdit = ({ attributes, setAttributes, clientId }) => {
	const { bannerType } = attributes;

	const blockProps = useBlockProps({
		className: `banners-block banner-${bannerType}`,
	});

	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId) || [],
		[clientId]
	);

	// Функция для получения шаблона блоков
	const getTemplateBlocks = () => {
		if (bannerType === 'banner-3') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Sandbox focuses on ',
						text: 'We carefully consider our solutions to support each and every stage of your growth.',
						titleSize: 'display-1',
						textClass:
							'lead fs-24 lh-sm text-white mb-7 pe-md-18 pe-lg-0 pe-xxl-15',
						titleClass: 'text-white mb-4',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Get Started',
						ButtonSize: '',
					},
				],
			];
		}

		if (bannerType === 'banner-14') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We bring rapid solutions for your business.',
						text: 'We are an award winning branding design agency that strongly believes in the power of creative ideas.',
						titleSize: 'display-1 fs-66 lh-xxs mb-0',
						textClass: 'lead fs-25 my-3',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Learn More',
						ButtonClass: 'more hover',
					},
				],
			];
		}

		if (bannerType === 'banner-23') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: true,
						enableText: false,
						title: "I'm Julia Sandbox",
						subtitle: 'couples & wedding photographer',
						titleSize: 'fs-19 text-uppercase ls-xl text-white mb-3',
						subtitleSize: 'display-1 fs-60 text-white mb-0',
					},
				],
			];
		}

		if (bannerType === 'banner-1') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Grow Your Business with Our Solutions.',
						text: 'We help our clients to increase their website traffic, rankings and visibility in search results.',
						titleSize: 'display-1 mb-5 mx-md-n5 mx-lg-0',
						textClass: 'lead fs-lg mb-7',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Try It For Free',
						ButtonClass: 'btn-primary rounded-pill me-2',
					},
				],
			];
		}

		if (bannerType === 'banner-2') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We bring solutions to make life easier for our customers.',
						text: 'We have considered our solutions to support every stage of your growth.',
						titleSize: 'display-1 mb-5',
						textClass: 'lead fs-25 lh-sm mb-7 px-md-10 px-lg-0',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-primary rounded-pill me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Free Trial',
						ButtonClass: 'btn-lg btn-outline-primary rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-4') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Just sit & relax while we take care of your business needs.',
						text: 'We make your spending stress-free for you to have the perfect control.',
						titleSize: 'display-1 mb-5',
						textClass: 'lead fs-25 lh-sm mb-7 pe-md-10',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-primary rounded-pill me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Us',
						ButtonClass: 'btn-lg btn-outline-primary rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-6') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Get all of your steps, exercise, sleep and meds in one place.',
						text: 'Sandbox is now available to download from both the App Store and Google Play Store.',
						titleSize: 'display-2 mb-4 mx-sm-n2 mx-md-0',
						textClass: 'lead fs-lg mb-7 px-md-10 px-lg-0',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'App Store',
						ButtonClass:
							'btn-primary btn-icon btn-icon-start rounded me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Google Play',
						ButtonClass:
							'btn-green btn-icon btn-icon-start rounded',
					},
				],
			];
		}

		if (bannerType === 'banner-7') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Creative. Smart. Awesome.',
						text: 'We are an award winning web & mobile design agency that strongly believes in the power of creative ideas.',
						titleSize: 'display-1 mb-4',
						textClass:
							'lead fs-24 lh-sm px-md-5 px-xl-15 px-xxl-10 mb-7',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'See Projects',
						ButtonClass: 'btn-lg btn-primary rounded-pill mx-1',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Us',
						ButtonClass:
							'btn-lg btn-outline-primary rounded-pill mx-1',
					},
				],
			];
		}

		if (bannerType === 'banner-8') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Crafting project specific solutions with expertise.',
						text: "We're a company that focuses on establishing long-term relationships with customers.",
						titleSize: 'display-2 mb-5',
						textClass: 'lead fs-lg lh-sm mb-7 pe-xl-10',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-primary rounded-pill me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Us',
						ButtonClass: 'btn-lg btn-outline-primary rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-10') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We bring solutions to make life easier.',
						text: 'We are a creative company that focuses on long term relationships with customers.',
						titleSize: 'display-1 fs-60 mb-4 px-md-15 px-lg-0',
						textClass: 'lead fs-24 lh-sm mb-7 mx-md-13 mx-lg-10',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Read More',
						ButtonClass: 'btn-lg btn-primary rounded mb-5',
					},
				],
			];
		}

		if (bannerType === 'banner-11') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Crafting project specific solutions with expertise.',
						text: "We're a creative company that focuses on establishing long-term relationships with customers.",
						titleSize: 'display-2 mb-5 text-white',
						textClass: 'lead fs-lg lh-sm mb-7 pe-xl-10 text-white',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-white rounded-pill me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Us',
						ButtonClass: 'btn-lg btn-outline-white rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-15') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We bring solutions to make life easier.',
						text: 'We are a creative company that focuses on long term relationships with customers.',
						titleSize: 'display-1 fs-56 mb-4 text-white',
						textClass: 'lead fs-23 lh-sm mb-7 text-white',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Read More',
						ButtonClass: 'btn-lg btn-outline-white rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-16') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: "I'm User Interface Designer & Developer.",
						text: "Hello! I'm Julia, a freelance user interface designer & developer based in London. I'm very passionate about the work that I do.",
						titleSize: 'display-1 mb-5',
						textClass: 'lead fs-25 lh-sm mb-7 px-md-10 px-lg-0',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'See My Works',
						ButtonClass: 'btn-lg btn-primary rounded-pill me-2',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Me',
						ButtonClass: 'btn-lg btn-outline-primary rounded-pill',
					},
				],
			];
		}

		if (bannerType === 'banner-18') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Networking <span class="text-gradient gradient-1">solutions</span> for worldwide communication',
						text: "We're a company that focuses on establishing long-term relationships with customers.",
						titleSize: 'display-2 mb-4 me-xl-5 me-xxl-0',
						textClass: 'lead fs-23 lh-sm mb-7 pe-xxl-15',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-gradient gradient-1 rounded',
					},
				],
			];
		}

		if (bannerType === 'banner-18') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Networking <span class="text-gradient gradient-1">solutions</span> for worldwide communication',
						text: "We're a company that focuses on establishing long-term relationships with customers.",
						titleSize: 'display-2 mb-4 me-xl-5 me-xxl-0',
						textClass: 'lead fs-23 lh-sm mb-7 pe-xxl-15',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-gradient gradient-1 rounded',
					},
				],
			];
		}

		if (bannerType === 'banner-24') {
			return [];
		}

		if (bannerType === 'banner-27') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We bring solutions to make life <span class="underline-3 style-3 yellow">easier</span>',
						text: 'We are a creative company that focuses on long term relationships with customers.',
						titleSize:
							'display-1 fs-56 mb-4 mt-0 mt-lg-5 ls-xs pe-xl-5 pe-xxl-0',
						textClass:
							'lead fs-23 lh-sm mb-7 pe-lg-5 pe-xl-5 pe-xxl-0',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Read More',
						ButtonClass: 'btn-lg btn-primary rounded',
					},
				],
			];
		}

		if (bannerType === 'banner-29') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'Manage all your bills, accounts and budgets in <span class="text-gradient gradient-7">one place.</span>',
						text: 'Sandbox is available to download from both App Store and Google Play Store.',
						titleSize: 'display-1 fs-50 mb-4',
						textClass: 'lead fs-24 lh-sm mb-7',
					},
				],
			];
		}

		if (bannerType === 'banner-30') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: false,
						enableText: true,
						title: 'We are a digital web agency specializing on <br /><span class="rotator-fade text-primary">web design.,SEO services.,e-commerce.,Google Adwords.</span>',
						text: 'We are an award winning digital web agency that strongly believes in the power of creative ideas.',
						titleSize: 'display-1 fs-64 mb-5 mx-md-10 mx-lg-0',
						textClass: 'lead fs-24 mb-8',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'See Projects',
						ButtonClass: 'btn-lg btn-primary rounded-xl mx-1',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Contact Us',
						ButtonClass: 'btn-lg btn-fuchsia rounded-xl mx-1',
					},
				],
			];
		}

		if (bannerType === 'banner-32') {
			return [
				[
					'codeweber-gutenberg-blocks/heading-subtitle',
					{
						enableTitle: true,
						enableSubtitle: true,
						enableText: false,
						subtitle: 'Hello! We are Sandbox',
						title: 'We have considered our solutions to <span class="underline-2 underline-gradient-6"><em>assist</em></span> every stage of your growth.',
						subtitleSize: 'h6 text-uppercase ls-xl text-white mb-5',
						titleSize: 'display-1 fs-68 lh-xxs mb-8 text-white',
					},
				],
				[
					'codeweber-blocks/button',
					{
						ButtonContent: 'Explore Now',
						ButtonClass: 'btn-lg btn-white',
					},
				],
			];
		}

		// Default template для banner-34
		return [
			[
				'codeweber-gutenberg-blocks/heading-subtitle',
				{
					enableTitle: true,
					enableSubtitle: false,
					enableText: true,
					title: 'We bring solutions to make life easier for our customers.',
					text: 'We have considered our solutions to support every stage of your growth.',
					titleSize: 'display-1',
					textClass: 'lead fs-lg mb-7',
				},
			],
			[
				'codeweber-blocks/button',
				{
					ButtonContent: 'Get Started',
					ButtonSize: '',
				},
			],
		];
	};

	// Применяем шаблон при первом создании блока, если блоки пусты
	const hasAppliedTemplateRef = useRef(false);
	useEffect(() => {
		if (innerBlocks.length === 0 && !hasAppliedTemplateRef.current) {
			const template = getTemplateBlocks();
			const templateBlocks =
				createBlocksFromInnerBlocksTemplate(template);
			replaceInnerBlocks(clientId, templateBlocks, false);
			hasAppliedTemplateRef.current = true;
		}
	}, [innerBlocks.length, clientId, replaceInnerBlocks]);

	const renderBanner = () => {
		switch (bannerType) {
			case 'banner-34':
				return (
					<Banner34
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-3':
				return (
					<Banner3
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-14':
				return (
					<Banner14
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-23':
				return (
					<Banner23
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-1':
				return (
					<Banner1
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-2':
				return (
					<Banner2
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-4':
				return (
					<Banner4
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-6':
				return (
					<Banner6
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-7':
				return (
					<Banner7
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-8':
				return (
					<Banner8
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-10':
				return (
					<Banner10
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-11':
				return (
					<Banner11
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-15':
				return (
					<Banner15
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-16':
				return <Banner16 attributes={attributes} isEditor={true} />;
			case 'banner-18':
				return <Banner18 attributes={attributes} isEditor={true} />;
			case 'banner-20':
				return <Banner20 attributes={attributes} isEditor={true} />;
			case 'banner-24':
				return (
					<Banner24
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-25':
				return (
					<Banner25
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
			case 'banner-27':
				return <Banner27 attributes={attributes} isEditor={true} />;
			case 'banner-29':
				return <Banner29 attributes={attributes} isEditor={true} />;
			case 'banner-30':
				return <Banner30 attributes={attributes} isEditor={true} />;
			case 'banner-32':
				return <Banner32 attributes={attributes} isEditor={true} />;
			default:
				return (
					<Banner34
						attributes={attributes}
						isEditor={true}
						clientId={clientId}
					/>
				);
		}
	};

	return (
		<>
			<InspectorControls>
				<BannersSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
			<div {...blockProps}>{renderBanner()}</div>
		</>
	);
};

export default BannersEdit;
