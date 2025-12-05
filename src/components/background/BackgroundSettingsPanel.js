import { useMemo } from '@wordpress/element';
import { Button, ButtonGroup, SelectControl, ComboboxControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import { colors } from '../../utilities/colors';
import { gradientcolors } from '../../utilities/gradient_colors';
import { ColorTypeControl } from '../colors/ColorTypeControl';
import { ImageSizeControl } from '../image-size';

const BACKGROUND_TYPES = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: 'none' },
	{ label: __('Color', 'codeweber-gutenberg-blocks'), value: 'color' },
	{ label: __('Image', 'codeweber-gutenberg-blocks'), value: 'image' },
	{ label: __('Pattern', 'codeweber-gutenberg-blocks'), value: 'pattern' },
];

const BACKGROUND_SIZE_BUTTONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: __('Auto', 'codeweber-gutenberg-blocks'), value: 'bg-auto' },
	{ label: __('Cover', 'codeweber-gutenberg-blocks'), value: 'bg-cover' },
	{ label: __('Full', 'codeweber-gutenberg-blocks'), value: 'bg-full' },
];

const OVERLAY_OPTIONS = [
	{ label: __('None', 'codeweber-gutenberg-blocks'), value: '' },
	{ label: '30%', value: 'bg-overlay bg-overlay-300' },
	{ label: '40%', value: 'bg-overlay bg-overlay-400' },
	{ label: '50%', value: 'bg-overlay' },
	{ label: '60%', value: 'bg-overlay bg-overlay-600' },
	{ label: '70%', value: 'bg-overlay bg-overlay-700' },
	{ label: '80%', value: 'bg-overlay bg-overlay-800' },
];

export const BackgroundSettingsPanel = ({
	attributes,
	setAttributes,
	allowVideo = false,
	backgroundImageSize,
	renderImagePicker,
	renderPatternPicker,
	imageSizeLabel = '',
	patternSizeLabel = '',
	availableImageSizes = [],
}) => {
	const {
		backgroundType,
		backgroundColor,
		backgroundColorType,
		backgroundGradient,
		backgroundImageId,
		backgroundImageUrl,
		backgroundPatternUrl,
		backgroundSize,
		backgroundOverlay,
	} = attributes;

	const typeOptions = useMemo(() => {
		const base = [...BACKGROUND_TYPES];
		if (allowVideo) {
			base.push({ label: __('Video', 'codeweber-gutenberg-blocks'), value: 'video' });
		}
		return base;
	}, [allowVideo]);

	const setBackgroundType = (type) => {
		setAttributes({ backgroundType: type });
	};

	const handleImageSelect = (media) => {
		setAttributes({
			backgroundImageId: media?.id || 0,
			backgroundImageUrl: media?.url || '',
		});
	};

	const handlePatternSelect = (media) => {
		setAttributes({
			backgroundPatternUrl: media?.url || '',
		});
	};

	const showOverlayControl =
		backgroundType === 'image' || (allowVideo && backgroundType === 'video');
const overlayControl = showOverlayControl ? (
	<>
		<div className="component-sidebar-title">
			<label>{__('Background Overlay', 'codeweber-gutenberg-blocks')}</label>
		</div>
		<div className="button-group-sidebar_33 mb-3">
			{OVERLAY_OPTIONS.map((option) => (
				<Button
					key={option.value}
					isPrimary={backgroundOverlay === option.value}
					onClick={() => setAttributes({ backgroundOverlay: option.value })}
				>
					{option.label}
				</Button>
			))}
		</div>
	</>
) : null;

	const sizeButtons = (
		<div className="button-group-sidebar_33">
			{BACKGROUND_SIZE_BUTTONS.map((option) => (
				<Button
					key={option.value}
					isPrimary={backgroundSize === option.value}
					onClick={() => setAttributes({ backgroundSize: option.value })}
				>
					{option.label}
				</Button>
			))}
		</div>
	);

const renderDefaultMediaPicker = ({
	label,
	url,
	value,
	onSelect,
	onRemove,
	placeholderIcon,
	placeholderLabel,
	sizeLabel = '',
	selectLabel,
	selectValue,
	selectOnChange,
	availableSizes = [],
}) => (
	<div className="mb-3">
		<div className="component-sidebar-title">
			<label>{label}</label>
		</div>
		<MediaUploadCheck>
			<MediaUpload
				onSelect={onSelect}
				allowedTypes={['image']}
				value={value}
				render={({ open }) => (
					<>
						{!url && (
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
										{placeholderIcon}
									</div>
									<div style={{ fontSize: '12px', fontWeight: '500' }}>
										{placeholderLabel}
									</div>
								</div>
							</div>
						)}
						{url && (
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
									src={url}
									alt={label}
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
										onRemove();
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
								{/* Size availability badge */}
								{selectValue && availableSizes.length > 0 && (() => {
									const isAvailable = availableSizes.includes(selectValue);
									return (
										<div
											style={{
												position: 'absolute',
												top: '6px',
												left: '6px',
												padding: '4px 8px',
												backgroundColor: isAvailable
													? 'rgba(40, 167, 69, 0.9)' 
													: 'rgba(255, 193, 7, 0.9)',
												color: '#fff',
												borderRadius: '3px',
												fontSize: '10px',
												fontWeight: '600',
												display: 'flex',
												alignItems: 'center',
												gap: '4px',
											}}
										>
											{isAvailable ? (
												<>
													<span>✓</span>
													<span>{__('Available', 'codeweber-gutenberg-blocks')}</span>
												</>
											) : (
												<>
													<span>⚠</span>
													<span>{__('Not Available', 'codeweber-gutenberg-blocks')}</span>
												</>
											)}
										</div>
									);
								})()}
								{sizeLabel && (
									<div
										style={{
											position: 'absolute',
											bottom: '6px',
											right: '6px',
											padding: '2px 6px',
											backgroundColor: 'rgba(0, 0, 0, 0.7)',
											color: '#fff',
											borderRadius: '3px',
											fontSize: '10px',
										}}
									>
										{sizeLabel}
									</div>
								)}
							</div>
						)}
					</>
				)}
			/>
		</MediaUploadCheck>
		{selectLabel && selectOnChange && (
			<ImageSizeControl
				label={selectLabel}
				value={selectValue || 'full'}
				onChange={(value) => selectOnChange?.(value)}
				availableSizes={availableSizes}
			/>
		)}
	</div>
);

	const imagePickerProps = {
		label: __('Background Image', 'codeweber-gutenberg-blocks'),
		url: backgroundImageUrl,
		value: backgroundImageId,
		onSelect: handleImageSelect,
		onRemove: () => setAttributes({ backgroundImageId: 0, backgroundImageUrl: '' }),
		placeholderIcon: '📷',
		placeholderLabel: __('Select Image', 'codeweber-gutenberg-blocks'),
		sizeLabel: imageSizeLabel,
		selectLabel: __('Image Size', 'codeweber-gutenberg-blocks'),
		selectValue: backgroundImageSize,
		selectOnChange: (value) => setAttributes({ backgroundImageSize: value }),
		availableSizes: availableImageSizes,
	};

	const patternPickerProps = {
		label: __('Pattern Image', 'codeweber-gutenberg-blocks'),
		url: backgroundPatternUrl,
		onSelect: handlePatternSelect,
		onRemove: () => setAttributes({ backgroundPatternUrl: '' }),
		placeholderIcon: '🎨',
		placeholderLabel: __('Select Pattern', 'codeweber-gutenberg-blocks'),
		sizeLabel: patternSizeLabel,
		selectLabel: __('Pattern Size', 'codeweber-gutenberg-blocks'),
		selectValue: backgroundImageSize,
		selectOnChange: (value) => setAttributes({ backgroundImageSize: value }),
	};

	const defaultImagePicker = renderDefaultMediaPicker(imagePickerProps);
	const defaultPatternPicker = renderDefaultMediaPicker(patternPickerProps);

	return (
		<>
			<div className="component-sidebar-title">
				<label>{__('Background Type', 'codeweber-gutenberg-blocks')}</label>
			</div>
			<ButtonGroup>
				{typeOptions.map((option) => (
					<Button
						key={option.value}
						isPrimary={backgroundType === option.value}
						onClick={() => setBackgroundType(option.value)}
					>
						{option.label}
					</Button>
				))}
			</ButtonGroup>

			{backgroundType === 'color' && (
				<>
					<ColorTypeControl
						label={__('Background Color Type', 'codeweber-gutenberg-blocks')}
						value={backgroundColorType}
						onChange={(value) => setAttributes({ backgroundColorType: value })}
					/>
					{backgroundColorType === 'gradient' ? (
						<ComboboxControl
							label={__('Background Gradient', 'codeweber-gutenberg-blocks')}
							value={backgroundGradient}
							options={gradientcolors}
							onChange={(value) => setAttributes({ backgroundGradient: value })}
						/>
					) : (
						<ComboboxControl
							label={__('Background Color', 'codeweber-gutenberg-blocks')}
							value={backgroundColor}
							options={colors}
							onChange={(value) => setAttributes({ backgroundColor: value })}
						/>
					)}
				</>
			)}

			{backgroundType === 'image' && (
				<>
					{renderImagePicker ? renderImagePicker(imagePickerProps) : defaultImagePicker}
					{sizeButtons}
					{overlayControl}
				</>
			)}

			{backgroundType === 'pattern' && (
				<>
					{renderPatternPicker ? renderPatternPicker(patternPickerProps) : defaultPatternPicker}
					{sizeButtons}
					{overlayControl}
				</>
			)}
		</>
	);
};

export default BackgroundSettingsPanel;


