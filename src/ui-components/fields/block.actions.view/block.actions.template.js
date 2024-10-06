import React from "react";
import {Oval} from "react-loader-spinner";

export function templateHelpers(options){
  if(options?.defaultTemplate){
      return (
          <div className="d-flex align-items-center justify-content-center">
              <div className = 'top-align'>
                  <Oval
                      visible={true}
                      height="80"
                      width="80"
                      color="black"
                      secondaryColor='grey'
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                  />
                  <p className="text-center loading-message">{options.message}</p>
              </div>
          </div>
      )
  } else {
      return (
          <div className='loader-body-field'>
              <div className="loader-field"></div>
          </div>
      )
  }
};