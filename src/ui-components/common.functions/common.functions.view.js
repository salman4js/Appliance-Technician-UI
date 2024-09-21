import React from 'react';

// Form a style instance and return it!
export function getStyle(options){
  return{
    marginTop: options.marginTop,
    marginBottom: options.marginBottom,
    color: options.color,
    textAlign: options.textCenter ? "center" : "none",
    marginLeft: options.marginLeft,
    paddingTop: options.paddingTop,
    fontBold: options.fontBold,
    fontWeight: options.fontWeight,
    fontSize: options.fontSize
  }
}

// common label message!
export function commonLabel(opts){
  return(
    <div className = "common-label-message" style = {getStyle(opts)}>
      {opts.message}
    </div>
  )
}

// Spinner!
export function activityLoader(opts){
  return(
    <div>
      <div className = "text-center">
        <div className = "spinner-border" role="status" style = {getStyle(opts)}>
        </div>
      </div>
    </div>
  )
}

export function getBackArrow(){
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
           className="bi bi-arrow-return-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
              d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
      </svg>
  )
}

export function getAddButtonIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-plus"
             viewBox="0 0 16 16">
            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5z"/>
            <path
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
        </svg>
    )
}

export function getMenuActions(){
  return(
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots"
           viewBox="0 0 16 16">
        <path
            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
      </svg>
  )
}

export function getGlobalMessageCloseIcon(){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
             className="bi bi-check2-circle" viewBox="0 0 16 16">
            <path
                d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
            <path
                d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
        </svg>
    )
}
