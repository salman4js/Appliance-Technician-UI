import CommandAcceptOrder from "./command.accept.order";
import commandsConstants from "../../commands.constants";

class CommandCompleteOrder extends CommandAcceptOrder {
    constructor(signatureOptions) {
        super(signatureOptions);
        this.defaults.value = commandsConstants.commandCompleteOrder.label;
        this.defaults.signature = 'Command-Complete-Order';
        this.postBody = {
            isOrderCompleted: true
        }
    };

    enabled(){
        // Check selected nodes conditions!
        const widgetCond = this.status.viewOptions.expandedWidgetViewInfo.widgetLabel === 'worker_order';
        return !!(widgetCond && this.status.selectedNode.isOrderAccepted && this.status.selectedNode.isOrderCompleted === false);
    };

    getSuccessMsgOptions(){
        return {state: 'resolved', message: commandsConstants.commandCompleteOrder.onSuccess}
    };
}

export default CommandCompleteOrder;