const loginUser = require('./post/loginUser');
const userRateSong = require('./post/selection');
const sessionComments = require('./post/sessionComments');
const researchPortalData = require('./post/researchPortalData');

const post = {
    loginUser,
    userRateSong,
	sessionComments,
    researchPortalData
}


module.exports = {
    post
}
