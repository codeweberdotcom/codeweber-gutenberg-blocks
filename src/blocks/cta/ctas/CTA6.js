import { InnerBlocks } from '@wordpress/block-editor';
import { generateBackgroundClasses } from '../../../utilities/class-generators';

const getBlockWrapperProps = (attributes) => {
	const { blockClass, blockId, blockData } = attributes;
	const id = blockId ? String(blockId).replace(/^#/, '') : undefined;
	const dataAttrs = {};
	if (blockData && typeof blockData === 'string') {
		blockData.split(',').forEach((pair) => {
			const eq = pair.indexOf('=');
			if (eq > 0) {
				const key = pair.slice(0, eq).trim();
				const value = pair.slice(eq + 1).trim();
				if (key) dataAttrs[`data-${key}`] = value;
			}
		});
	}
	return { id, ...dataAttrs };
};

export const CTA6 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundGradient,
		sectionClass,
		containerClass,
		blockClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'gradient-8', 'bg-lines'];

		const bgClasses = generateBackgroundClasses(attributes);
		classes.push(...bgClasses);

		if (sectionClass) {
			classes.push(sectionClass);
		}
		if (blockClass) classes.push(blockClass);

		return classes.filter(Boolean).join(' ');
	};

	const wrapperProps = getBlockWrapperProps(attributes);

	if (isEditor) {
		return (
			<div className={getSectionClasses()} {...wrapperProps}>
				<InnerBlocks
					templateLock={false}
				/>
			</div>
		);
	}

	return (
		<section className={getSectionClasses()} {...wrapperProps}>
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


