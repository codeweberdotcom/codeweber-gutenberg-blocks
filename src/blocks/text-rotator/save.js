import { RichText } from '@wordpress/block-editor';
import { generateColorClass } from '../../utilities/class-generators';

const getTitleClasses = ( attrs ) => {
	const {
		titleSize,
		titleWeight,
		titleTransform,
		titleColor,
		titleColorType,
		align,
		titleClass,
	} = attrs;

	return [
		titleSize,
		titleWeight,
		titleTransform,
		generateColorClass( titleColor, titleColorType, 'text' ),
		align ? `text-${ align }` : '',
		titleClass,
	]
		.filter( Boolean )
		.join( ' ' );
};

const TextRotatorSave = ( { attributes } ) => {
	const {
		titlePrefix,
		titleTag,
		breakBeforeRotator,
		animationType,
		animationWords,
		animationColor,
		animationDelay,
		animationLoop,
		blockId,
	} = attributes;

	const titleClasses = getTitleClasses( attributes );
	const TitleTag = titleTag || 'h2';
	const colorClass = animationColor ? ` text-${ animationColor }` : '';
	const words = ( animationWords || [] ).join( ',' );

	let animatedPart;
	if ( animationType === 'typer' ) {
		animatedPart = (
			<>
				<span
					className={ `typer${ colorClass }` }
					data-loop={ animationLoop ? 'true' : 'false' }
					data-delay={ animationDelay }
					data-words={ words }
				></span>
				<span
					className={ `cursor${ colorClass }` }
					data-owner="typer"
				></span>
			</>
		);
	} else {
		animatedPart = (
			<span className={ `${ animationType }${ colorClass }` }>
				{ words }
			</span>
		);
	}

	return (
		<TitleTag
			className={ titleClasses || undefined }
			id={ blockId || undefined }
		>
			<RichText.Content value={ titlePrefix } />
			{ breakBeforeRotator && <br /> }
			{ animatedPart }
		</TitleTag>
	);
};

export default TextRotatorSave;
