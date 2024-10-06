import React from 'react';
import {getMenuActions} from "../../../ui-components/common.functions/common.functions.view";

export default function listWidgetTileTemplate(listItemOptions){
    return(
        <div className='list-widget-item-wrapper'>
            {listItemOptions.listOptions.map((options) => {
                return(
                    <div className='list-widget-tile-wrapper'>
                        <div className = 'list-widget-tile-container'>
                            <div className= 'list-widget-tile-title'>
                                {options[listItemOptions.getLabel()]}
                            </div>
                            <div>
                                {listItemOptions.subChildView && listItemOptions.subChildView(options)}
                            </div>
                        </div>
                        {listItemOptions._shouldShowMenuAction() && (
                            <div className = 'list-widget-menu-actions'>
                                <div className='list-child-menu-actions' onClick={() => listItemOptions._showModalDialog(options)}>
                                    {getMenuActions()}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}