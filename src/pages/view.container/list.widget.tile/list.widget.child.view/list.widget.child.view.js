import React from 'react';
import _ from 'lodash';
import './list.widget.child.view.css';
import ListWidgetChildViewConstants from "./list.widget.child.view.constants";
import listWidgetChildTemplate from "./list.widget.child.template";
import {booleanParser} from "../../../../ui-components/common.functions/node.convertor";
class ListWidgetChildView extends React.Component {
    constructor(options) {
        super(options);
        this.options = {
            listOptions: options.listOptions,
            widgetInformation: options.widgetInformation,
            _id: options._id
        }
    };

    templateHelpers(){
        this._prepareViewOptions();
        return listWidgetChildTemplate({subChildViewOptions: this.requiredOptionsArr})
    };

    _prepareViewOptions(){
        const requiredSubOptions = ListWidgetChildViewConstants.requiredViewOptions[this.options.widgetInformation.widgetLabel],
            requiredOptionsKey = Object.keys(requiredSubOptions);
        this.requiredOptionsArr = []
        requiredOptionsKey.map((optionsKey) => {
            const newOptionsObj = {};
            if(Object.keys(this.options.listOptions).includes(optionsKey)){
                newOptionsObj['key'] = requiredSubOptions[optionsKey];
                newOptionsObj['value'] = _.isBoolean(this.options.listOptions[optionsKey]) ? booleanParser(this.options.listOptions[optionsKey]) : this.options.listOptions[optionsKey];
                this.requiredOptionsArr.push(newOptionsObj);
            }
        })
    };

    render(){
        return this.templateHelpers();
    };
}

export default ListWidgetChildView;