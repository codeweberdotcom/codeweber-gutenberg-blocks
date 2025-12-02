/**
 * InlineSvg - Компонент для загрузки SVG inline
 * Позволяет применять CSS цвета к SVG элементам
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { useState, useEffect } from '@wordpress/element';

// Кэш для загруженных SVG
const svgCache = new Map();

/**
 * Загрузка SVG файла
 * @param {string} url - URL SVG файла
 * @returns {Promise<string>} - SVG контент
 */
const fetchSvg = async (url) => {
	// Проверяем кэш
	if (svgCache.has(url)) {
		return svgCache.get(url);
	}

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch SVG: ${response.status}`);
		}
		const svgText = await response.text();
		
		// Сохраняем в кэш
		svgCache.set(url, svgText);
		return svgText;
	} catch (error) {
		console.error('Error fetching SVG:', error);
		return null;
	}
};

/**
 * Обработка SVG: добавление классов и удаление лишних атрибутов
 * @param {string} svgText - SVG контент
 * @param {string} className - CSS классы
 * @param {boolean} preserveFillClasses - Сохранять классы fill-primary/fill-secondary (для solid-duo)
 * @returns {string} - Обработанный SVG
 */
const processSvg = (svgText, className, preserveFillClasses = false) => {
	if (!svgText) return '';

	// Создаем временный контейнер для парсинга SVG
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgText, 'image/svg+xml');
	const svg = doc.querySelector('svg');

	if (!svg) return svgText;

	// Добавляем классы
	if (className) {
		svg.setAttribute('class', className);
	}

	// Удаляем фиксированные размеры если есть viewBox
	if (svg.hasAttribute('viewBox')) {
		svg.removeAttribute('width');
		svg.removeAttribute('height');
	}

	// Для solid-duo и solid-mono сохраняем классы fill-primary/fill-secondary
	// и НЕ заменяем fill на currentColor
	if (!preserveFillClasses) {
		// Убираем fill="..." с путей чтобы CSS мог управлять цветом через currentColor
		const paths = svg.querySelectorAll('path, circle, rect, polygon, ellipse, line, polyline');
		paths.forEach((el) => {
			const elClass = el.getAttribute('class') || '';
			// Не трогаем элементы с классами fill-primary или fill-secondary
			if (elClass.includes('fill-primary') || elClass.includes('fill-secondary')) {
				return;
			}
			const fill = el.getAttribute('fill');
			// Оставляем только none, убираем цвета
			if (fill && fill !== 'none' && fill !== 'currentColor') {
				el.setAttribute('fill', 'currentColor');
			}
		});

		// Устанавливаем fill="currentColor" на SVG если нет
		if (!svg.hasAttribute('fill')) {
			svg.setAttribute('fill', 'currentColor');
		}
	}

	return svg.outerHTML;
};

/**
 * InlineSvg Component
 *
 * @param {Object} props
 * @param {string} props.src - URL SVG файла
 * @param {string} props.className - CSS классы
 * @param {string} props.alt - Alt текст (для fallback)
 * @param {boolean} props.preserveFillClasses - Сохранять fill-primary/fill-secondary (для solid icons)
 */
export const InlineSvg = ({ src, className = '', alt = '', preserveFillClasses = false }) => {
	const [svgContent, setSvgContent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!src) {
			setIsLoading(false);
			setError(true);
			return;
		}

		setIsLoading(true);
		setError(false);

		fetchSvg(src)
			.then((svgText) => {
				if (svgText) {
					const processed = processSvg(svgText, className, preserveFillClasses);
					setSvgContent(processed);
				} else {
					setError(true);
				}
				setIsLoading(false);
			})
			.catch(() => {
				setError(true);
				setIsLoading(false);
			});
	}, [src, className, preserveFillClasses]);

	// Загрузка
	if (isLoading) {
		return (
			<span className={`inline-svg-loading ${className}`} role="img" aria-label={alt}>
				<svg viewBox="0 0 24 24" className="inline-svg-spinner">
					<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
				</svg>
			</span>
		);
	}

	// Ошибка - показываем placeholder
	if (error || !svgContent) {
		return (
			<span className={`inline-svg-error ${className}`} role="img" aria-label={alt}>
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
				</svg>
			</span>
		);
	}

	// Вставляем SVG inline
	return (
		<span
			className="inline-svg-wrapper"
			role="img"
			aria-label={alt}
			dangerouslySetInnerHTML={{ __html: svgContent }}
		/>
	);
};

export default InlineSvg;

