import { Banner34, Banner3, Banner14, Banner23 } from './banners';

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
			default:
				return <Banner34 attributes={attributes} isEditor={false} />;
		}
	};

	return renderBanner();
};

export default BannersSave;

