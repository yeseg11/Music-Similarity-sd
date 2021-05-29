var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var globalRatingSchema = new Schema({
    language: String,
    playlists: [{
        name:String,
        country:String,
        records: [
            {
                mbId: String,
                title: String,
                year: Number,
                artistName: String,
                language: String,
                country: String,
                sumOfRatings: Number,
                countOfRaters: Number,
                ratingAvg: Number
            }]
    }]
});


var GlobalRating = mongoose.model('GlobalRating', globalRatingSchema);

module.exports = GlobalRating;
