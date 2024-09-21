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
            url += '?';
            Object.keys(this.options.query).forEach((query) => {
                if(query === 'selectedNodes'){
                    let selectedNodes = encodeURIComponent(JSON.stringify(this.options.query.selectedNodes));
                    url += `${query}=${selectedNodes}&`;
                    return;
                }
                url += `${query}=${this.options.query[query]}&`;
            });
        }
        return url;
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
                  resolve(res.data)
              }).catch((err) => {
                  reject(err.response.data);
              })
          });
    };
}

export default RestResourceConnector;