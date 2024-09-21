import commandsConstant from '../commands.constants';
import {getBackArrow} from "../../common.functions/common.functions.view";

class CommandsGoBack {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getGoBackIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-GoBack'
        }
    };

    enabled(){
        return !commandsConstant.isCommandNotEnabled.goBack.includes(this.status.viewOptions.expandedWidgetViewInfo.widgetLabel);
    };

    execute(){
       this.status.events._updateStateRouter({action: 'DELETE'});
    };

    getGoBackIcon() {
        return getBackArrow();
    };
}

export default CommandsGoBack;