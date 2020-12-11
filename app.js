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
let UserData = require('./models/userData.js');

const routes = require('./routes');


// const insertResearcher = require('bcrypt');
// const saltRounds = 10;
var CryptoJS = require("crypto-js");

let similarity = require('compute-cosine-similarity');
const e = require('express');
// gzip
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
app.get('/usersList', (req, res) => res.sendFile(path.join(__dirname, 'assests', 'usersList.html'), {}, () => res.end()));
/**
 * *Admin Page
 */
app.get('/createUsers', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createUsers.html'), {}, () => res.end()));
app.get('/editUsers', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editUserList.html'), {}, () => res.end()));
app.get('/editUserPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editUser.html'), {}, () => res.end()));
app.get('/createResearchGroup', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createResearchGroup.html'), {}, () => res.end()));
app.get('/createResearcher', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createResearcher.html'), {}, () => res.end()));
app.get('/firstPlaylistPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/firstPlaylistPage.html'), {}, () => res.end()));
app.get('/newManualPlaylist', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newManualPlaylistPage.html'), {}, () => res.end()));
app.get('/createNewManualPlaylist', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/createManualPlaylistPage.html'), {}, () => res.end()));
app.get('/editPlaylist', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editPlaylistPage.html'), {}, () => res.end()));
app.get('/showPlaylistTable', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/showPlaylistTable.html'), {}, () => res.end()));

app.get('/newPlaylist', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newPlaylist.html'), {}, () => res.end()));
app.get('/newSong', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newSong.html'), {}, () => res.end()));

/**
 * researchers pages
 */
app.get('/newResearch', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/newResearch.html'), {}, () => res.end())); // login form
app.get('/editResearch', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editResearchList.html'), {}, () => res.end()));
app.get('/editResearchPage', (req, res) => res.sendFile(path.join(__dirname, 'assests', '/editResearch.html'), {}, () => res.end()));




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
        year: req.body.year,
        country: req.body.country,
        language: req.body.language,
        records: JSON.parse(req.body.records)
    };
    // console.log(playlistData);
    var query = {name: playlistData.name},
        update = playlistData,
        options = {upsert: true, new: true, setDefaultsOnInsert: true};

    var exiset = true;
    PlayList.updateOne(query, update, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a private user.`)
            }

        })
        .catch(err => console.error(`Failed to add review: ${err}`))

});

/** ----------------------------------------------------------------------------------
 * Create user data record
 ----------------------------------------------------------------------------------*/

app.post('/insertUserData', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("req.body.tamaringaId: ",req.body);
    // console.log("req.body.playlists: ",req.body['playlists[]']);

    if (req.body.tamaringaId && req.body.userName && req.body.firstName && req.body.lastName) {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId.toString(),
            playlists: req.body['playlists[]'], //need to added
            researchList: req.body.researchList
        };

        const query = {"tamaringaId": userData.tamaringaId};
        const options = {"upsert": true};
        UserData.updateOne(query, userData, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a new User Data.`)
                }
            }).catch(err => console.error(`Failed to add review: ${err}`))
    }
});

/** ----------------------------------------------------------------------------------
 * update user data record
 ----------------------------------------------------------------------------------*/

app.post('/updateUserData', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");
    // console.log("req.body.tamaringaId: ",req.body);

    if (req.body.tamaringaId && req.body.userName && req.body.firstName && req.body.lastName) {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId.toString(),
        };

        const query = {"tamaringaId": userData.tamaringaId};
        const options = {"upsert": true};
        UserData.updateOne(query, userData, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a new User Data.`)
                }
            }).catch(err => console.error(`Failed to add review: ${err}`))
    }
});
/** ----------------------------------------------------------------------------------
 * Get user playlist data
 ----------------------------------------------------------------------------------*/
app.post('/updateUserDataCollection', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    if (!req.body) return res.sendStatus(400);
    if (req.body.tamaringaId === undefined) {
        return next(err);
    }
    let playlist = [];
    let researchList = [];

    UserData.find({tamaringaId: req.body.tamaringaId}).limit(1).exec(function (err, docs) {
        if (err) return next(err);
        try {
            if (docs[0].playlists != null){
                playlist = docs[0].playlists;
            }
            if (docs[0].researchList != null){
                researchList = docs[0].researchList;
            }

            // let researchListData = {};

            let researchListData = {
                researchId : req.body.researchId,
                maxSessionNum: req.body.maxSessionNum,
                sessionList: null
            };

            if (req.body.tamaringaId && req.body['playlists[]']) {
                for (var i = 0 ; i < req.body['playlists[]'].length ; i++){
                    playlist.push(req.body['playlists[]'][i])
                }
               // playlist.push(req.body.playlists)
                researchList.push(researchListData)
                const userData = {
                    tamaringaId: req.body.tamaringaId.toString(),
                    playlists: playlist,
                    researchList: researchList,
                };
                const query = {"tamaringaId": userData.tamaringaId};
                const options = {"upsert": true};
                UserData.updateOne(query, userData, options)
                    .then(result => {
                        const {matchedCount, modifiedCount} = result;
                        if (matchedCount && modifiedCount) {
                            console.log(`Successfully added a new User Data.`)
                        }
                    }).catch(err => console.error(`Failed to add review: ${err}`))
            }
            else {
                return next(e);
            }
        } catch (e) {
            return next(e);
        }
    });
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

    if (req.body.tamaringaId && req.body.birthYear && req.body.countryAtTwenty && req.body.userName && req.body.firstName && req.body.lastName) {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
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
        // var bulk = PublicUsers.collection.initializeOrderedBulkOp();
        // bulk.find({
        //     tamaringaId: userData.tamaringaId                 //update the id , if have - update else its build new document
        // }).upsert().updateOne(userData);
        // bulk.execute();
        const query = {"tamaringaId": userData.tamaringaId};
        const options = {"upsert": true};
        PublicUsers.updateOne(query, userData, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a new public user.`)
                }
            }).catch(err => console.error(`Failed to add review: ${err}`))
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

    if (req.body.tamaringaId && req.body.userName && req.body.firstName && req.body.lastName && req.body.privateId && req.body.nursingHome) {
        var userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId,
            privateId: req.body.privateId,
            nursingHome: req.body.nursingHome
        };
        console.log(userData.privateId);
        //var bulk = PrivateUsers.collection.initializeOrderedBulkOps();
        //var bulk = PrivateUsers.collection.bulkWrite();
        // bulk.find({
        //     privateId: userData.privateId                 //update the id , if have - update else its build new document
        // }).updateOne( 'privateId': 'userData.privateId',userData,);
        // bulk.execute();

        const query = {"privateId": userData.privateId};
        const update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId,
            privateId: req.body.privateId,
            nursingHome: req.body.nursingHome
        };
        const options = {"upsert": true};
        PrivateUsers.updateOne(query, update, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a private user.`)
                }
            })
            .catch(err => console.error(`Failed to add review: ${err}`))


    }
});

/** ----------------------------------------------------------------------------------
 * Update the given users playlist , and add user to Data base
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} name: Given user name
 * @PARAM {String} country: Given user name
 * @PARAM {Number} entrance:The user entrance
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList , userData}
 ----------------------------------------------------------------------------------*/

app.post('/updatePrivateUsers', function (req, res, next) {
    if (!req.body) return res.sendStatus(400, "Error to add user");

    if (req.body.tamaringaId && req.body.name && req.body.nursingHome) {
        var userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId,
            nursingHome: req.body.nursingHome
        };

        const query = {"tamaringaId": userData.tamaringaId};
        const update = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            tamaringaId: req.body.tamaringaId,
            // privateId: req.body.privateId,
            nursingHome: req.body.nursingHome
        };
        const options = {"upsert": true};
        PrivateUsers.updateOne(query, update, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a private user.`)
                }
            })
            .catch(err => console.error(`Failed to add review: ${err}`))

        // var bulk = PrivateUsers.collection.initializeOrderedBulkOp();
        // bulk.find({
        //     tamaringaId: userData.tamaringaId                 //update the id , if have - update else its build new document
        // }).upsert().updateOne(userData);
        // bulk.execute();
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
            year: {$gt: parseInt(req.params.yearAtTwenty) - 5, $lt: parseInt(req.params.yearAtTwenty) + 5},
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
 * Return the top records of the given year between 2 year before and 2 years after
 *
 * @PARAM {String} year: The user 20's year
 * @PARAM {String} country: The user country
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.post('/mb/track/recording', function (req, res, next) {
    db().then(() => {
        var year = req.body.year.toString(),
            country = req.body.country,
            language = req.body.language;
        let lookup = {}
        if (year && !isNaN(year) && year !== "") lookup['year'] = {$gt: parseInt(year) - 5, $lt: parseInt(year) + 5};
        if (country && country !== "") lookup['country'] = country.toString();
        if (language && language !== "") lookup['language'] = language.toString();

        if (!Object.keys(lookup).length) return next(new Error('Invalid search params'));

        Records.find(lookup).sort({'youtube.views': -1}).limit(PLAYLISTSIZE).exec(function (err, docs) {
            if (err) return next(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
            var recList = [];
            var size = PLAYLISTSIZE
            if (docs.length < size) {
                size = data.items.length;
            }
            for (i = 0; i < size; i++) {
                console.log('docs[i]: ',docs[i])
                recList.push({
                    mbId: docs[i].mbId,
                    title: docs[i].title,
                    year: parseInt(docs[i].year),
                    artist: docs[i].artist,
                    language: docs[i].language,
                    artistName: docs[i].artist[0].name,
                    country: docs[i].country,
                    lyrics: docs[i].lyrics,
                    genre: docs[i].genre,
                    youtube: docs[i].youtube,
                    mbRaw: docs[i].mbRaw
                });
            }
            if (typeof req.body.createPlayList == 'undefined') {
                return res.status(200).json({err: true, items: [].concat(recList)});
            }
            //create a playlist
            var playlistData = {
                name: req.body.playlistName,
                year: req.body.year,
                country: req.body.country,
                language: req.body.language,
                records: recList
            };
            // console.log('playlistData: ', playlistData);
            var query = {name: playlistData.name},
                update = playlistData,
                options = {upsert: true, new: true, setDefaultsOnInsert: true};

            PlayList.updateOne(query, update, options)
                .then(result => {
                    const {matchedCount, modifiedCount} = result;
                    if (matchedCount && modifiedCount) {
                        console.log(`Successfully added a private user.`)
                    }
                })
                .catch(err => console.error(`Failed to add review: ${err}`))

            res.status(200).json({err: false, items: [].concat(req.body.playlistName)});

        });
    }).catch(next);
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
app.post('/mb/track', function (req, res, next) {
    db().then(() => {
        // console.log("req",req.body);
        var recordName = req.body.recordName,
            year = req.body.year.toString(),
            country = req.body.country,
            language = req.body.language;
        let lookup = {}
        if (recordName && recordName !== "") lookup['title'] = {'$regex': new RegExp(recordName, "i")};
        if (year && !isNaN(year) && year !== "") lookup['year'] = {$gt: parseInt(year) - 5, $lt: parseInt(year) + 5};
        if (country && country !== "") lookup['country'] = country.toString();
        if (language && language !== "") lookup['language'] = language.toString();

        if (!Object.keys(lookup).length) return next(new Error('Invalid search params'));

        Records.find(lookup).limit(PLAYLISTSIZE).exec(function (err, docs) {
            if (err) return next(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
            // console.log("docs: ",docs);
            res.status(200).json({err: false, items: [].concat(docs)});
        })


        // year can be same year
        // string can be found by title: {/^Move over Darling$/i}
        /*
        title:{$regex: /^move over darling$/i},
                year: {$gt: parseInt(1990) - 5, $lt: parseInt(1990) + 5},
                country: "US",
                language: "eng"
        * */


    }).catch(next);
});

/** ----------------------------------------------------------------------------------
 * create playlist with only playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/createNewManualPlayList', function (req, res, next) {
    //console.log(req.params.id);
    PlayList.find({name: req.params.name}).exec(function (err, docs) {
        if (err) return next(err);
        //console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })


    if (!req.body) return res.sendStatus(400, "Error to add user");
    var playlistData = {
        name: req.body.name,
        year: req.body.year,
        country: req.body.country,
        language: req.body.language,
        records: JSON.parse(req.body.records)
    };
    // console.log(playlistData);
    var query = {name: playlistData.name},
        update = playlistData,
        options = {upsert: true, new: true, setDefaultsOnInsert: true};


    PlayList.updateOne(query, update, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a private user.`)
            }
        })
        .catch(err => console.error(`Failed to add review: ${err}`))
});


/** ----------------------------------------------------------------------------------
 * create playlist with only playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.post('/createManualPlayList', function (req, res, next) {
    //console.log(req.params.id);
    PlayList.find({name: req.params.name}).exec(function (err, docs) {
        if (err) return next(err);
        //console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })


    if (!req.body) return res.sendStatus(400, "Error to add user");
    var playlistData = {
        name: req.body.name,
        year: req.body.year,
        country: req.body.country,
        language: req.body.language,
        records: JSON.parse(req.body.records)
    };
    // console.log(playlistData);
    var query = {name: playlistData.name},
        update = playlistData,
        options = {upsert: true, new: true, setDefaultsOnInsert: true};


    PlayList.updateOne(query, update, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a private user.`)
            }
        })
        .catch(err => console.error(`Failed to add review: ${err}`))
});


/** ----------------------------------------------------------------------------------
 * create playlist with only playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.post('/ManualPlayListByName', function (req, res, next) {

    if (!req.body) return res.sendStatus(400, "Error to add user");
    var playlistData = {
        name: req.body.name,
    };
    console.log(playlistData);
    var query = {name: playlistData.name},
        update = playlistData,
        options = {upsert: true, new: true, setDefaultsOnInsert: true};

    PlayList.updateOne(query, update, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a playlist.`)
            }
            res.status(200).json({err: false, items: [].concat(result)});
        })
        .catch(err => console.error(`Failed to add review: ${err}`))
});


/** ----------------------------------------------------------------------------------
 * create playlist with only playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.post('/addSongToPlaylist', function (req, res, next) {

    if (!req.body) return res.sendStatus(400, "Error to add user");
    var mbId = req.body['mbIdArr[]']; //req.body['researchersIds[]']
    console.log(mbId);
    var recordDetails = [];
    var allRecords = [];
    // Records.find({mbId: mbId}).limit(1).exec(function (err, docs) {
    //     if (err) return next(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
    //     // console.log("docs: ", docs[0]);
    //     recordDetails = docs
    //     console.log('recordDetails1: ',recordDetails);
    // });

    return new Promise(function (resolve, reject) {
        Records.find({mbId:{$in:mbId}}).exec(function (err, docs) {
            if (err) return reject(err);       //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
            // console.log("docs: ", docs[0]);
            var record = docs
            resolve(record);
        });
    }).then(function (res) {
        console.log('recordDetails: ',res);
        recordDetails = res;
        // console.log('recordDetails2: ',recordDetails.artist);
        // console.log('recordDetails2: ',recordDetails.artist);

        return new Promise(function (resolvePl, reject) {

            var playlistName = req.body.playlistName;

            PlayList.find({name: playlistName}).limit(1).exec(function (err, docs) {
                if (err) return reject(err);
                //the data we get sorted from the bigest views number to the smalll ones and limit to 10 top .
                // console.log("docs[0].records: ", docs[0].records);
                resolvePl(docs[0]);
            });

        }).then(function (res) {
            // console.log('response', res);
            allRecords = res.records;
            // console.log('recordDetails: ',recordDetails);
            var recordsToAdd = [];
            for (let i = 0 ; i < recordDetails.length; i++){
                console.log('HHHH: ',recordDetails[i]._doc);
                var recordData = {
                    mbId: recordDetails[i]._doc.mbId,
                    title: recordDetails[i]._doc.title,
                    year: recordDetails[i]._doc.year,
                    artistName: recordDetails[i]._doc.artist[0].name,
                    artist: recordDetails[i]._doc.artist,
                    language: recordDetails[i]._doc.language,
                    country: recordDetails[i]._doc.country,
                    lyrics: recordDetails[i]._doc.lyrics,
                    genre: recordDetails[i]._doc.genre,
                    youtube: recordDetails[i]._doc.youtube,
                    mbRaw: recordDetails[i]._doc.mbRaw,
                }
                allRecords.push(recordData);
            }
            console.log('allRecords: ', allRecords);
            var playlistData = {
                name: req.body.playlistName,
                records: allRecords
            };
            console.log("playlistData: ", playlistData);
            var query = {name: playlistData.name},
                update = playlistData,
                options = {upsert: true, new: true, setDefaultsOnInsert: true};

            PlayList.updateOne(query, update, options)
                .then(result => {
                    const {matchedCount, modifiedCount} = result;
                    if (matchedCount && modifiedCount) {
                        console.error(`Successfully added a playlist.`)
                    }
                    //res.status(200).json({err: false, items: [].concat(result)});
                })
                .catch(err => console.error(`Failed to add review: ${err}`))
        });
    });
});

/** ----------------------------------------------------------------------------------
 * return all the records from playlist by playlist name.
 *
 * @PARAM {String*} name: the playlist name
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/playlistRecords/:playlistName', function (req, res, next) {

    console.log("req", req.params.playlistName);

    if (!req.body) return res.sendStatus(400, "Error to add user");
    var playlistName = req.params.playlistName;
    PlayList.find({name: playlistName}).limit(1).exec(function (err, docs) {
        if (err) return reject(err);

        res.status(200).json({err: false, items: [].concat(docs)});
    });

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

    var decrypted1 = bytes.toString(CryptoJS.enc.Utf8)
    // console.log(req.params.id);
    PublicUsers.find({tamaringaId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs);
        // res.status(200).json({err: false, items: [].concat(docs)});
        var bytes2 = CryptoJS.AES.decrypt(docs[0].password, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        // console.log("docs: ",decrypted2);
        if (decrypted2 === decrypted1) {
            res.status(200).json({err: false, items: [].concat(docs)});
        } else {
            return next(err)
        }
    });
});

app.get('/user/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    // console.log(req.params.id);
    PublicUsers.find({tamaringaId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    });
});


/** ----------------------------------------------------------------------------------
 * Return the Research by id
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/


app.get('/research/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    console.log(req.params.id.toString());
    Research.find({researchId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        console.log(docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    });
});

app.get('/userByResearch/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    // console.log(req.params.id);
    let usersIds = [];
    Research.find({researchId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);
        // console.log(docs[0].patientsIds);
        usersIds = docs[0].patientsIds
        PublicUsers.find({tamaringaId: {"$in": usersIds}}).exec(function (err, docs) {
            if (err) return next(err);
            // console.log(docs);
            res.status(200).json({err: false, items: [].concat(docs)});
        });
    });
});


app.post('/loginUser', routes.post.loginUser);

/** ----------------------------------------------------------------------------------
 * Return decade playlist name if exists
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/

app.post('/getDecadePlaylist', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    PlayList.find({name: { $in:req.body['name[]']}}).exec(function (err, docs) {
        if (err) return next(err);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});

/** ----------------------------------------------------------------------------------
 * Return the private id by tamaringa id
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/


app.get('/privateUser/:id', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    console.log(req.params.id);
    PrivateUsers.find({tamaringaId: req.params.id.toString()}).exec(function (err, docs) {
        if (err) return next(err);

        res.status(200).json({err: false, items: docs[0].privateId});
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
 * Return all the users Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.post('/allPlaylists', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    PlayList.find({}).exec(function (err, docs) {
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
 * Return all the researches Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/allresearches', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    Research.find({}).exec(function (err, docs) {
        if (err) return next(err);
        console.log("allresearches", docs);
        res.status(200).json({err: false, items: [].concat(docs)});
    })
});


/** ----------------------------------------------------------------------------------
 * Return all the researcheGroups Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/getResearcheGroupsSize', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    ResearchGroup.find({}).exec(function (err, docs) {
        if (err) return next(err);
        res.status(200).json({err: false, items: docs.length});
    })
});
/** ----------------------------------------------------------------------------------
 * Return all the researchs Data from DB
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {docs: []}
 ----------------------------------------------------------------------------------*/
app.get('/getResearchesSize', function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req) return res.sendStatus(400);
    Research.find({}).exec(function (err, docs) {
        if (err) return next(err);
        res.status(200).json({err: false, items: docs.length});
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
app.post('/selection/:userId', routes.post.userRateSong);

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
        // console.log("docs[0]: ",docs[0]);
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
        var encryptedPass = CryptoJS.AES.encrypt(req.body.researcherPassword, 'Password');

        const researcherData = {
            researcherName: req.body.researcherName,
            researcherId: req.body.researcherId,
            researcherPassword: encryptedPass.toString(),
            isAdmin: Boolean(req.body.isAdmin)
        };

        console.log('researcherData: ', researcherData);

        const query = {researcherId: researcherData.researcherId};
        const options = {"upsert": true};
        Researchers.updateOne(query, researcherData, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a private user.`)
                }
            })
            .catch(err => console.error(`Failed to add review: ${err}`))


        // var bulk = Researchers.collection.initializeOrderedBulkOp();
        // bulk.find({
        //     researcherId: researcherData.id                 //update the id , if have - update else its build new document
        // }).upsert().updateOne(researcherData);
        // bulk.execute();
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
    const researchData = {
        researchName: req.body.researchName,
        researchId: req.body.researchId,
        researchersIds: req.body['researchersIds[]'],
        description: req.body.description,
        researchGroupId: req.body.researchGroupId,
        patientsIds: req.body['patientsIds[]'],
        nursingHome: req.body.nursingHome,
        department: req.body.department,
        numberOfWeeks: req.body.numberOfWeeks,
        meetingPerWeek: req.body.meetingPerWeek,
        lengthOfSession: req.body.lengthOfSession,
        algorithm: req.body.algorithm,
        // created: req.body.created
    };
    // var bulk = Research.collection.initializeOrderedBulkOp();
    // bulk.find({
    //     researchId: researchData.researchId                 //update the id , if have - update else its build new document
    // }).upsert().updateOne(researchData);
    // bulk.execute();

    const query = {"researchId": researchData.researchId};
    const options = {"upsert": true};
    Research.updateOne(query, researchData, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a private user.`)
            }
        })
        .catch(err => console.error(`Failed to add review: ${err}`))

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
        description: req.body.description,
        researchersIds: req.body['researchersIds[]']
    };
    // console.log("researchGroup: ",researchGroup);
    // var bulk = ResearchGroup.collection.initializeOrderedBulkOp();
    // bulk.find({
    //     researchGroupId: researchGroup.researchGroupId                 //update the id , if have - update else its build new document
    // }).upsert().updateOne(researchGroup);
    // bulk.execute();


    const query = {"researchGroupId": researchGroup.researchGroupId};
    const options = {"upsert": true};
    ResearchGroup.updateOne(query, researchGroup, options)
        .then(result => {
            const {matchedCount, modifiedCount} = result;
            if (matchedCount && modifiedCount) {
                console.log(`Successfully added a private user.`)
            }
        })
        .catch(err => console.error(`Failed to add review: ${err}`))


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

// app.get('/insertResearcher/:id', function (req, res, next) {
//     if (!req.body) return res.sendStatus(400);
//     console.log("req.body: ", req.body);
//
//     var CryptoJS = require("crypto-js");
//     var bytes = CryptoJS.AES.decrypt(req.params.encryptedPass, 'Password');
//     var decrypted1 = bytes.toString(CryptoJS.enc.Utf8);
//     var id = req.params.id.toString()
//
//     Researchers.find({researcherId: id}).exec(function (err, docs) {
//         if (err) return next(err);
//         // console.log("docs: ",docs);
//         if (docs[0] === undefined || docs[0].researcherPassword === undefined) {
//             return next(err);
//         }
//         var bytes2 = CryptoJS.AES.decrypt(docs[0].researcherPassword, 'Password');
//         var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
//         if (decrypted2 === decrypted1 && docs[0].isAdmin) {
//             res.status(200).json({err: false, items: [].concat(docs)});
//         } else {
//             return next(err)
//         }
//     });
// });

app.post('/loginResearcher', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.researcherId === undefined || req.body.researcherPassword === undefined) {
        return next(err);
    }
    Researchers.find({researcherId: req.body.researcherId}).exec(function (err, docs) {
        if (err) return next(err);
        if (docs[0] === undefined || docs[0].researcherPassword === undefined) {
            return next(err);
        }
        var CryptoJS = require("crypto-js");

        var bytes2 = CryptoJS.AES.decrypt(docs[0].researcherPassword, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        // console.log(decrypted2)
        if (decrypted2 === req.body.researcherPassword && docs[0].isAdmin) {
            res.status(200).json({err: false, items: [].concat(docs)});
        } else {
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
    var bytes = CryptoJS.AES.decrypt(req.params.encryptedPass, 'Password');
    var decrypted1 = bytes.toString(CryptoJS.enc.Utf8);
    var id = req.params.id.toString()
    // console.log("Log-IN")
    ResearchGroup.find({researchGroupId: id}).exec(function (err, docs) {
        // console.log("Log-IN",docs)
        if (err) return next(err);
        var bytes2 = CryptoJS.AES.decrypt(docs[0].researchGroupPassword, 'Password');
        var decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);
        if (decrypted2 === decrypted1) {
            res.status(200).json({err: false, items: [].concat(docs)});
        } else {
            return next(err)
        }
    });
});

app.post('/loginResearchGroup', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    var CryptoJS = require("crypto-js");
    // console.log("req.body: ",req.body);
    if (req.body.Id === undefined || req.body.Password === undefined) {
        return next(err);
    }
    var id = req.body.Id
    ResearchGroup.find({researchGroupId: id}).exec(function (err, docs) {
        // console.log("docs",docs);
        if (err) return next(err);
        if (docs == null || docs[0] == null || docs[0].researchGroupPassword == null) {
            // alert("No playlist was defined for this user!");
            return next(err);
        }
        var bytes = CryptoJS.AES.decrypt(docs[0].researchGroupPassword, 'Password');
        var decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (decrypted === req.body.Password) {
            res.status(200).json({err: false, items: [].concat(docs)});
        } else {
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
        const recordData = {
            mbId: req.body.mbId,
            title: req.body.title,
            year: req.body.year,
            artistName: req.body.artistName,
            artist: JSON.parse(req.body.artist),
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
        // var bulk = Records.collection.initializeOrderedBulkOp();
        // bulk.find({
        //     id: recordData.mbId                 //update the id , if have - update else its build new document
        // }).upsert().updateOne(recordData);
        // bulk.execute();

        const query = {"mbId": recordData.mbId};
        const options = {"upsert": true};
        Records.updateOne(query, recordData, options)
            .then(result => {
                const {matchedCount, modifiedCount} = result;
                if (matchedCount && modifiedCount) {
                    console.log(`Successfully added a private user.`)
                }
            })
            .catch(err => console.error(`Failed to add review: ${err}`))


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

app.use(function(err, req, res, next){
    let response = {error: true, message: err.message || 'unkown error'};
    if(process.env.NODE_ENV != 'production'){
        response.stack = err.stack.split('\n');
    }
    res.status(err.status || 500).json(response);
})

/** ----------------------------------------------------------------------------------
 * open the connction with the DB.
 ----------------------------------------------------------------------------------*/
db().then(() => {
    const server1 = app.listen(process.env.port || 3000, () => debug('app:server')(`Server has started in port ${server1.address().port}`))
    // const server2 = app.listen(process.env.port || 3200, () => debug('app:server')(`Server has started in port ${server2.address().port}`))

}).catch(() => debug('app:mongo')('Houston we got a problem.... mongo'));




