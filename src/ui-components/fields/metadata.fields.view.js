import React from 'react';
import DateField from './datefield/datefield.view';
import TextField from './textfield/textfield.view';
import ListField from './listfield/listfield.view';
import DataList from './dataListField/datalist.field.view';
import CheckBox from './checkBoxField/checkbox.field.view';
import ButtonField from './buttonField/button.field.view';
import LabelField from './labelField/label.field.view';
import StepperField from './stepperField/stepper.field.view';
import TextareaField from "./textareafield.view/textareafield.view";

const MetadataFields = (props) => {

  // Get input value!
  function getInputValue(event, attribute){
    if(attribute === 'dateField' || attribute === "dataListField" || attribute === "checkBoxField" || attribute === 'stepperButtonField'){
      return event.value ? event.value : event;
    } else {
      return event.target.value;
    }
  };
  
  // Get actual value helps in listField and dataListField fields to get the actual value!
  function getActualValue(event, attribute){ // As of now this only supports in dataListField since we populate actual value for listField in the state itself.
    if(attribute === 'dataListField'){
      return event.actualValue;
    };
  };
  
  // Update field should vanish field state! // TODO: Change this function later to work on all the variety scenarios!
  function _updateFieldShouldVanish(fieldState, index, dependentValueField, currentFieldIndex){
    if(fieldState[index].fieldShouldVanish){ 
        if(!fieldState[currentFieldIndex].dependentValueUpdateWithNoCondition && fieldState[currentFieldIndex].value !== fieldState[currentFieldIndex].defaultValue){ // Here, we restrict the value only
            // if the changed value is not as same as Default value
          fieldState[index].restrictShow = true;
        } else {
          fieldState[index].restrictShow = false;
        };
    };
  };
  
  // Prepare dependent value field only on the supported format!
  function prepareDependentValueField(dependentValueField){
    var dependentValue = [];
    if(Array.isArray(dependentValueField)){
      for (var dependentVal of dependentValueField){
        dependentValue.push(dependentVal);
      };
      return dependentValue;
    } else if(typeof dependentValueField === 'string'){
      return [dependentValueField]; // in case of string, convert the string into array then return it.
    } else {
      throw new Error('dependent value is not in supported format')
    }
  };

  // NOTE: dependentValueField --> Takes array or string, if string passed, it will be converted into an array!
  // Update the dependent value field!
  function updateDependantValueField(dependentValueField, currentFieldIndex) {
    // DependentValueField could be array if multiple fields value should be changes, therefore, changing the dependentValue to array values even though it's a string!
    // First, check for the dependentValueField type and throw error if not in supported type!
    var dependentValues = prepareDependentValueField(dependentValueField);
    const fieldState = [...props.data];    
    // Loop through the array and find the dependent field name!
    fieldState.forEach((options, index) => {
      if (dependentValues.includes(options.name)) {
        fieldState[index].value = undefined;
        fieldState[index].isChanged = false;
        if (options.updateIsRequiredOnDependentValue) {
          fieldState[index].isRequired = false;
          // Check if the dependent value should vanish!
          fieldState[index].fieldShouldVanish && _updateFieldShouldVanish(fieldState, index, dependentValueField, currentFieldIndex);
        };
      };
    });
    props.updateData(fieldState);
  }

  // Handle input change!
  const handleInputChange = (index, event, attribute) => {
    const fieldState = [...props.data]; // Create a copy of the state array
    // If the field value needs to be changed while changing the input itself, This condition will be useful to do the conversion.
    // conversionInFieldConvertor flag should be set to true and conversionMethod has to be specified.
    fieldState[index].value = fieldState[index].conversionInFieldConvertor ? fieldState[index].conversionMethod(getInputValue(event, attribute))
        : getInputValue(event, attribute) // Update the value at the specified index
    fieldState[index].actualValue = getActualValue(event, attribute);
    fieldState[index].isChanged = true; // Change the metadata field value to true when the value changed!
    if(fieldState[index].eventKeyRequired && event.key){ // If event key is required, and if the event key is not undefined.
      // Send the key back to the respective component!
      fieldState[index].eventKey = event.key;
    };
    props.toggleButtonProp &&  props.toggleButtonProp("success", false); // Make buttons enable when the field value is changed!
    props.updateData(fieldState); // Update the state with the updated array
    fieldState[index].callBackAfterUpdate && fieldState[index].callBackAfterUpdate(fieldState);
    fieldState[index].dependentValue && updateDependantValueField(fieldState[index].dependentValue, index);
  };
  
  // Disable and enable custom modals footer buttons!
  function toggleButtonValue(){
    props.toggleButtonProp && props.toggleButtonProp("success", true)
  };

  if(props.data !== undefined){
    return (
        <>
          {props.data.map((field, index) => {
            if (field.attribute === 'dateField' && field.restrictShow !== true) {
              return (
                <DateField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
              );
            }

            if (field.attribute === 'textField' && field.restrictShow !== true) {
              return (
                <TextField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)}
                  toggleButtonValue = {() => toggleButtonValue()}
                 />
              );
            }

            if (field.attribute === 'textAreaField' && field.restrictShow !== true) {
              return (
                  <TextareaField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)}
                             toggleButtonValue = {() => toggleButtonValue()}
                  />
              );
            }
            
            if(field.attribute === 'listField' && field.restrictShow !== true) {
              return(
                <ListField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
              )
            }
            
            if(field.attribute === 'dataListField' && field.restrictShow !== true) {
              return(
                <DataList data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
              )
            }
            
            if(field.attribute === "checkBoxField" && field.restrictShow !== true){
              return(
                <CheckBox data = {field} index = {index} checkboxIndex = {props.checkboxIndex} 
                handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)}  />
              )
            }
            
            if(field.attribute === 'buttonField' && field.restrictShow !== true){
              return(
                <ButtonField data = {field} />
              )
            }
            
            if(field.attribute === 'labelField' && field.restrictShow !== true){
              return (
                <LabelField data = {field} />
              )
            }
            
            if(field.attribute === 'stepperButtonField' && field.restrictShow !== true){
              return(
                <StepperField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
              )
            }
            
            return null;
          })}
        </>
    );
  };
};

export default MetadataFields;
