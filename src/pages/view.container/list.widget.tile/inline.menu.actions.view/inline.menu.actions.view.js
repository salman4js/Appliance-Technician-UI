import React from 'react';
import './inline.menu.actions.view.css';
import {inlineMenuActionsTemplate} from "./inline.menu.actions.template";
import setupCommandsInstances from "../../../../ui-components/commands/base.commands.setup";
import _ from "lodash";

class InlineMenuActionsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: this.props.status
        }
    };

    templateHelpers(){
        this._prepareMenuActionCommands();
        return inlineMenuActionsTemplate(this.commands);
    };

    _prepareMenuActionCommands(){
        this.baseCommands = setupCommandsInstances({perspectiveInformation: this.state.options}, {inlineMenuActions: true});
        this.commands = this.baseCommands._getCommands();
    };

    render(){
        return this.templateHelpers();
    };
}

export default InlineMenuActionsView;