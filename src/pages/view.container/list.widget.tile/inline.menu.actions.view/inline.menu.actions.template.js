export function inlineMenuActionsTemplate(options) {
    return options.map((opts) => {
       if(!opts.disabled){
           return(
               <div className = 'inline-menu-actions' onClick = {() => opts.onClick()}>
                   <div className = 'text-center'>
                       {opts.value}
                   </div>
               </div>
           )
       }
    });
}