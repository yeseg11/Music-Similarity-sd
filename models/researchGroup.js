// this file we build a schema for DB for users

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var researchGroup = new Schema({
    researchGroupName: String,
    researchGroupId: String,
    researchGroupPassword: String,
    researchersIds: [String]
});

// the schema is useless so far
// we need to create a model using it
var ResearchGroup = mongoose.model('ResearchGroup', researchGroup);

// make this available to our users in our Node applications
module.exports = ResearchGroup;
