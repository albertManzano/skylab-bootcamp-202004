const context = require('./context')


module.exports = {
    get __context__() { return context },

    context: require('./context'),
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    isUserAuthenticated: require('./is-user-authenticated'),
    createWorkspace: require('./create-workspace'),
    uploadImage: require('./upload-image'),
    uploadUserImage: require('./upload-user-image'),
    retrieveUserWorkspaces: require('./retrieve-user-workspaces'),
    retrieveWorkspaces: require('./retrieve-workspaces'),
    searchWorkspaces: require('./search-workspaces'),
    searchFavorites: require('./search-favorites'),
    retrieveWorkspaceById: require('./retrieve-workspace-by-id'),
    deleteWorkspace: require('./delete-workspace'),
    postReview: require('./post-review'),
    toggleFavorites: require('./toggle-favorites'),
    retrieveFavorites: require('./retrieve-favorites'),
}