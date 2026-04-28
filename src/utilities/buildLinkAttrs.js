/**
 * Shared utility: build <a> href and data-attributes from LinkType attributes.
 * Used by Image Simple block; mirrors the link-building logic in button/save.js.
 *
 * @param {Object} attributes Block attributes containing LinkType, LinkUrl, etc.
 * @returns {{ linkProps: Object, videoFrameId: string|null, videoFrameSrc: string|null }|null}
 *          Returns null when LinkType is empty (fallback to block's own behaviour).
 */
export function buildLinkAttrs( attributes ) {
	const {
		LinkType,
		LinkUrl,
		PostId,
		PostType,
		DataGlightbox,
		DataGallery,
		DataBsToggle,
		DataBsTarget,
		DataValue,
	} = attributes;

	if ( ! LinkType ) return null;

	const hasGlightbox    = DataGlightbox && DataGlightbox.trim() !== '';
	const hasGallery      = DataGallery   && DataGallery.trim()   !== '';
	const hasBsToggle     = DataBsToggle  && DataBsToggle.trim()  !== '';
	const hasBsTarget     = DataBsTarget  && DataBsTarget.trim()  !== '';
	const isExternalLink  = LinkType === 'external';
	const shouldOpenInNewTab = isExternalLink && ! hasGlightbox && ! hasBsToggle;

	const isVideoLink =
		LinkType === 'vk' ||
		LinkType === 'rutube' ||
		LinkType === 'youtube' ||
		LinkType === 'vimeo' ||
		( hasGlightbox && DataGlightbox.includes( 'type: iframe' ) );

	let finalHref      = LinkUrl;
	let finalGlightbox = DataGlightbox;
	let videoFrameId   = null;
	let videoFrameSrc  = null;

	// Post link fallback when URL is missing
	if (
		LinkType === 'post' &&
		( ! LinkUrl || LinkUrl === '#' || LinkUrl === '' ) &&
		PostId
	) {
		if ( PostType === 'page' )       finalHref = `?page_id=${ PostId }`;
		else if ( PostType === 'post' )  finalHref = `?p=${ PostId }`;
		else if ( PostType )             finalHref = `?post_type=${ PostType }&p=${ PostId }`;
		else                             finalHref = `?p=${ PostId }`;
	}

	// Video: hidden iframe rendered separately, anchor href points to it
	if ( isVideoLink && LinkUrl ) {
		videoFrameId  = `video-${ Math.random().toString( 36 ).substring( 2, 11 ) }`;
		videoFrameSrc = LinkUrl;
		finalHref     = `#${ videoFrameId }`;
		finalGlightbox = 'width: auto;';
	}

	const linkProps = {
		href: finalHref || 'javascript:void(0)',
	};

	if ( DataValue )                     linkProps[ 'data-value' ]      = DataValue;
	if ( hasGlightbox || isVideoLink )   linkProps[ 'data-glightbox' ]  = finalGlightbox;
	if ( hasGallery )                    linkProps[ 'data-gallery' ]    = DataGallery;
	if ( hasBsToggle )                   linkProps[ 'data-bs-toggle' ]  = DataBsToggle;
	if ( hasBsTarget ) {
		linkProps[ 'data-bs-target' ] = DataBsTarget.startsWith( '#' )
			? DataBsTarget
			: `#${ DataBsTarget }`;
	}
	if ( shouldOpenInNewTab ) {
		linkProps.target = '_blank';
		linkProps.rel    = 'noopener noreferrer';
	}

	return { linkProps, videoFrameId, videoFrameSrc };
}
