import {
	CTA1,
	CTA2,
	CTA3,
	CTA4,
	CTA5,
	CTA6,
} from './ctas';

const CTASave = ({ attributes }) => {
	const { ctaType } = attributes;

	const renderCTA = () => {
		switch (ctaType) {
			case 'cta-1':
				return <CTA1 attributes={attributes} isEditor={false} />;
			case 'cta-2':
				return <CTA2 attributes={attributes} isEditor={false} />;
			case 'cta-3':
				return <CTA3 attributes={attributes} isEditor={false} />;
			case 'cta-4':
				return <CTA4 attributes={attributes} isEditor={false} />;
			case 'cta-5':
				return <CTA5 attributes={attributes} isEditor={false} />;
			case 'cta-6':
				return <CTA6 attributes={attributes} isEditor={false} />;
			default:
				return <CTA1 attributes={attributes} isEditor={false} />;
		}
	};

	return renderCTA();
};

export default CTASave;












