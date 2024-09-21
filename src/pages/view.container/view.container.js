import React from 'react';
import {useNavigate} from 'react-router-dom';
import './view.container.css';
import viewContainerTemplate from './view.container.template';
import WidgetTile from "./widget.tile/widget.tile";
import PerspectiveContainer from "./perspective.container/perspective.container";
import HeaderViewControl from "./header.view.control/header.view.control";
import {getQueryParams, updateQueryParams} from "../../ui-components/common.functions/node.convertor";
import GlobalMessageView from "./global.message/global.message.view";


class ViewContainer extends React.Component {
    constructor(options) {
        super(options);
        this.defaultPerspective = {
            isWidgetViewExpanded: false,
            expandedWidgetViewInfo: {
                widgetName: 'Home',
                widgetLabel:'home',
                widgetType: 'home'
            }
        };
        this.state = {
            viewOptions: this.defaultPerspective,
            routerInformation: {
                viewContainer: []
            },
            events: {},
            globalMessage: {
                show: false,
                msgOptions: undefined
            }
        }
    };

    _renderChildView(){
        if(!this.state.viewOptions.isWidgetViewExpanded){
            return <WidgetTile updateViewContainer = {(options) => this._updatePerspective(options)}/>
        } else {
            return <PerspectiveContainer status = {this.state} />
        }
    };

    _getRouterHistoryByIndex(index){
        return this.state.routerInformation.viewContainer[index];
    };

    _updatePerspective(options) {
        options.value = options.value || this.defaultPerspective;
        this._updateStateRouter({ action: options.action || 'ADD', currentViewContainerRouter: options?.value })
            .then((opts) => this._updateStateComponent(opts));
    };

    _updateStateRouter(opts){
        return new Promise((resolve) => {
            let viewContainerRouterInfo = this.state.routerInformation.viewContainer;
            switch (opts.action) {
                case "ADD":
                    viewContainerRouterInfo.push(opts.currentViewContainerRouter);
                    this._updateStateComponent({key: 'routerInformation', value: {viewContainer: viewContainerRouterInfo}}).then(() => {
                        opts.value = viewContainerRouterInfo[viewContainerRouterInfo.length -1] || opts.currentViewContainerRouter;
                        opts.key = 'viewOptions';
                        resolve(opts);
                    })
                    break;
                case "REMOVE":
                    break;
                case "DELETE":
                    viewContainerRouterInfo.pop();
                    this._updateStateComponent({key: 'routerInformation', value: {viewContainer: viewContainerRouterInfo}}).then(() => {
                        opts.value = viewContainerRouterInfo[viewContainerRouterInfo.length -1] || opts.currentViewContainerRouter;
                        opts.key = 'viewOptions';
                        resolve(opts);
                    })
                    break;
                default:
                    break;
            }
        })
    };

    _updateQueryParams(params){
        const pathName = window.location.pathname;
        if(params.length === 0){
            this.props.options.navigate(pathName, {replace: true});
            return;
        }
        params.map((options) => {
            const currentParams = getQueryParams();
            currentParams.set(options.key, options.value);
            const newUrl = `${pathName}?${updateQueryParams(currentParams)}`;
            this.props.options.navigate(newUrl, { replace: true });
        });
    };

    _renderHeaderControlView(){
        if(this.state.globalMessage.show){
            return <GlobalMessageView msgOptions = {this.state.globalMessage.msgOptions} _updateViewContainerState = {(options) => this._updateViewContainerState(options)}/>
        }
        return <HeaderViewControl perspectiveInformation = {this.state}/>
    };

    _updateStateComponent(options){
        return new Promise((resolve) => {
            this.setState({[options.key]: options.value}, () => {
                resolve();
            });
        });
    };

    async _updateViewContainerState(options){
        if(options.bulkUpdate){
           await this._updateStateComponent(options)
        } else {
            this.state[options.key][options.subKey] = options.value;
            await this._updateStateComponent({key: options.key, value: this.state[options.key]});
        }
    };

    _prepareEventHelpers(){
        this.state.events._updateStateRouter = (opts) => this._updatePerspective(opts);
        this.state.events._updateViewContainerState = async (opts) => await this._updateViewContainerState(opts)
    };

    templateHelpers(){
        this._prepareEventHelpers();
        return viewContainerTemplate({childViewOptions: () => this._renderChildView(), headerControlOptions: () => this._renderHeaderControlView()});
    };

    render(){
        return this.templateHelpers();
    };
}

function ViewContainerWrapper(){
  const navigate = useNavigate();
  return <ViewContainer options = {{navigate: navigate}}/>
};

export default ViewContainerWrapper;