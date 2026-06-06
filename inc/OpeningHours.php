<?php
/**
 * Opening Hours — shared helper.
 *
 * Single source of truth for company opening hours stored in theme Redux
 * options (Company Details → Opening Hours). Used by:
 *  - the Opening Hours block (src/blocks/opening-hours/render.php)
 *  - the Contacts block "schedule" entity (src/blocks/contacts/render.php)
 *  - the Contacts REST endpoint (editor preview).
 *
 * Redux keys: opening_hours_{day}_opens_1 / _closes_1 / _opens_2 / _closes_2.
 *
 * @package CodeWeber Gutenberg Blocks
 */

namespace Codeweber\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OpeningHours {

	/**
	 * Monday-first day order, mapped to the PHP weekday index (0 = Sunday).
	 *
	 * @var array<string,int>
	 */
	const DAY_INDEX = array(
		'monday'    => 1,
		'tuesday'   => 2,
		'wednesday' => 3,
		'thursday'  => 4,
		'friday'    => 5,
		'saturday'  => 6,
		'sunday'    => 0,
	);

	/**
	 * Read a single Redux option, with a safe fallback.
	 *
	 * @param string $key Option key.
	 * @return string
	 */
	protected static function option( string $key ): string {
		if ( class_exists( 'Codeweber_Options' ) ) {
			return (string) \Codeweber_Options::get( $key, '' );
		}
		$opts = get_option( 'redux_demo', array() );
		return isset( $opts[ $key ] ) ? (string) $opts[ $key ] : '';
	}

	/**
	 * Raw hours for every day.
	 *
	 * @return array<string,array{o1:string,c1:string,o2:string,c2:string,closed:bool}>
	 */
	public static function rows(): array {
		$rows = array();
		foreach ( array_keys( self::DAY_INDEX ) as $day ) {
			$o1 = trim( self::option( 'opening_hours_' . $day . '_opens_1' ) );
			$c1 = trim( self::option( 'opening_hours_' . $day . '_closes_1' ) );
			$o2 = trim( self::option( 'opening_hours_' . $day . '_opens_2' ) );
			$c2 = trim( self::option( 'opening_hours_' . $day . '_closes_2' ) );

			$rows[ $day ] = array(
				'o1'     => $o1,
				'c1'     => $c1,
				'o2'     => $o2,
				'c2'     => $c2,
				'closed' => ( '' === $o1 ),
			);
		}
		return $rows;
	}

	/**
	 * Whether any opening hours are configured at all.
	 *
	 * @param array|null $rows Optional pre-fetched rows.
	 * @return bool
	 */
	public static function hasData( ?array $rows = null ): bool {
		$rows = null === $rows ? self::rows() : $rows;
		foreach ( $rows as $r ) {
			if ( empty( $r['closed'] ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Resolve the time-range separator string from a key.
	 *
	 * @param string $key ndash | mdash | to.
	 * @return string
	 */
	public static function separator( string $key ): string {
		switch ( $key ) {
			case 'mdash':
				return ' — ';
			case 'to':
				return ' ' . __( 'to', 'codeweber-gutenberg-blocks' ) . ' ';
			default:
				return ' – '; // en dash.
		}
	}

	/**
	 * Localized day name for a day key.
	 *
	 * @param string $day    Day key (monday..sunday).
	 * @param string $format short | full.
	 * @return string
	 */
	public static function dayName( string $day, string $format = 'short' ): string {
		global $wp_locale;
		$index = self::DAY_INDEX[ $day ];
		$full  = $wp_locale->get_weekday( $index );
		return ( 'full' === $format ) ? $full : $wp_locale->get_weekday_abbrev( $full );
	}

	/**
	 * Build the display time line(s) for a single day, honoring the break mode.
	 *
	 * @param array  $row        One row from rows().
	 * @param string $breakMode  both | range | second-line.
	 * @param string $sep        Separator string.
	 * @param string $dayoffLabel Day-off label.
	 * @return array{closed:bool,lines:string[]}
	 */
	public static function formatDay( array $row, string $breakMode, string $sep, string $dayoffLabel ): array {
		if ( ! empty( $row['closed'] ) ) {
			return array(
				'closed' => true,
				'lines'  => array( $dayoffLabel ),
			);
		}

		$end1 = ( '' !== $row['c1'] ) ? $row['c1'] : $row['c2'];

		if ( 'range' === $breakMode ) {
			$end = ( '' !== $row['c2'] ) ? $row['c2'] : $row['c1'];
			return array(
				'closed' => false,
				'lines'  => array( $row['o1'] . $sep . $end ),
			);
		}

		$first      = $row['o1'] . $sep . $end1;
		$has_second = ( '' !== $row['o2'] && '' !== $row['c2'] );

		if ( ! $has_second ) {
			return array(
				'closed' => false,
				'lines'  => array( $first ),
			);
		}

		$second = $row['o2'] . $sep . $row['c2'];

		if ( 'second-line' === $breakMode ) {
			return array(
				'closed' => false,
				'lines'  => array( $first, $second ),
			);
		}

		// both.
		return array(
			'closed' => false,
			'lines'  => array( $first . ', ' . $second ),
		);
	}

	/**
	 * Today's day key in the site timezone.
	 *
	 * @return string
	 */
	public static function todayKey(): string {
		$now     = current_datetime();
		$today_w = (int) $now->format( 'w' );
		return (string) array_search( $today_w, self::DAY_INDEX, true );
	}

	/**
	 * Whether the company is open right now (site timezone).
	 *
	 * @param array|null $rows Optional pre-fetched rows.
	 * @return bool
	 */
	public static function isOpenNow( ?array $rows = null ): bool {
		$rows      = null === $rows ? self::rows() : $rows;
		$now_hm    = current_datetime()->format( 'H:i' );
		$today_key = self::todayKey();

		if ( ! isset( $rows[ $today_key ] ) || ! empty( $rows[ $today_key ]['closed'] ) ) {
			return false;
		}

		$tr     = $rows[ $today_key ];
		$within = static function ( $a, $b ) use ( $now_hm ) {
			return ( '' !== $a && '' !== $b && $now_hm >= $a && $now_hm <= $b );
		};
		$end1   = ( '' !== $tr['c1'] ) ? $tr['c1'] : $tr['c2'];

		return ( $within( $tr['o1'], $end1 ) || $within( $tr['o2'], $tr['c2'] ) );
	}

	/**
	 * Build the final display list, grouping consecutive identical days when asked.
	 *
	 * @param array      $rows Optional pre-fetched rows.
	 * @param array      $opts {
	 *     @type string $dayFormat    short | full.
	 *     @type string $breakMode    both | range | second-line.
	 *     @type bool   $groupSameDays Group consecutive identical days.
	 *     @type string $separator    Separator key (ndash | mdash | to).
	 *     @type string $dayoffLabel  Day-off label.
	 * }
	 * @return array<int,array{label:string,lines:string[],closed:bool,is_today:bool,single:bool}>
	 */
	public static function buildDisplay( ?array $rows, array $opts = array() ): array {
		$rows = null === $rows ? self::rows() : $rows;

		$day_format = isset( $opts['dayFormat'] ) ? (string) $opts['dayFormat'] : 'short';
		$break_mode = isset( $opts['breakMode'] ) ? (string) $opts['breakMode'] : 'both';
		$group_days = ! empty( $opts['groupSameDays'] );
		$sep        = self::separator( isset( $opts['separator'] ) ? (string) $opts['separator'] : 'ndash' );
		$dayoff     = isset( $opts['dayoffLabel'] ) ? (string) $opts['dayoffLabel'] : __( 'Day off', 'codeweber-gutenberg-blocks' );

		$day_keys  = array_keys( self::DAY_INDEX );
		$today_key = self::todayKey();

		$formatted = array();
		foreach ( $day_keys as $day ) {
			$formatted[ $day ] = self::formatDay( $rows[ $day ], $break_mode, $sep, $dayoff );
		}

		$display = array();
		$n       = count( $day_keys );
		$i       = 0;
		while ( $i < $n ) {
			$day = $day_keys[ $i ];
			$sig = implode( '|', $formatted[ $day ]['lines'] ) . ( $formatted[ $day ]['closed'] ? 'C' : 'O' );
			$j   = $i;

			if ( $group_days ) {
				while ( $j + 1 < $n ) {
					$next = $day_keys[ $j + 1 ];
					$nsig = implode( '|', $formatted[ $next ]['lines'] ) . ( $formatted[ $next ]['closed'] ? 'C' : 'O' );
					if ( $nsig === $sig ) {
						$j++;
					} else {
						break;
					}
				}
			}

			$label = self::dayName( $day_keys[ $i ], $day_format );
			if ( $j > $i ) {
				$label .= '–' . self::dayName( $day_keys[ $j ], $day_format );
			}

			$is_today = false;
			for ( $k = $i; $k <= $j; $k++ ) {
				if ( $day_keys[ $k ] === $today_key ) {
					$is_today = true;
					break;
				}
			}

			$display[] = array(
				'label'    => $label,
				'lines'    => $formatted[ $day_keys[ $i ] ]['lines'],
				'closed'   => $formatted[ $day_keys[ $i ] ]['closed'],
				'is_today' => $is_today,
				'single'   => ( $j === $i ),
			);

			$i = $j + 1;
		}

		return $display;
	}

	/**
	 * Raw payload for client-side (editor) formatting.
	 *
	 * The Contacts editor preview formats the schedule in JS according to each
	 * entity's own options, so it needs the raw hours plus localized day names.
	 *
	 * @return array{
	 *     rows: array,
	 *     dayNames: array{short:array<string,string>,full:array<string,string>},
	 *     today: string,
	 *     isOpen: bool
	 * }
	 */
	public static function restPayload(): array {
		$rows  = self::rows();
		$short = array();
		$full  = array();
		foreach ( array_keys( self::DAY_INDEX ) as $day ) {
			$short[ $day ] = self::dayName( $day, 'short' );
			$full[ $day ]  = self::dayName( $day, 'full' );
		}

		return array(
			'rows'     => $rows,
			'dayNames' => array(
				'short' => $short,
				'full'  => $full,
			),
			'today'    => self::todayKey(),
			'isOpen'   => self::isOpenNow( $rows ),
		);
	}
}
