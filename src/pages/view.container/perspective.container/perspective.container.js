import React from 'react';
import _ from "lodash";
import './perspective.container.css';
import {nodeConvertor} from "../../../ui-components/common.functions/node.convertor";
import ListWidgetTile from "../list.widget.tile/list.widget.tile";
import PropertiesView from "../properties.view/properties.view";
import BlockActions from "../../../ui-components/fields/block.actions.view/block.actions.view";
import RestResourceConnector from "../../../rest.link.support/rest.resource.connector";
import Collections from "../../../ui-components/singleton.collection/singleton.collection";
import CustomModal from "../../../ui-components/fields/customModalField/custom.modal.view";
import MetadataFieldsView from "../../../ui-components/fields/metadata.fields.view";
import InlineMenuActionsView from "../list.widget.tile/inline.menu.actions.view/inline.menu.actions.view";
import PerspectiveContainerConstants from "./perspective.container.constants";

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
            },
            searchBoxFormContent: [{
                attribute: 'textField',
                placeholder: PerspectiveContainerConstants.searchBoxContent[props.status.viewOptions.expandedWidgetViewInfo.widgetLabel],
                name: 'searchText',
                width: '100%'
            }]
        };
        this.events = {
            customModal: {
                events: {}
            }
        };
        this.debouncedSearch = _.debounce(this._triggerSearch, 3000);
    };

    _perspectiveContainerViewSelector(){
        if(!this.state.isLoading && this.state.itemsList !== undefined){
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
        } else {
            return <BlockActions options = {{defaultTemplate: true}}/>
        }
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
          this.events._reloadPerspectiveContainer = (options) => this._getUserRolePerspectiveData(options);
          this.events.customModal.events.onCloseCustomModal = () => this.onCloseCustomModal();
          _.merge(this.state.options.events, this.events);
    };

    _renderSearchBoxView(){
        return (
            <div className = 'widget-searchbar-container'>
                <MetadataFieldsView data = {this.state.searchBoxFormContent} updateData = {(updatedData) => this._updateSearchBarContainer(updatedData)}/>
            </div>
        )
    };

    _updateSearchBarContainer(updatedData){
        this.setState({searchBoxFormContent: updatedData}, () => {
            this.debouncedSearch();
        })
    };

    _triggerSearch(){
        const searchTxt = nodeConvertor(this.state.searchBoxFormContent);
        this._getUserRolePerspectiveData({query:
                {[PerspectiveContainerConstants.searchBoxQueryName[this.state.options.viewOptions.expandedWidgetViewInfo.widgetLabel]]: searchTxt['searchText']}
        });
    };

    _shouldRenderSearchBar(){
        return  this.state.options.viewOptions.expandedWidgetViewInfo.widgetType === 'LIST';
    };

    _perspectiveContainerView(){
        return(
            <>
                {this._shouldRenderSearchBar() && this._renderSearchBoxView()}
                {this._perspectiveContainerViewSelector()}
            </>
        )
    };

    templateHelpers(){
        this._prepareEventHelpers();
        return this._perspectiveContainerView();
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

    formQueryParamBasedOnUserRole(opts){
        opts = opts || {};
        const query = {}, currentLoggedInUser = this._getCurrentLoggedInUserInfo();
        if(currentLoggedInUser.loggedInUserRole === 'worker'){
            query['workerPartner'] = currentLoggedInUser.loggedInWorkerId;
        } else {
            query['adminId'] = currentLoggedInUser.loggedInUserId
        }
        return _.merge(query, opts.query);
    };

    _getUserRolePerspectiveData(opts){
        this._toggleLoader(true);
        const options = {
            repoName: this.state.options.viewOptions.expandedWidgetViewInfo.widgetLabel,
            linkRel: 'nodeItems',
            method: 'get',
            query: this.formQueryParamBasedOnUserRole(opts)
        }
        RestResourceConnector.makeAjaxCall(options).then((resp) => {
            this.updateStateComponent({key: 'itemsList', value: resp.data.result, nextFunc: () => this._toggleLoader(false)})
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