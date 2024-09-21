import React from 'react';
import _ from 'lodash';
import './header.view.control.css';
import {headerViewControlTemplate} from "./header.view.control.template";
import HeaderViewControlConstants from "./header.view.control.constants";
import setupCommandsInstances from "../../../ui-components/commands/base.commands.setup";

class HeaderViewControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props
        }
    };

    _prepareCommands(){
        this.baseCommands = setupCommandsInstances(this.state.options);
        this.commands = this.baseCommands._getCommands();
    };

    getHeaderCustomClassName(commandSignature){
        return HeaderViewControlConstants.headerCustomClassName[commandSignature];
    };

    templateHelpers(){
        this._prepareCommands();
        return headerViewControlTemplate({commands: this.commands, getHeaderClassName: (commandSignature) => this.getHeaderCustomClassName(commandSignature)});
    };

    _updateStateValue(updatedValue){
        this.setState({options: updatedValue});
    };

    render(){
        return this.templateHelpers();
    };

    componentDidUpdate() {
       if(!_.isEqual(this.props.perspectiveInformation.viewOptions.expandedWidgetViewInfo, this.state.options.perspectiveInformation.viewOptions.expandedWidgetViewInfo)){
          this._updateStateValue(this.props);
       }
    };
}

export default HeaderViewControl;