/**
 * PostSourceControl
 *
 * Shared data-source picker: posts (queried or hand-picked) and taxonomy terms
 * (queried or hand-picked). Extracted so blocks other than Post Grid can offer
 * the same choices without duplicating the fetching and ordering logic.
 */

import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	Button,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	Spinner,
} from '@wordpress/components';
import { PostTypeTaxonomyControl } from '../post-type-taxonomy/PostTypeTaxonomyControl';

// Ordered list of picked items with remove / move controls.
const PickedList = ({ items, onChange, emptyLabel }) => {
	const move = (index, delta) => {
		const next = [...items];
		const target = index + delta;
		if (target < 0 || target >= next.length) {
			return;
		}
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	};

	if (!items.length) {
		return (
			<p style={{ margin: '8px 0', fontSize: '12px', color: '#757575' }}>
				{emptyLabel}
			</p>
		);
	}

	return (
		<ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
			{items.map((item, index) => (
				<li
					key={`${item.id}-${index}`}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '4px',
						padding: '4px 6px',
						marginBottom: '4px',
						background: '#f0f0f1',
						borderRadius: '3px',
						fontSize: '12px',
					}}
				>
					<span style={{ flex: 1 }}>{item.name || `#${item.id}`}</span>
					<Button
						size="small"
						icon="arrow-up-alt2"
						label={__('Up', 'codeweber-gutenberg-blocks')}
						disabled={index === 0}
						onClick={() => move(index, -1)}
					/>
					<Button
						size="small"
						icon="arrow-down-alt2"
						label={__('Down', 'codeweber-gutenberg-blocks')}
						disabled={index === items.length - 1}
						onClick={() => move(index, 1)}
					/>
					<Button
						size="small"
						icon="no-alt"
						isDestructive
						label={__('Remove', 'codeweber-gutenberg-blocks')}
						onClick={() =>
							onChange(items.filter((entry, i) => i !== index))
						}
					/>
				</li>
			))}
		</ul>
	);
};

// Hand-picked posts of the selected post type.
const ManualPosts = ({ postType, manualItems, setAttributes }) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [candidate, setCandidate] = useState('');

	useEffect(() => {
		if (!postType) {
			setPosts([]);
			return undefined;
		}

		let cancelled = false;
		setLoading(true);

		apiFetch({ path: '/wp/v2/types' })
			.then((types) => {
				const info = (types || {})[postType];
				const restBase =
					info?.rest_base ||
					(postType === 'post' ? 'posts' : postType);
				return apiFetch({
					path: addQueryArgs(`/wp/v2/${restBase}`, {
						per_page: 100,
						_fields: 'id,title',
						orderby: 'title',
						order: 'asc',
						status: 'publish',
					}),
				});
			})
			.then((data) => {
				if (cancelled) {
					return;
				}
				setPosts(Array.isArray(data) ? data : []);
				setLoading(false);
			})
			.catch(() => {
				if (cancelled) {
					return;
				}
				setPosts([]);
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [postType]);

	const add = () => {
		const id = parseInt(candidate, 10);
		if (!id || manualItems.some((item) => item.id === id)) {
			return;
		}
		const found = posts.find((p) => p.id === id);
		setAttributes({
			manualItems: [
				...manualItems,
				{ id, name: found?.title?.rendered || `#${id}` },
			],
		});
		setCandidate('');
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<>
			<SelectControl
				label={__('Add post', 'codeweber-gutenberg-blocks')}
				value={candidate}
				options={[
					{
						label: __('— Select —', 'codeweber-gutenberg-blocks'),
						value: '',
					},
					...posts
						.filter(
							(p) => !manualItems.some((item) => item.id === p.id)
						)
						.map((p) => ({
							label: p.title?.rendered || `#${p.id}`,
							value: String(p.id),
						})),
				]}
				onChange={setCandidate}
				__nextHasNoMarginBottom
			/>
			<Button variant="secondary" onClick={add} disabled={!candidate}>
				{__('Add', 'codeweber-gutenberg-blocks')}
			</Button>
			<PickedList
				items={manualItems}
				onChange={(items) => setAttributes({ manualItems: items })}
				emptyLabel={__(
					'Nothing picked yet — the list stays empty.',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};

// Hand-picked terms of the selected taxonomy.
const ManualTerms = ({ taxonomy, manualTermItems, setAttributes }) => {
	const [terms, setTerms] = useState([]);
	const [loading, setLoading] = useState(false);
	const [candidate, setCandidate] = useState('');

	useEffect(() => {
		if (!taxonomy) {
			setTerms([]);
			return undefined;
		}

		let cancelled = false;
		setLoading(true);

		apiFetch({ path: '/wp/v2/taxonomies' })
			.then((taxes) => {
				const info = (taxes || {})[taxonomy];
				const restBase = info?.rest_base || taxonomy;
				return apiFetch({
					path: addQueryArgs(`/wp/v2/${restBase}`, {
						per_page: 100,
						_fields: 'id,name',
						orderby: 'name',
						order: 'asc',
						hide_empty: false,
					}),
				});
			})
			.then((data) => {
				if (cancelled) {
					return;
				}
				setTerms(Array.isArray(data) ? data : []);
				setLoading(false);
			})
			.catch(() => {
				if (cancelled) {
					return;
				}
				setTerms([]);
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [taxonomy]);

	const add = () => {
		const id = parseInt(candidate, 10);
		if (!id || manualTermItems.some((item) => item.id === id)) {
			return;
		}
		const found = terms.find((t) => t.id === id);
		setAttributes({
			manualTermItems: [
				...manualTermItems,
				{ id, taxonomy, name: found?.name || `#${id}` },
			],
		});
		setCandidate('');
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<>
			<SelectControl
				label={__('Add term', 'codeweber-gutenberg-blocks')}
				value={candidate}
				options={[
					{
						label: __('— Select —', 'codeweber-gutenberg-blocks'),
						value: '',
					},
					...terms
						.filter(
							(t) =>
								!manualTermItems.some((item) => item.id === t.id)
						)
						.map((t) => ({ label: t.name, value: String(t.id) })),
				]}
				onChange={setCandidate}
				__nextHasNoMarginBottom
			/>
			<Button variant="secondary" onClick={add} disabled={!candidate}>
				{__('Add', 'codeweber-gutenberg-blocks')}
			</Button>
			<PickedList
				items={manualTermItems}
				onChange={(items) => setAttributes({ manualTermItems: items })}
				emptyLabel={__(
					'Nothing picked yet — the list stays empty.',
					'codeweber-gutenberg-blocks'
				)}
			/>
		</>
	);
};

export const PostSourceControl = ({ attributes, setAttributes }) => {
	const {
		sourceType = 'post',
		postType,
		selectedTaxonomies,
		manualMode = false,
		manualItems = [],
		sourceTaxonomy = '',
		taxonomyHideEmpty = true,
		taxonomyOrderBy = 'name',
		taxonomyOrder = 'asc',
		manualTermMode = false,
		manualTermItems = [],
	} = attributes;

	const [taxonomies, setTaxonomies] = useState([]);

	useEffect(() => {
		apiFetch({ path: '/wp/v2/taxonomies' })
			.then((data) => {
				const list = Object.values(data || {})
					.filter((t) => t.visibility?.show_ui !== false)
					.map((t) => ({ label: t.name, value: t.slug }));
				setTaxonomies(list);
			})
			.catch(() => setTaxonomies([]));
	}, []);

	const isTaxonomy = sourceType === 'taxonomy';

	return (
		<>
			<div className="component-sidebar-title">
				<span>{__('Source', 'codeweber-gutenberg-blocks')}</span>
			</div>
			<ButtonGroup style={{ marginBottom: '16px' }}>
				<Button
					variant={isTaxonomy ? 'secondary' : 'primary'}
					onClick={() => setAttributes({ sourceType: 'post' })}
				>
					{__('Posts', 'codeweber-gutenberg-blocks')}
				</Button>
				<Button
					variant={isTaxonomy ? 'primary' : 'secondary'}
					onClick={() => setAttributes({ sourceType: 'taxonomy' })}
				>
					{__('Taxonomy', 'codeweber-gutenberg-blocks')}
				</Button>
			</ButtonGroup>

			{!isTaxonomy && (
				<>
					<PostTypeTaxonomyControl
						postType={postType || ''}
						selectedTaxonomies={selectedTaxonomies || {}}
						onPostTypeChange={(value) =>
							setAttributes({ postType: value })
						}
						onTaxonomyChange={(value) =>
							setAttributes({ selectedTaxonomies: value })
						}
					/>
					<ToggleControl
						label={__(
							'Pick posts manually',
							'codeweber-gutenberg-blocks'
						)}
						checked={!!manualMode}
						onChange={(value) =>
							setAttributes({ manualMode: value })
						}
						help={__(
							'Choose and order individual posts instead of querying them.',
							'codeweber-gutenberg-blocks'
						)}
					/>
					{manualMode && (
						<ManualPosts
							postType={postType}
							manualItems={manualItems}
							setAttributes={setAttributes}
						/>
					)}
				</>
			)}

			{isTaxonomy && (
				<>
					<SelectControl
						label={__('Taxonomy', 'codeweber-gutenberg-blocks')}
						value={sourceTaxonomy}
						options={[
							{
								label: __(
									'— Select taxonomy —',
									'codeweber-gutenberg-blocks'
								),
								value: '',
							},
							...taxonomies,
						]}
						onChange={(value) =>
							setAttributes({ sourceTaxonomy: value })
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__(
							'Pick terms manually',
							'codeweber-gutenberg-blocks'
						)}
						checked={!!manualTermMode}
						onChange={(value) =>
							setAttributes({ manualTermMode: value })
						}
						help={__(
							'Choose and order individual terms instead of querying them.',
							'codeweber-gutenberg-blocks'
						)}
					/>

					{manualTermMode ? (
						<ManualTerms
							taxonomy={sourceTaxonomy}
							manualTermItems={manualTermItems}
							setAttributes={setAttributes}
						/>
					) : (
						<>
							<ToggleControl
								label={__(
									'Hide empty terms',
									'codeweber-gutenberg-blocks'
								)}
								checked={!!taxonomyHideEmpty}
								onChange={(value) =>
									setAttributes({ taxonomyHideEmpty: value })
								}
							/>
							<SelectControl
								label={__(
									'Order by',
									'codeweber-gutenberg-blocks'
								)}
								value={taxonomyOrderBy}
								options={[
									{
										label: __(
											'Name',
											'codeweber-gutenberg-blocks'
										),
										value: 'name',
									},
									{
										label: __(
											'Count',
											'codeweber-gutenberg-blocks'
										),
										value: 'count',
									},
									{
										label: __(
											'Slug',
											'codeweber-gutenberg-blocks'
										),
										value: 'slug',
									},
								]}
								onChange={(value) =>
									setAttributes({ taxonomyOrderBy: value })
								}
								__nextHasNoMarginBottom
							/>
							<SelectControl
								label={__('Order', 'codeweber-gutenberg-blocks')}
								value={taxonomyOrder}
								options={[
									{
										label: __(
											'Ascending',
											'codeweber-gutenberg-blocks'
										),
										value: 'asc',
									},
									{
										label: __(
											'Descending',
											'codeweber-gutenberg-blocks'
										),
										value: 'desc',
									},
								]}
								onChange={(value) =>
									setAttributes({ taxonomyOrder: value })
								}
								__nextHasNoMarginBottom
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default PostSourceControl;
