import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const CTA5 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundGradient,
		sectionClass,
		containerClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-soft-primary'];

		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		if (sectionClass) {
			classes.push(sectionClass);
		}

		return classes.filter(Boolean).join(' ');
	};

	if (isEditor) {
		return (
			<div className={getSectionClasses()}>
				<InnerBlocks
					templateLock={false}
				/>
			</div>
		);
	}

	return (
		<section className={getSectionClasses()}>
			<div className={`container py-14 py-md-16 ${containerClass || ''}`}>
				<InnerBlocks.Content />
			</div>
			{/* /.container */}
		</section>
	);
};

