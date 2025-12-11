/**
 * Plyr Video Player Utility
 * 
 * Функции для инициализации и уничтожения Plyr плеера
 */

/**
 * Инициализация Plyr плеера
 * 
 * @param {string} selector - CSS селектор элементов для инициализации (по умолчанию '.player')
 * @returns {boolean} - true если инициализация успешна, false если нет
 */
export const initPlyr = (selector = '.player') => {
	if (typeof window === 'undefined') {
		return false;
	}

	// Проверяем наличие Plyr
	if (typeof window.Plyr === 'undefined') {
		console.warn('Plyr library not loaded');
		return false;
	}

	const players = document.querySelectorAll(selector);
	
	if (!players || players.length === 0) {
		return false;
	}

	try {
		players.forEach(player => {
			// Пропускаем уже инициализированные плееры
			if (player.plyr) {
				return;
			}

			// Инициализируем новый плеер
			new window.Plyr(player, {
				controls: [
					'play-large',
					'play',
					'progress',
					'current-time',
					'mute',
					'volume',
					'settings',
					'fullscreen',
				],
			});
		});

		return true;
	} catch (error) {
		console.error('Plyr initialization error:', error);
		return false;
	}
};

/**
 * Уничтожение Plyr плеера
 * 
 * @param {string} selector - CSS селектор элементов для уничтожения (по умолчанию '.player')
 * @returns {boolean} - true если уничтожение успешно, false если нет
 */
export const destroyPlyr = (selector = '.player') => {
	if (typeof window === 'undefined') {
		return false;
	}

	const players = document.querySelectorAll(selector);
	
	if (!players || players.length === 0) {
		return false;
	}

	try {
		players.forEach(player => {
			if (player.plyr) {
				player.plyr.destroy();
			}
		});

		return true;
	} catch (error) {
		console.error('Plyr destroy error:', error);
		return false;
	}
};






