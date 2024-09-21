import React from 'react';
import './properties.view.css';
import _ from 'lodash';
import BlockActions from "../../../ui-components/fields/block.actions.view/block.actions.view";
import RestResourceConnector from "../../../rest.link.support/rest.resource.connector";
import MetadataFields from "../../../ui-components/fields/metadata.fields.view";
import {propertiesViewTemplate} from "./properties.view.template";
import {validateFieldData, nodeConvertor, booleanParser} from "../../../ui-components/common.functions/node.convertor";
import Collections from "../../../ui-components/singleton.collection/singleton.collection";

class PropertiesView extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            form: undefined,
            buttons: [{
                id: 'properties-save',
                btnValue: 'Save',
                onClick: () => this.onSave(),
                isDark: false,
                occupyFullSpace: true,
                customClass: 'btn btn-success',
                attribute: 'buttonField'
            }]
        }
    };

    templateHelpers(){
      if(!this.state.isLoading){
          return propertiesViewTemplate({renderFormView: () => this.renderFormView(), renderButtonsView: () => this.renderButtonsView()})
      } else {
          return <BlockActions options = {{defaultTemplate: true}}/>
      }
    };

    renderFormView(){
        return <MetadataFields data = {this.state.form} updateData = {(updatedData) => this._updateStateComponent({key: 'form', value: updatedData})}/>
    };

    isFormReadOnlyMode(){
        return this.props.status.viewOptions.expandedWidgetViewInfo.mode === 'READ';
    };

    renderButtonsView(){
        if(!this.isFormReadOnlyMode()){
            return <MetadataFields data = {this.state.buttons} />
        }
    };

    _getLoggedInUserDataFromCollection(){
        return Collections.getCollections('userInfo').data;
    };

    onSave(){
        validateFieldData(this.state.form, (result) => this.setState({form: result})).then((result) => {
            if(result.length === 0){
                this._toggleLoader(true);
                const fieldData = nodeConvertor(this.state.form), loggedUserInfo = this._getLoggedInUserDataFromCollection();
                fieldData['userRole'] = loggedUserInfo.loggedInUserRole;
                const options = {
                    linkRel: this.widget,
                    repoName: this.widget,
                    method: 'post',
                    body: fieldData,
                    query: {
                        adminId: loggedUserInfo.loggedInUserId
                    }
                }
                RestResourceConnector.makeAjaxCall(options).then((resp) => {
                    resp.statusCode === 201 && this.props.updateItemsList({property: _.isArray(resp.result) ? resp.result[0] : resp.result});
                    this.props.status.events._updateStateRouter({action: 'DELETE'});
                }).catch((err) => {

                }).finally(() => {
                    this._toggleLoader(false);
                })
            }
        })
    };

    _toggleLoader(val){
      this._updateStateComponent({key: 'isLoading', value: val});
    };

    _updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    prepareQueryParams(requiredQuery){
        const query = requiredQuery[0]
        return {
            [query]: this._getLoggedInUserDataFromCollection().loggedInUserId
        }
    };

    fetchAsyncFieldData(field) {
        return new Promise((resolve) => {
            // Check for query required.
            if (field.asyncOptions.restResources.queryRequired && field.asyncOptions.restResources.queryRequired.length > 0) {
                field.asyncOptions.restResources.query = this.prepareQueryParams(field.asyncOptions.restResources.queryRequired);
            }
            RestResourceConnector.makeAjaxCall(field.asyncOptions.restResources).then((resp) => {
                if (resp.statusCode === 200) {
                    field.asyncOptions.restResourceValue = resp.result;
                    resolve(field);
                } else {
                    resolve();
                }
            }).catch((err) => {
                console.log(err);
                resolve();
            });
        });
    }

    checkForAsyncAndPopulate(formFields) {
        const promises = formFields.map((field) => {
            if (field.async) {
                return this.fetchAsyncFieldData(field);
            } else {
                return field;
            }
        });
        return Promise.all(promises).then((result) => {
            return result;
        });
    };

    populateFormValue(formDialog){
        formDialog.map((formField) => {
           formField.value = _.isBoolean(this.props.status.selectedNode[formField.name])
               ? booleanParser(this.props.status.selectedNode[formField.name]) : this.props.status.selectedNode[formField.name];
        });
        return formDialog;
    };

    getFormDialog() {
        const prevRouterInfo = this.props.status.routerInformation.viewContainer[this.props.status.routerInformation.viewContainer.length - 2],
            prevWidgetInfo = prevRouterInfo.expandedWidgetViewInfo;
        this.widget = prevWidgetInfo.widgetLabel;

        RestResourceConnector.makeAjaxCall({ repoName: 'properties_form', linkRel: 'formDialog', method: 'get', query: { widget: this.widget } })
            .then((resp) => {
                if (resp.statusCode === 200) {
                    this.checkForAsyncAndPopulate(resp.result).then((result) => {
                        // If status object contains selectedNodes information, populate those values with the form dialog!
                        if(this.props.status.selectedNode){
                            result = this.populateFormValue(result);
                        }
                        this._updateStateComponent({ key: 'form', value: result, nextFunc: () => this._toggleLoader(false) });
                    });
                }
            }).catch((err) => {
            console.log(err);
        });
    };


    render(){
      return this.templateHelpers();
    };

    componentDidMount(){
        this.getFormDialog();
    };
}

export default PropertiesView;