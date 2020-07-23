// this file we build a schema for DB



// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var playlistSchema = new Schema({
    name:String,
    similarity: [],
    year:Number,
    country:String,
    language:String,
    records: [
        {
        mbId: String,
        title: String,
        year: Number,
        artistName: String,
        language: String,
        country: String,
        lyrics: String,
        genre: String,
        youtube: {},
        votes: [{userId: String, vote: Number}]
    }]
});

/*
* mbId: '4b30b0e3-7422-4332-a40c-ec659df3cc61',
       title: 'Lion\'s Share',
       year: 1986,
       artistName: [Array],
       language: 'eng',
       country: 'US',
       lyrics: '',
       genre: '',
       youtube: [Object]
*
*
* */

// the schema is useless so far
// we need to create a model using it
var PlayList = mongoose.model('PlayList', playlistSchema);

// make this available to our users in our Node applications
module.exports = PlayList;
