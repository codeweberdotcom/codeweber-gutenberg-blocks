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

export const CTA3 = ({ attributes, isEditor = false }) => {
	const {
		backgroundType,
		backgroundImageUrl,
		backgroundSize,
		sectionClass,
		containerClass,
		blockClass,
	} = attributes;

	// Функция для получения классов секции
	const getSectionClasses = () => {
		const classes = ['wrapper', 'bg-light'];

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
				className={`container py-14 py-md-16 text-center ${containerClass || ''}`}
			>
				<div className="row">
					<div className="col-md-9 col-lg-7 col-xl-7 mx-auto text-center">
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


