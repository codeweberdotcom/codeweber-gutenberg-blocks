import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { CheckboxControl, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export const TaxonomyFilterControl = ({ postType, selectedTaxonomies = {}, onChange }) => {
	const [taxonomies, setTaxonomies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Загружаем таксономии при изменении типа записи
	useEffect(() => {
		if (!postType) {
			setTaxonomies([]);
			return;
		}

		const fetchTaxonomies = async () => {
			setIsLoading(true);
			try {
				const data = await apiFetch({
					path: `/codeweber-gutenberg-blocks/v1/taxonomies/${postType}`,
				});

				setTaxonomies(data || []);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching taxonomies:', error);
				setTaxonomies([]);
				setIsLoading(false);
			}
		};

		fetchTaxonomies();
	}, [postType]);

	// Обработчик изменения выбора термина
	const handleTermChange = (taxonomySlug, termId, checked) => {
		const newSelectedTaxonomies = { ...selectedTaxonomies };

		if (!newSelectedTaxonomies[taxonomySlug]) {
			newSelectedTaxonomies[taxonomySlug] = [];
		}

		if (checked) {
			// Добавляем термин, если его еще нет
			if (!newSelectedTaxonomies[taxonomySlug].includes(termId)) {
				newSelectedTaxonomies[taxonomySlug] = [
					...newSelectedTaxonomies[taxonomySlug],
					termId,
				];
			}
		} else {
			// Удаляем термин
			newSelectedTaxonomies[taxonomySlug] = newSelectedTaxonomies[taxonomySlug].filter(
				(id) => id !== termId
			);

			// Удаляем пустые таксономии
			if (newSelectedTaxonomies[taxonomySlug].length === 0) {
				delete newSelectedTaxonomies[taxonomySlug];
			}
		}

		onChange(newSelectedTaxonomies);
	};

	if (isLoading) {
		return (
			<div style={{ marginTop: '16px' }}>
				<p style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600 }}>
					{__('Filter by Taxonomies', 'codeweber-gutenberg-blocks')}
				</p>
				<Spinner />
			</div>
		);
	}

	if (taxonomies.length === 0) {
		return null;
	}

	return (
		<div style={{ marginTop: '16px' }}>
			<p style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600 }}>
				{__('Filter by Taxonomies', 'codeweber-gutenberg-blocks')}
			</p>
			{taxonomies.map((taxonomy) => {
				const selectedTerms = selectedTaxonomies[taxonomy.slug] || [];

				return (
					<div key={taxonomy.slug} style={{ marginBottom: '0' }}>
						<p style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 500, color: '#1e1e1e' }}>
							{taxonomy.name}
						</p>
						{taxonomy.terms.length === 0 ? (
							<p style={{ color: '#757575', fontStyle: 'italic', fontSize: '12px', margin: 0 }}>
								{__('No terms available.', 'codeweber-gutenberg-blocks')}
							</p>
						) : (
							<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
								{taxonomy.terms.map((term) => (
									<CheckboxControl
										key={term.id}
										label={`${term.name} (${term.count})`}
										checked={selectedTerms.includes(term.id)}
										onChange={(checked) => handleTermChange(taxonomy.slug, term.id, checked)}
									/>
								))}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
