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
        this.linkRel = {
            admin: 'admin_delete',
            admin_worker: 'admin_delete_worker'
        }
    };

    enabled(){
        return this.isSuperAdminUser() && (this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'admin' || this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'admin_worker');
    };

    execute(){
        if(this.checkNodeCondition()){
            RestResourceConnector.makeAjaxCall({method: 'delete', linkRel: 'admin_delete',
                repoName: this.status.viewOptions.expandedWidgetViewInfo.widgetLabel, query: this.formDeleteCommandQuery()})
                .then((resp) => {
                    this.status.events.customModal.events.onCloseCustomModal();
                    resp.status === 204 && this.status.events._reloadPerspectiveContainer();
                    this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: this.getToastMessageOpts(resp.status)}})
                }).catch((err) => {
                this.status.events.customModal.events.onCloseCustomModal();
                this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: this.getToastMessageOpts(err.status)}})
            });
        } else {
            this.status.events.customModal.events.onCloseCustomModal();
            this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage',
                value: {show: true, msgOptions: {state: 'rejected', message: commandsConstants.commandDelete[this.status.viewOptions.expandedWidgetViewInfo.widgetLabel].conflict}}})
        }
    };

    checkNodeCondition(){
        if(this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'admin_worker'){
            return this.status.selectedNode.orders.length > 0
                ? !(this.status.selectedNode.userAcceptedPendingOrder > 0 || this.status.selectedNode.userPendingOrder > 0)
                : true;
        } else {
            return true;
        }
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