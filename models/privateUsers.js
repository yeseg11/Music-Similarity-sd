// this file we build a schema for DB for users

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var privateUsersSchema = new Schema({
    name: String,
    publicId: String,
    privateId:String,
    nursingHome:String
});


// the schema is useless so far
// we need to create a model using it
var PrivateUsers = mongoose.model('PrivateUsers', privateUsersSchema);

// make this available to our users in our Node applications
module.exports = PrivateUsers;
