/**
 * Avatar Block - Sidebar Settings
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	PanelBody,
	ButtonGroup,
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
	Spinner,
	TabPanel,
	Icon,
	ComboboxControl,
} from '@wordpress/components';
import {
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { image, people, cog } from '@wordpress/icons';
import { colors } from '../../utilities/colors';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { SpacingControl } from '../../components/spacing/SpacingControl';

export const AvatarSidebar = ({ attributes, setAttributes }) => {
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
		blockId,
		blockClass,
		blockData,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
	} = attributes;

	// Users list state
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	// Fetch users when avatarType is 'user'
	useEffect(() => {
		if (avatarType === 'user') {
			setLoadingUsers(true);
			apiFetch({ path: '/wp/v2/users?per_page=100&context=edit' })
				.then((fetchedUsers) => {
					setUsers(fetchedUsers || []);
					setLoadingUsers(false);
				})
				.catch(() => {
					setUsers([]);
					setLoadingUsers(false);
				});
		}
	}, [avatarType]);


	// Size options (w-1 to w-25)
	const sizeOptions = [];
	for (let i = 1; i <= 25; i++) {
		sizeOptions.push({
			label: `${i}`,
			value: `${i}`,
		});
	}

	const handleImageSelect = (media) => {
		setAttributes({
			imageId: media.id || 0,
			imageUrl: media.url || '',
			imageAlt: media.alt || '',
		});
	};

	const handleImageRemove = () => {
		setAttributes({
			imageId: 0,
			imageUrl: '',
			imageAlt: '',
		});
	};

	// Tab icon with native title tooltip
	const TabIcon = ({ icon, label }) => (
		<span 
			title={label}
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Icon icon={icon} size={20} />
		</span>
	);

	const tabs = [
		{ name: 'avatar', title: <TabIcon icon={people} label={__('Avatar', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'data', title: <TabIcon icon={image} label={__('Additional Data', 'codeweber-gutenberg-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
	];

	return (
		<TabPanel
			tabs={tabs}
		>
			{(tab) => (
				<>
					{tab.name === 'avatar' && (
						<>
							{/* Avatar Type Selection */}
							<PanelBody
								title={__('Avatar Type', 'codeweber-gutenberg-blocks')}
								className="custom-panel-body"
								initialOpen={true}
							>
								<ButtonGroup>
									{[
										{ label: __('Custom', 'codeweber-gutenberg-blocks'), value: 'custom' },
										{ label: __('User', 'codeweber-gutenberg-blocks'), value: 'user' },
									].map((typeOption) => (
										<Button
											key={typeOption.value}
											isPrimary={avatarType === typeOption.value}
											onClick={() => setAttributes({ avatarType: typeOption.value })}
										>
											{typeOption.label}
										</Button>
									))}
								</ButtonGroup>
							</PanelBody>

							{/* Custom Settings */}
							{avatarType === 'custom' && (
								<PanelBody
									title={__('Custom Avatar Settings', 'codeweber-gutenberg-blocks')}
									className="custom-panel-body"
									initialOpen={true}
								>
									{/* Image Upload */}
									<div style={{ marginTop: '16px' }}>
										<div className="component-sidebar-title">
											<label>{__('Avatar Image', 'codeweber-gutenberg-blocks')}</label>
										</div>
										<MediaUploadCheck>
											<MediaUpload
												onSelect={handleImageSelect}
												allowedTypes={['image']}
												value={imageId}
												render={({ open }) => (
													<>
														{!imageUrl && (
															<div
																className="image-placeholder"
																onClick={open}
																style={{
																	width: '100%',
																	height: '100px',
																	backgroundColor: '#f0f0f0',
																	border: '2px dashed #ccc',
																	borderRadius: '4px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	cursor: 'pointer',
																	transition: 'all 0.2s ease',
																	marginBottom: '15px',
																}}
															>
																<div style={{ textAlign: 'center', color: '#666' }}>
																	<div style={{ fontSize: '20px', marginBottom: '4px' }}>
																		📷
																	</div>
																	<div style={{ fontSize: '12px', fontWeight: '500' }}>
																		{__('Select Image', 'codeweber-gutenberg-blocks')}
																	</div>
																</div>
															</div>
														)}
														{imageUrl && (
															<div
																onClick={(event) => {
																	event.preventDefault();
																	open();
																}}
																style={{
																	marginTop: '12px',
																	marginBottom: '12px',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	minHeight: '140px',
																	backgroundColor: '#fff',
																	border: '1px solid #ddd',
																	borderRadius: '4px',
																	overflow: 'hidden',
																	cursor: 'pointer',
																	position: 'relative',
																}}
															>
																<img
																	src={imageUrl}
																	alt={imageAlt || __('Avatar Image', 'codeweber-gutenberg-blocks')}
																	style={{
																		width: '100%',
																		height: 'auto',
																		display: 'block',
																	}}
																/>
																<Button
																	isLink
																	onClick={(event) => {
																		event.stopPropagation();
																		handleImageRemove();
																	}}
																	style={{
																		position: 'absolute',
																		top: '6px',
																		right: '6px',
																		backgroundColor: 'rgba(220, 53, 69, 0.8)',
																		borderRadius: '50%',
																		width: '20px',
																		height: '20px',
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'center',
																		color: '#fff',
																		textDecoration: 'none',
																	}}
																>
																	<i className="uil uil-times" style={{ margin: 0, fontSize: '12px' }}></i>
																</Button>
															</div>
														)}
													</>
												)}
											/>
										</MediaUploadCheck>
									</div>

									{/* Background Color (for letters fallback) */}
									<div style={{ marginTop: '16px' }}>
										<div className="component-sidebar-title">
											<label>{__('Background Color', 'codeweber-gutenberg-blocks')}</label>
										</div>
										<ComboboxControl
											value={bgColor}
											options={colors}
											onChange={(value) => setAttributes({ bgColor: value })}
											help={__('Used when image is not uploaded', 'codeweber-gutenberg-blocks')}
										/>
									</div>

									{/* Text Color (for letters fallback) */}
									<div style={{ marginTop: '16px' }}>
										<div className="component-sidebar-title">
											<label>{__('Text Color', 'codeweber-gutenberg-blocks')}</label>
										</div>
										<ComboboxControl
											value={textColor}
											options={colors}
											onChange={(value) => setAttributes({ textColor: value })}
											help={__('Used when image is not uploaded', 'codeweber-gutenberg-blocks')}
										/>
									</div>
								</PanelBody>
							)}

							{/* User Settings */}
							{avatarType === 'user' && (
								<PanelBody
									title={__('User Avatar Settings', 'codeweber-gutenberg-blocks')}
									className="custom-panel-body"
									initialOpen={true}
								>
									<div style={{ marginTop: '16px' }}>
										{loadingUsers ? (
											<div>
												<Spinner />
												<span style={{ marginLeft: '8px' }}>
													{__('Loading users...', 'codeweber-gutenberg-blocks')}
												</span>
											</div>
										) : (
											<SelectControl
												label={__('Select User', 'codeweber-gutenberg-blocks')}
												value={userId || 0}
												options={[
													{ label: __('— Select User —', 'codeweber-gutenberg-blocks'), value: 0 },
													...users.map((user) => ({
														label: `${user.name} (${user.slug})`,
														value: user.id,
													})),
												]}
												onChange={(value) => {
													const selectedUserId = parseInt(value, 10);
													setAttributes({ userId: selectedUserId || 0 });
												}}
											/>
										)}
									</div>
								</PanelBody>
							)}

							{/* Size */}
							<PanelBody
								title={__('Size Settings', 'codeweber-gutenberg-blocks')}
								className="custom-panel-body"
								initialOpen={false}
							>
								<div style={{ marginTop: '16px' }}>
									<SelectControl
										label={__('Size', 'codeweber-gutenberg-blocks')}
										value={size}
										options={sizeOptions}
										onChange={(value) => setAttributes({ size: value })}
										help={__('Size from 1 to 25 (w-1 to w-25, h-1 to h-25)', 'codeweber-gutenberg-blocks')}
									/>
								</div>
							</PanelBody>
						</>
					)}

					{tab.name === 'data' && (
						<>
							<PanelBody
								title={__('Additional Data', 'codeweber-gutenberg-blocks')}
								className="custom-panel-body"
								initialOpen={true}
							>
								{/* Show Additional Data Toggle */}
								<div style={{ marginBottom: '16px' }}>
									<ToggleControl
										label={__('Show Additional Data', 'codeweber-gutenberg-blocks')}
										checked={showName}
										onChange={(value) => setAttributes({ showName: value })}
										help={__('Enable to show name and position', 'codeweber-gutenberg-blocks')}
									/>
								</div>

								{/* Name & Position Fields */}
								{showName && (
									<>
										{/* Name */}
										<div style={{ marginTop: '16px' }}>
											<TextControl
												label={__('Name', 'codeweber-gutenberg-blocks')}
												value={name}
												onChange={(value) => setAttributes({ name: value })}
												placeholder={__('Enter name', 'codeweber-gutenberg-blocks')}
											/>
										</div>

										{/* Position */}
										<div style={{ marginTop: '16px' }}>
											<TextControl
												label={__('Position', 'codeweber-gutenberg-blocks')}
												value={position}
												onChange={(value) => setAttributes({ position: value })}
												placeholder={__('Enter position/job title', 'codeweber-gutenberg-blocks')}
											/>
										</div>

										{/* Name Link */}
										<div style={{ marginTop: '16px' }}>
											<TextControl
												label={__('Name Link (URL)', 'codeweber-gutenberg-blocks')}
												value={nameLink}
												onChange={(value) => setAttributes({ nameLink: value })}
												placeholder={__('Optional: URL for name link', 'codeweber-gutenberg-blocks')}
												help={__('Leave empty if name should not be a link', 'codeweber-gutenberg-blocks')}
											/>
										</div>
									</>
								)}
							</PanelBody>
						</>
					)}

					{tab.name === 'settings' && (
						<>
							<div style={{ padding: '16px' }}>
								<SpacingControl
									spacingType={spacingType}
									spacingXs={spacingXs}
									spacingSm={spacingSm}
									spacingMd={spacingMd}
									spacingLg={spacingLg}
									spacingXl={spacingXl}
									spacingXxl={spacingXxl}
									onChange={(key, value) => setAttributes({ [key]: value })}
								/>
							</div>
							<BlockMetaFields
								attributes={attributes}
								setAttributes={setAttributes}
								blockId={blockId}
								blockIdLabel={__('Avatar ID', 'codeweber-gutenberg-blocks')}
								blockClass={blockClass}
								blockClassLabel={__('Avatar Class', 'codeweber-gutenberg-blocks')}
								blockData={blockData}
								blockDataLabel={__('Avatar Data', 'codeweber-gutenberg-blocks')}
							/>
						</>
					)}
				</>
			)}
		</TabPanel>
	);
};



