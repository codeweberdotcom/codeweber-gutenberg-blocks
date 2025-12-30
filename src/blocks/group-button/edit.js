/**
 * Group Button Block - Edit Component
 *
 * @package CodeWeber Gutenberg Blocks
 */

import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, cog, positionCenter, resizeCornerNE, arrowRight } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';
import { PositioningControl } from '../../components/layout/PositioningControl';
import { SpacingControl } from '../../components/spacing/SpacingControl';
import { AnimationControl } from '../../components/animation/Animation';
import { BlockMetaFields } from '../../components/block-meta/BlockMetaFields';
import { getGroupButtonClassNames, normalizeGroupButtonId } from './utils';

// Tab icon with native title tooltip
const TabIcon = ({ icon, label }) => (
	<span title={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<Icon icon={icon} size={20} />
	</span>
);

const tabs = [
	{ name: 'align', title: <TabIcon icon={positionCenter} label={__('Position', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'spacing', title: <TabIcon icon={resizeCornerNE} label={__('Spacing', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'animation', title: <TabIcon icon={arrowRight} label={__('Animation', 'codeweber-gutenberg-blocks')} /> },
	{ name: 'settings', title: <TabIcon icon={cog} label={__('Settings', 'codeweber-gutenberg-blocks')} /> },
];

// Template для двух кнопок по умолчанию
const TEMPLATE = [
	['codeweber-blocks/button', {
		ButtonContent: 'Обсудить проект',
		ButtonType: 'solid',
		ButtonStyle: 'solid',
		ButtonColor: 'primary',
		ButtonSize: '',
		blockClass: 'me-1',
	}],
	['codeweber-blocks/button', {
		ButtonContent: 'Все услуги',
		ButtonType: 'solid',
		ButtonStyle: 'outline',
		ButtonColor: 'primary',
		ButtonSize: '',
	}],
];

const GroupButtonEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		groupAlignItems,
		groupJustifyContent,
		groupTextAlign,
		groupPosition,
		spacingType,
		spacingXs,
		spacingSm,
		spacingMd,
		spacingLg,
		spacingXl,
		spacingXxl,
		animationEnabled,
		animationType,
		animationDuration,
		animationDelay,
		blockClass,
		blockData,
		blockId,
	} = attributes;

	const blockProps = useBlockProps({
		className: getGroupButtonClassNames(attributes, 'edit'),
		id: normalizeGroupButtonId(blockId) || undefined,
	});

	// Анимация в редакторе (аналогично Card)
	useEffect(() => {
		const timer = setTimeout(() => {
			const currentBlock = document.querySelector(`[data-block="${clientId}"]`);
			if (!currentBlock) {
				return;
			}

			const elementWithCue =
				currentBlock.hasAttribute('data-cue') ? currentBlock : currentBlock.querySelector('[data-cue]');

			if (animationEnabled && animationType && elementWithCue && elementWithCue.hasAttribute('data-cue')) {
				elementWithCue.classList.remove('cue-hide', 'cue-show', 'cue-sticky');
				elementWithCue.removeAttribute('data-show');
				elementWithCue.style.animationDelay = '';
				elementWithCue.style.animationDuration = '';
				elementWithCue.style.opacity = '';

				const animationClasses = Array.from(elementWithCue.classList).filter(cls => 
					cls.startsWith('fadeIn') || cls.startsWith('slideIn') || 
					cls.startsWith('zoomIn') || cls.startsWith('zoomOut') ||
					cls.startsWith('rotateIn') || cls.startsWith('bounceIn') ||
					cls.startsWith('flipIn')
				);
				animationClasses.forEach(cls => elementWithCue.classList.remove(cls));

				elementWithCue.classList.add('cue-hide');
				elementWithCue.style.opacity = '0';

				if (typeof window.reinitScrollCue === 'function') {
					setTimeout(() => {
						window.reinitScrollCue();
					}, 50);
					
					setTimeout(() => {
						elementWithCue.classList.remove('cue-hide');
						elementWithCue.classList.add('cue-show');
						elementWithCue.style.opacity = '1';
						window.reinitScrollCue();
					}, 150);
				}
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [animationEnabled, animationType, animationDuration, animationDelay, clientId]);

	return (
		<>
			<InspectorControls>
				<TabPanel tabs={tabs}>
					{(tab) => (
						<>
							{tab.name === 'align' && (
								<div style={{ padding: '16px' }}>
									<PositioningControl
										title={__('Group align', 'codeweber-gutenberg-blocks')}
										alignItems={groupAlignItems}
										onAlignItemsChange={(value) => setAttributes({ groupAlignItems: value })}
										justifyContent={groupJustifyContent}
										onJustifyContentChange={(value) => setAttributes({ groupJustifyContent: value })}
										textAlign={groupTextAlign}
										onTextAlignChange={(value) => setAttributes({ groupTextAlign: value })}
										position={groupPosition}
										onPositionChange={(value) => setAttributes({ groupPosition: value })}
										noPanel={true}
									/>
								</div>
							)}
							{tab.name === 'spacing' && (
								<div style={{ padding: '16px' }}>
									<SpacingControl
										spacingType={spacingType}
										spacingXs={spacingXs}
										spacingSm={spacingSm}
										spacingMd={spacingMd}
										spacingLg={spacingLg}
										spacingXl={spacingXl}
										spacingXxl={spacingXxl}
										onChange={(key, value) => setAttributes({ [key]: value })}
									/>
								</div>
							)}
							{tab.name === 'animation' && (
								<div style={{ padding: '16px' }}>
									<AnimationControl
										attributes={attributes}
										setAttributes={setAttributes}
									/>
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
											classLabel: __('Group Class', 'codeweber-gutenberg-blocks'),
											dataLabel: __('Group Data', 'codeweber-gutenberg-blocks'),
											idLabel: __('Group ID', 'codeweber-gutenberg-blocks'),
										}}
									/>
								</div>
							)}
						</>
					)}
				</TabPanel>
			</InspectorControls>
			<div {...blockProps}>
				<InnerBlocks
					allowedBlocks={['codeweber-blocks/button']}
					template={TEMPLATE}
					templateLock={false}
				/>
			</div>
		</>
	);
};

export default GroupButtonEdit;

