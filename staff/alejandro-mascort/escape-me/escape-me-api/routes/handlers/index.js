module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    toggleEscapeRoomPending: require('./toggle-escape-room-pending'),
    toggleEscapeRoomParticipated: require('./toggle-escape-room-participated'),
    toggleEscapeRoomFavorites: require('./toggle-escape-room-favorites'),
    toggleFollowUser: require('./toggle-follow-user'),
    retrieveEscapeRoomsFavorites: require('./retrieve-escape-rooms-favorites'),
    retrieveEscapeRoomsParticipated: require('./retrieve-escape-rooms-participated'),
    retrieveEscapeRoomsPending: require('./retrieve-escape-rooms-pending'),
    retrieveFollowing: require('./retrieve-following'),
    searchEscapeRoom: require('./search-escape-room'),
    searchUsers: require('./search-users'),
    retrieveEscapeIds: require('./retrieve-escape-ids'),
    retrieveFollowingIds: require('./retrieve-following-ids'),
    suggestEscapeRooms: require('./suggest-escape-rooms'),
    retrieveEscapeRoomDetails: require('./retrieve-escape-room-details')
}