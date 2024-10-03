import _ from 'lodash';
import Collections from "../../../singleton.collection/singleton.collection";
import RestResourceConnector from "../../../../rest.link.support/rest.resource.connector";
import commandsConstants from "../../commands.constants";

class CommandDelete {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: commandsConstants.commandDelete.label,
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Delete'
        };
    };

    enabled(){
        return this.isSuperAdminUser() && this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'admin';
    };

    execute(){
        RestResourceConnector.makeAjaxCall({method: 'delete', linkRel: 'admin_delete', repoName: 'admin', query: this.formDeleteCommandQuery()})
            .then((resp) => {
                this.status.events.customModal.events.onCloseCustomModal();
                resp.status === 204 && this.status.events._reloadPerspectiveContainer();
                this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: this.getToastMessageOpts(resp.status)}})
            }).catch((err) => {
                this.status.events.customModal.events.onCloseCustomModal();
                this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: this.getToastMessageOpts(err.statusCode)}})
        });
    };

    getToastMessageOpts(statusCode){
        const state = statusCode === 204 ? 'resolved' : 'rejected';
        return {state: state, message: commandsConstants.commandDelete.toastMessage[statusCode]}
    };

    isSuperAdminUser(){
        return this._getLoggedInUserDataFromCollection().loggedInUserRole === 'superAdmin';
    };

    formDeleteCommandQuery(){
        return {
            adminId: this._getLoggedInUserDataFromCollection().loggedInUserId,
            selectedNodes: _.isArray(this.status.selectedNode._id) ? this.status.selectedNode._id : [this.status.selectedNode._id]
        }
    };

    _getLoggedInUserDataFromCollection(){
        return Collections.getCollections('userInfo').data;
    };
}

export default CommandDelete;