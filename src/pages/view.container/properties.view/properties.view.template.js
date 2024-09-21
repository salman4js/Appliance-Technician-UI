export function propertiesViewTemplate(options){
    return(
       <div className='properties-form-view-wrapper'>
           <div className='properties-form-view container'>
               {options.renderFormView()}
           </div>
           <div className = 'properties-form-view-button-region container'>
               {options.renderButtonsView()}
           </div>
       </div>
    )
}