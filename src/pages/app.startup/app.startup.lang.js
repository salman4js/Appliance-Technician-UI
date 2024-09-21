const AppStartupConstants = Object.freeze({
    fieldValue: {
        username: {
            placeholder: 'User Name',
            name: 'userName',
            width: '100%',
            inlineToastColor: 'white'
        },
        password: {
            placeholder: 'Password',
            name: 'password',
            width: '100%',
            type: 'password',
            inlineToastColor: 'white'
        },
        singIn: {
            value: 'Sign In'
        }
    },
    blockActionsMessage: 'Authenticating...',
    configFetchError: 'Error while fetching the config, please try again!'
});

export default AppStartupConstants;