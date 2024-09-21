import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import { getStyle } from '../../common.functions/common.functions.view'

const ListField = (props) => {

  const [options, setOptions] = useState(props.data.options);

  // Handle input change for the metadata fields!
  function inputChange(event){
    // Pass the selected value to the parent base class(Metadata)!
    props.handleInputChange(props.index, event, props.data.attribute)
  };
  
  // Get selected value for the options!
  function getSelected(){
    return props.data.placeholder;
  };

  function populationMethod(resp, asyncOptions){
    const options = [];
    resp.map((res) => {
      const opts = {
        value: res[asyncOptions.value],
        actualValue: res[_.isArray(asyncOptions.actualValue) ? asyncOptions.actualValue[0] : asyncOptions.actualValue]
      }
      options.push(opts);
    })
    setOptions(options);
  };
  
  // Get value for the selected data!
  function getValue(opts){
    return opts.actualValue !== undefined ? opts.actualValue : opts.value;
  };

  useEffect(() => {
    if(props.data.options === undefined && props.data.async && props.data.asyncOptions.populationRequired && props.data.asyncOptions.restResourceValue !== undefined){
        populationMethod(props.data.asyncOptions.restResourceValue, props.data.asyncOptions.populationOptions);
    }
  }, []);

  return (
    <div className = "view-bottom-gap-10px" style = {{width: props.data.width, padding: props.data.padding}}>
      {props.data.label && (
        <label className = "metadata-label" style = {getStyle(props.data.style)}> {props.data.label} </label>
      )}
      <select className = "form-control" onChange = {(event) => inputChange(event)}>
        <option value="" disabled selected>{getSelected()}</option>
        {options && options.map((opts, key) => {
          if(!opts.value && Array.isArray(props.data.options)){
            var convertedOpts = convertIntoListFieldOptions(opts);
            return(
                <option value = {getValue(convertedOpts)}>{convertedOpts.value}</option>
            )
          } else {
            return(
                <option value = {getValue(opts)}>{opts.value}</option>
            )
          }
        })}
      </select>
    </div>
  )
}

// Convert normal array into listField options!
export function convertIntoListFieldOptions(option){
  return {
    value: option.value,
    actualValue: option.actualValue
  }
};

export default ListField;