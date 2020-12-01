// this file we build a schema for DB for users

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var usersSchema = new Schema({
    name: String,
    id: String,
    year: Number,
    age: Number,
    country: String,
    language1: String,
    language2: String,
    entrance: Number,
    group: String,
    songs: []
});

// the schema is useless so far
// we need to create a model using it
var Users = mongoose.model('Users', usersSchema);

// make this available to our users in our Node applications
module.exports = Users;
