const loginUser = require('./post/loginUser');
const userRateSong = require('./post/selection');
const sessionComments = require('./post/sessionComments');

const post = {
    loginUser,
    userRateSong,
	sessionComments
}


module.exports = {
    post
}
