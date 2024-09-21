import React from 'react';
import _ from 'lodash';
import './global.message.view.css';
import {globalMessageViewTemplate} from "./global.message.view.template";
import {getGlobalMessageCloseIcon} from "../../../ui-components/common.functions/common.functions.view";

class GlobalMessageView extends React.Component {
    constructor(props) {
        super(props);
        this.events = {};
    };

    templateHelpers(){
        this._prepareEventHandlers();
        return globalMessageViewTemplate(this.props.msgOptions);
    };

    getIcon(){
        return getGlobalMessageCloseIcon();
    };

    onCloseGlobalMessage(){
          this.props._updateViewContainerState({bulkUpdate: true, key: 'globalMessage', value: {show: false}})
    };

    getClassNameBasedOnState(){
        return this.props.msgOptions.state === 'resolved' ? 'global-message-success-icon' : 'global-message-information-icon';
    };

    _prepareEventHandlers(){
        this.events.getIcon = (opt) => this.getIcon(opt);
        this.events.getClassName = () => this.getClassNameBasedOnState();
        this.events.onCloseGlobalMessage = () => this.onCloseGlobalMessage();
        _.merge(this.props.msgOptions, this.events);
    };

    render(){
        return this.templateHelpers();
    };
}

export default GlobalMessageView;