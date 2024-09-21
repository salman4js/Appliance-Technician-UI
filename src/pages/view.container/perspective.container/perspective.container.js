import React from 'react';
import _ from "lodash";
import ListWidgetTile from "../list.widget.tile/list.widget.tile";
import PropertiesView from "../properties.view/properties.view";
import BlockActions from "../../../ui-components/fields/block.actions.view/block.actions.view";
import RestResourceConnector from "../../../rest.link.support/rest.resource.connector";
import Collections from "../../../ui-components/singleton.collection/singleton.collection";
import CustomModal from "../../../ui-components/fields/customModalField/custom.modal.view";
import InlineMenuActionsView from "../list.widget.tile/inline.menu.actions.view/inline.menu.actions.view";

class PerspectiveContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            itemsList: undefined,
            options: props.status,
            childViewOptions: {
                customModal: {
                    show: false,
                    onHide: () => this.onCloseCustomModal(),
                    header: undefined,
                    centered: true,
                    restrictBody: true,
                    customComponent: undefined,
                    showBodyItemView: undefined,
                    modalSize: "medium",
                    footerEnabled: false,
                    footerButtons: undefined
                }
            }
        };
        this.events = {
            customModal: {
                events: {}
            }
        };
    };

    _perspectiveContainerViewSelector(){
        const widgetType = this.state.options.viewOptions.expandedWidgetViewInfo.widgetType,
        perspectives = {
            LIST: () => {
                return <ListWidgetTile listOptions = {this.state.itemsList} status = {this.state.options}
                _inlineMenuActionsView = {(options) => this._inlineMenuActionsView(options)} perspectiveChildOptions = {this.state.childViewOptions}
                _updatePerspectiveChildViewOptions = {(options) => this._updatePerspectiveContainerChildView(options)}/>
            },
            PROPERTIES: () => {
                return <PropertiesView status = {this.state.options} updateItemsList = {(options) => this._updateNodeItemsList(options)}/>
            }
        }
        return perspectives[widgetType]();
    };

    _inlineMenuActionsView(options){
        this.state.options['selectedNode'] = options.selectedNode;
        return <InlineMenuActionsView status = {this.state.options} />
    };

    onCloseCustomModal(){
        this.state.childViewOptions.customModal.show = false;
        this.state.childViewOptions.customModal.onHide = () => this.onCloseCustomModal();
        this._updatePerspectiveContainerChildView({value: {customModal: this.state.childViewOptions.customModal}});
    };

    _updatePerspectiveContainerChildView(options){
        options['key'] = 'childViewOptions';
        this.updateStateComponent(options);
    };

    _updateNodeItemsList(options){
        _.isArray(this.state.itemsList) ? this.state.itemsList.push(options.property) : (this.state.itemsList = [options.property]);
        this.updateStateComponent({key: 'itemsList', value: this.state.itemsList});
    };

    _prepareEventHelpers(){
          this.events._reloadPerspectiveContainer = () => this._getUserRolePerspectiveData();
          this.events.customModal.events.onCloseCustomModal = () => this.onCloseCustomModal();
          _.merge(this.state.options.events, this.events);
    };

    templateHelpers(){
        this._prepareEventHelpers();
        if(!this.state.isLoading && this.state.itemsList !== undefined){
            return this._perspectiveContainerViewSelector();
        } else {
            return <BlockActions options = {{defaultTemplate: true}}/>
        }
    };

    updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    _toggleLoader(val){
        this.setState({isLoading: val});
    };

    _getCurrentLoggedInUserInfo(){
        return Collections.getCollections('userInfo').data;
    };

    formQueryParamBasedOnUserRole(){
        const query = {}, currentLoggedInUser = this._getCurrentLoggedInUserInfo();
        if(currentLoggedInUser.loggedInUserRole === 'worker'){
            query['workerPartner'] = currentLoggedInUser.loggedInWorkerId;
        } else {
            query['adminId'] = currentLoggedInUser.loggedInUserId
        }
        return query;
    };

    _getUserRolePerspectiveData(){
        this._toggleLoader(true);
        const options = {
            repoName: this.state.options.viewOptions.expandedWidgetViewInfo.widgetLabel,
            linkRel: 'nodeItems',
            method: 'get',
            query: this.formQueryParamBasedOnUserRole()
        }
        RestResourceConnector.makeAjaxCall(options).then((resp) => {
            this.updateStateComponent({key: 'itemsList', value: resp.result, nextFunc: () => this._toggleLoader(false)})
        }).catch((err) => {
            console.log(err);
        });
    };

    _shouldRenderCustomModal(){
        if(this.state.childViewOptions.customModal.show){
            return <CustomModal modalData = {this.state.childViewOptions.customModal}/>
        }
    };

    render(){
        return(
            <>
                {this.templateHelpers()}
                {this.state.childViewOptions?.customModal?.show && this._shouldRenderCustomModal()}
            </>
        )
    };

    componentDidMount() {
        this._getUserRolePerspectiveData();
    };

    componentDidUpdate() {
        if(!_.isEqual(this.props.status.viewOptions.expandedWidgetViewInfo, this.state.options.viewOptions.expandedWidgetViewInfo)){
            this.updateStateComponent({key: 'options', value: this.props.status});
        }
    };
}

export default PerspectiveContainer;