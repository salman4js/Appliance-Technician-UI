export function globalMessageViewTemplate(options){
    return(
        <div className='global-message-wrapper'>
            <div className = {options.getClassName()}></div>
            <div className='global-message-message-label'>
                {options.message}
            </div>
            <div className = 'global-message-right-events-wrapper' onClick={() => options.onCloseGlobalMessage()}>
                {options.getIcon(options)}
            </div>
        </div>
    )
}