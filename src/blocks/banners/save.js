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

const BannersSave = ({ attributes }) => {
	const { bannerType } = attributes;

	const renderBanner = () => {
		switch (bannerType) {
			case 'banner-34':
				return <Banner34 attributes={attributes} isEditor={false} />;
			case 'banner-3':
				return <Banner3 attributes={attributes} isEditor={false} />;
			case 'banner-14':
				return <Banner14 attributes={attributes} isEditor={false} />;
			case 'banner-23':
				return <Banner23 attributes={attributes} isEditor={false} />;
			case 'banner-1':
				return <Banner1 attributes={attributes} isEditor={false} />;
			case 'banner-2':
				return <Banner2 attributes={attributes} isEditor={false} />;
			case 'banner-4':
				return <Banner4 attributes={attributes} isEditor={false} />;
			case 'banner-6':
				return <Banner6 attributes={attributes} isEditor={false} />;
			case 'banner-7':
				return <Banner7 attributes={attributes} isEditor={false} />;
			case 'banner-8':
				return <Banner8 attributes={attributes} isEditor={false} />;
			case 'banner-10':
				return <Banner10 attributes={attributes} isEditor={false} />;
			case 'banner-11':
				return (
					<Banner11
						attributes={attributes}
						isEditor={false}
						clientId={''}
					/>
				);
			case 'banner-15':
				return (
					<Banner15
						attributes={attributes}
						isEditor={false}
						clientId={''}
					/>
				);
			case 'banner-16':
				return <Banner16 attributes={attributes} isEditor={false} />;
			case 'banner-18':
				return <Banner18 attributes={attributes} isEditor={false} />;
			case 'banner-20':
				return <Banner20 attributes={attributes} isEditor={false} />;
			case 'banner-24':
				return (
					<Banner24
						attributes={attributes}
						isEditor={false}
						clientId={''}
					/>
				);
			case 'banner-25':
				return (
					<Banner25
						attributes={attributes}
						isEditor={false}
						clientId={''}
					/>
				);
			case 'banner-27':
				return <Banner27 attributes={attributes} isEditor={false} />;
			case 'banner-29':
				return <Banner29 attributes={attributes} isEditor={false} />;
			case 'banner-30':
				return <Banner30 attributes={attributes} isEditor={false} />;
			case 'banner-32':
				return <Banner32 attributes={attributes} isEditor={false} />;
			default:
				return <Banner34 attributes={attributes} isEditor={false} />;
		}
	};

	return renderBanner();
};

export default BannersSave;
