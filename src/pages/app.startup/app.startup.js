import React from 'react';
import './app.startup.css';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';
import MetadataFields from "../../ui-components/fields/metadata.fields.view";
import Collections from "../../ui-components/singleton.collection/singleton.collection";
import MetadataFieldTemplateState from "../../ui-components/fields/metadata.field.templatestate";
import BlockActions from "../../ui-components/fields/block.actions.view/block.actions.view";
import RestResourceConnector from "../../rest.link.support/rest.resource.connector";
import AppStartupConstants from "./app.startup.lang";
import {appStartupTemplate} from "./app.startup.template";
import {
    nodeConvertor,
    updateMetadataFields,
    validateFieldData
} from "../../ui-components/common.functions/node.convertor";
class AppStartup extends React.Component {
    constructor(options) {
        super(options);
        this.state = {
            isLoading: false,
            formView: undefined
        };
        this.formFields = [{
            placeholder: AppStartupConstants.fieldValue.username.placeholder,
            name: AppStartupConstants.fieldValue.username.name,
            width: AppStartupConstants.fieldValue.username.width,
            inlineToast: {
                isShow: false,
                inlineToastColor: AppStartupConstants.fieldValue.username.inlineToastColor
            }
        }, {
            placeholder: AppStartupConstants.fieldValue.password.placeholder,
            name: AppStartupConstants.fieldValue.password.name,
            width: AppStartupConstants.fieldValue.password.width,
            type: AppStartupConstants.fieldValue.password.type,
            inlineToast: {
                isShow: false,
                inlineToastColor: AppStartupConstants.fieldValue.username.inlineToastColor
            }
        }];
    };

    templateHelpers(){
        this._prepareTemplateEventHelpers();
        if(!this.state.isLoading){
            return appStartupTemplate(this.templateEventHelpers)
        } else {
            return <BlockActions options = {{defaultTemplate: true}} />
        }
    };

    onSignIn(){
        validateFieldData(this.state.formView, (result) => this.setState({formView: result})).then((result) => {
            if(result.length === 0){
                this.setState({isLoading: true});
                const fieldData = nodeConvertor(this.state.formView), options = {
                    linkRel: 'login_user',
                    repoName: 'login_user',
                    method: 'post',
                    body: fieldData
                };
                RestResourceConnector.makeAjaxCall(options).then((resp) => {
                    Collections.setCollections('userInfo', resp.data.result, 'currentUser');
                    this.props.options.navigate('/home', {replace: true});
                }).catch((err) => {
                   // Find password form field by name and add error message to that field inline toast attribute.
                    this.setErrorMessage(err.message);
                });
            }
        });
    };

    setErrorMessage(errMessage){
        const nodeState = this.formFields[1];
        nodeState.inlineToast = {isShow: true, inlineToastColor: 'white', inlineMessage: errMessage};
        updateMetadataFields('password', nodeState, this.state.formView, (updatedData) => this.setState({formView: updatedData})).then(() => {
           this.setState({isLoading: false});
        });
    };

    _prepareTemplateEventHelpers(){
        this.templateEventHelpers = {
            formView: () => this._renderFormView()
        }
    };

    _renderFormView(){
        return <MetadataFields data = {this.state.formView} updateData = {(updatedData) => this.setState({formView: updatedData})} />
    };

    _setUpFormView(){
        const formFieldTemplate = [];
        this.formFields.map((fields) => {
            const field = _.clone(MetadataFieldTemplateState.textField);
            field.name = fields.name;
            field.label = fields.label;
            field.placeholder = fields.placeholder;
            field.width = fields.width;
            field.type = fields.type;
            if(fields.inlineToast){
                Object.keys(fields.inlineToast).forEach((inlineToast) => {
                    field.inlineToast[inlineToast] = fields.inlineToast[inlineToast];
                });
            }
            formFieldTemplate.push(field);
        });
        var signInField = _.clone(MetadataFieldTemplateState.buttonField);
        signInField.btnValue = AppStartupConstants.fieldValue.singIn.value;
        signInField.onClick = () => this.onSignIn();
        signInField.customClass = 'sign-in-button';
        formFieldTemplate.push(signInField);
        this.setState({formView: formFieldTemplate});
    };

    componentDidMount() {
        this._setUpFormView();
    };

    render(){
      return this.templateHelpers();
    };
}

function AppStartUpWrapper(){
    const navigate = useNavigate();
    return <AppStartup options = {{navigate: navigate}}/>
};

export default AppStartUpWrapper;