/**
 * Post Grid — editor preview.
 *
 * Карточки рендерит PHP (render.php → cw_render_post_card), а не JS.
 * Набор шаблонов динамический: тема, дочерняя тема и плагины подкладывают
 * свои файлы в templates/post-cards/, поэтому дублировать разметку в JSX
 * нельзя — превью разъедется с фронтом на первом же новом шаблоне.
 *
 * ServerSideRender ядра сам дебаунсит запросы (500 мс) и держит предыдущую
 * разметку, пока грузится новая, — собственный debounce не нужен.
 */

import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import { PostGridSidebar } from './sidebar';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { displayMode = 'grid' } = attributes;

	const previewRef = useRef( null );

	const blockProps = useBlockProps( {
		className: 'cwgb-post-grid-editor',
		'data-block': clientId,
	} );

	// Разметку подставляет PHP, поэтому скрипты темы (overlay, swiper, ripple)
	// нужно поднимать заново после каждой замены DOM.
	useEffect( () => {
		const root = previewRef.current;
		if ( ! root ) {
			return undefined;
		}

		// Ассеты темы живут в iframe холста, а не в окне редактора.
		const view = root.ownerDocument?.defaultView;
		if ( ! view ) {
			return undefined;
		}

		let initTimer = null;
		let reconnectTimer = null;

		const runThemeInit = () => {
			try {
				// Overlay: span.bg тема дорисовывает скриптом, в разметке его нет.
				root.querySelectorAll( '.overlay > a, .overlay > span' ).forEach(
					( overlay ) => {
						if ( overlay.querySelector( ':scope > span.bg' ) ) {
							return;
						}
						const bg = overlay.ownerDocument.createElement( 'span' );
						bg.className = 'bg';
						overlay.appendChild( bg );
					}
				);

				if (
					displayMode === 'swiper' &&
					typeof view.theme?.swiperSlider === 'function'
				) {
					view.theme.swiperSlider();
				}

				if ( typeof view.custom?.rippleEffect === 'function' ) {
					view.custom.rippleEffect();
				}
			} catch ( _e ) {
				// Тема может быть не готова — превью и без эффектов читаемо.
			}
		};

		const observer = new view.MutationObserver( () => {
			clearTimeout( initTimer );
			initTimer = setTimeout( () => {
				// На время инициализации отключаемся: overlay и swiper сами
				// меняют DOM, иначе получим бесконечный цикл наблюдения.
				observer.disconnect();
				runThemeInit();
				reconnectTimer = setTimeout( () => {
					if ( previewRef.current ) {
						observer.observe( previewRef.current, {
							childList: true,
						} );
					}
				}, 400 );
			}, 150 );
		} );

		// childList без subtree: SSR меняет содержимое целиком одним узлом,
		// а мутации самого swiper идут глубже и повторный цикл не запускают.
		observer.observe( root, { childList: true } );
		initTimer = setTimeout( runThemeInit, 300 );

		return () => {
			observer.disconnect();
			clearTimeout( initTimer );
			clearTimeout( reconnectTimer );
		};
	}, [ clientId, displayMode ] );

	return (
		<>
			<PostGridSidebar
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<div { ...blockProps }>
				<div ref={ previewRef }>
					<ServerSideRender
						block="codeweber-blocks/post-grid"
						attributes={ attributes }
						httpMethod="POST"
					/>
				</div>
			</div>
		</>
	);
}
