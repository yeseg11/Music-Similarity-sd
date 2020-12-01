var mb = require('./musicbrainz');
var db = require('../db');
var mongoose = require('mongoose');
var async = require('async');
var youtube = require('./youtube');

var fs = require('fs-extra');
let path = require('path');

var Records = require('../models/records.js');

var debug = require('debug');
var request = require('request');
//send a request to musicbraintz for the year and return it .

exports.scrapt = getDataFromMB;

//call to musicbrainz file and make folders's with json file's with 100 songs in each file for every year.


var toYear = process.env.toYear || (new Date).getFullYear(); //if we want to chose the years (from year 1989 , to year 1998)

var quest = {                   //build object with the types of the data .
    query: 'ageYear',
    type: 'release/',
    country: 'IT',
    reid: '',
    language: 'ita',
    date: process.env.year || (new Date).getFullYear(),
    limit: 100
};






db().then(function() {  //go to db
    var count = 0;

    Records.find({"language":null}).lean().limit(597).exec(function(err, docs) { //check if youtube.videoId not exists if exists - dont update or change
        if (err) return console.log(err);
        console.log(docs.length);
        async.mapLimit(docs, 1, (doc, cb) => {  // every 5 steps the data add to mongo
            // console.log(docs)
            let reid = doc.mbRaw.releases[0].id
            getDataFromMB({url: `https://musicbrainz.org/ws/2/${quest.type}?query=reid:${reid}&fmt=json`})
                .then(data=> {
                        // what the data is?
                    console.log(`We are going to update ${doc._id}`)
                    console.log(`We are going to update ${reid}`)

                    // console.log(JSON.stringify(data.items.releases[0]["text-representation"].language, null, 4));
                    // process.exit(1)
                    // "data.items.releases[0]["text-representation"].language"
                        let language = "eng";
                    if (data.items.releases[0] == null){
                        language = "eng";
                    }
                    else if (data.items.releases[0]["text-representation"] == null || data.items.releases[0]["text-representation"].language == null ) {

                            if (data.items.releases[0].country == "FR"){
                                language = "fra";
                            }
                            else if (data.items.releases[0].country == "IT"){
                                language = "ita";
                            }
                            else language = "eng";

                        }else{
                            language = data.items.releases[0]["text-representation"].language
                            console.log(JSON.stringify(data.items.releases[0]["text-representation"].language, null, 4));
                        }
                    console.log('the language that added is : ',language);
                        let lyrics = "";
                        let genre = "";
                    return Records.update({_id: doc._id}, {$set: {
                            language: language,
                            lyrics: lyrics,
                            genre: genre
                        }}, {multi: false, upsert: false}).exec(function(err, result){
                        if(err) return cb(err);
                        cb(null, result);
                    })
                    }
                )
                .catch(e=>cb(e))

            return;

        }, function(err, batch) {
            if (err) return console.log(err);
            console.log('done'); //show when finish to add
            process.exit(0);
        })

    })
}).catch("error");


function getDataFromMB(options){ //get the data from MusicBrinz

    //console.log("url: "+options.url);
    return new Promise((resolve, reject) => {
        if(!options || !options.url) return reject(new Error(`Missing url options for musicbrainz`)); //  send a http requst to get the data fromthe link
        request({
            'method': 'GET',
            'uri': options.url,
            'headers': {
                'User-Agent': 'MY IPHINE 7s ' + (+new Date()) // A hack to get into musicbrainz api
            }

        }, function(error, response, body) {
            // if (error) return reject(error);
            if (error || !response || !response.statusCode || response.statusCode !== 200) {
                options.retry = options.retry || 0;
                options.retry++;
                //if (options.retry > 10) return reject(new Error('Check your ISP internet connection'));
                var nextRetry = (1); //run in a random time to give the system time to make the download's betewen evry request
                return setTimeout(function() {
                    debug('app:musicbrainz')(`RETRY ${options.retry} in ${nextRetry} s. :: ${options.url}`);
                    getDataFromMB(options).then(resolve).catch(reject);
                }, nextRetry);
            }
            debug('app:musicbrainz')(`recived data from ${options.url}`); //show the url we get the data from him
            try {
                var data = JSON.parse(body);        //the data we get
                //console.log("data: "+data);
                return resolve({items: data, options: options});
            } catch (e) {
                return reject(e);
            }
        });
    })
}







