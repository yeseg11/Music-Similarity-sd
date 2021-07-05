let UserData = require('../../models/userData.js');
let Records = require('../../models/records.js');
let Research = require('../../models/research.js');

module.exports = async function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req.body) return res.sendStatus(400);
    const researchID = req.params.researchId;

    if(!researchID) return next(new Error('No research found'));


    Research.find({researchId: researchID.toString()}).lean().exec(function (err, researchDoc) {
        if (err) return next(err);


        UserData.find({tamaringaId: researchDoc["0"].patientsIds}).lean().exec(function (err, UserDatadocs) {
            if (err) return next(err);

            const playlistsKeys = {
                arame: "ArabicME",
                arana: "ArabicNA",
                heb: "Hebrew",
                fra: "French",
                spa: "Spanish",
                rus: "Russian",
                eng: "English",
                Eng: "English",
                yid: "Yiddish",
                lad: "Ladino",
                ara: "Arabic",
                pra: "Prayer Songs (Piyutim)",
                mid: "Middle Eastern music",
                cla: "Classical/Traditional"
            };

            let portalData = {
                researchName: researchDoc["0"].researchName,
                researchId: researchDoc["0"].researchId,
                researchGroup: researchDoc["0"].researchGroupId,
                nursingHome: researchDoc["0"].nursingHome,
                department: researchDoc["0"].department,
                description: researchDoc["0"].description,
                patientsIds: researchDoc["0"].patientsIds,
                numberOfWeek: researchDoc["0"].numberOfWeeks,
                meetingPerWeeks: researchDoc["0"].meetingPerWeek,
                lengthOfSession: researchDoc["0"].lengthOfSession,
                mostRatedSongsNum: 0,
                numberOfPlaylistsNum: 0,
                numberOfSongs: 0,
                NumberOfRatedSongs: 0,
                pieLables: [],
                pieData: [],

            };

            //every array item of researchData represent a user
            const researchData = UserDatadocs.map(item =>{
                return item.researchList.find(research => {
                    return research.researchId = portalData.researchId;
                })
            });


            const allUsersSongs = researchData.map(patient => {
                return patient.sessionList.map(session => {
                    return session.songs;
                })
            }).flat(2);


            let songStatistics = {};
            let playlistsData = [];
            let languageData = [];
            let genreData = [];


            // Create an array with the research songs, songs occurrences and average rating
            allUsersSongs.forEach(function (value) {
                if(!songStatistics[value.mbId]) {
                    songStatistics[value.mbId] = { //add songs to songStatistics if he isn't there already
                        sumScore: 0,
                        average: 0,
                        occurrences: 0,
                        sumOfRaters: 0,
                        language: value.language,
                        playlistName: value.playlistName,
                    }
                    portalData.numberOfSongs++;
                }

                songStatistics[value.mbId].occurrences++;
                songStatistics[value.mbId].sumScore += value.score || 0;
                songStatistics[value.mbId].language = value.language;
                songStatistics[value.mbId].playlistName = value.playlistName;
                if(value.score > 0){
                    songStatistics[value.mbId].sumOfRaters++;
                    songStatistics[value.mbId].average = songStatistics[value.mbId].sumScore / songStatistics[value.mbId].sumOfRaters;
                    if(songStatistics[value.mbId].sumOfRaters === 1) { // count songs that rated when it a song has at least one rater
                        portalData.NumberOfRatedSongs++;
                    }
                }
            });
            console.log("check");
            Object.values(songStatistics).forEach(value => {
                let isGenre = false;
                if(value.playlistName.localeCompare("cla") === 0
                    || value.playlistName.localeCompare("yid") === 0
                    || value.playlistName.localeCompare("lad") === 0
                    || value.playlistName.localeCompare("pra") === 0
                    || value.playlistName.localeCompare("mid") === 0){
                    isGenre = true;
                }

                if(!genreData[value.playlistName] && isGenre){
                    genreData[value.playlistName] = {
                        playlistName: value.playlistName,
                        languageStr: playlistsKeys[value.playlistName],
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    genreData.length++;
                }

                if(!languageData[value.language] && !isGenre){
                    languageData[value.language] = {
                        language: value.language,
                        languageStr: playlistsKeys[value.language],
                        songsCount: 0,
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    languageData.length++;
                }

                if(!playlistsData[value.playlistName] && !isGenre){
                    playlistsData[value.playlistName] = {
                        playlistName: value.playlistName,
                        languageStr: playlistsKeys[value.language],
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    playlistsData.length++;
                }

                if(!isGenre) {
                    languageData[value.language].songsCount++;
                }

                if(value.average > 0){
                    if(!isGenre) {
                        playlistsData[value.playlistName].sumScore += value.average;
                        playlistsData[value.playlistName].sumOfRaters++;
                        playlistsData[value.playlistName].average = playlistsData[value.playlistName].sumScore / playlistsData[value.playlistName].sumOfRaters;

                        languageData[value.language].sumScore += value.average;
                        languageData[value.language].sumOfRaters++;
                        languageData[value.language].average = languageData[value.language].sumScore / languageData[value.language].sumOfRaters;
                    }

                    if(isGenre) {
                        genreData[value.playlistName].sumScore += value.average;
                        genreData[value.playlistName].sumOfRaters++;
                        genreData[value.playlistName].average = genreData[value.playlistName].sumScore / genreData[value.playlistName].sumOfRaters;
                    }
                }
            });

            const mostRatedSongs = Object.entries(songStatistics).sort( (a,b) => {
                return b[1].average-a[1].average
            });


            Object.values(languageData).forEach(function (language)
            {
                portalData.pieLables.push(language.languageStr);
                portalData.pieData.push(language.sumOfRaters);
            });

            res.status(200).json({err: false, items: portalData});
        });

    });




    // return UserData.findOne({tamaringaId}).exec((err, user)=>{
    //     if(err || !user) return next(err || new Error('Invalid user Id!'));
    //
    //     const currentSessionIndex = user.researchList[0].sessionList.length -1;
    //     let currentSession = user.researchList[0].sessionList[parseInt(currentSessionIndex)];
    //
    //     if(stringType === 'start') {
    //         console.log("post start");
    //         currentSession.guideCommentStart = commentString;
    //     }
    //
    //     if(stringType === 'end') {
    //         currentSession.guideCommentEnd = commentString;
    //     }
    //
    //     let update = {};
    //
    //     const options = {"upsert": true};
    //     update['$set'] = {
    //         'researchList.0.sessionList': user.researchList[0].sessionList
    //     }
    //
    //
    //     UserData.findOneAndUpdate({_id:  user._id}, update, options).exec((err, result)=>{
    //         if(err) return next(err);
    //         //res.status(200).json({err: false})
    //     })
    //
    //     res.status(200).json({err: false})
    // });


}