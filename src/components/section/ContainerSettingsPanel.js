import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';

export const ContainerSettingsPanel = ({
	containerType,
	containerClass,
	onContainerChange,
}) => (
	<PanelBody
		title={__('Container Settings', 'codeweber-gutenberg-blocks')}
		className="custom-panel-body"
		initialOpen={true}
	>
		<SelectControl
			label={__('Container Type', 'codeweber-gutenberg-blocks')}
			value={containerType}
			options={[
				{ label: 'Container', value: 'container' },
				{ label: 'Container Fluid', value: 'container-fluid' },
				{ label: 'Container XXL', value: 'container-xxl' },
			]}
			onChange={(value) => onContainerChange('containerType', value)}
		/>
		<TextControl
			label={__('Container Class', 'codeweber-gutenberg-blocks')}
			value={containerClass}
			onChange={(value) => onContainerChange('containerClass', value)}
		/>
	</PanelBody>
);

export default ContainerSettingsPanel;


