/**
 * Marker Repeater Control - Manage custom markers
 *
 * @package CodeWeber Gutenberg Blocks
 */

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

const MarkerEditor = ({ marker, onSave, onCancel }) => {
	const [editedMarker, setEditedMarker] = useState({
		id: marker?.id || `marker-${Date.now()}`,
		coords: marker?.coords || { lat: 55.76, lng: 37.64 },
		title: marker?.title || '',
		address: marker?.address || '',
		phone: marker?.phone || '',
		workingHours: marker?.workingHours || '',
		city: marker?.city || '',
		category: marker?.category || '',
		link: marker?.link || '',
		description: marker?.description || '',
	});

	const mapContainerRef = useRef(null);
	const mapInstanceRef = useRef(null);
	const placemarkRef = useRef(null);
	const initDoneRef = useRef(false);

	useEffect(() => {
		const el = mapContainerRef.current;
		if (!el || typeof window === 'undefined' || typeof window.ymaps === 'undefined') {
			return;
		}
		// Очищаем контейнер (защита от двойной инициализации в React Strict Mode)
		el.innerHTML = '';
		initDoneRef.current = false;
		window.ymaps.ready(() => {
			if (!el.isConnected || initDoneRef.current) return;
			initDoneRef.current = true;
			const lat = parseFloat(editedMarker.coords?.lat) || 55.76;
			const lng = parseFloat(editedMarker.coords?.lng) || 37.64;
			const coords = [lat, lng];
			// Передаём DOM-элемент, чтобы карта использовала наш контейнер и не дублировалась
			const map = new window.ymaps.Map(el, {
				center: coords,
				zoom: 14,
				controls: ['zoomControl', 'searchControl'],
			});
			mapInstanceRef.current = map;
			const placemark = new window.ymaps.Placemark(coords, {}, { draggable: true });
			placemarkRef.current = placemark;
			map.geoObjects.add(placemark);

			function updateFromCoords(newCoords, addressText = null) {
				setEditedMarker((prev) => ({
					...prev,
					coords: { lat: newCoords[0], lng: newCoords[1] },
					...(addressText != null ? { address: addressText } : {}),
				}));
			}

			placemark.events.add('dragend', function () {
				const newCoords = placemark.geometry.getCoordinates();
				updateFromCoords(newCoords);
				window.ymaps.geocode(newCoords).then(function (res) {
					const first = res.geoObjects.get(0);
					if (first) {
						setEditedMarker((prev) => ({ ...prev, address: first.getAddressLine() }));
					}
				});
			});

			map.events.add('click', function (e) {
				const newCoords = e.get('coords');
				placemark.geometry.setCoordinates(newCoords);
				updateFromCoords(newCoords);
				window.ymaps.geocode(newCoords).then(function (res) {
					const first = res.geoObjects.get(0);
					if (first) {
						setEditedMarker((prev) => ({ ...prev, address: first.getAddressLine() }));
					}
				});
			});

			const searchControl = map.controls.get('searchControl');
			if (searchControl && searchControl.events) {
				searchControl.events.add('resultselect', function (e) {
					const results = searchControl.getResultsArray();
					const idx = e.get('index');
					const item = results && results[idx];
					if (item) {
						const newCoords = item.geometry.getCoordinates();
						placemark.geometry.setCoordinates(newCoords);
						map.setCenter(newCoords, 16);
						const name = item.properties.get('name');
						updateFromCoords(newCoords, name || '');
					}
				});
			}
		});
		return () => {
			initDoneRef.current = false;
			if (mapInstanceRef.current && typeof mapInstanceRef.current.destroy === 'function') {
				mapInstanceRef.current.destroy();
			}
			mapInstanceRef.current = null;
			placemarkRef.current = null;
			if (el && el.parentNode) {
				el.innerHTML = '';
			}
		};
	}, []);

	// Sync placemark when coords change from CoordinateControl
	useEffect(() => {
		const lat = parseFloat(editedMarker.coords?.lat);
		const lng = parseFloat(editedMarker.coords?.lng);
		if (placemarkRef.current && !isNaN(lat) && !isNaN(lng)) {
			placemarkRef.current.geometry.setCoordinates([lat, lng]);
			if (mapInstanceRef.current) {
				mapInstanceRef.current.setCenter([lat, lng]);
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
				<BaseControl label={__('Select point on the map', 'codeweber-gutenberg-blocks')} __nextHasNoMarginBottom>
					<div
						ref={mapContainerRef}
						className="cwgb-marker-map-container"
						style={{
							width: '100%',
							minHeight: '250px',
							height: '250px',
							backgroundColor: '#e5e5e5',
							borderRadius: '4px',
							marginBottom: '12px',
						}}
					/>
					{typeof window !== 'undefined' && typeof window.ymaps === 'undefined' && (
						<p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
							{__('Yandex Maps will appear here when the theme loads the API in the editor.', 'codeweber-gutenberg-blocks')}
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
				/>

				<TextControl
					label={__('Address', 'codeweber-gutenberg-blocks')}
					value={editedMarker.address}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, address: value })
					}
				/>

				<TextControl
					label={__('Phone', 'codeweber-gutenberg-blocks')}
					value={editedMarker.phone}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, phone: value })
					}
				/>

				<TextControl
					label={__('Working Hours', 'codeweber-gutenberg-blocks')}
					value={editedMarker.workingHours}
					onChange={(value) =>
						setEditedMarker({
							...editedMarker,
							workingHours: value,
						})
					}
				/>

				<TextControl
					label={__('City', 'codeweber-gutenberg-blocks')}
					value={editedMarker.city}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, city: value })
					}
				/>

				<TextControl
					label={__('Category', 'codeweber-gutenberg-blocks')}
					value={editedMarker.category}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, category: value })
					}
				/>

				<TextControl
					label={__('Link', 'codeweber-gutenberg-blocks')}
					value={editedMarker.link}
					onChange={(value) =>
						setEditedMarker({ ...editedMarker, link: value })
					}
					type="url"
				/>

				<BaseControl
					label={__('Description', 'codeweber-gutenberg-blocks')}
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

	const handleAdd = () => {
		setIsAdding(true);
	};

	const handleEdit = (marker, index) => {
		setEditingMarker({ ...marker, _index: index });
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

	const handleSave = (marker) => {
		const newMarkers = [...markers];
		if (editingMarker?._index !== undefined) {
			// Edit existing
			const { _index, ...markerData } = marker;
			newMarkers[editingMarker._index] = markerData;
		} else {
			// Add new
			newMarkers.push(marker);
		}
		onChange(newMarkers);
		setEditingMarker(null);
		setIsAdding(false);
	};

	const handleCancel = () => {
		setEditingMarker(null);
		setIsAdding(false);
	};

	return (
		<>
			<div style={{ marginBottom: '16px' }}>
				<Button
					variant="primary"
					icon={plus}
					onClick={handleAdd}
					style={{ width: '100%' }}
				>
					{__('Add Marker', 'codeweber-gutenberg-blocks')}
				</Button>
			</div>

			{markers.length === 0 ? (
				<p style={{ color: '#666', fontStyle: 'italic' }}>
					{__(
						'No markers added yet. Click "Add Marker" to add one.',
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
							<div style={{ flex: 1 }}>
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
											marginTop: '4px',
										}}
									>
										{marker.address}
									</div>
								)}
							</div>
							<div style={{ display: 'flex', gap: '4px' }}>
								<Button
									variant="secondary"
									size="small"
									onClick={() => handleEdit(marker, index)}
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
					onCancel={handleCancel}
				/>
			)}
		</>
	);
};











