/**
 * Avatar Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import { ImageUpload } from '../../components/media-upload/ImageUpload';
import { AvatarSidebar } from './sidebar';

const Edit = ({ attributes, setAttributes }) => {
	const {
		avatarType,
		letters,
		bgColor,
		textColor,
		size,
		imageId,
		imageUrl,
		imageAlt,
		showName,
		name,
		position,
		nameLink,
		userId,
		blockAlign,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	// User data state
	const [userData, setUserData] = useState(null);
	const [loadingUser, setLoadingUser] = useState(false);

	// Fetch user data when userId changes and avatarType is 'user'
	useEffect(() => {
		if (avatarType === 'user' && userId) {
			setLoadingUser(true);
			apiFetch({ path: `/wp/v2/users/${userId}?context=edit` })
				.then((user) => {
					setUserData(user);
					setLoadingUser(false);
				})
				.catch(() => {
					setUserData(null);
					setLoadingUser(false);
				});
		} else {
			setUserData(null);
		}
	}, [avatarType, userId]);

	// Block classes
	const blockClasses = [
		'cwgb-avatar-block',
		blockAlign ? `text-${blockAlign}` : '',
		blockClass,
	].filter(Boolean).join(' ');

	// Parse data attributes
	const dataAttributes = {};
	if (blockData) {
		blockData.split(',').forEach((pair) => {
			const [key, value] = pair.split('=').map((s) => s.trim());
			if (key && value) {
				dataAttributes[`data-${key}`] = value;
			}
		});
	}

	const blockProps = useBlockProps({
		className: blockClasses,
		id: blockId || undefined,
		...dataAttributes,
	});

	// Helper function to get initials from name
	const getInitials = (fullName) => {
		if (!fullName) return 'AB';
		const words = fullName.trim().split(' ').filter(w => w.length > 0);
		if (words.length === 0) return 'AB';
		if (words.length === 1) {
			return words[0].substring(0, 2).toUpperCase();
		}
		return (words[0][0] + words[words.length - 1][0]).toUpperCase();
	};

	// Avatar classes
	const getAvatarClasses = () => {
		const classes = ['avatar'];
		
		// Background and text color for letters fallback
		if (bgColor) {
			classes.push(`bg-${bgColor}`);
		}
		if (textColor) {
			classes.push(`text-${textColor}`);
		}
		
		// Size
		if (size) {
			classes.push(`w-${size}`, `h-${size}`);
		}
		
		return classes.join(' ');
	};

	const handleImageChange = (image) => {
		setAttributes({
			imageId: image.id || 0,
			imageUrl: image.url || '',
			imageAlt: image.alt || '',
		});
	};

	return (
		<>
			{/* Alignment Toolbar */}
			<BlockControls>
				<AlignmentToolbar
					value={blockAlign}
					onChange={(value) => setAttributes({ blockAlign: value })}
				/>
			</BlockControls>

			{/* Inspector Controls */}
			<InspectorControls>
				<AvatarSidebar
					attributes={attributes}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			{/* Preview */}
			<div {...blockProps}>
				{avatarType === 'user' ? (
					<div className="author-info d-md-flex align-items-center">
						<div className="d-flex align-items-center">
							{loadingUser ? (
								<figure className="user-avatar">
									<div className="cwgb-avatar-placeholder">
										{__('Loading...', 'codeweber-gutenberg-blocks')}
									</div>
								</figure>
							) : userData ? (
								<figure className="user-avatar">
									{userData.avatar_urls && userData.avatar_urls[96] ? (
										<img
											className="rounded-circle"
											src={userData.avatar_urls[96]}
											alt={userData.name || ''}
										/>
									) : (
										<span className={getAvatarClasses()}>
											<span>{getInitials(userData.name)}</span>
										</span>
									)}
								</figure>
							) : (
								<figure className="user-avatar">
									<div className="cwgb-avatar-placeholder">
										{__('Select a user', 'codeweber-gutenberg-blocks')}
									</div>
								</figure>
							)}
							{userData && (
								<div>
									<h6>
										<a href={userData.link || '#'} className="link-dark">
											{userData.name || __('Name', 'codeweber-gutenberg-blocks')}
										</a>
									</h6>
									{userData.meta?.user_position && (
										<span className="post-meta fs-15">
											{userData.meta.user_position}
										</span>
									)}
								</div>
							)}
						</div>
					</div>
				) : (
					<div className={showName ? 'd-flex align-items-center' : ''}>
						{/* Avatar */}
						{imageUrl ? (
							<img
								className={getAvatarClasses()}
								src={imageUrl}
								alt={imageAlt || ''}
								style={showName ? { marginRight: '12px' } : {}}
							/>
						) : (
							<span className={getAvatarClasses()} style={showName ? { marginRight: '12px' } : {}}>
								<span>{getInitials(name)}</span>
							</span>
						)}

						{/* Additional Data (Name & Position) */}
						{showName && (
							<div>
								{nameLink ? (
									<div className="h6 mb-0">
										<a href={nameLink} className="link-dark">
											{name || __('Name', 'codeweber-gutenberg-blocks')}
										</a>
									</div>
								) : (
									name && (
										<div className="h6 mb-0">
											{name}
										</div>
									)
								)}
								{position && (
									<span className="post-meta fs-15 d-block">
										{position}
									</span>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Edit;






