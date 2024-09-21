// Stepper wizard template helpers
export function templateHelpers(options){
  return(
    <div className="stepper-wizard">
      <div className="overlay">
        <div className="stepper-wizard-content">
          <div className = 'stepper-wizard-header brew-cursor'>
            <span>
              {options.propsData.header}
            </span>
            <span className="stepper-wizard-close" onClick = {(event) => options.closeWizard(event)}>&times;</span>
          </div>
          <div className = 'stepper-wizard-body' style = {{height: options.bodyViewHeight}}>
            {options.callBodyView()}
          </div>
          <div className = 'stepper-wizard-footer'>
            {options.callFooter()}
          </div>
        </div>
      </div>
    </div>
  )
};