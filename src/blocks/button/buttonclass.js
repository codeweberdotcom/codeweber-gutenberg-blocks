// Функция для динамического формирования класса кнопки
import { __ } from '@wordpress/i18n';

export const getClassNames = (attributes) => {
	const {
		ButtonSize,
		ButtonColor,
		ButtonGradientColor,
		ButtonStyle,
		ButtonType,
		ButtonShape,
		ButtonIconPosition,
		SocialIconStyle,
		SocialIconClass,
		LinkColor,
		HoverType,
		LinkTextColor,
		blockClass,
	} = attributes;

	// Создаем массив классов
	const classes = [];

	// Добавляем класс btn
	if (
		ButtonType === 'solid' ||
		ButtonType === 'circle' ||
		ButtonType === 'expand' ||
		ButtonType === 'play' ||
		ButtonType === 'circle' ||
		ButtonType === 'social' ||
		ButtonType === 'icon'
	)
		classes.push(`btn`);

	// Добавляем класс btn
	if (
		ButtonType === 'solid' ||
		ButtonType === 'circle' ||
		ButtonType === 'icon' ||
		ButtonType === 'social'
	)
		classes.push(`has-ripple`);

	// Добавляем классы размера
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'social' ||
			ButtonType === 'icon') &&
		ButtonSize
	)
		classes.push(`${ButtonSize}`);

	// Добавляем класс btn-circle
	if (
		ButtonType === 'circle' ||
		ButtonType === 'social' ||
		ButtonType === 'play'
	)
		classes.push(`btn-circle`);

	// Добавляем классы btn-play
	if (ButtonType === 'play') classes.push(`btn-play ripple`);

	// Добавляем классы btn-expand
	if (ButtonType === 'expand') classes.push(`btn-expand rounded-pill`);

	// Добавляем классы btn-icon btn-icon-start
	if (ButtonType === 'icon' && ButtonIconPosition === 'left')
		classes.push(`btn-icon btn-icon-start`);

	// Добавляем классы btn-icon btn-icon-end
	if (ButtonType === 'icon' && ButtonIconPosition === 'right')
		classes.push(`btn-icon btn-icon-end`);

	// Добавляем классы btn-color
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'icon' ||
			ButtonType === 'expand' ||
			ButtonType === 'play') &&
		ButtonStyle === 'solid' &&
		ButtonColor
	)
		classes.push(`btn-${ButtonColor}`);

	// Добавляем классы btn-outline-color
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'icon' ||
			ButtonType === 'expand' ||
			ButtonType === 'play') &&
		ButtonStyle === 'outline' &&
		ButtonColor
	)
		classes.push(`btn-outline-${ButtonColor}`);

	// Добавляем классы btn-soft-color
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'icon' ||
			ButtonType === 'expand' ||
			ButtonType === 'play') &&
		ButtonStyle === 'soft' &&
		ButtonColor
	)
		classes.push(`btn-soft-${ButtonColor}`);

	// Добавляем классы btn-gradient и gradient-X
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'icon' ||
			ButtonType === 'expand' ||
			ButtonType === 'play') &&
		ButtonStyle === 'gradient' &&
		ButtonGradientColor
	) {
		classes.push(`btn-gradient`);
		// Извлекаем номер градиента (например, "gradient-1" -> "gradient-1")
		// Если значение уже содержит "gradient-", используем его как есть
		if (ButtonGradientColor.startsWith('gradient-')) {
			classes.push(ButtonGradientColor);
		} else {
			// Если формат другой, добавляем префикс
			classes.push(`gradient-${ButtonGradientColor}`);
		}
	}

	// Добавляем классы btn-social
	if (ButtonType === 'social' && SocialIconClass)
		classes.push(`btn-${SocialIconClass}`);

	// Добавляем классы btn-outline-gradient и gradient-X
	if (
		(ButtonType === 'solid' ||
			ButtonType === 'circle' ||
			ButtonType === 'icon' ||
			ButtonType === 'expand' ||
			ButtonType === 'play') &&
		ButtonStyle === 'outline-gradient' &&
		ButtonGradientColor
	) {
		classes.push(`btn-outline-gradient`);
		// Извлекаем номер градиента (например, "gradient-1" -> "gradient-1")
		// Если значение уже содержит "gradient-", используем его как есть
		if (ButtonGradientColor.startsWith('gradient-')) {
			classes.push(ButtonGradientColor);
		} else {
			// Если формат другой, добавляем префикс
			classes.push(`gradient-${ButtonGradientColor}`);
		}
	}

	// Добавляем классы btn-shape
	if ((ButtonType === 'solid' || ButtonType === 'icon') && ButtonShape)
		classes.push(`${ButtonShape}`);

	// Добавляем классы для link
	if (ButtonType === 'link') {
		classes.push(HoverType);
		if (LinkColor === 'body') {
			classes.push('link-body');
		} else if (LinkColor === 'more') {
			classes.push('more');
		}
		if (LinkTextColor) {
			classes.push(`text-${LinkTextColor}`);
		}
	}

	// Добавляем пользовательский класс
	if (blockClass) {
		classes.push(blockClass.trim());
	}

	// Объединяем массив классов в строку
	return classes.join(' ');
};
