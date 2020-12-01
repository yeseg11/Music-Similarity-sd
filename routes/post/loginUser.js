let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let PlayList = require('../../models/playlist.js');

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

                /*if(user.data.researchList[0].maxSessionNum >= (user.data.researchList[0].sessionList.length -1)){
                    return next(err || new Error('You max the ammount of sessions!'));
                }*/

                user.data = userDataDocs[0].toObject();
                user.data.firstTime = !user.data.researchList.filter(x=>x.sessionList).length?false:true;


                const logEntrence = () => new Promise((res, rej)=>{
                    PublicUsers.findOneAndUpdate({_id: user._id}, {$inc: {'entrance': 1}}).exec((err)=>{
                        if(err) return rej(err);

                        if(user.data.firstTime){

                            // cla + yid (3 digits code) - get 2 songs
                            // not 3 digits code - get 7 songs
                            const mapPlaylistData = user.data.playlists.map(x=>{
                                return {
                                    name: x,
                                    songs: (x.length == 3) ? 2 : 7
                                }
                            });

                            return Promise.all(mapPlaylistData.map(playlistData=>{
                                return new Promise((pres, prej)=>{
                                    PlayList.find({name: playlistData.name}).exec((err, playlistsDocs)=>{
                                        if(err) return prej(err);

                                        const getRandom = (items)=>{
                                            return items[Math.floor(Math.random()*items.length)]
                                        }

                                        pres(playlistsDocs.map(doc=>{
                                            const limitSongs = mapPlaylistData.find(x=>x.name==doc.name).songs;

                                            let records = [];
                                            while(records.length < limitSongs){
                                                const record = getRandom(doc.records);
                                                if(!records.filter(x=>
                                                    record._id.toString()
                                                    ==
                                                    x._id.toString()
                                                ).length) records.push(record);
                                            }


                                            doc.records = records;
                                            return doc;
                                        }).sort((a, b)=>{
                                            return a.records.length - b.records.length
                                        }));
                                    })
                                })
                            })).then(playlists=>{

                                res(playlists)
                            }).catch(e=>rej(e))
                        }else{
                            // @TODO logic if not first time
                            res([]);
                        }

                    })
                });

                logEntrence().then((playlists)=>{
                    user.playlists = playlists.filter(x=>x.length);

                    if(!user.data.researchList.length) return next(new Error('No research list exists!'));

                    let update = {};

                        update['$push'] = {
                            'researchList.0.sessionList': {
                                sessionNumber: (!user.data.researchList[0].sessionList.length) ? 1 : user.data.researchList[0].sessionList.length + 1,
                                sessionDate: new Date(),
                                songs: []
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
