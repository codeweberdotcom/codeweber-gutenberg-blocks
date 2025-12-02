import { RichText } from '@wordpress/block-editor';
import { getTitleClasses, getSubtitleClasses } from './utils';
import { ParagraphRenderSave } from '../../components/paragraph';

const HeadingSubtitleSave = ({ attributes }) => {
    const {
        enableTitle,
        enableSubtitle,
        enableText,
        title,
        subtitle,
        order,
        titleTag,
        subtitleTag,
        textTag,
    } = attributes;

    const elements = [];

    if (enableTitle) {
        elements.push(
            <RichText.Content
                key="title"
                tagName={titleTag}
                value={title}
                className={getTitleClasses(attributes)}
            />
        );
    }
    if (enableSubtitle) {
        elements.push(
            <RichText.Content
                key="subtitle"
                tagName={subtitleTag}
                value={subtitle}
                className={getSubtitleClasses(attributes)}
            />
        );
    }

    if (order === 'subtitle-first') {
        elements.reverse();
    }

    // Paragraph всегда после title и subtitle
    if (enableText) {
        elements.push(
            <ParagraphRenderSave
                key="text"
                attributes={attributes}
                prefix=""
                tag={textTag}
            />
        );
    }

    // Возвращаем элементы без обёртки
    return <>{elements}</>;
};

export default HeadingSubtitleSave;

