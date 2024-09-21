
class CommandsHeaderMenu {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            disabled: this.isDisabled,
            value: this.status.viewOptions.expandedWidgetViewInfo.widgetName,
            onClick: () => this.execute(),
            signature: 'Command-HeaderMenu'
        }
    };

    enabled(){
        return true;
    };

    execute(){

    };
}

export default CommandsHeaderMenu;