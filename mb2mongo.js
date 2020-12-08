// mb2mongo - take the data from the mb-raw file's and add tham to mongoDB , using mongoose schema.

var db = require('../db');
var mongoose = require('mongoose');
var Records = require('../models/records.js');
var glob = require("glob");
var path = require('path');
var async = require('async');

var index = 0;
// fsGlob.readdir('./mb-raw/**/*.json', function(err, files) {
//   console.log(err || files);
// });

glob(path.join(__dirname, "/new-mb-raw/**/*.json"), {}, function(err, files) {
    if (err) return console.log(err);

    var total = 0;

    db().then(function() {
        //console.log(process.env.from,process.env.to);
        async.mapLimit(files.slice(process.env.from, process.env.to), 5, function(file, cb){ //add by steps of 5
            try{
                var data = require(file);
            }catch(e){
                var data = [];
        }

            if(!data.length) return cb();


            var bulk = Records.collection.initializeOrderedBulkOp();    //get the schema

            ([].concat(data)).forEach(function(el) {
                // console.log(el['text-representation'].language);
                // var year =parseInt(el['releases'][0]['date'])
                var year = 0;
                var stingYear = '';
                for (var i = 0 ; i < 4 ; i++ ){
                    stingYear +=  el.date[i]
                }
                console.log('stingYear: ',stingYear);
                year = parseInt(stingYear);
                console.log('year: ',year);
                var language = "";

                try {
                    language = el['text-representation'].language;
                } catch (error) {
                    language = "eng"
                }
                console.log('language: ',language);
                var prepare = {         //add the details to every document
                    mbId: el.id,
                    title: el.title,
                    year: year,
                    artist: el['artist-credit'][0].name,
                    country: el.country,
                    language: language,
                    lyrics: "",
                    genre: "",
                    youtube: {},
                    mbRaw: el,
                };

                bulk.find({
                    mbId: el.id                 //update the mbid , if have - update else its build new document
                }).upsert().updateOne(prepare);
            });
            if(!bulk.length){
                return cb();
            }
            total += bulk.length;
            console.log(`Gooing to execute ${bulk.length}, so far ${total}`); //show has how many files moved
            // if (bulk.length >= 254500)
            // {
            //     return cb();
            // }

            bulk.execute(function(err, data){
                //console.log(data.toJSON());
                delete bulk;
                return cb(err)
            });

        }, function(err, data) {
            console.log(err || data);
            process.exit(0);
        })
    }).catch((err) => console.log(err));
});
