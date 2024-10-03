var commandsConstant = Object.freeze({
    LOCAL_SERVER: 'localhost',
    commandAcceptOrder: {
        label: 'Accept Order',
        onSuccess: 'Order has been accepted.'
    },
    commandCompleteOrder: {
        label: 'Mark it as completed',
        onSuccess: 'You have successfully completed this order.'
    },
    commandMoreDetails: {
        label: 'More Details'
    },
    commandDelete: {
        label: 'Delete',
        toastMessage: {
            403: 'Permission denied to perform this operation.',
            204: 'Selected admin details has been deleted',
            500: 'Internal server error occurred.'
        }
    },
    isCommandNotEnabled: {
        goBack: ['home'],
        addButton: ['home', 'properties']
    }
});

export default commandsConstant;