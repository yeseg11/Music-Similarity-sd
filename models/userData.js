// this file we build a schema for DB for users

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userDataSchema = new Schema({ //create when create a user .
    firstName: String,
    lastName: String,
    userName: String,
    tamaringaId: String,
    playlists: {
        firstLanguage: {
            language: String,
            playlists: []
        },
        secondLanguage: {
            language: String,
            playlists: []
        },
        genrePlaylists: []
    },
    researchList: [{
        //added when research created with the user.
        researchId: String,
        maxSessionNum: Number,
        sessionList: [
            //every new session add a new object.
            {
                sessionNumber: String,
                sessionDate: Date,
                guideName: String,
                guideGeneralScore: String,
                guideCommentStart: String,
                guideCommentEnd: String,
                guideSessionRate: Number,

                songs: [{
                    playlistName: String,
                    mbId: String,
                    score: Number,
                    guideComment: String,
                    language: String
                }]
            }]
    }]
});

// the schema is useless so far
// we need to create a model using it
var UserData = mongoose.model('UserData', userDataSchema);

// make this available to our users in our Node applications
module.exports = UserData;
