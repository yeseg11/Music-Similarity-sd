let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let PlayList = require('../../models/playlist.js');

let FULLPLAYLISTSONGS = 3;
let GENERPLAYLISTSONGS =2;
const TESTFLAG= true


module.exports = function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req || !req.body) return res.sendStatus(400);

    if (req.body.userName === undefined || req.body.userPassword === undefined) {
        return next(new Error('User name or Password is missing'));
    }

    PublicUsers.find({
        userName: req.body.userName.toString(),
        password: req.body.userPassword.toString()
    }).exec(function (err, docs) {
        if (err || !docs.length) return next(err || new Error('Invalid user!'));

        const user = docs[0].toObject();

        // return res.status(200).json({err: false, items: [].concat([user])});

        UserData.find({tamaringaId: user.tamaringaId.toString()})
            .exec(function (err, userDataDocs) {
                if(err || !userDataDocs.length) return next(err || new Error('Contact support no userData avialable!'));
                if(userDataDocs[0].researchList === null) return next(err || new Error('Can not Enter, Please add the user to research!'));
                user.data = userDataDocs[0].toObject();



                user.data.firstTime = user.data.researchList.filter(x=>x.sessionList == null ? 0:x.sessionList).length !== 0?false:true;
                // @TODO remove me because I'm debug first time
                //  user.data.researchList[0].sessionList = [];

                if (user.data.researchList[0].sessionList != null){
                    if(user.data.researchList[0].maxSessionNum === (user.data.researchList[0].sessionList.length )){
                        return next(new Error('You max the amount of sessions classes!'));
                    }
                }

                const logEntrence = () => new Promise((res, rej)=>{
                    PublicUsers.findOneAndUpdate({_id: user._id}, {$inc: {'entrance': 1}}).exec((err)=>{
                        if(err) return rej(err);

                        // cla + yid (3 digits code) - get 2 songs
                        // not 3 digits code - get 3 songs
                        const mapPlaylistData = user.data.playlists.map(x=>{
                            return {
                                name: x,
                                songs: (x.length == 3) ? GENERPLAYLISTSONGS : FULLPLAYLISTSONGS
                            }
                        });

                        const getRandom = (items)=>{
                            return items[Math.floor(Math.random()*items.length)]
                        }
                        if(TESTFLAG || user.data.firstTime){

                            return Promise.all(mapPlaylistData.map(playlistData=>{
                                return new Promise((pres, prej)=>{
                                    PlayList.find({name: playlistData.name}).exec((err, playlistsDocs)=>{
                                        if(err) return prej(err)
                                        pres(playlistsDocs.map(doc=>{
                                            const limitSongs = mapPlaylistData.find(x=>x.name==doc.name).songs;
                                            let records = [];
                                            while(records.length < limitSongs){
                                                const record = getRandom(doc.records);
                                                if(!records.filter(x=>
                                                    record.mbId.toString()
                                                    ==
                                                    x.mbId.toString()
                                                ).length) records.push(record);
                                            }
                                            doc.records = records;
                                            return doc;
                                        }));
                                    })
                                })
                            })).then(playlists=>{
                                //console.log("playlists1: ",playlists)
                                res(playlists);
                            }).catch(e=>rej(e))
                        }else{
                            //  Not first time user login
                            const mbidLiked = user.data.researchList[0].sessionList.map(x=>{
                                return x.songs
                                    .filter(s=>s.score >= 3 && s.score <= 5)
                                    .map(s=> s.mbId)
                            }).reduce(function(o, v, i, arr){
                                for(let i=0; i < v.length; i++){
                                    if(o.indexOf(v[i]) != -1) continue;
                                    o.push(v[i]);
                                }
                                return o;
                            }, []);


                            const likedPlaylist = {
                                "similarity": [],
                                "_id": null,
                                "name": "Liked",
                                "country": null,
                                "language": "eng",
                                records: []
                            }

                            // console.log(likedPlaylist);

                            return Promise.all(mapPlaylistData.map(playlistData=>{
                                return new Promise((pres, prej)=>{
                                    PlayList.find({name: playlistData.name}).exec((err, playlistsDocs)=>{
                                        if(err) return prej(err);
                                        // join all sessions seen mbid
                                        // @return mbid[]
                                        // console.log("playlistsDocs",playlistsDocs);
                                        for(let i=0; i < playlistsDocs.length;i++){
                                            const playlist = playlistsDocs[i];
                                            if(!playlist || !playlist.records || !playlist.records.length) continue;
                                            for(let r=0;r < playlist.records.length;r++){
                                                const record = playlist.records[r];
                                                if(!record) continue;
                                                if(mbidLiked.indexOf(record.mbId) != -1 && !likedPlaylist.records.find(x=>x.mbId==record.mbId)) likedPlaylist.records.push(record);
                                            }
                                        }
                                        // console.log("likedPlaylist",likedPlaylist);

                                            let songs = playlistsDocs.map(doc=>{
                                                let records = []; //.concat(doc.records.find(x=>mbidLiked.indexOf(x.mbId)!=-1) || []).slice(0, 2);
                                                // return the number of songs for each playlist
                                                const limitSongs = ((limit,defaultlimitSongs)=>{
                                                    return defaultlimitSongs > limit ? defaultlimitSongs : limit;
                                                })(mapPlaylistData.find(x=>x.name==doc.name).songs - records.length >= 3 ? 3 : records.length, mapPlaylistData.find(x=>x.name==doc.name).songs);


                                                while(records.length < limitSongs){
                                                    const record = getRandom(doc.records);
                                                    if(!records.filter(x=>
                                                        record.mbId.toString()
                                                        ==
                                                        x.mbId.toString()
                                                    ).length) {
                                                        // prevent duplicate mbid to show on end user
                                                        if(mbidLiked.indexOf(record.mbId) == -1)
                                                        records.push(record);
                                                    }
                                                }
                                                doc.records = records;
                                                return doc;
                                        });
                                        pres(songs);
                                    })
                                })
                            })).then((playlists)=>{
                                // console.log('before res', likedPlaylist);
                                res([playlists, likedPlaylist]);
                            }).catch(e=>rej(e))

                        }

                    })
                });

                logEntrence().then((data)=>{
                    let likedPL, playlists;
                    //
                    if(Array.isArray(data) && data.length == 1 && Array.isArray(data[0])){ //Not the first time enter
                        [playlists, likedPL] = data;
                    }else{
                        playlists = data;
                    }

                    //console.log("playlists2:",playlists);
                    if (playlists.length > 1){
                        user.playlists = playlists.filter(x=>x.length).sort((a,b)=>((b || [])[0].records || []).length - ((a || [])[0].records || []).length);

                    }
                    else{
                        user.playlists = [playlists]
                    }
                    //console.log("user.playlists:",user.playlists);
                    if(typeof likedPL == 'object') user.playlists.unshift([likedPL]);
                    if(!user.data.researchList.length) return next(new Error('No research list exists!'));

                    let update = {};
                    if (!TESTFLAG){
                        update['$push'] = {
                            'researchList.0.sessionList': {
                                sessionNumber: (!user.data.researchList[0].sessionList.length) ? 1 : user.data.researchList[0].sessionList.length + 1,
                                sessionDate: new Date(),
                                songs: []
                            }
                        }
                    }



                    UserData.findOneAndUpdate({_id:  user.data._id}, update).exec((err, result)=>{
                        if(err) return next(err);
                        res.status(200).json({err: false, items: [user]})
                    })
                }).catch(e=>next(e))
            });


    });
};
