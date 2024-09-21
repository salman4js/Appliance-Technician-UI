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
    isCommandNotEnabled: {
        goBack: ['home'],
        addButton: ['home', 'properties']
    }
});

export default commandsConstant;