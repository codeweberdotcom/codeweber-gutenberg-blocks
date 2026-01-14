import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

export const CTA6 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundGradient,
		sectionClass,
		containerClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'gradient-8', 'bg-lines'];

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
			<div
				className={`container py-15 py-md-17 text-center ${containerClass || ''}`}
			>
				<div className="row">
					<div className="col-lg-10 col-xl-9 col-xxl-8 mx-auto text-center">
						<InnerBlocks.Content />
					</div>
					{/* /column */}
				</div>
				{/* /.row */}
			</div>
			{/* /.container */}
		</section>
	);
};


