import commandsConstants from "../../commands.constants";

class CommandMoreDetails {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: commandsConstants.commandMoreDetails.label,
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-More-Details'
        };
    };

    enabled(){
        return this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'worker_order';
    };

    execute(){
        const tileInfo = {
            widgetType: 'PROPERTIES',
            widgetName: 'Properties',
            widgetLabel: 'properties',
            mode: 'READ'
        }
        this.status.events.customModal.events.onCloseCustomModal();
        this.status.events._updateStateRouter({key: 'viewOptions', value: {isWidgetViewExpanded: true, expandedWidgetViewInfo: tileInfo}});
    };
}

export default CommandMoreDetails;