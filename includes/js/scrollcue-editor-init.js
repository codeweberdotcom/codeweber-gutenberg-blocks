/**
 * Инициализация scrollCue в редакторе Gutenberg
 */
(function() {
    'use strict';
    
    // Функция инициализации scrollCue
    function initScrollCue() {
        if (typeof window.scrollCue !== 'undefined') {
            try {
                // Инициализируем scrollCue
                window.scrollCue.init({
                    duration: 600,
                    interval: -0.7,
                    percentage: 0.75,
                    enable: true
                });
                console.log('✅ scrollCue initialized in Gutenberg editor');
                return true;
            } catch (error) {
                console.warn('⚠️ scrollCue init error:', error);
                return false;
            }
        }
        return false;
    }
    
    // Пытаемся инициализировать при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initScrollCue, 500);
        });
    } else {
        setTimeout(initScrollCue, 500);
    }
    
    // Глобальная функция для ре-инициализации (вызывается из блоков)
    window.reinitScrollCue = function() {
        if (typeof window.scrollCue !== 'undefined' && typeof window.scrollCue.update === 'function') {
            try {
                window.scrollCue.update();
                console.log('🔄 scrollCue.update() called');
                return true;
            } catch (error) {
                console.warn('⚠️ scrollCue.update() error:', error);
                return false;
            }
        } else {
            console.warn('⚠️ scrollCue is not available');
            // Пытаемся инициализировать если еще не было
            return initScrollCue();
        }
    };
    
    // Пробуем инициализировать каждые 2 секунды первые 10 секунд (если не получилось)
    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = setInterval(function() {
        attempts++;
        if (typeof window.scrollCue !== 'undefined' && typeof window.scrollCue.update === 'function') {
            console.log('✅ scrollCue detected after ' + attempts + ' attempts');
            clearInterval(retryInterval);
        } else if (attempts >= maxAttempts) {
            console.warn('⚠️ scrollCue not detected after ' + maxAttempts + ' attempts. Animation preview may not work.');
            clearInterval(retryInterval);
        }
    }, 2000);
    
    console.log('📝 scrollCue editor init script loaded');
})();






