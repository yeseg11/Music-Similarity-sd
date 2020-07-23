// this file we build a schema for DB for users

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var researchSchema = new Schema({
    researchName: String,
    researchId: Number,
    researchersIds: [String],
    patientsIds: [String],
    nursingHome: String,
    department: String,
    numberOfWeeks: Number,
    meetingPerWeek: Number,
    lengthOfSession: Number,
    alguritem:String
});

// the schema is useless so far
// we need to create a model using it
var Research = mongoose.model('Research', researchSchema);

// make this available to our users in our Node applications
module.exports = Research;
