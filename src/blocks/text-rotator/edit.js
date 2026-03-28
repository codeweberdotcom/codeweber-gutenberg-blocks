import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { generateColorClass } from '../../utilities/class-generators';
import { TextRotatorSidebar } from './sidebar';

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

const TextRotatorEdit = ( { attributes, setAttributes } ) => {
	const {
		enablePrefix,
		titlePrefix,
		enableSuffix,
		titleSuffix,
		titleTag,
		breakBeforeRotator,
		animationType,
		animationWords,
		animationColor,
		blockClass,
		blockId,
	} = attributes;

	const blockProps = useBlockProps( {
		className: blockClass || undefined,
		id: blockId || undefined,
	} );

	const TitleTag = titleTag || 'h2';
	const titleClasses = getTitleClasses( attributes );
	const colorClass = animationColor ? ` text-${ animationColor }` : '';
	const previewWord =
		animationWords && animationWords.length > 0 ? animationWords[ 0 ] : '…';

	return (
		<>
			<InspectorControls>
				<TextRotatorSidebar
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			</InspectorControls>

			<div { ...blockProps }>
				<TitleTag className={ titleClasses || undefined }>
					{ enablePrefix && (
						<RichText
							value={ titlePrefix }
							onChange={ ( value ) =>
								setAttributes( { titlePrefix: value } )
							}
							placeholder={ __(
								'Enter prefix text…',
								'codeweber-gutenberg-blocks'
							) }
							allowedFormats={ [] }
							withoutInteractiveFormatting
						/>
					) }
					{ enablePrefix && breakBeforeRotator && <br /> }
					{ /* Editor preview of first word */ }
					<span
						className={ `${ animationType }${ colorClass }` }
						style={ { opacity: 0.75 } }
					>
						{ previewWord }
					</span>
					{ animationType === 'typer' && (
						<span
							className={ `cursor${ colorClass }` }
							style={ { opacity: 0.75 } }
						>
							|
						</span>
					) }
					{ enableSuffix && (
						<RichText
							value={ titleSuffix }
							onChange={ ( value ) =>
								setAttributes( { titleSuffix: value } )
							}
							placeholder={ __(
								'Enter suffix text…',
								'codeweber-gutenberg-blocks'
							) }
							allowedFormats={ [] }
							withoutInteractiveFormatting
						/>
					) }
				</TitleTag>
			</div>
		</>
	);
};

export default TextRotatorEdit;
