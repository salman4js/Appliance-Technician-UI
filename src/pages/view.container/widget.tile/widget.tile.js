import React from 'react';
import _ from 'lodash';
import './widget.tile.css';
import {widgetTileTemplate} from "./widget.tile.template";
import BlockActions from "../../../ui-components/fields/block.actions.view/block.actions.view";
import RestResourceConnector from "../../../rest.link.support/rest.resource.connector";
import Collections from "../../../ui-components/singleton.collection/singleton.collection";

class WidgetTile extends React.Component {
    constructor(options) {
        super(options);
        this.options = options;
        this.state = {
            isLoading: true,
            widgetOptions: undefined
        }
        this.widgetTileEvents = {
            onClick: (tileInfo) => this.onWidgetTileClick(tileInfo)
        }
    };

    templateHelpers(){
        if(!this.state.isLoading){
            return widgetTileTemplate(this.state.widgetOptions, this.widgetTileEvents);
        } else {
            return <BlockActions options = {{defaultTemplate: true}}/>
        }
    };

    onWidgetTileClick(tileInfo){
        tileInfo.widgetType = 'LIST';
        this.options.updateViewContainer({key: 'viewOptions', value: {isWidgetViewExpanded: true, expandedWidgetViewInfo: tileInfo}});
    };

    updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    _toggleLoader(value){
        this.setState({isLoading: value});
    };

    _getCurrentUserRole(){
        return Collections.getCollections('userInfo').data;
    };

    _getListOfWidgets(){
        RestResourceConnector.makeAjaxCall({repoName:'widgets', linkRel: 'widgets', method: 'get', query: {userRole: this._getCurrentUserRole().loggedInUserRole}}).then((resp) => {
            if(resp.data.success){
                this.updateStateComponent({key: 'widgetOptions', value: resp.data.result, nextFunc: () => this._toggleLoader(false)})
            } else {

            }
        });
    };

    componentDidMount() {
        this._getListOfWidgets();
    };

    render(){
        return this.templateHelpers();
    };

}

export default WidgetTile;