/**
 * Offices Query Control - Settings for offices CPT query
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	SelectControl,
	RangeControl,
	BaseControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export const OfficesQueryControl = ({ attributes, setAttributes }) => {
	const {
		officesQuery = {
			postsPerPage: -1,
			orderBy: 'title',
			order: 'asc',
			selectedCities: [],
			selectedCategories: [],
		},
	} = attributes;

	const [cities, setCities] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Загружаем список городов и категорий
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Загружаем офисы для получения уникальных городов
				const offices = await apiFetch({
					path: '/wp/v2/offices?per_page=100',
				});

				const uniqueCities = new Set();
				offices.forEach((office) => {
					const city = office.meta?._office_city;
					if (city) {
						uniqueCities.add(city);
					}
				});

				setCities(Array.from(uniqueCities).sort());

				// Загружаем категории офисов (если есть таксономия)
				try {
					const cats = await apiFetch({
						path: '/wp/v2/office_category?per_page=100',
					});
					setCategories(
						cats.map((cat) => ({
							label: cat.name,
							value: cat.id.toString(),
						}))
					);
				} catch (e) {
					// Таксономия может не существовать
					setCategories([]);
				}

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching offices data:', error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const updateQuery = (key, value) => {
		setAttributes({
			officesQuery: {
				...officesQuery,
				[key]: value,
			},
		});
	};

	const orderByOptions = [
		{ label: __('Title', 'codeweber-gutenberg-blocks'), value: 'title' },
		{ label: __('Date', 'codeweber-gutenberg-blocks'), value: 'date' },
		{
			label: __('Menu Order', 'codeweber-gutenberg-blocks'),
			value: 'menu_order',
		},
	];

	const orderOptions = [
		{ label: __('Ascending', 'codeweber-gutenberg-blocks'), value: 'asc' },
		{
			label: __('Descending', 'codeweber-gutenberg-blocks'),
			value: 'desc',
		},
	];

	const cityOptions = cities.map((city) => ({
		label: city,
		value: city,
	}));

	return (
		<VStack spacing={4}>
			<RangeControl
				label={__('Posts Per Page', 'codeweber-gutenberg-blocks')}
				value={
					officesQuery.postsPerPage === -1
						? 0
						: officesQuery.postsPerPage
				}
				onChange={(value) =>
					updateQuery('postsPerPage', value === 0 ? -1 : value)
				}
				min={0}
				max={100}
				step={1}
				help={
					officesQuery.postsPerPage === -1
						? __('Show all offices', 'codeweber-gutenberg-blocks')
						: __(
								'Limit number of offices',
								'codeweber-gutenberg-blocks'
							)
				}
			/>

			<SelectControl
				label={__('Order By', 'codeweber-gutenberg-blocks')}
				value={officesQuery.orderBy || 'title'}
				options={orderByOptions}
				onChange={(value) => updateQuery('orderBy', value)}
			/>

			<SelectControl
				label={__('Order', 'codeweber-gutenberg-blocks')}
				value={officesQuery.order || 'asc'}
				options={orderOptions}
				onChange={(value) => updateQuery('order', value)}
			/>

			{!isLoading && cities.length > 0 && (
				<BaseControl
					label={__('Filter by Cities', 'codeweber-gutenberg-blocks')}
				>
					<select
						multiple
						value={officesQuery.selectedCities || []}
						onChange={(e) => {
							const selected = Array.from(
								e.target.selectedOptions,
								(option) => option.value
							);
							updateQuery('selectedCities', selected);
						}}
						style={{ width: '100%', minHeight: '100px' }}
					>
						{cityOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<p
						style={{
							fontSize: '12px',
							color: '#666',
							marginTop: '4px',
						}}
					>
						{__(
							'Hold Ctrl/Cmd to select multiple cities',
							'codeweber-gutenberg-blocks'
						)}
					</p>
				</BaseControl>
			)}

			{!isLoading && categories.length > 0 && (
				<BaseControl
					label={__(
						'Filter by Categories',
						'codeweber-gutenberg-blocks'
					)}
				>
					<select
						multiple
						value={officesQuery.selectedCategories || []}
						onChange={(e) => {
							const selected = Array.from(
								e.target.selectedOptions,
								(option) => option.value
							);
							updateQuery(
								'selectedCategories',
								selected.map((id) => parseInt(id))
							);
						}}
						style={{ width: '100%', minHeight: '100px' }}
					>
						{categories.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<p
						style={{
							fontSize: '12px',
							color: '#666',
							marginTop: '4px',
						}}
					>
						{__(
							'Hold Ctrl/Cmd to select multiple categories',
							'codeweber-gutenberg-blocks'
						)}
					</p>
				</BaseControl>
			)}
		</VStack>
	);
};



