import React from 'react';

export default function viewContainerTemplate(options){
    return(
       <>
           <div className='view-container-header-control'>
               {options.headerControlOptions()}
           </div>
           <div className = 'view-container-child-view-options'>
               {options.childViewOptions()}
           </div>
       </>
    )
}