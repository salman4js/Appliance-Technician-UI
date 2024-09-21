import React from 'react';
import Tippy from '@tippy.js/react';
import './textfield.view.css';
import 'tippy.js/dist/tippy.css'; // optional

class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  };

  // Check input limit!
  checkLimit(event){
    const limit = this.props.data.limitValue !== undefined ? this.props.data.limitValue : 0; // By default limit value would be zero!
    var isGreater = event.target.value > limit;

    if(this.props.data.limitValue !== undefined){
      this.handleLimit(isGreater, event);
    } else {
      this.props.handleInputChange(this.props.index, event, this.props.data.attribute)
    }
  };

  // Handle input event separately!
  handleEvents(event){
    this.props.data.eventKeyRequired && this.props.handleInputChange(this.props.index, event, this.props.data.attribute);
  };

  // Handle limit value from the field data!
  handleLimit(isGreater, event){
    if(!isGreater){
      this.props.handleInputChange(this.props.index, event, this.props.data.attribute)
    } else {
      this.props.toggleButtonValue()
    }
  };

  // Text Field inline toast message!
  _showInlineToast(){
      return(
          this.props.data.inlineToast.isShow && (
              <small className="inline-toast-view" style = {{color: this.props.data?.inlineToast?.inlineToastColor || 'red'}}>
                {this.props.data.inlineToast.inlineMessage}
              </small>
          )
      )
  };

  _renderCustomFieldIcon(){
      if(this.props.data.customFieldIconWithToolTip){
        return(
            <Tippy content = {this.props.data.customFieldIconToolTip} placement= {this.props.data.customFieldIconToolTipPlacement || 'bottom'}>
              {this.props.data.showCustomFieldIcon()}
            </Tippy>
        )
      } else {
        return this.props.data.showCustomFieldIcon();
      }
  }

  // Get value for the input field!
  getValue(){
    if(this.props.data.value !== undefined){
      return Array.isArray(this.props.data.value) ? this.props.data.value.length : this.props.data.value;
    } else if(this.props.data.defaultValue !== undefined){
      return  this.props.data.defaultValue;
    } else {
      return ''; // Showing here as empty string, which will not be considered in nodeConvertor function, so its safe.
    }
  };

  // Get value for the placeholder!
  getValueForPlaceholder(){
    return this.props.data.placeholder;
  };

  // Get type of the input fields based on the data!
  getType(){
    return this.props.data.type !== undefined ? this.props.data.type : "text"; // Setting the default type as 'text'
  };

  render(){
    return(
        <div className="view-bottom-gap-10px" style = {{width: this.props.data.width, padding: this.props.data.padding}}>
          {this.props.data.label && (
              <label style={{ color: "black" }}> {this.props.data.label} </label>
          )}
          <span className= 'text-field-region'>
            <input type={this.getType()} className="form-control" aria-describedby="input-field" value = {this.getValue()}
                   placeholder={this.getValueForPlaceholder()} onKeyDown = {(event) => this.handleEvents(event)}
                   onChange = {(event) => this.checkLimit(event)} readOnly = {this.props.data.readOnly}/>
            {this.props.data.customFieldIconWithToolTip && (
                <span className = 'custom-field-icon'>
                  {this._renderCustomFieldIcon()}
                </span>
            )}
          </span>
          {this.props.data?.inlineToast !== undefined && (
              this._showInlineToast()
          )}
        </div>
    )
  };
};

export default TextField;