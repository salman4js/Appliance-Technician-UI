const ListWidgetChildViewConstants = {
    requiredViewOptions: Object.freeze({
        admin: {
            userRole: 'User Role'
        },
        admin_worker: {
            userBalance: 'User Balance',
            userPendingOrder: 'User Pending Order',
            userAcceptedPendingOrder: 'User Accepted Pending Order'
        },
        admin_order: {
            orderDeadline: 'Order Deadline',
            isOrderAccepted: 'Order Accepted',
            isOrderCompleted: 'Order Completed'
        },
        worker_order: {
            orderDeadline: 'Order Deadline',
            isOrderAccepted: 'Order Accepted',
            isOrderCompleted: 'Order Completed'
        }
    })
}

export default ListWidgetChildViewConstants;