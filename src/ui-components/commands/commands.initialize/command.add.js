import {getAddButtonIcon} from "../../common.functions/common.functions.view";
import commandsConstant from "../commands.constants";
import Collections from "../../singleton.collection/singleton.collection";

class CommandAdd {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getAddIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Add'
        }
    };

    _getCurrentUserRole(){
        return Collections.getCollections('userInfo').data.loggedInUserRole;
    };

    _isCurrentUserAdminRole(){
        const userRole = this._getCurrentUserRole();
        return userRole === 'superAdmin' || userRole === 'Admin';
    };
    enabled(){
        // Add command should be enabled for the user with super admin or admin role.
        const widgetCond = !commandsConstant.isCommandNotEnabled.addButton.includes(this.status.viewOptions.expandedWidgetViewInfo.widgetLabel);
        return !!(this._isCurrentUserAdminRole() && widgetCond);

    };

    execute(){
        const tileInfo = {
            widgetType: 'PROPERTIES',
            widgetName: 'Properties',
            widgetLabel: 'properties'
        }
        this.status.events._updateStateRouter({key: 'viewOptions', value: {isWidgetViewExpanded: true, expandedWidgetViewInfo: tileInfo}});
    };

    getAddIcon(){
        return getAddButtonIcon();
    };
}

export default CommandAdd;