/**
 * PositionControl — адаптивное позиционирование блока.
 *
 * Включение position-absolute (и других типов), z-index, смещения
 * top/right/bottom/left и scale отдельно для каждого брейкпоинта,
 * плюс управление видимостью через d-* классы Bootstrap.
 *
 * @package CodeWeber Gutenberg Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
	__experimentalUnitControl as UnitControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import {
	POSITION_BREAKPOINTS,
	POSITION_SIDES,
	POSITION_TYPES,
	POSITION_ORIGINS,
	POSITION_DISPLAYS,
	POSITION_VISIBILITY_BREAKPOINTS,
	getBreakpointDescription,
	hasParallax,
	isBreakpointConfigured,
	positionAttr,
} from './helpers';

const UNITS = [
	{ value: 'px', label: 'px' },
	{ value: '%', label: '%' },
	{ value: 'rem', label: 'rem' },
	{ value: 'em', label: 'em' },
	{ value: 'vh', label: 'vh' },
	{ value: 'vw', label: 'vw' },
];

const SIDE_LABELS = {
	Top: __('Top', 'codeweber-gutenberg-blocks'),
	Right: __('Right', 'codeweber-gutenberg-blocks'),
	Bottom: __('Bottom', 'codeweber-gutenberg-blocks'),
	Left: __('Left', 'codeweber-gutenberg-blocks'),
};

/**
 * PositionControl Component
 *
 * @param {Object}   props
 * @param {Object}   props.attributes    Атрибуты блока
 * @param {Function} props.setAttributes Сеттер атрибутов
 * @param {string}   props.prefix        Префикс атрибутов (по умолчанию 'pos')
 * @return {Element} Контрол
 */
export const PositionControl = ({
	attributes,
	setAttributes,
	prefix = 'pos',
}) => {
	const [activeBreakpoint, setActiveBreakpoint] = useState('');

	const attr = (name, bpKey = '') => positionAttr(name, bpKey, prefix);
	const getValue = (name, bpKey = '') => attributes[attr(name, bpKey)];
	const setValue = (name, bpKey, value) =>
		setAttributes({ [attr(name, bpKey)]: value });

	const enabled = !!getValue('Enabled');

	if (!enabled) {
		return (
			<ToggleControl
				label={__('Enable positioning', 'codeweber-gutenberg-blocks')}
				help={__(
					'Take the block out of the flow and place it manually.',
					'codeweber-gutenberg-blocks'
				)}
				checked={false}
				onChange={(value) => setValue('Enabled', '', value)}
			/>
		);
	}

	const positionType = getValue('Type') || 'absolute';
	const parallax = hasParallax(attributes, prefix);
	const transformHelp = parallax
		? __(
				'Unavailable with parallax: rellax rewrites the inline transform on every scroll.',
				'codeweber-gutenberg-blocks'
			)
		: undefined;
	const scaleRaw = getValue('Scale', activeBreakpoint);
	const scaleValue =
		scaleRaw === '' || scaleRaw === undefined
			? undefined
			: parseFloat(scaleRaw);

	const resetBreakpoint = () => {
		const reset = {};

		POSITION_SIDES.forEach((side) => {
			reset[attr(side, activeBreakpoint)] = '';
		});

		reset[attr('Scale', activeBreakpoint)] = '';

		setAttributes(reset);
	};

	return (
		<>
			<ToggleControl
				label={__('Enable positioning', 'codeweber-gutenberg-blocks')}
				help={
					positionType === 'absolute'
						? __(
								'The parent element must be position-relative, otherwise offsets are measured from the nearest positioned ancestor.',
								'codeweber-gutenberg-blocks'
							)
						: undefined
				}
				checked={true}
				onChange={(value) => setValue('Enabled', '', value)}
			/>

			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>
						{__('Position type', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<SelectControl
					value={positionType}
					options={POSITION_TYPES}
					onChange={(value) => setValue('Type', '', value)}
				/>
			</div>

			<div className="mb-3">
				<NumberControl
					label={__('Z-index', 'codeweber-gutenberg-blocks')}
					help={__(
						'Stacking order. Leave empty to inherit from the theme.',
						'codeweber-gutenberg-blocks'
					)}
					value={getValue('ZIndex') ?? ''}
					min={-100}
					max={9999}
					step={1}
					onChange={(value) =>
						setValue(
							'ZIndex',
							'',
							value === undefined || value === null
								? ''
								: String(value)
						)
					}
				/>
			</div>

			<ToggleControl
				label={__('Parallax (rellax)', 'codeweber-gutenberg-blocks')}
				help={__(
					'Moves the block on scroll, like the decorative shapes in the theme demos.',
					'codeweber-gutenberg-blocks'
				)}
				checked={parallax}
				onChange={(value) => setValue('Parallax', '', value)}
			/>

			{parallax && (
				<div className="mb-3">
					<NumberControl
						label={__(
							'Parallax speed',
							'codeweber-gutenberg-blocks'
						)}
						help={__(
							'Negative moves against the scroll, positive with it. Effect is off in the editor.',
							'codeweber-gutenberg-blocks'
						)}
						value={getValue('ParallaxSpeed') ?? ''}
						min={-10}
						max={10}
						step={0.5}
						onChange={(value) =>
							setValue(
								'ParallaxSpeed',
								'',
								value === undefined || value === null
									? ''
									: String(value)
							)
						}
					/>
				</div>
			)}

			{/* Полоса брейкпоинтов */}
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>
						{__('Breakpoint', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<div
					style={{
						display: 'flex',
						gap: '4px',
						flexWrap: 'wrap',
					}}
				>
					{POSITION_BREAKPOINTS.map((bp) => {
						const configured = isBreakpointConfigured(
							attributes,
							bp.key,
							prefix
						);

						return (
							<Button
								key={bp.key || 'base'}
								variant={
									activeBreakpoint === bp.key
										? 'primary'
										: 'secondary'
								}
								onClick={() => setActiveBreakpoint(bp.key)}
								showTooltip
								label={getBreakpointDescription(bp.key)}
								style={{
									minWidth: '46px',
									justifyContent: 'center',
									fontWeight: configured ? '700' : '400',
								}}
							>
								{bp.label}
								{configured ? ' •' : ''}
							</Button>
						);
					})}
				</div>
				<p
					className="description"
					style={{ marginTop: '8px', marginBottom: 0 }}
				>
					{getBreakpointDescription(activeBreakpoint)}
					{activeBreakpoint
						? ` — ${__(
								'empty fields inherit the smaller breakpoint',
								'codeweber-gutenberg-blocks'
							)}`
						: ''}
				</p>
			</div>

			{/* Смещения активного брейкпоинта */}
			<div
				className="mb-3"
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '8px',
				}}
			>
				{POSITION_SIDES.map((side) => (
					<UnitControl
						key={side}
						label={SIDE_LABELS[side]}
						value={getValue(side, activeBreakpoint) || ''}
						units={UNITS}
						onChange={(value) =>
							setValue(side, activeBreakpoint, value ?? '')
						}
					/>
				))}
			</div>

			<div className="mb-3">
				<RangeControl
					label={__('Scale, %', 'codeweber-gutenberg-blocks')}
					help={transformHelp}
					disabled={parallax}
					value={scaleValue}
					min={10}
					max={300}
					step={1}
					allowReset
					resetFallbackValue={undefined}
					onChange={(value) =>
						setValue(
							'Scale',
							activeBreakpoint,
							value === undefined || value === null
								? ''
								: String(value)
						)
					}
				/>
			</div>

			<div className="mb-3">
				<Button
					variant="secondary"
					isDestructive
					onClick={resetBreakpoint}
					disabled={
						!isBreakpointConfigured(
							attributes,
							activeBreakpoint,
							prefix
						)
					}
				>
					{__(
						'Clear this breakpoint',
						'codeweber-gutenberg-blocks'
					)}
				</Button>
			</div>

			{/* Трансформация */}
			<div className="mb-3">
				<div className="component-sidebar-title">
					<label>
						{__('Transform origin', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<SelectControl
					value={getValue('Origin') || ''}
					options={POSITION_ORIGINS}
					disabled={parallax}
					help={transformHelp}
					onChange={(value) => setValue('Origin', '', value)}
				/>
			</div>

			<ToggleControl
				label={__(
					'Center horizontally (X: −50%)',
					'codeweber-gutenberg-blocks'
				)}
				help={
					transformHelp ||
					__(
						'Use together with left: 50%.',
						'codeweber-gutenberg-blocks'
					)
				}
				disabled={parallax}
				checked={!!getValue('CenterX')}
				onChange={(value) => setValue('CenterX', '', value)}
			/>

			<ToggleControl
				label={__(
					'Center vertically (Y: −50%)',
					'codeweber-gutenberg-blocks'
				)}
				help={
					transformHelp ||
					__(
						'Use together with top: 50%.',
						'codeweber-gutenberg-blocks'
					)
				}
				disabled={parallax}
				checked={!!getValue('CenterY')}
				onChange={(value) => setValue('CenterY', '', value)}
			/>

			{/* Видимость */}
			<div className="mb-3" style={{ marginTop: '16px' }}>
				<div className="component-sidebar-title">
					<label>
						{__('Visibility', 'codeweber-gutenberg-blocks')}
					</label>
				</div>
				<SelectControl
					label={__('Show from', 'codeweber-gutenberg-blocks')}
					value={getValue('VisibleFrom') || ''}
					options={[
						{
							value: '',
							label: __(
								'Always visible',
								'codeweber-gutenberg-blocks'
							),
						},
						...POSITION_VISIBILITY_BREAKPOINTS.map((bp) => ({
							value: bp.slug,
							label: `${bp.label} — ${getBreakpointDescription(
								bp.key
							)}`,
						})),
					]}
					onChange={(value) => setValue('VisibleFrom', '', value)}
				/>
				{getValue('VisibleFrom') && (
					<SelectControl
						label={__('Display', 'codeweber-gutenberg-blocks')}
						value={getValue('VisibleDisplay') || 'block'}
						options={POSITION_DISPLAYS}
						onChange={(value) =>
							setValue('VisibleDisplay', '', value)
						}
					/>
				)}
				<SelectControl
					label={__('Hide from', 'codeweber-gutenberg-blocks')}
					value={getValue('HiddenFrom') || ''}
					options={[
						{
							value: '',
							label: __(
								'Never hidden',
								'codeweber-gutenberg-blocks'
							),
						},
						...POSITION_VISIBILITY_BREAKPOINTS.map((bp) => ({
							value: bp.slug,
							label: `${bp.label} — ${getBreakpointDescription(
								bp.key
							)}`,
						})),
					]}
					onChange={(value) => setValue('HiddenFrom', '', value)}
				/>
			</div>
		</>
	);
};

export default PositionControl;
