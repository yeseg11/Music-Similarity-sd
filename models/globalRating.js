var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var globalRatingSchema = new Schema({
    language: String,
    playlists: [{
        name:String,
        year:Number,
        country:String,
        records: [
            {
                mbId: String,
                title: String,
                year: Number,
                artistName: String,
                language: String,
                country: String,
                SumOfRatings: Number,
                CountOfRaters: Number
            }]
    }]
});


var UserData = mongoose.model('GlobalRating', globalRatingSchema);

module.exports = UserData;
