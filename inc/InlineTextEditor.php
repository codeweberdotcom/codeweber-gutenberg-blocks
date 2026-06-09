<?php

namespace Codeweber\Blocks;

/**
 * Inline Text Editor — frontend in-place text editing for Codeweber blocks.
 *
 * Self-contained companion to the `codeweber-blocks/inline-text-editor` block.
 * Everything this feature needs (REST routes, DOM tagging, content rewriting)
 * lives here. Removing the feature = delete the block folder + this file +
 * revert the small wiring edits (see the block's README.md). Nothing else in
 * the plugin depends on this class, so removal cannot break other blocks.
 *
 * @package CodeWeber Gutenberg Blocks
 */
class InlineTextEditor {

	/** REST namespace + base (matches the plugin's other routes). */
	const REST_NS   = 'codeweber-gutenberg-blocks/v1';
	const REST_BASE = '/inline-editor';

	/** Frontend tagging counter, scoped to the main post content. */
	private static int $tag_counter = 0;
	private static int $tag_post_id = 0;

	/**
	 * Single entry point. Wired from plugin.php with one line.
	 */
	public static function boot(): void {
		add_action('rest_api_init', [self::class, 'register_routes']);
		// Tag editable blocks in the main content so the frontend JS can find them.
		add_filter('render_block', [self::class, 'tag_editable_block'], 20, 2);
	}

	/**
	 * Registry of editable blocks → fields.
	 *
	 * Each field: attr key => [ label, enable (toggle attr), enableDefault ].
	 * Extend this array to support more blocks/fields.
	 *
	 * @return array<string, array{label:string, fields:array<string, array{label:string, enable:?string, enableDefault:bool}>}>
	 */
	public static function registry(): array {
		return [
			// NOTE: heading-subtitle is registered under the legacy
			// `codeweber-gutenberg-blocks/` namespace (unlike most blocks).
			'codeweber-gutenberg-blocks/heading-subtitle' => [
				'label'  => __('Title block', 'codeweber-gutenberg-blocks'),
				'fields' => [
					'title'    => [
						'label'         => __('Title', 'codeweber-gutenberg-blocks'),
						'enable'        => 'enableTitle',
						'enableDefault' => true,
					],
					'subtitle' => [
						'label'         => __('Subtitle', 'codeweber-gutenberg-blocks'),
						'enable'        => 'enableSubtitle',
						'enableDefault' => true,
					],
					'text'     => [
						'label'         => __('Text', 'codeweber-gutenberg-blocks'),
						'enable'        => 'enableText',
						'enableDefault' => false,
					],
				],
			],
		];
	}

	/**
	 * Allowed inline HTML for edited text values.
	 *
	 * @return array<string, mixed>
	 */
	private static function allowed_html(): array {
		return [
			'strong' => [],
			'b'      => [],
			'em'     => [],
			'i'      => [],
			'u'      => [],
			'mark'   => [],
			'small'  => [],
			'br'     => [],
			'span'   => ['class' => true],
			'a'      => ['href' => true, 'title' => true, 'target' => true, 'rel' => true],
		];
	}

	/* --------------------------------------------------------------------- */
	/* Frontend tagging                                                      */
	/* --------------------------------------------------------------------- */

	/**
	 * Add data-cw-edit-index to editable blocks rendered in the main query loop.
	 *
	 * Counting order matches the REST traversal (document order), so the index
	 * is a stable handle the frontend JS uses to swap the block after saving.
	 *
	 * @param string $block_content
	 * @param array  $block
	 * @return string
	 */
	public static function tag_editable_block($block_content, $block) {
		if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
			return $block_content;
		}
		if (!in_the_loop() || !is_main_query()) {
			return $block_content;
		}

		$queried = (int) get_queried_object_id();
		$current = (int) get_the_ID();
		if ($current !== $queried || $current === 0) {
			return $block_content;
		}

		// Reset the counter when the main post changes.
		if (self::$tag_post_id !== $current) {
			self::$tag_post_id = $current;
			self::$tag_counter = 0;
		}

		$name = $block['blockName'] ?? '';
		if ($name === '' || !isset(self::registry()[$name])) {
			return $block_content;
		}

		$index = self::$tag_counter++;

		// Inject the attribute into the first opening tag only.
		return preg_replace(
			'/<([a-zA-Z][^\s>\/]*)/',
			'<$1 data-cw-edit-index="' . $index . '"',
			$block_content,
			1
		);
	}

	/* --------------------------------------------------------------------- */
	/* REST                                                                  */
	/* --------------------------------------------------------------------- */

	public static function register_routes(): void {
		$args = [
			'post_id' => [
				'required'          => true,
				'sanitize_callback' => 'absint',
			],
		];

		register_rest_route(self::REST_NS, self::REST_BASE . '/(?P<post_id>\d+)', [
			[
				'methods'             => 'GET',
				'callback'            => [self::class, 'rest_get'],
				'permission_callback' => [self::class, 'permission'],
				'args'                => $args,
			],
			[
				'methods'             => 'POST',
				'callback'            => [self::class, 'rest_post'],
				'permission_callback' => [self::class, 'permission'],
				'args'                => $args,
			],
		]);
	}

	/**
	 * @param \WP_REST_Request $request
	 * @return bool
	 */
	public static function permission($request): bool {
		return current_user_can('edit_post', (int) $request['post_id']);
	}

	/**
	 * GET: list editable blocks (with current values) for a post.
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function rest_get($request) {
		$post_id = (int) $request['post_id'];
		$post    = get_post($post_id);
		if (!$post) {
			return new \WP_Error('cw_not_found', 'Post not found', ['status' => 404]);
		}

		$blocks    = parse_blocks($post->post_content);
		$registry  = self::registry();
		$collected = [];
		$counter   = 0;

		self::collect($blocks, $registry, $collected, $counter, 0, ['id' => -1, 'name' => '']);

		return new \WP_REST_Response($collected, 200);
	}

	/**
	 * Display name of a container block, matching the editor List View.
	 *
	 * Priority: Gutenberg "Rename" name (attrs.metadata.name) → registered block
	 * title (e.g. "Section", "CTA", "Banners"). Anchors are intentionally ignored.
	 *
	 * @param array $block
	 * @return string
	 */
	private static function container_name(array $block): string {
		$attrs = $block['attrs'] ?? [];

		$meta = $attrs['metadata']['name'] ?? '';
		if (is_string($meta) && trim($meta) !== '') {
			return trim($meta);
		}

		$name = $block['blockName'] ?? '';
		if ($name !== '') {
			$type = \WP_Block_Type_Registry::get_instance()->get_registered($name);
			if ($type && !empty($type->title)) {
				return $type->title;
			}
			$parts = explode('/', $name);
			return ucfirst((string) end($parts));
		}

		return __('Block', 'codeweber-gutenberg-blocks');
	}

	/**
	 * Recursively collect editable blocks in document order, grouped by their
	 * top-level container block (matching the editor List View).
	 *
	 * @param array $blocks
	 * @param array $registry
	 * @param array $collected
	 * @param int   $counter
	 * @param int   $depth     Current nesting depth (0 = top level).
	 * @param array $container Current top-level container: ['id' => int, 'name' => string].
	 */
	private static function collect(array $blocks, array $registry, array &$collected, int &$counter, int $depth, array $container): void {
		foreach ($blocks as $i => $block) {
			$name = $block['blockName'] ?? '';

			// The top-level block is the container shown as a group header.
			$this_container = $container;
			if ($depth === 0) {
				$this_container = [
					'id'   => $i,
					'name' => self::container_name($block),
				];
			}

			if ($name !== '' && isset($registry[$name])) {
				$index = $counter++;
				$attrs = $block['attrs'] ?? [];
				$fields = [];

				foreach ($registry[$name]['fields'] as $key => $field) {
					if (!self::field_enabled($attrs, $field)) {
						continue;
					}
					$fields[] = [
						'key'   => $key,
						'label' => $field['label'],
						'value' => self::read_field_value($block, $attrs, $key),
					];
				}

				if ($fields) {
					// Card label: the heading text, so multiple blocks in the
					// same container are distinguishable. Falls back to the
					// block title.
					$display = '';
					foreach ($fields as $f) {
						$text = trim(wp_strip_all_tags($f['value']));
						if ($text !== '') {
							$display = $text;
							break;
						}
					}
					if ($display === '') {
						$type = \WP_Block_Type_Registry::get_instance()->get_registered($name);
						$display = ($type && !empty($type->title)) ? $type->title : $registry[$name]['label'];
					}
					if (function_exists('mb_strlen') && mb_strlen($display) > 80) {
						$display = mb_substr($display, 0, 80) . '…';
					}

					$collected[] = [
						'index'       => $index,
						'blockName'   => $name,
						'label'       => $registry[$name]['label'],
						'name'        => $display,
						'container'   => $this_container['name'] ?? '',
						'containerId' => $this_container['id'] ?? -1,
						'fields'      => $fields,
					];
				}
			}

			if (!empty($block['innerBlocks'])) {
				self::collect($block['innerBlocks'], $registry, $collected, $counter, $depth + 1, $this_container);
			}
		}
	}

	/**
	 * POST: apply edits to one block and return its re-rendered HTML.
	 *
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response|\WP_Error
	 */
	public static function rest_post($request) {
		$post_id = (int) $request['post_id'];
		$post    = get_post($post_id);
		if (!$post) {
			return new \WP_Error('cw_not_found', 'Post not found', ['status' => 404]);
		}

		$params = $request->get_json_params();
		$index  = isset($params['index']) ? (int) $params['index'] : -1;
		$values = isset($params['values']) && is_array($params['values']) ? $params['values'] : [];
		if ($index < 0 || !$values) {
			return new \WP_Error('cw_bad_request', 'Missing index or values', ['status' => 400]);
		}

		$blocks   = parse_blocks($post->post_content);
		$registry = self::registry();
		$counter  = 0;

		$found = &self::find_editable($blocks, $registry, $index, $counter);
		if ($found === null) {
			return new \WP_Error('cw_not_found', 'Editable block not found', ['status' => 404]);
		}

		$name = $found['blockName'] ?? '';
		if (!isset($registry[$name])) {
			return new \WP_Error('cw_not_editable', 'Block is not editable', ['status' => 400]);
		}

		$attrs   = $found['attrs'] ?? [];
		$inner   = (string) ($found['innerHTML'] ?? '');
		$skipped = [];
		$changed = false;

		foreach ($values as $value) {
			$key = isset($value['key']) ? (string) $value['key'] : '';
			if ($key === '' || !isset($registry[$name]['fields'][$key])) {
				continue;
			}
			$old = isset($value['old']) ? (string) $value['old'] : '';
			$new = isset($value['new']) ? wp_kses((string) $value['new'], self::allowed_html()) : '';

			$rewritten = self::write_field_value($inner, $attrs, $key, $old, $new);
			if ($rewritten === false) {
				$skipped[] = $key;
				continue;
			}
			$inner = $rewritten;
			$found['attrs'][$key] = $new;
			$changed = true;
		}

		if ($changed) {
			$found['innerHTML'] = $inner;
			if (empty($found['innerBlocks'])) {
				$found['innerContent'] = [$inner];
			}

			$new_content = serialize_blocks($blocks);
			$result = wp_update_post([
				'ID'           => $post_id,
				'post_content' => $new_content,
			], true);

			if (is_wp_error($result)) {
				return $result;
			}
		}

		$html = render_block($found);

		return new \WP_REST_Response([
			'html'    => $html,
			'skipped' => $skipped,
		], 200);
	}

	/**
	 * Locate the Nth editable block, returned by reference so callers can mutate
	 * it in place. Returns a reference to null when not found.
	 *
	 * @param array $blocks
	 * @param array $registry
	 * @param int   $target
	 * @param int   $counter
	 * @return array|null
	 */
	private static function &find_editable(array &$blocks, array $registry, int $target, int &$counter) {
		$null = null;
		foreach ($blocks as &$block) {
			$name = $block['blockName'] ?? '';
			if ($name !== '' && isset($registry[$name])) {
				if ($counter === $target) {
					return $block;
				}
				$counter++;
			}
			if (!empty($block['innerBlocks'])) {
				$found = &self::find_editable($block['innerBlocks'], $registry, $target, $counter);
				if ($found !== null) {
					return $found;
				}
				unset($found);
			}
		}
		return $null;
	}

	/* --------------------------------------------------------------------- */
	/* Field helpers                                                         */
	/* --------------------------------------------------------------------- */

	/**
	 * @param array $attrs
	 * @param array $field
	 * @return bool
	 */
	private static function field_enabled(array $attrs, array $field): bool {
		$toggle = $field['enable'] ?? null;
		if ($toggle === null) {
			return true;
		}
		return (bool) ($attrs[$toggle] ?? $field['enableDefault'] ?? false);
	}

	/**
	 * Read the live value of a field from the block markup.
	 *
	 * @param array  $block
	 * @param array  $attrs
	 * @param string $key
	 * @return string
	 */
	private static function read_field_value(array $block, array $attrs, string $key): string {
		$inner = (string) ($block['innerHTML'] ?? '');
		$node  = null;
		$dom   = self::locate($inner, $attrs, $key, $node);
		if ($dom === null || $node === null) {
			// Fallback: clean attribute value.
			return (string) ($attrs[$key] ?? '');
		}
		return self::inner_html($node);
	}

	/**
	 * Rewrite a field's text inside the block markup.
	 *
	 * Optimistic lock: only rewrites when the current markup text still matches
	 * the `$old` value the client read. Returns the new wrapper HTML, or false
	 * if the field could not be located or the guard failed (skip, don't clobber).
	 *
	 * @param string $inner Block innerHTML (the wrapper element).
	 * @param array  $attrs
	 * @param string $key
	 * @param string $old
	 * @param string $new Already sanitized.
	 * @return string|false
	 */
	private static function write_field_value(string $inner, array $attrs, string $key, string $old, string $new) {
		$node = null;
		$dom  = self::locate($inner, $attrs, $key, $node);
		if ($dom === null || $node === null) {
			return false;
		}

		// Guard against concurrent edits: compare normalized plain text.
		$current_text = self::normalize_text(self::inner_html($node));
		$old_text     = self::normalize_text($old);
		if ($current_text !== $old_text) {
			return false;
		}

		// Replace children with the new value.
		while ($node->firstChild) {
			$node->removeChild($node->firstChild);
		}
		if ($new !== '') {
			$frag = self::fragment_from_html($node->ownerDocument, $new);
			if ($frag !== null) {
				$node->appendChild($frag);
			}
		}

		// Serialize the shell's children back to the wrapper HTML.
		$shell = self::find_shell($node->ownerDocument);
		if ($shell === null) {
			return false;
		}
		$out = '';
		foreach ($shell->childNodes as $child) {
			$out .= $node->ownerDocument->saveHTML($child);
		}
		return $out;
	}

	/**
	 * Load the block innerHTML and return the DOMElement for the target field.
	 *
	 * @param string       $inner
	 * @param array        $attrs
	 * @param string       $key
	 * @param \DOMElement|null $node (out)
	 * @return \DOMDocument|null
	 */
	private static function locate(string $inner, array $attrs, string $key, &$node) {
		$node = null;
		if (trim($inner) === '') {
			return null;
		}

		$dom = new \DOMDocument('1.0', 'UTF-8');
		libxml_use_internal_errors(true);
		$ok = $dom->loadHTML(
			'<?xml encoding="UTF-8"?><div data-cw-shell="1">' . $inner . '</div>',
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
		);
		libxml_clear_errors();
		if (!$ok) {
			return null;
		}

		$shell = self::find_shell($dom);
		if ($shell === null) {
			return null;
		}

		// The block wrapper is the shell's first element child.
		$wrapper = self::first_element_child($shell);
		if ($wrapper === null) {
			return null;
		}

		$children = self::element_children($wrapper);
		$order    = self::field_order($attrs);
		$pos      = array_search($key, $order, true);
		if ($pos === false || !isset($children[$pos])) {
			return null;
		}

		$target = $children[$pos];

		// Subtitle may be wrapped in a flex alignment div.
		if ($key === 'subtitle' && self::subtitle_is_wrapped($attrs)) {
			$inner_el = self::first_element_child($target);
			if ($inner_el !== null) {
				$target = $inner_el;
			}
		}

		$node = $target;
		return $dom;
	}

	/**
	 * Ordered list of present fields, mirroring heading-subtitle save.js.
	 *
	 * @param array $attrs
	 * @return string[]
	 */
	private static function field_order(array $attrs): array {
		$subtitle_first = ($attrs['order'] ?? 'subtitle-first') === 'subtitle-first';
		$enable_title    = (bool) ($attrs['enableTitle'] ?? true);
		$enable_subtitle = (bool) ($attrs['enableSubtitle'] ?? true);
		$enable_text     = (bool) ($attrs['enableText'] ?? false);

		$order = [];
		if ($subtitle_first) {
			if ($enable_subtitle) {
				$order[] = 'subtitle';
			}
			if ($enable_title) {
				$order[] = 'title';
			}
		} else {
			if ($enable_title) {
				$order[] = 'title';
			}
			if ($enable_subtitle) {
				$order[] = 'subtitle';
			}
		}
		if ($enable_text) {
			$order[] = 'text';
		}
		return $order;
	}

	/**
	 * Whether the subtitle is wrapped in an alignment div (see getSubtitleAlignWrapperClass).
	 *
	 * @param array $attrs
	 * @return bool
	 */
	private static function subtitle_is_wrapped(array $attrs): bool {
		$line_type = $attrs['subtitleLineType'] ?? 'default';
		if (!in_array($line_type, ['line', 'primary'], true)) {
			return false;
		}
		$align       = (string) ($attrs['align'] ?? 'left');
		$align_class = $align === '' ? '' : (strpos($align, 'text-') === 0 ? $align : 'text-' . $align);
		return in_array($align_class, ['text-center', 'text-end', 'text-right'], true);
	}

	/* --------------------------------------------------------------------- */
	/* DOM utilities                                                         */
	/* --------------------------------------------------------------------- */

	/**
	 * @param \DOMDocument $dom
	 * @return \DOMElement|null
	 */
	private static function find_shell(\DOMDocument $dom) {
		foreach ($dom->childNodes as $child) {
			if ($child->nodeType === XML_ELEMENT_NODE && $child->nodeName === 'div') {
				return $child;
			}
		}
		// Fallback: documentElement may be the shell.
		return $dom->documentElement instanceof \DOMElement ? $dom->documentElement : null;
	}

	/**
	 * @param \DOMNode $node
	 * @return \DOMElement|null
	 */
	private static function first_element_child(\DOMNode $node) {
		foreach ($node->childNodes as $child) {
			if ($child->nodeType === XML_ELEMENT_NODE) {
				return $child;
			}
		}
		return null;
	}

	/**
	 * @param \DOMNode $node
	 * @return \DOMElement[]
	 */
	private static function element_children(\DOMNode $node): array {
		$els = [];
		foreach ($node->childNodes as $child) {
			if ($child->nodeType === XML_ELEMENT_NODE) {
				$els[] = $child;
			}
		}
		return $els;
	}

	/**
	 * Serialize a node's children to an HTML string.
	 *
	 * @param \DOMNode $node
	 * @return string
	 */
	private static function inner_html(\DOMNode $node): string {
		$html = '';
		foreach ($node->childNodes as $child) {
			$html .= $node->ownerDocument->saveHTML($child);
		}
		return trim($html);
	}

	/**
	 * Build a document fragment from an HTML string.
	 *
	 * @param \DOMDocument $dom
	 * @param string       $html
	 * @return \DOMDocumentFragment|null
	 */
	private static function fragment_from_html(\DOMDocument $dom, string $html) {
		$tmp = new \DOMDocument('1.0', 'UTF-8');
		libxml_use_internal_errors(true);
		$ok = $tmp->loadHTML(
			'<?xml encoding="UTF-8"?><div data-cw-shell="1">' . $html . '</div>',
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
		);
		libxml_clear_errors();
		if (!$ok) {
			return null;
		}
		$shell = self::find_shell($tmp);
		if ($shell === null) {
			return null;
		}

		$frag = $dom->createDocumentFragment();
		foreach ($shell->childNodes as $child) {
			$frag->appendChild($dom->importNode($child, true));
		}
		return $frag;
	}

	/**
	 * Normalize text for the optimistic-lock comparison.
	 *
	 * @param string $html
	 * @return string
	 */
	private static function normalize_text(string $html): string {
		$text = wp_strip_all_tags($html);
		$text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
		$text = preg_replace('/\s+/u', ' ', $text);
		return trim((string) $text);
	}
}
