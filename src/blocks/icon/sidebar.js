// Импорт необходимых модулей
import { __ } from '@wordpress/i18n';
import {
	TabPanel,
	ToggleControl,
	ButtonGroup,
	Button,
	BaseControl,
} from '@wordpress/components';
import { Icon, symbol, cog, cover } from '@wordpress/icons';
import { IconControl } from '../../components/icon/IconControl';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import {
	iconWrapperStyles,
	iconBtnSizes,
	iconBtnVariants,
} from '../../utilities/icon_sizes';

export const IconSidebar = ({ attributes, setAttributes }) => {
	// Tab icon with native title tooltip
	const TabIcon = ({ icon, label }) => (
		<span 
			title={label}
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
		>
			<Icon icon={icon} size={20} />
		</span>
	);

	const {
		iconType,
		iconName,
		svgIcon,
		customSvgUrl,
		iconWrapper,
		iconWrapperStyle,
		iconBtnSize,
		iconBtnVariant,
		iconWrapperClass,
	} = attributes;

	const tabs = [
		{ name: 'icon', title: <TabIcon icon={symbol} label={__('Icon', 'codeweber-blocks')} /> },
		{ name: 'wrapper', title: <TabIcon icon={cover} label={__('Wrapper', 'codeweber-blocks')} /> },
		{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-blocks')} /> },
	];

	return (
		<TabPanel
			tabs={tabs}
		>
			{(tab) => (
				<>
				{tab.name === 'icon' && (
					<IconControl
						attributes={attributes}
						setAttributes={setAttributes}
						prefix=""
						label={__('Настройки иконки', 'codeweber-blocks')}
						allowSvg={true}
						allowFont={true}
						allowCustom={true}
						showWrapper={false}
						showMargin={true}
						initialOpen={true}
					/>
				)}

				{tab.name === 'wrapper' && (
					<div style={{ padding: '16px' }}>
						{iconType !== 'none' && (iconName || svgIcon || customSvgUrl) && (
							<>
								<ToggleControl
									label={__('Обернуть в div.icon', 'codeweber-blocks')}
									help={__('Добавляет обёртку для позиционирования или стилизации', 'codeweber-blocks')}
									checked={iconWrapper}
									onChange={(value) => setAttributes({ iconWrapper: value })}
									__nextHasNoMarginBottom
								/>

								{iconWrapper && (
									<>
										<BaseControl
											label={__('Стиль обёртки', 'codeweber-blocks')}
											__nextHasNoMarginBottom
										>
											<ButtonGroup className="icon-wrapper-style-buttons">
												{iconWrapperStyles.map((style) => (
													<Button
														key={style.value}
														variant={iconWrapperStyle === style.value ? 'primary' : 'secondary'}
														onClick={() => setAttributes({ iconWrapperStyle: style.value })}
														size="compact"
													>
														{style.label}
													</Button>
												))}
											</ButtonGroup>
										</BaseControl>

										{/* Настройки кнопки */}
										{(iconWrapperStyle === 'btn' || iconWrapperStyle === 'btn-circle') && (
											<>
												<BaseControl
													label={__('Вариант кнопки', 'codeweber-blocks')}
													__nextHasNoMarginBottom
												>
													<ButtonGroup className="icon-wrapper-style-buttons">
														{iconBtnVariants.map((variant) => (
															<Button
																key={variant.value}
																variant={iconBtnVariant === variant.value ? 'primary' : 'secondary'}
																onClick={() => setAttributes({ iconBtnVariant: variant.value })}
																size="compact"
															>
																{variant.label}
															</Button>
														))}
													</ButtonGroup>
												</BaseControl>

												<BaseControl
													label={__('Размер кнопки', 'codeweber-blocks')}
													__nextHasNoMarginBottom
												>
													<ButtonGroup className="icon-wrapper-style-buttons">
														{iconBtnSizes.map((size) => (
															<Button
																key={size.value}
																variant={iconBtnSize === size.value ? 'primary' : 'secondary'}
																onClick={() => setAttributes({ iconBtnSize: size.value })}
																size="compact"
															>
																{size.label}
															</Button>
														))}
													</ButtonGroup>
												</BaseControl>
											</>
										)}

										<BaseControl
											label={__('Доп. классы обёртки', 'codeweber-blocks')}
											help={__('Например: pe-none, mb-5', 'codeweber-blocks')}
										>
											<input
												type="text"
												className="components-text-control__input"
												value={iconWrapperClass}
												onChange={(e) => setAttributes({ iconWrapperClass: e.target.value })}
												placeholder="pe-none mb-5"
											/>
										</BaseControl>
									</>
								)}
							</>
						)}
					</div>
				)}

				{tab.name === 'settings' && (
					<div style={{ padding: '16px' }}>
						<BlockMetaFields
							attributes={attributes}
							setAttributes={setAttributes}
							fieldKeys={{
								classKey: 'blockClass',
								dataKey: 'blockData',
								idKey: 'blockId',
							}}
							labels={{
								classLabel: __('Block Class', 'codeweber-blocks'),
								dataLabel: __('Block Data', 'codeweber-blocks'),
								idLabel: __('Block ID', 'codeweber-blocks'),
							}}
						/>
					</div>
				)}
				</>
			)}
		</TabPanel>
	);
};

