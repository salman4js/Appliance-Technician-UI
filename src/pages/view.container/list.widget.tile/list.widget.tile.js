import React from 'react';
import './list.widget.tile.css';
import ListWidgetChildView from "./list.widget.child.view/list.widget.child.view";
import listWidgetTileTemplate from "./list.widget.tile.template";
import ListWidgetTileConstants from "./list.widget.tile.constants";
import Collections from "../../../ui-components/singleton.collection/singleton.collection";

class ListWidgetTile extends React.Component {
    constructor(options) {
        super(options);
        this.options = options;
        this.widgetInformation = this.options.status.viewOptions.expandedWidgetViewInfo;
    };

    templateHelpers(){
        return listWidgetTileTemplate({listOptions: this.options.listOptions,
            subChildView: (listOptions) => this._renderListSubChildView(listOptions),
            getLabel: () => this.getWidgetTileHeaderKey(),
            _showModalDialog: (listItem) => this._showModalDialog(listItem), _shouldShowMenuAction: () => this._shouldShowMenuAction()});
    };

    getWidgetTileHeaderKey(){
        return ListWidgetTileConstants[this.widgetInformation.widgetLabel];
    };

    _renderListSubChildView(listOptions){
        return <ListWidgetChildView listOptions = {listOptions} widgetInformation = {this.widgetInformation}/>
    };

    _getCustomModalHeader(){
        return ListWidgetTileConstants.action_modal_header[this.widgetInformation.widgetLabel].customModalHeader;
    };

    _inlineMenuActionsView(selectedNode){
        return this.props._inlineMenuActionsView({selectedNode: selectedNode});
    };

    _prepareModalData(selectedNode){
        this.props.perspectiveChildOptions.customModal.show = true;
        this.props.perspectiveChildOptions.customModal.header = this._getCustomModalHeader();
        this.props.perspectiveChildOptions.customModal.restrictBody = false;
        this.props.perspectiveChildOptions.customModal.showBodyItemView = () => this._inlineMenuActionsView(selectedNode);
        this.props._updatePerspectiveChildViewOptions({value: {customModal: this.props.perspectiveChildOptions.customModal}})
    };

    _getLoggedInUserInfo(){
        return Collections.getCollections('userInfo').data;
    };

    _isOrderWidget(){
        return this.widgetInformation.widgetLabel === 'admin_order';
    };

    _shouldShowMenuAction(){
          const loggedInUserInfo = this._getLoggedInUserInfo();
          if(loggedInUserInfo.loggedInUserRole === 'worker'){
              return true;
          } else {
              return !this._isOrderWidget();
          }
    };

    _showModalDialog(selectedNode){
        this._prepareModalData(selectedNode);
    };

    render(){
        return this.templateHelpers();
    };
}

export default ListWidgetTile;