import React from "react";
import _ from 'lodash';
import WidgetTileLang from "./widget.tile.lang";
import {commonLabel} from "../../../ui-components/common.functions/common.functions.view";

export function widgetTileTemplate(widgetOptions, widgetEvents){
    if(widgetOptions && _.isArray(widgetOptions) && widgetOptions.length > 0){
        return widgetOptions.map((tileInfo) => {
            return (
                <div className = 'widget-tile' onClick = {() => widgetEvents.onClick(tileInfo)}>
                    <div className = 'widget-tile-title'>
                        {tileInfo.widgetName}
                    </div>
                </div>
            )
        });
    } else {
        return commonLabel({message: WidgetTileLang.noWidgetAvailable});
    }
}