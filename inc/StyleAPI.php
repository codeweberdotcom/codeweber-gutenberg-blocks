<?php

namespace Codeweber\Blocks;

/**
 * REST API: Theme style values (card/button/form radius)
 */
class StyleAPI {
	/**
	 * Register REST routes.
	 */
	public static function register_routes(): void {
		register_rest_route(
			'codeweber/v1',
			'/styles',
			[
				'methods'             => 'GET',
				'permission_callback' => '__return_true',
				'callback'            => [__CLASS__, 'get_styles'],
			]
		);
	}

	/**
	 * GET /codeweber/v1/styles
	 */
	public static function get_styles() {
		$card_radius   = function_exists('getThemeCardImageRadius') ? getThemeCardImageRadius() : '';
		$button_radius = function_exists('getThemeButton') ? getThemeButton() : '';
		$form_radius   = function_exists('getThemeFormRadius') ? getThemeFormRadius() : '';

		return [
			'card_radius_class'   => $card_radius,
			'button_radius_class' => $button_radius,
			'form_radius_class'   => $form_radius,
		];
	}
}





