// this file add the youtube details to mongo by geting the relevent data
var db = require('../db');
var mongoose = require('mongoose');
var Records = require('../models/records.js');
var debug = require('debug');
var request = require('request');
var async = require('async');
var youtube = require('./youtube');




var reject = function(err) { //if have a error , return the error massage
    console.log(err.message);
    process.exit(0);
}

db().then(function() {  //go to db
    var count = 0;
    Records.find({'youtube.videoId': null}).lean().limit(3000).exec(function(err, docs) { //check if youtube.videoId not exists if exists - dont update or change
        if (err) return reject(err);
        console.log(docs.length);
        async.mapLimit(docs, 1, (doc, cb) => {  // every 5 steps the data add to mongo
            return youtube.scrapt({name: `${doc.title} - ${doc.artist}`}).then(data=>{ //get the track name and the artist name and search in youtube
                doc.youtube = doc.youtube || {};
                console.log(data);
                doc.youtube.videoId = data.videoId; // get the videoID
                doc.youtube.views = data.views;     // get the number of views
                if (!doc.youtube.views)
                {
                    doc.youtube.views = 1 ;
                }
                doc.youtube.tags = data.tags;       //get the tags arrey
                return Records.update({_id: doc._id}, {$set: doc}, {multi: false, upsert: false}).exec(function(err, result){
                    if(err) return cb(err);
                    count++;
                    // console.log(count, doc.mbId,doc.youtube.views,doc.year);
                    return cb(null, result);
                });
            }).catch(reject)
  

        }, function(err, batch) {
            if (err) return reject(err);
            console.log('done'); //show when finish to add
            process.exit(0);
        })

    })

}).catch(reject);




