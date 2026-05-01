import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from '@wordpress/element';
import {
	Button,
	TextControl,
	Modal,
	BaseControl,
} from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { CoordinateControl } from './CoordinateControl';

const DEFAULT_LAT = 55.76;
const DEFAULT_LNG = 37.64;

const MarkerEditor = ({ marker, onSave, onCancel }) => {
	const [editedMarker, setEditedMarker] = useState({
		id: marker?.id || `osm-marker-${Date.now()}`,
		coords: marker?.coords || { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
		title: marker?.title || '',
		address: marker?.address || '',
		phone: marker?.phone || '',
		description: marker?.description || '',
		link: marker?.link || '',
		color: marker?.color || '#0d6efd',
	});

	const mapContainerRef = useRef(null);
	const mapInstanceRef = useRef(null);
	const markerRef = useRef(null);
	const initDoneRef = useRef(false);

	useEffect(() => {
		const el = mapContainerRef.current;
		if (!el || typeof window === 'undefined' || typeof window.L === 'undefined') {
			return;
		}

		el.innerHTML = '';
		initDoneRef.current = false;

		const lat = parseFloat(editedMarker.coords?.lat) || DEFAULT_LAT;
		const lng = parseFloat(editedMarker.coords?.lng) || DEFAULT_LNG;

		if (initDoneRef.current) return;
		initDoneRef.current = true;

		const map = window.L.map(el, {
			center: [lat, lng],
			zoom: 14,
			scrollWheelZoom: false,
		});

		window.L.tileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 19,
			}
		).addTo(map);

		const leafletMarker = window.L.marker([lat, lng], {
			draggable: true,
		}).addTo(map);

		markerRef.current = leafletMarker;
		mapInstanceRef.current = map;

		leafletMarker.on('dragend', function () {
			const pos = leafletMarker.getLatLng();
			setEditedMarker((prev) => ({
				...prev,
				coords: { lat: pos.lat, lng: pos.lng },
			}));
		});

		map.on('click', function (e) {
			const { lat: newLat, lng: newLng } = e.latlng;
			leafletMarker.setLatLng([newLat, newLng]);
			setEditedMarker((prev) => ({
				...prev,
				coords: { lat: newLat, lng: newLng },
			}));
		});

		return () => {
			initDoneRef.current = false;
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
			}
			mapInstanceRef.current = null;
			markerRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const lat = parseFloat(editedMarker.coords?.lat);
		const lng = parseFloat(editedMarker.coords?.lng);
		if (markerRef.current && !isNaN(lat) && !isNaN(lng)) {
			markerRef.current.setLatLng([lat, lng]);
			if (mapInstanceRef.current) {
				mapInstanceRef.current.setView([lat, lng]);
			}
		}
	}, [editedMarker.coords?.lat, editedMarker.coords?.lng]);

	return (
		<Modal
			title={
				marker
					? __('Edit Marker', 'codeweber-gutenberg-blocks')
					: __('Add Marker', 'codeweber-gutenberg-blocks')
			}
			onRequestClose={onCancel}
			style={{ maxWidth: '600px' }}
		>
			<div style={{ padding: '16px' }}>
				<BaseControl
					label={__('Click on the map to set position', 'codeweber-gutenberg-blocks')}
					__nextHasNoMarginBottom
				>
					<div
						ref={mapContainerRef}
						style={{
							width: '100%',
							height: '250px',
							backgroundColor: '#e5e5e5',
							borderRadius: '4px',
							marginBottom: '12px',
						}}
					/>
					{typeof window !== 'undefined' &&
						typeof window.L === 'undefined' && (
							<p
								style={{
									fontSize: '12px',
									color: '#666',
									marginTop: '4px',
								}}
							>
								{__(
									'Leaflet will appear here when loaded.',
									'codeweber-gutenberg-blocks'
								)}
							</p>
						)}
				</BaseControl>

				<CoordinateControl
					label={__('Coordinates', 'codeweber-gutenberg-blocks')}
					value={editedMarker.coords}
					onChange={(coords) =>
						setEditedMarker({ ...editedMarker, coords })
					}
				/>

				<TextControl
					label={__('Title', 'codeweber-gutenberg-blocks')}
					value={editedMarker.title}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, title: value })
					}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Address', 'codeweber-gutenberg-blocks')}
					value={editedMarker.address}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, address: value })
					}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Phone', 'codeweber-gutenberg-blocks')}
					value={editedMarker.phone}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, phone: value })
					}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Link URL', 'codeweber-gutenberg-blocks')}
					value={editedMarker.link}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, link: value })
					}
					type="url"
					__nextHasNoMarginBottom
				/>

				<BaseControl
					label={__('Description', 'codeweber-gutenberg-blocks')}
					__nextHasNoMarginBottom
				>
					<textarea
						value={editedMarker.description}
						onChange={(e) =>
							setEditedMarker({
								...editedMarker,
								description: e.target.value,
							})
						}
						rows={3}
						style={{ width: '100%' }}
					/>
				</BaseControl>

				<TextControl
					label={__('Marker Color', 'codeweber-gutenberg-blocks')}
					value={editedMarker.color}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, color: value })
					}
					type="color"
					__nextHasNoMarginBottom
				/>

				<div
					style={{
						display: 'flex',
						gap: '8px',
						marginTop: '16px',
						justifyContent: 'flex-end',
					}}
				>
					<Button variant="secondary" onClick={onCancel}>
						{__('Cancel', 'codeweber-gutenberg-blocks')}
					</Button>
					<Button
						variant="primary"
						onClick={() => onSave(editedMarker)}
					>
						{__('Save', 'codeweber-gutenberg-blocks')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export const MarkerRepeaterControl = ({ markers = [], onChange }) => {
	const [editingMarker, setEditingMarker] = useState(null);
	const [isAdding, setIsAdding] = useState(false);

	const handleSave = (marker) => {
		const newMarkers = [...markers];
		if (editingMarker?._index !== undefined) {
			const { _index, ...markerData } = marker;
			newMarkers[editingMarker._index] = markerData;
		} else {
			newMarkers.push(marker);
		}
		onChange(newMarkers);
		setEditingMarker(null);
		setIsAdding(false);
	};

	const handleDelete = (index) => {
		if (
			window.confirm(
				__('Delete this marker?', 'codeweber-gutenberg-blocks')
			)
		) {
			const newMarkers = [...markers];
			newMarkers.splice(index, 1);
			onChange(newMarkers);
		}
	};

	return (
		<>
			<div style={{ marginBottom: '16px' }}>
				<Button
					variant="primary"
					icon={plus}
					onClick={() => setIsAdding(true)}
					style={{ width: '100%' }}
				>
					{__('Add Marker', 'codeweber-gutenberg-blocks')}
				</Button>
			</div>

			{markers.length === 0 ? (
				<p style={{ color: '#666', fontStyle: 'italic' }}>
					{__(
						'No markers yet. Click "Add Marker" to add one.',
						'codeweber-gutenberg-blocks'
					)}
				</p>
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					{markers.map((marker, index) => (
						<div
							key={marker.id || index}
							style={{
								padding: '12px',
								border: '1px solid #ddd',
								borderRadius: '4px',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
								<span
									style={{
										display: 'inline-block',
										width: '12px',
										height: '12px',
										borderRadius: '50%',
										background: marker.color || '#0d6efd',
										flexShrink: 0,
									}}
								/>
								<div>
									<strong>
										{marker.title ||
											__(
												'Untitled Marker',
												'codeweber-gutenberg-blocks'
											)}
									</strong>
									{marker.address && (
										<div
											style={{
												fontSize: '12px',
												color: '#666',
												marginTop: '2px',
											}}
										>
											{marker.address}
										</div>
									)}
								</div>
							</div>
							<div style={{ display: 'flex', gap: '4px' }}>
								<Button
									variant="secondary"
									size="small"
									onClick={() =>
										setEditingMarker({
											...marker,
											_index: index,
										})
									}
								>
									{__('Edit', 'codeweber-gutenberg-blocks')}
								</Button>
								<Button
									variant="secondary"
									size="small"
									icon={trash}
									onClick={() => handleDelete(index)}
									isDestructive
								/>
							</div>
						</div>
					))}
				</div>
			)}

			{(isAdding || editingMarker) && (
				<MarkerEditor
					marker={isAdding ? null : editingMarker}
					onSave={handleSave}
					onCancel={() => {
						setEditingMarker(null);
						setIsAdding(false);
					}}
				/>
			)}
		</>
	);
};
