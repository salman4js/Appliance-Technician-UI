import _ from 'lodash';
import commandsConstants from "../../commands.constants";
import RestResourceConnector from "../../../../rest.link.support/rest.resource.connector";
class CommandAcceptOrder {
    constructor(signatureOptions) {
        this.status = signatureOptions.perspectiveInformation;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: commandsConstants.commandAcceptOrder.label,
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Accept-Order'
        };
        this.postBody = {
            isOrderAccepted: true
        }
    };

    enabled(){
        // Check selected nodes conditions!
        if(this.status.selectedNode.isOrderAccepted){
            return false;
        }
        return this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'worker_order';
    };

    formAcceptOrderQuery(){
        return {
            workerPartner: this.status.selectedNode.workerPartner,
            selectedNodes: _.isArray(this.status.selectedNode._id) ? this.status.selectedNode._id : [this.status.selectedNode._id]
        }
    };

    getSuccessMsgOptions(){
        return {state: 'resolved', message: commandsConstants.commandAcceptOrder.onSuccess}
    };

    execute(){
        RestResourceConnector.makeAjaxCall({method: 'patch', linkRel: 'accept_order', repoName: 'order', query: this.formAcceptOrderQuery(),
            body: this.postBody}).then((resp) => {
                if(resp.data.success){
                    this.status.events.customModal.events.onCloseCustomModal();
                    this.status.events._reloadPerspectiveContainer();
                    this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: this.getSuccessMsgOptions()}})
                } else {
                    this.status.events.customModal.events.onCloseCustomModal();
                    this.status.events._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: true, msgOptions: {state: 'rejected', message: resp.data.message}}})
                }
            }).catch(() => {
            this.status.events.customModal.events.onCloseCustomModal();
        });
    };
}

export default CommandAcceptOrder;