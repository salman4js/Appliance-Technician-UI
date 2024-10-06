const RestResources = Object.freeze({
    login_user: (options) =>`${options.repoName}/login-user`,
    widgets: (options) => `${options.repoName}/widgets-list`,
    nodeItems: (options) => `${options.repoName}/get-repo-info`,
    formDialog: (options) => `${options.repoName}/properties-form-dialog`,
    admin_worker: (options) => `${options.repoName}/create-worker`,
    admin_order: (options) => `${options.repoName}/create-new-order`,
    accept_order: (options) => `${options.repoName}/accept-worker-order`,
    admin: (options) => `${options.repoName}/create-admin`,
    admin_delete: (options) => `${options.repoName}/admin-delete-non-admin`,
    admin_delete_worker: (options) => `${options.repoName}/admin-delete-worker`
});

export default RestResources;