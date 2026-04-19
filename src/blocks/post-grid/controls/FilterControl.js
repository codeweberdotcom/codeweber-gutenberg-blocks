import { __ } from '@wordpress/i18n';
import {
	ComboboxControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Notice,
	Spinner,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { ColorTypeControl } from '../../../components/colors/ColorTypeControl';
import { colors } from '../../../utilities/colors';

export const FilterControl = ({ attributes, setAttributes }) => {
	const {
		postType = 'post',
		enableFilter,
		filterTaxonomy,
		filterStyle,
		filterActiveColor,
		filterActiveColorType,
		filterTextReset,
		filterAllLabel,
		selectedTaxonomies,
	} = attributes;

	const [taxonomies, setTaxonomies] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		apiFetch({
			path: addQueryArgs(
				`/codeweber-gutenberg-blocks/v1/taxonomies/${postType}`
			),
		})
			.then((data) => {
				if (cancelled) return;
				setTaxonomies(Array.isArray(data) ? data : []);
				setIsLoading(false);
			})
			.catch(() => {
				if (cancelled) return;
				setTaxonomies([]);
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [postType]);

	const taxonomyOptions = [
		{
			value: '',
			label: __('— Select taxonomy —', 'codeweber-gutenberg-blocks'),
		},
		...taxonomies.map((tax) => ({
			value: tax.slug,
			label: tax.name || tax.slug,
		})),
	];

	const hasInitialFilter =
		selectedTaxonomies &&
		Object.keys(selectedTaxonomies).some(
			(k) =>
				Array.isArray(selectedTaxonomies[k]) &&
				selectedTaxonomies[k].length > 0
		);

	return (
		<>
			<ToggleControl
				label={__('Enable Filter Bar', 'codeweber-gutenberg-blocks')}
				checked={!!enableFilter}
				onChange={(value) => setAttributes({ enableFilter: value })}
				help={__(
					'Show an interactive filter above the grid on the frontend.',
					'codeweber-gutenberg-blocks'
				)}
			/>

			{enableFilter && (
				<>
					{isLoading ? (
						<div style={{ padding: '12px 0' }}>
							<Spinner />
						</div>
					) : taxonomies.length === 0 ? (
						<Notice status="warning" isDismissible={false}>
							{__(
								'No taxonomies registered for this post type.',
								'codeweber-gutenberg-blocks'
							)}
						</Notice>
					) : (
						<SelectControl
							label={__(
								'Filter Taxonomy',
								'codeweber-gutenberg-blocks'
							)}
							value={filterTaxonomy || ''}
							options={taxonomyOptions}
							onChange={(value) =>
								setAttributes({ filterTaxonomy: value })
							}
							help={__(
								'Visitors will see buttons for each term of this taxonomy.',
								'codeweber-gutenberg-blocks'
							)}
						/>
					)}

					<SelectControl
						label={__('Filter Style', 'codeweber-gutenberg-blocks')}
						value={filterStyle || 'default'}
						options={[
							{
								value: 'default',
								label: __(
									'Default (projects-style links)',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'btn-xs',
								label: __(
									'Button XS',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'btn-sm',
								label: __(
									'Button SM',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'badge',
								label: __(
									'Badge',
									'codeweber-gutenberg-blocks'
								),
							},
						]}
						onChange={(value) =>
							setAttributes({ filterStyle: value })
						}
					/>

					<ColorTypeControl
						label={__(
							'Active Color Type',
							'codeweber-gutenberg-blocks'
						)}
						value={filterActiveColorType || 'solid'}
						onChange={(value) =>
							setAttributes({ filterActiveColorType: value })
						}
						options={[
							{
								value: 'solid',
								label: __(
									'Solid',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'soft',
								label: __(
									'Soft',
									'codeweber-gutenberg-blocks'
								),
							},
							{
								value: 'pale',
								label: __(
									'Pale',
									'codeweber-gutenberg-blocks'
								),
							},
						]}
					/>

					<ComboboxControl
						label={__('Active Color', 'codeweber-gutenberg-blocks')}
						value={filterActiveColor || ''}
						options={colors}
						onChange={(value) =>
							setAttributes({ filterActiveColor: value })
						}
						help={__(
							'Leave empty to use the theme default.',
							'codeweber-gutenberg-blocks'
						)}
					/>

					<ToggleControl
						label={__(
							'Inherit Text Color (text-reset)',
							'codeweber-gutenberg-blocks'
						)}
						checked={!!filterTextReset}
						onChange={(value) =>
							setAttributes({ filterTextReset: value })
						}
						help={__(
							'Adds Bootstrap .text-reset to the filter container so text inherits the surrounding section color (useful on dark or inverse backgrounds).',
							'codeweber-gutenberg-blocks'
						)}
					/>

					<TextControl
						label={__(
							'"All" Button Label',
							'codeweber-gutenberg-blocks'
						)}
						value={filterAllLabel || 'All'}
						onChange={(value) =>
							setAttributes({ filterAllLabel: value })
						}
						placeholder="All"
					/>

					{hasInitialFilter && (
						<Notice status="info" isDismissible={false}>
							{__(
								'Initial taxonomy restrictions (set in the Main tab) limit the base query. The filter bar only re-queries within that pool.',
								'codeweber-gutenberg-blocks'
							)}
						</Notice>
					)}
				</>
			)}
		</>
	);
};
