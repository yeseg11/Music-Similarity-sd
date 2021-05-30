let PlayList = require('../../models/playlist.js');
let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let GlobalRating = require('../../models/globalRating');
let Records = require('../../models/records.js');

module.exports = async function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    const tamaringaId = req.params.userId;
    const {mbId, playlistName, score, rateType} = req.body;
    if(!tamaringaId) return next(new Error('Missing user Id'));

    const checkKeys =['mbId', 'playlistName', 'score', 'rateType'].filter(key=>!req.body[key]).map(key=>`We are missing ${key}`);
    if(checkKeys.length) return next(new Error(checkKeys.join(",")));


    const currentRecord = await getRecord(mbId);
    const rateGlobal = await globalRate(currentRecord, score, playlistName);

    return UserData.findOne({tamaringaId}).exec((err, user)=>{
        if(err || !user) return next(err || new Error('Invalid user Id!'));

        let currentSessionIndex = rateType;

        //if it's a user, get the last session index. If it's a guide, the last session index is 'rateType'
        if(currentSessionIndex === 'user') {
            currentSessionIndex = user.researchList[0].sessionList.length -1;
        }

        const currentSession = user.researchList[0].sessionList[parseInt(currentSessionIndex)];

        currentSession.songs = currentSession.songs || [];
        const gradedSongAlready = currentSession.songs.find(x=>x.mbId==mbId);

        if(gradedSongAlready){
            gradedSongAlready.score = score;
        }else{
            currentSession.songs.push({
                playlistName: playlistName,
                mbId: mbId,
                score: score
            })
        }

        let update = {};


        update['$set'] = {
            'researchList.0.sessionList': user.researchList[0].sessionList
        }


        UserData.findOneAndUpdate({_id:  user._id}, update).exec((err, result)=>{
            if(err) return next(err);
            res.status(200).json({err: false})
        })


    }); // end UserData.findOne


}

function getRecord(mbId){
    return new Promise(function(resolve,reject) {
        Records.find({mbId: mbId})
            .exec(function (err, docs) {
                if(err || !docs.length)
                    reject(new Error('Error: No record available!'));
                else{
                    let record = docs["0"]._doc
                    delete record.lyrics;
                    delete record.genre;
                    delete record.youtube;
                    delete record.mbRaw;
                    resolve(record);
                    }
            })
    })
}

function globalRate(currentRecord, score, playlistName){
    return new Promise(function(resolve,reject) {
        GlobalRating.findOne({language: currentRecord.language})
            .exec(function (err, docs) {
                if(err)
                    reject(new Error('Error: No record available!'));
                else {
                    let updateGlobal = {};
                    if (!docs) {
                        updateGlobal = {
                            language: currentRecord.language,
                            playlists: []
                        };
                    }
                    else
                        updateGlobal = docs._doc;

                    let currentPlaylist = updateGlobal.playlists.find(function (playlist) {
                        return playlist.name === playlistName;
                    });

                    if(typeof currentPlaylist === "undefined") {
                        updateGlobal.playlists.push({
                            name: playlistName,
                            country: currentRecord.country,
                            records: []
                        })
                    }

                    let recordExist = false;

                    updateGlobal.playlists.forEach(function (playlist) {
                        if(playlist.name === playlistName){
                            playlist.records.forEach(function(song){
                                if (currentRecord.mbId === song.mbId) {
                                    song.sumOfRatings += parseInt(score);
                                    song.countOfRaters++;
                                    song.ratingAvg = song.sumOfRatings/song.countOfRaters;
                                    recordExist = true;
                                }
                            })
                            if (!recordExist) {
                                currentRecord.sumOfRatings = score;
                                currentRecord.countOfRaters = 1;
                                currentRecord.ratingAvg = score;
                                currentRecord.playlist = playlist.name;
                                playlist.records.push(currentRecord);
                            }
                        }
                    });

                    const options = {"upsert": true};
                    GlobalRating.findOneAndUpdate({language: currentRecord.language}, updateGlobal, options)
                            .exec(function (err, docs) {
                                if(err)
                                    reject(new Error('Error updating global rating!'));
                                else
                                    resolve(docs);
                            })

                    resolve(updateGlobal);
                }
            })
    })

}



    /*
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
     */

