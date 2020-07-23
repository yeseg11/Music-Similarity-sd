//the main app !!

const express = require('express');
const app = express();
const debug = require('debug');
const path = require('path');
const db = require('./db');
const bodyParser = require('body-parser');
const PLAYLISTSIZE = 50;

let Records = require('./models/records.js');
// let Users = require('./models/users.js');
let Researchers = require('./models/researchers.js');
let PlayList = require('./models/playlist.js');
let PublicUsers = require('./models/publicUsers.js');
let PrivateUsers = require('./models/privateUsers.js');
let Research = require('./models/research.js');
let ResearchGroup = require('./models/researchGroup.js');
var AES = require("crypto-js/aes");



let similarity = require('compute-cosine-similarity');

app.use("/", express.static(path.join(__dirname, "assests")));

/**
 * Virtual dir for js & css for third party libraries
 */

app.use("/lib/jquery", express.static(path.join(__dirname, "node_modules", "jquery", "dist")));
app.use("/lib/bootstrap", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist")));
app.use("/lib/font-awesome/css", express.static(path.join(__dirname, "node_modules", "font-awesome", "css")));
app.use("/lib/font-awesome/fonts", express.static(path.join(__dirname, "node_modules", "font-awesome", "fonts")));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

/**
 * Statics pages
 */

/**
 * Main Page and there link
 */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'assests', 'mainPage.html'), {}, () => res.end())); // Static front page
/*admin*/
app.get('/adminLoginPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/adminLoginPage.html'), {}, () => res.end()));
app.get('/adminMainPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/adminMainPage.html'), {}, () => res.end()));/*6 buttons*/
/*user*/
app.get('/userLoginPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/userLoginPage.html'), {}, () => res.end()));
app.get('/userScreen', (req, res) => res.sendFile(path.join(__dirname, 'assests', 'userScreen.html'), {}, () => res.end())); // song list with youTube
/*research group*/
app.get('/researchGroupLoginPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/researchGroupLoginPage.html'), {}, () => res.end()));
app.get('/researchGroupMainPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', 'researchGroupMainPage.html'), {}, () => res.end()));/*2*/
app.get('/researchList', (req, res) => res.sendFile(path.join(__dirname, 'assests', 'researchList.html'), {}, () => res.end()));
/**
 * *Admin Page
 */
app.get('/createUsers', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createUsers.html'), {}, () => res.end()));
app.get('/editUsers', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editUsers.html'), {}, () => res.end()));
app.get('/createResearchGroup', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createResearchGroup.html'), {}, () => res.end()));
app.get('/createResearcher', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createResearcher.html'), {}, () => res.end()));
app.get('/newPlaylist', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newPlaylist.html'), {}, () => res.end()));
app.get('/newSong', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newSong.html'), {}, () => res.end()));

/**
 * researchers pages
 */
app.get('/newResearch', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newResearch.html'), {}, () => res.end())); // login form
app.get('/editResearch', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editResearch.html'), {}, () => res.end()));


// /** ----------------------------------------------------------------------------------
//  * Return the given users playlist , and add user to Data base
//  *
//  * @PARAM {String*} id: Given user id
//  * @PARAM {String} name: Given user name
//  * @PARAM {String} country: Given user name
//  * @PARAM {Number} age: The user age
//  * @PARAM {Number} entrance:The user entrance
//  *
//  * @RESPONSE {json}
//  * @RESPONSE-SAMPLE {playList , userData}
//  ----------------------------------------------------------------------------------*/
//
// app.post('/users/insertUsers',function(req, res, next) {
//     if (!req.body) return res.sendStatus(400,"Error to add user");
//     // console.log("here44");
//     // console.log(req.body.entrance);
//
//     if (req.body.id && req.body.birthYear && req.body.country && req.body.name) {
//         var userData = {
//             id: req.body.id.toString(),
//             name: req.body.name,
//             country: req.body.country,
//             birthYear: parseInt(req.body.birthYear),
//             language1: req.body.language1,
//             language2: req.body.language2,
//             entrance: req.body.entrance,
//             yearAtTwenty: parseInt(req.body.yearAtTwenty),
//             group: req.body.group,
//             songs: []
//         };
//
//
//         var bulk = Users.collection.initializeOrderedBulkOp();
//         bulk.find({
//             id: userData.id                 //update the id , if have - update else its build new document
//         }).upsert().updateOne(userData);
//         bulk.execute();
//
//         var playlistData = {
//             name: req.body.group,
//             year: parseInt(req.body.yearAtTwenty),
//             country: req.body.country,
//             records: JSON.parse(req.body.records)
//         };
//
//         var query = {name: playlistData.name},
//             update = playlistData,
//             options = {upsert: true, new: true, setDefaultsOnInsert: true};
//
// // Find the document
//         var exiset = true;
//         //PlayList.createIndex({name:1});
//         PlayList.findOne({name: playlistData.name}, function (error, result) {
//             if (error) return;
//             //console.log("r1",result);
//             if (!result || result == null)
//                 exiset = false;
//             // do something with the document
//             //console.log(exiset);
//             if (!exiset) {
//                 PlayList.findOneAndUpdate(query, update, options, function (error, result) {
//                     if (error) return;
//                 });
//             }
//         });
//
//     }
// });


/** ----------------------------------------------------------------------------------
 * Add the playlist to Data base
 *
 * @PARAM {[String]} record list
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList}
 ----------------------------------------------------------------------------------*/

app.post('/playList/createPlaylist', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    var playlistData = {
        name: req.body.name,
        year:req.body.year,
        country:req.body.country,
        language:req.body.language,
        records: JSON.parse(req.body.records)
    };
    // console.log(playlistData);
    var query = {name: playlistData.name},
        update = playlistData,
        options = {upsert: true, new: true, setDefaultsOnInsert: true};

    var exiset = true;
    //PlayList.createIndex({name:1});
    // PlayList.findOneAndUpdate(query, update, options, function (error, result) {
    //     if (error) return;
    // });

    var bulk = PlayList.collection.initializeOrderedBulkOp();
    bulk.find({
        name: playlistData.name                 //update the id , if have - update else its build new document
    }).upsert().updateOne(playlistData);
    bulk.execute();



    // PlayList.findOne({name: playlistData.name}, function (error, result) {
    //     if (error) return;
    //     console.log("r1",result);
    //     if (!result || result == null)
    //         exiset = false;
    //     // do something with the document
    //     console.log(exiset);
    //     if (!exiset) {
    //         // console.log(exiset);
    //         PlayList.findOneAndUpdate(query, update, options, function (error, result) {
    //             if (error) return;
    //         });
    //     }
    // });
});


/** ----------------------------------------------------------------------------------
 * Return the given users playlist , and add user to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 * @PARAM {String} country: Given user name
 * @PARAM {Number} age: The user age
 * @PARAM {Number} entrance:The user entrance
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList , userData}
 ----------------------------------------------------------------------------------*/

app.post('/insertPublicUsers', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("req.body.tamaringaId: ",req.body);

    if (req.body.tamaringaId && req.body.birthYear && req.body.countryAtTwenty && req.body.name) {
        var userData = {
            name: req.body.name,
            tamaringaId: req.body.tamaringaId.toString(),
            password: req.body.password,
            department: req.body.department,
            medicalProfile: req.body.medicalProfile,
            birthYear: parseInt(req.body.birthYear),
            yearAtTwenty: parseInt(req.body.yearAtTwenty),
            countryAtTwenty: req.body.countryAtTwenty,
            countryOrigin: req.body.countryOrigin,
            languageOrigin: req.body.languageOrigin,
            languageAtTwenty: req.body.languageAtTwenty,
            yearOfImmigration: req.body.yearOfImmigration,
            Genre1Select: req.body.Genre1Select,
            Genre2Select: req.body.Genre2Select,
            entrance: req.body.entrance,
            nursingHome: req.body.nursingHome,
            group: req.body.group,
            songs: []
        };
        var bulk = PublicUsers.collection.initializeOrderedBulkOp();
        bulk.find({
            tamaringaId: userData.tamaringaId                 //update the id , if have - update else its build new document
        }).upsert().updateOne(userData);
        bulk.execute();
    }
});


/** ----------------------------------------------------------------------------------
 * Return the given users playlist , and add user to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 * @PARAM {String} country: Given user name
 * @PARAM {Number} entrance:The user entrance
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList , userData}
 ----------------------------------------------------------------------------------*/

app.post('/insertPrivateUsers', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");

    if (req.body.tamaringaId && req.body.name && req.body.privateId && req.body.nursingHome) {
        var userData = {
            name: req.body.name,
            tamaringaId: req.body.tamaringaId,
            privateId: req.body.privateId,
            nursingHome: req.body.nursingHome
        };

        var bulk = PrivateUsers.collection.initializeOrderedBulkOp();
        bulk.find({
            privateId: userData.privateId                 //update the id , if have - update else its build new document
        }).upsert().updateOne(userData);
        bulk.execute();
    }
});


/** ----------------------------------------------------------------------------------
 * Return and update the entrance time of the user  to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {Number} entrance: The user entrance
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {user data: []}
 ----------------------------------------------------------------------------------*/

app.post('/users/:id', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    // console.log(req.body.entrance);
    // console.log(req.params.entrance);
    PublicUsers.find({tamaringaId: req.params.id}).exec(function (err, docs) {
        if (err) return next(err);
        try {
            docs[0].entrance = req.body.entrance;
        } catch (e) {
            return next(e);
        }
        docs[0].save(function (err, updatedUser) {
            if (err) return handleError(err);
            res.send(updatedUser);
        });
    });
});


/** ----------------------------------------------------------------------------------
 * Return the top records of the given year between 2 year before and 2 years after
 *
 * @PARAM {String} year: The user 20's year
 * @PARAM {String} country: The user country
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/mb/track/recording/:yearAtTwenty/:country/:language', function (req, res, next) {
    db().then(() => {
        Records.find({
            year: {$gt: parseInt(req.params.yearAtTwenty) - 1, $lt: parseInt(req.params.yearAtTwenty) + 1},
            country: req.params.country,
            language: req.params.language
        }).sort({'youtube.views': -1}).limit(PLAYLISTSIZE).exec(function (err, docs) {
            if (err) return next(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
            // console.log(docs);
            res.status(200).json({err: false, items: [].concat(docs)});
        })
    }).catch(next);
});


/** ----------------------------------------------------------------------------------
 * Return the record if exisset
 *
 * @PARAM {String} record data.............................:
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/mb/track/record/:mbid', function (req, res, next) {
    db().then(() => {
        Records.find({mbid: req.mbid}).limit(1).exec(function (err, docs) {
            if (err) return next(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
            // console.log(docs);
            res.status(200).json({err: false, items: [].concat(docs)});
        })
    }).catch(next);
});


/** ----------------------------------------------------------------------------------
 * Return playlist by the playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/playList/:name', function (req, res, next) {
    //console.log(req.params.id);
    PlayList.find({name: req.params.name}).exec(function (err, docs) {
        if (err) return next(err);
        //console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});

/** ----------------------------------------------------------------------------------
 * Return the user Data from DB
 *
 * @PARAM {String*} id: Given user id
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/user/:id/:encryptedPass', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    var CryptoJS = require("crypto-js");
    var bytes  = CryptoJS.AES.decrypt(req.params.encryptedPass, 'Password');
    var decrypted1 = bytes.toString(CryptoJS.enc.Utf8)
    // console.log(req.params.id);
    PublicUsers.find({tamaringaId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs);
        // res.status(200).json({err: false, items: [].concat(docs)});
        var bytes2  = CryptoJS.AES.decrypt(docs[0].password, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        // console.log("docs: ",decrypted2);
        if (decrypted2 === decrypted1){
            res.status(200).json({err: false, items: [].concat(docs)});
        }
        else{
            return next(err)
        }
    });
});

app.get('/user/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    console.log(req.params.id);
    PublicUsers.find({tamaringaId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    });
});




/** ----------------------------------------------------------------------------------
 * Return all the users Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/allusers', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    PublicUsers.find({}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});

/** ----------------------------------------------------------------------------------
 * Return all the researchers Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/allresearchers', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    Researchers.find({}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});


/** ----------------------------------------------------------------------------------
 * Return all the researches for specific  id Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/allresearches/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);

    Research.find({researchGroupId: req.params.id}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log("docs",docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});


// researchId



/** ----------------------------------------------------------------------------------
 * Return the user with the playlist name from the DB
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {Array} playlist: The playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {user data: []}
 ----------------------------------------------------------------------------------*/
app.get('/selection/:id/:playlist', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    //console.log(req.params.id+" "+req.params.playlist);
    PublicUsers.find({tamaringaId: {$ne: req.params.id}, group: req.params.playlist}).exec(function (err, docs) {
        if (err) return next(err);
    });
});

/** ----------------------------------------------------------------------------------
 * Post and update the the playlist with the vote of the user , add it and calculate the cosine function with similarity function
 *
 * @CALC cosine function
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} mbid: The song mbid
 * @PARAM {String} name: the playlist name
 *
 *
 * @RESPONSE-SAMPLE {{}}
 ----------------------------------------------------------------------------------*/
app.post('/selection/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req.body) return res.sendStatus(400);

    PublicUsers.find({tamaringaId: req.params.id}).exec(function (err, docs) {
        if (err) return next(err);
        var userData = docs[0];
        var flag = false;
        var reqSongs = JSON.parse(req.body.songs);
        try {
            // console.log("userData.songs.count: ",userData.songs.length);
            if (userData.songs.length > 0) {
                for (var i = 0; i < userData.songs.length; i++) {
                    if (userData.songs[i].mbid === reqSongs.mbid) {
                        userData.songs[i].vote = reqSongs.vote;
                        flag = true;
                    }
                }
                if (!flag) {
                    userData.songs.push(JSON.parse(req.body.songs));
                }
            } else {
                userData.songs = JSON.parse(req.body.songs);
            }
        } catch (e) {
            return next(e);
        }

        var bulk = PublicUsers.collection.initializeOrderedBulkOp();
        bulk.find({
            tamaringaId: userData.tamaringaId                 //update the id , if have - update else its build new document
        }).upsert().updateOne(userData);
        bulk.execute(function (err, BulkWriteResult) {
            if (err) return next(err);
            // do cosine similirity calc in 2 minutes
            // loop all songs
            var data = userData.songs[0];
            var group = userData.group;
            var lookup = {'name': group, 'records.mbId': data.mbid};
            var mbId = data.mbid
            PlayList.findOne(lookup).exec(function (err, q) {
                // console.log("q: ",q);
                var pos = q.records.findIndex(e => e.mbId === mbId);

                q.records[pos].votes = q.records[pos].votes || [];
                var posUser = q.records[pos].votes.findIndex(e => e.userId === data.id);

                if (posUser >= 0) {
                    q.records[pos].votes[posUser].vote = data.vote
                } else {
                    q.records[pos].votes.push({userId: data.id, vote: data.vote})
                }

                var user = [];
                var users = [];
                q.records.forEach(rec => {
                    user.push(rec.votes.filter(x => x.userId === data.id).map(x => x.vote)[0] || 0);
                    rec.votes.map(function (x) {
                        if (users.indexOf(x.userId) === -1 && x.userId !== data.id) users.push(x.userId)
                    });
                });

                users.forEach(u => {
                    var votesByUser = [];
                    q.records.forEach(rec => {
                        votesByUser.push(rec.votes.filter(x => x.userId == u).map(x => x.vote)[0] || 0)
                    });
                    q.similarity = q.similarity || [];
                    var pos = q.similarity.findIndex(x => x.user1 == u && x.user2 == data.id || x.user2 == u && x.user1 == data.id);
                    //console.log(pos);
                    if (pos >= 0) {
                        q.similarity[pos].similarity = similarity(user, votesByUser);
                    } else {
                        q.similarity.push({user1: u, user2: data.id, similarity: similarity(user, votesByUser)})
                    }
                });
                q.markModified('similarity');
                q.save(function (err) {
                    if (err) return next(err);
                    res.json({message: 'cool man'});

                })
            });
        });
    });
});

/** ----------------------------------------------------------------------------------
 * Return and update the user best song, the recommended user best songs and the unseen user song.
 *
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} mbid: The track mbid
 * @PARAM {String} playlist: the playlist name
 * @PARAM {Number} vote: the vote for the track
 * @PARAM {String} artist: the artist name
 * @PARAM {String} title: the track name
 * @PARAM {String} videoId: the video Id number in youtube.
 *
 * @RESPONSE topUser - top user songs
 * @RESPONSE recSongs - top recommended user song
 * @RESPONSE notEar - not ear song of the user.
 *
 * @RESPONSE-SAMPLE {{obj}}
 ----------------------------------------------------------------------------------*/
app.get('/playlist/:playlist/:id', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);

    // console.log(req.params.id+" "+req.params.playlist);
    var id = req.params.id.toString();
    // console.log("id:",id);
    PlayList.find({"records.votes.userId": {$in: [id]}}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log('docs: ',docs);
        if (!docs[0] || !docs || docs == []) {
            res.sendFile(path.join(__dirname, 'assests', '404.html'));
        }
        var topUser = [];
        var notEar = [];
        console.log("docs[0]: ",docs[0]);
        docs[0].records.forEach(function callback(currentValue, index, rec) {
            var index = index;
            var o = currentValue.votes.filter(x => x.userId == id);
            var ex = currentValue.votes.findIndex(x => x.userId == id);
            // console.log('rec: ', rec);
            if (ex != -1) {
                // console.log(rec[index]);
                //console.log(index);
                //console.log(currentValue.votes.filter(x=>x.userId == id));
                //console.log(currentValue.votes.findIndex(x=>x.userId == id));
                topUser.push({
                    index: index,
                    vote: o[0].vote,
                    mbid: rec[index].mbid,
                    artist: rec[index].artist,
                    title: rec[index].title,
                    videoId: rec[index].youtube.videoId
                });
            } else {
                // console.log(rec[index]);
                notEar.push({
                    index: index,
                    vote: 0,
                    mbid: rec[index].mbid,
                    artist: rec[index].artist,
                    title: rec[index].title,
                    videoId: rec[index].youtube.videoId
                });
            }
        });
        topUser.sort(function (a, b) {
            return b.vote - a.vote;
        });

        var topUsers = [];
        if (docs[0].similarity.length != 0) {
            docs[0].similarity.forEach(function callback(currentValue, index, rec) {
                if (currentValue.user1 == id || currentValue.user2 == id) {
                    //console.log(currentValue);
                    topUsers.push({
                        user1: currentValue.user1,
                        user2: currentValue.user2,
                        similarity: currentValue.similarity
                    });
                }
            });
            topUsers.sort(function (a, b) {
                return b.similarity - a.similarity;
            });

            //console.log(topUser);
            //console.log(topUsers);
            //topUsers = topUsers[0];
            //console.log(topUsers);
            var recUser;
            if (id == topUsers[0].user1) {
                recUser = topUsers[0].user2;
            } else {
                recUser = topUsers[0].user1;
            }
            //console.log(recUser);
            var recSongs = [];
            docs[0].records.forEach(function callback(currentValue, index, rec) {
                var ind = index;
                var o = currentValue.votes.filter(x => x.userId == recUser);
                var ex = currentValue.votes.findIndex(x => x.userId == recUser);
                if (ex != -1) {
                    //console.log(rec[index]);
                    //console.log(o);
                    //console.log(ex);
                    recSongs.push({
                        index: index,
                        vote: o[0].vote,
                        mbid: rec[index].mbid,
                        artist: rec[index].artist,
                        title: rec[index].title,
                        videoId: rec[index].youtube.videoId
                    });
                }
            });
            //console.log(recSongs);
            recSongs.sort(function (a, b) {
                return b.vote - a.vote;
            });
        }

        //console.log(recSongs);
        var obj = [{topUser, recSongs, notEar}];
        res.status(200).json({err: false, items: [].concat(obj)});
    });
});


/** ----------------------------------------------------------------------------------
 *  Post and add a new researcher to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.post('/insertResearcher', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("Try to post the researcher");

    if (req.body.researcherId && req.body.researcherName && req.body.researcherPassword) {
        var researcherData = {
            researcherName: req.body.researcherName,
            researcherId: req.body.researcherId,
            researcherPassword: req.body.researcherPassword,
            isAdmin: Boolean(req.body.isAdmin)
        };
        var bulk = Researchers.collection.initializeOrderedBulkOp();
        bulk.find({
            id: researcherData.id                 //update the id , if have - update else its build new document
        }).upsert().updateOne(researcherData);
        bulk.execute();
    }
});

/** ----------------------------------------------------------------------------------
 *  Post and add a new research to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.post('/insertResearch', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("Try to post the research");
    var researchData = {
        researchName: req.body.researchName,
        researchId: req.body.researchId,
        researchersIds: req.body['researchersIds[]'],
        researchGroupId : req.body.researchGroupId,
        patientsIds: req.body['patientsIds[]'],
        nursingHome: req.body.nursingHome,
        department: req.body.department,
        numberOfWeeks: req.body.numberOfWeeks,
        meetingPerWeek: req.body.meetingPerWeek,
        lengthOfSession: req.body.lengthOfSession,
        alguritem: req.body.alguritem
    };
    var bulk = Research.collection.initializeOrderedBulkOp();
    bulk.find({
        researchId: researchData.researchId                 //update the id , if have - update else its build new document
    }).upsert().updateOne(researchData);
    bulk.execute();



});


/** ----------------------------------------------------------------------------------
 *  Post and add a new research Group to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} password: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.post('/insertResearchGroup', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    var researchGroup = {
        researchGroupName: req.body.researchGroupName,
        researchGroupId: req.body.researchGroupId,
        researchGroupPassword: req.body.researchGroupPassword,
        researchersIds: req.body['researchersIds[]']
    };
    // console.log("researchGroup: ",researchGroup);
    var bulk = ResearchGroup.collection.initializeOrderedBulkOp();
    bulk.find({
        researchGroupId: researchGroup.researchGroupId                 //update the id , if have - update else its build new document
    }).upsert().updateOne(researchGroup);
    bulk.execute();
});



/** ----------------------------------------------------------------------------------
 *  Get and add a new researcher to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.get('/insertResearcher/:id/:encryptedPass', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    var CryptoJS = require("crypto-js");
    var bytes  = CryptoJS.AES.decrypt(req.params.encryptedPass, 'Password');
    var decrypted1 = bytes.toString(CryptoJS.enc.Utf8);
    var id = req.params.id.toString()

    Researchers.find({researcherId:id}).exec(function (err, docs) {
        if (err) return next(err);
        console.log("docs: ",docs);
        var bytes2  = CryptoJS.AES.decrypt(docs[0].researcherPassword, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        if (decrypted2 === decrypted1 && docs[0].isAdmin){
            res.status(200).json({err: false, items: [].concat(docs)});
        }
        else{
            return next(err)
        }
    });
});

/** ----------------------------------------------------------------------------------
 *  Get  research Data from Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} password: Given user password
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.get('/insertResearchGroup/:id/:encryptedPass', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    var CryptoJS = require("crypto-js");
    var bytes  = CryptoJS.AES.decrypt(req.params.encryptedPass, 'Password');
    var decrypted1 = bytes.toString(CryptoJS.enc.Utf8);
    var id = req.params.id.toString()
    console.log("Log-IN")
    ResearchGroup.find({researchGroupId:id}).exec(function (err, docs) {
        console.log("Log-IN",docs)
        if (err) return next(err);
        var bytes2  = CryptoJS.AES.decrypt(docs[0].researchGroupPassword, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        if (decrypted2 === decrypted1){
            res.status(200).json({err: false, items: [].concat(docs)});
        }
        else{
            return next(err)
        }
    });
});








/** ----------------------------------------------------------------------------------
 *  Get the size of all the users and response as a public Id
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.get('/publicId/:id', function (req, res, next) {
    if (!req) return res.sendStatus(400);
    var size = 0;
    PrivateUsers.find({privateId: req.params.id}).count(function (err, res) {
        if (err)
            throw err;
        size = res;
    }).then(function (response) {
        if (size === 0) {
            PrivateUsers.find({}).count().exec(function (err, docs) {
                if (err) return next(err);
                // console.log("docs1: ",docs);
                res.status(200).json({err: false, items: [].concat(docs + 1)});
            })
        } else {
            PrivateUsers.findOne({privateId: req.params.id}).exec(function (err, docs) {
                if (err) return next(err);
                let docsString = JSON.stringify(docs);
                let parse = JSON.parse(docsString);
                res.status(200).json({err: false, items: [].concat(parse.tamaringaId)});
            })
        }
    });
});

/** ----------------------------------------------------------------------------------
 *  Add a new record to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {researcherData}
 ----------------------------------------------------------------------------------*/

app.post('/insertRecord', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("Try to post the researcher");
    // console.log(req);
    if (req.body.mbId && req.body.title) {
        var recordData = {
            mbId: req.body.mbId,
            title: req.body.title,
            year: req.body.year,
            artistName: req.body.artistName,
            language: req.body.language,
            country: req.body.country,
            lyrics: req.body.lyrics,
            genre: req.body.genre,
            youtube: JSON.parse(req.body.youtube)
            //     {
            //     videoId: youtubeId.val(),
            //     views: youtubeViews.val()
            // }
        };
        // console.log("recordData",recordData);
        var bulk = Records.collection.initializeOrderedBulkOp();
        bulk.find({
            id: recordData.mbId                 //update the id , if have - update else its build new document
        }).upsert().updateOne(recordData);
        bulk.execute();
    }
});





/** ----------------------------------------------------------------------------------
 * Return error page if have a problem
 * Statics page
 ----------------------------------------------------------------------------------*/

// 404 not found
app.use(function (req, res, next) {
    res.sendFile(path.join(__dirname, 'assests', '404.html'));
});

/** ----------------------------------------------------------------------------------
 * open the connction with the DB.
 ----------------------------------------------------------------------------------*/
db().then(() => {
    const server1 = app.listen(process.env.port || 3000, () => debug('app:server')(`Server has started in port ${server1.address().port}`))
    // const server2 = app.listen(process.env.port || 3200, () => debug('app:server')(`Server has started in port ${server2.address().port}`))

}).catch(() => debug('app:mongo')('Houston we got a problem.... mongo'));




