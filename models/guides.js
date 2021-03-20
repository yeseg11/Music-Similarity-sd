// DB's Schema guides

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create a schema for the guide's data
var guidesSchema = new Schema({
    guideName: String,
    guideId: String,
    guidePassword: String,
});

var Guides = mongoose.model('Guides', guidesSchema);

module.exports = Guides;
