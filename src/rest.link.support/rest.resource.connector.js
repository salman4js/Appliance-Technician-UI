import $ from 'jquery';
import RestResources from "./rest.resources";
import Connector from "../ui-components/connector/connector";

class RestResourceConnector {

    constructor(options) {
        this.options = options;
        this.endPoints = {
            post: 'create',
            patch: 'edit',
            get: 'read',
            delete: 'delete'
        }
    };

    addServerConnectionId(endPoint){
        var connectionHost = 'http://localhost:8080';
        return `${connectionHost}/${endPoint}`;
    };

    buildUrl(){
        let url = this.formLink();
        // Check a condition and add query parameters accordingly
        if (this.options.query) {
            if(this.options.query.selectedNodes){
                const selectedNodes = this.options.query.selectedNodes;
                this.options.query.selectedNodes = JSON.stringify(selectedNodes);
            }
            url += '?';
            url += this.formQueryParam(this.options.query);
        }
        return url;
    };

    formQueryParam(queryValue){
        return $.param(queryValue, true);
    };

    formLink(){
        const linkRel = this.options.linkRel;
        return this.addServerConnectionId(RestResources[linkRel](this.options));
    };

    static makeAjaxCall(options){
        const restConnector = new RestResourceConnector(options);
        return new Promise((resolve, reject) => {
              const url = restConnector.buildUrl(),
                  postBody = options.body;
              Connector[options.method](url, postBody, {}).then((res) => {
                  resolve(res)
              }).catch((err) => {
                  reject(err.response);
              })
          });
    };
}

export default RestResourceConnector;