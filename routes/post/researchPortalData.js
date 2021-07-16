let UserData = require('../../models/userData.js');
let Researchers = require('../../models/researchers.js');
let Research = require('../../models/research.js');
let Playlists = require('../../models/playlist.js');

function getRecord(songs){
    return new Promise(function(resolve,reject) {
        Playlists.find({"records.mbId":{$in:songs}}, "records" ).lean()
            .exec(function (err, docs) {
                if(err || !docs.length)
                    reject(new Error('Error: No record available!'));
                else{
                    let songsObject = docs.map(playlist => {
                        return playlist.records.filter(songObj => {
                            if(songs.indexOf(songObj.mbId) !== -1)
                                return songObj;
                        })

                    }).flat();

                    let sortedNames = [];

                    songs.forEach(function(key) {
                        let found = false;
                        songsObject = songsObject.filter(function(songObj) {
                            if(!found && songObj.mbId === key) {

                                sortedNames.push(songObj.artistName + " - " + songObj.title + " (" + songObj.year + ")");
                                found = true;
                                return false;
                            } else
                                return true;
                        })
                    })

                    resolve(sortedNames)
                }
            })
    })
}

function sortArrays(array){
    array = Object.entries(array).sort( (a,b) => {
        return b[1].average-a[1].average
    });

    return array;
}

function getResearcher(researchId) {
    return new Promise(function(resolve,reject) {
        Researchers.find({"researcherId": researchId.toString()} ).lean()
            .exec(function (err, docs) {
                if(err || !docs.length)
                    reject(new Error('Error: No record available!'));
                else{
                    resolve(docs["0"].researcherName)
                }
            })
    })
}

module.exports = async function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req.body) return res.sendStatus(400);
    const researchID = req.params.researchId;
    if(!researchID) return next(new Error('No research found'));

    Research.find({researchId: researchID.toString()}).lean().exec(function (err, researchDoc) {
        if (err) return next(err);

        UserData.find({tamaringaId: researchDoc["0"].patientsIds}).lean().exec(async function (err, UserDatadocs) {
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

            var leastRatedSong = "";
            var leastRatedScore = 5;

            let portalData = {
                researchName: researchDoc["0"].researchName,
                researchId: researchDoc["0"].researchId,
                researcherId: researchDoc["0"].researchersIds["0"],
                researcherName: "",
                researchGroup: researchDoc["0"].researchGroupId,
                nursingHome: researchDoc["0"].nursingHome,
                department: researchDoc["0"].department,
                description: researchDoc["0"].description,
                patientsIds: researchDoc["0"].patientsIds,
                numberOfWeek: researchDoc["0"].numberOfWeeks,
                meetingPerWeeks: researchDoc["0"].meetingPerWeek,
                lengthOfSession: researchDoc["0"].lengthOfSession,
                mostRatedSongsNum: 0,
                userStatistics: {},
                maxSessionLength: 0,
                langGenreStatistics: {},
                mostRatedSong: "",
                numberOfSongs: 0,
                numberOfPlaylists: 0,
                sessionComments: {},
                languageData: {length: 0},
                genreData: {length: 0},
                playlistsData: {length: 0},
                NumberOfRatedSongs: 0,
                playlistsAVG: {},
                pieLables: [],
                pieData: [],
            };

            //every array item of researchData represent a user
            let researchData = UserDatadocs.map(item =>{
                let tamId = item.tamaringaId;
                let plalistName = item.playlists.firstLanguage.playlists + item.playlists.secondLanguage.playlists;
                return item.researchList.find(research => {
                    research.tamaringaId = tamId;
                    return research.researchId = portalData.researchId;
                })
            });

            // for each user's session and playlist, count liked, unliked and indifferent song rating
            UserDatadocs.forEach(user => {
                if(!user.researchList)
                    return;
                const researchIndex = user.researchList.map(function(research) { return research.researchId; }).indexOf(portalData.researchId);

                if(!portalData.userStatistics[user.tamaringaId]){
                    portalData.userStatistics[user.tamaringaId] = {
                        sessions: {
                            liked: [],
                            indifferent : [],
                            unliked: []
                        },
                    };

                    if(!user.researchList[researchIndex])
                        return;

                    if(user.researchList[researchIndex].sessionList.length > portalData.maxSessionLength)
                         portalData.maxSessionLength = user.researchList[researchIndex].sessionList.length;

                    let sessionNum = 0;
                    user.researchList[researchIndex].sessionList.forEach(session => {
                        if(session.guideCommentStart || session.guideCommentEnd) {
                            if(!portalData.sessionComments[user.tamaringaId]){
                                portalData.sessionComments[user.tamaringaId] = {};
                            }

                            if(!portalData.sessionComments[user.tamaringaId][sessionNum]){
                                portalData.sessionComments[user.tamaringaId][sessionNum] = {
                                    userId: user.tamaringaId,
                                    guideCommentStart: "empty",
                                    guideCommentEnd: "empty",
                                    songsCommentsNames: [],
                                    songsCommentsArr: []
                                }
                                if(session.guideCommentStart){
                                    portalData.sessionComments[user.tamaringaId][sessionNum].guideCommentStart = session.guideCommentStart;
                                }
                                if(session.guideCommentStart){
                                    portalData.sessionComments[user.tamaringaId][sessionNum].guideCommentEnd = session.guideCommentEnd;
                                }
                            }
                        }

                        portalData.userStatistics[user.tamaringaId].sessions.liked[sessionNum] = 0;
                        portalData.userStatistics[user.tamaringaId].sessions.indifferent[sessionNum] = 0;
                        portalData.userStatistics[user.tamaringaId].sessions.unliked[sessionNum] = 0;

                        session.songs.forEach(async song => {

                            let songCount = 1;
                            if(song.guideComment) {
                                if(!portalData.sessionComments[user.tamaringaId]){
                                    portalData.sessionComments[user.tamaringaId] = {};
                                }

                                if(!portalData.sessionComments[user.tamaringaId][sessionNum]) {
                                    portalData.sessionComments[user.tamaringaId][sessionNum] = {
                                        userId: user.tamaringaId,
                                        guideCommentStart: "empty",
                                        guideCommentEnd: "empty",
                                        songsCommentsNames: [],
                                        songsCommentsArr: []
                                    };
                                }


                                if(!portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsNames){
                                    portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsNames = [];
                                }

                                if(!portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsArr){
                                    portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsArr = [];
                                }


                                portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsNames.push(song.mbId);
                                portalData.sessionComments[user.tamaringaId][sessionNum].songsCommentsArr.push(song.guideComment);
                            }

                            if(song.score > 0 && song.score < 3) {
                                portalData.userStatistics[user.tamaringaId].sessions.unliked[sessionNum]++;
                            }

                            if(song.score === 3) {
                                portalData.userStatistics[user.tamaringaId].sessions.indifferent[sessionNum]++;
                            }
                            if(song.score > 3) {
                                portalData.userStatistics[user.tamaringaId].sessions.liked[sessionNum]++;
                            }

                            songCount++;
                        })
                        sessionNum++;
                    })
                }
            });

            sessionNum = 0;
            UserDatadocs.forEach(user => {
                const researchIndex = user.researchList.map(function(research) { return research.researchId; }).indexOf(portalData.researchId);
                sessionNum = 0;
                    user.researchList[researchIndex].sessionList.forEach(session => {
                        session.songs.forEach(song => {
                            if(song && (sessionNum <= portalData.maxSessionLength)){
                                let isGenre = false;
                                    if (song.playlistName && (song.playlistName.localeCompare("cla") === 0
                                        || song.playlistName.localeCompare("yid") === 0
                                        || song.playlistName.localeCompare("lad") === 0
                                        || song.playlistName.localeCompare("pra") === 0
                                        || song.playlistName.localeCompare("mid") === 0)) {
                                        isGenre = true;
                                }

                                if(isGenre && !portalData.langGenreStatistics[song.playlistName]) {
                                    portalData.langGenreStatistics[song.playlistName] = {
                                        liked: new Array(portalData.maxSessionLength).fill(0),
                                        indifferent: new Array(portalData.maxSessionLength).fill(0),
                                        unliked: new Array(portalData.maxSessionLength).fill(0),
                                        languageStr: playlistsKeys[song.playlistName]
                                    }
                                }

                                if(!isGenre && !portalData.langGenreStatistics[song.language]) {
                                    portalData.langGenreStatistics[song.language] = {
                                        liked: new Array(portalData.maxSessionLength).fill(0),
                                        indifferent: new Array(portalData.maxSessionLength).fill(0),
                                        unliked: new Array(portalData.maxSessionLength).fill(0),
                                        languageStr: playlistsKeys[song.language]
                                    }
                                }

                                if (song.score > 0 && song.score < 3) {
                                    if (isGenre)
                                        portalData.langGenreStatistics[song.playlistName].unliked[sessionNum]++;
                                    else
                                        portalData.langGenreStatistics[song.language].unliked[sessionNum]++;
                                }

                                if (song.score === 3) {
                                    if (isGenre)
                                        portalData.langGenreStatistics[song.playlistName].indifferent[sessionNum]++;
                                    else
                                        portalData.langGenreStatistics[song.language].indifferent[sessionNum]++;
                                }
                                if (song.score > 3) {
                                    if (isGenre)
                                        portalData.langGenreStatistics[song.playlistName].liked[sessionNum]++;
                                    else
                                        portalData.langGenreStatistics[song.language].liked[sessionNum]++;
                                }
                            }
                        })
                        sessionNum++;
                    })

            });


            const allUsersSongs = researchData.map(patient => {
                return patient.sessionList.map(session => {
                    return session.songs;
                })
            }).flat(2);


            let songStatistics = {};


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
                    if(leastRatedScore > value.score){
                        leastRatedScore = value.score;
                        leastRatedSong = value.mbId;
                    }

                    songStatistics[value.mbId].sumOfRaters++;
                    songStatistics[value.mbId].average = songStatistics[value.mbId].sumScore / songStatistics[value.mbId].sumOfRaters;
                    if(songStatistics[value.mbId].sumOfRaters === 1) { // count songs that rated when it a song has at least one rater
                        portalData.NumberOfRatedSongs++;
                    }
                }
            });

            Object.values(songStatistics).forEach(value => {
                let isGenre = false;
                if(!value.playlistName) {
                    return;
                }
                if (value.playlistName.localeCompare("cla") === 0
                    || value.playlistName.localeCompare("yid") === 0
                    || value.playlistName.localeCompare("lad") === 0
                    || value.playlistName.localeCompare("pra") === 0
                    || value.playlistName.localeCompare("mid") === 0) {
                    isGenre = true;
                }


                if(!portalData.genreData[value.playlistName] && isGenre){
                    portalData.genreData[value.playlistName] = {
                        playlistName: value.playlistName,
                        languageStr: playlistsKeys[value.playlistName],
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    portalData.genreData.length++;
                }

                if(!portalData.languageData[value.language] && !isGenre){
                    portalData.languageData[value.language] = {
                        language: value.language,
                        languageStr: playlistsKeys[value.language],
                        songsCount: 0,
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    portalData.languageData.length++;
                }

                if(!portalData.playlistsData[value.playlistName] && !isGenre){
                    portalData.playlistsData[value.playlistName] = {
                        playlistName: value.playlistName,
                        languageStr: playlistsKeys[value.language],
                        sumOfRaters: 0,
                        sumScore: 0,
                        average: 0,
                    }
                    portalData.playlistsData.length++;
                }

                if(!isGenre) {
                    portalData.languageData[value.language].songsCount++;
                }

                if(value.average > 0){
                    if(!isGenre) {
                        portalData.playlistsData[value.playlistName].sumScore += value.average;
                        portalData.playlistsData[value.playlistName].sumOfRaters++;
                        portalData.playlistsData[value.playlistName].average = portalData.playlistsData[value.playlistName].sumScore / portalData.playlistsData[value.playlistName].sumOfRaters;

                        portalData.languageData[value.language].sumScore += value.average;
                        portalData.languageData[value.language].sumOfRaters++;
                        portalData.languageData[value.language].average = portalData.languageData[value.language].sumScore / portalData.languageData[value.language].sumOfRaters;
                    }

                    if(isGenre) {
                        portalData.genreData[value.playlistName].sumScore += value.average;
                        portalData.genreData[value.playlistName].sumOfRaters++;
                        portalData.genreData[value.playlistName].average = portalData.genreData[value.playlistName].sumScore / portalData.genreData[value.playlistName].sumOfRaters;
                    }
                }
            });

            portalData.numberOfPlaylists = portalData.playlistsData.length;
            portalData.numberOfGenres = portalData.genreData.length;
            let mostRatedSongs = Object.entries(songStatistics).sort( (a,b) => {
                    return b[1].average-a[1].average
            });



            Object.values(portalData.languageData).forEach(function (language)
            {
                if(language.languageStr)
                    portalData.pieLables.push(language.languageStr);
                if(language.sumOfRaters)
                portalData.pieData.push(language.sumOfRaters);
            });

            portalData.languageData = sortArrays(portalData.languageData);
            portalData.playlistsData = sortArrays(portalData.playlistsData);
            portalData.genreData = sortArrays(portalData.genreData);

            var songsforStrings = mostRatedSongs.slice(0, 5).flat().filter(e => typeof e === 'string');
            songsforStrings.push(leastRatedSong);

            //portalData.mostRatedSong = await getRecord(portalData.momostRatedSongs[0][0]);
            portalData.mostRatedSongs = await getRecord(songsforStrings);
            portalData.researcherName = await getResearcher(portalData.researcherId);

            portalData.playlistsAVG = {
                playlistNames: [],
                AVG: [],
            }
            portalData.playlistsData.forEach(playlist =>{
                if(playlist["0"] !== "length" && playlist["1"].average && playlist["1"].average) {
                    portalData.playlistsAVG.playlistNames.push(playlist["0"]);
                    portalData.playlistsAVG.AVG.push(playlist["1"].average);
                }
            });

            portalData.genreData.forEach(playlist =>{
                if(playlist["0"] !== "length" && playlist["1"].average && playlist["1"].average) {
                    portalData.playlistsAVG.playlistNames.push(playlist["1"].languageStr);
                    portalData.playlistsAVG.AVG.push(playlist["1"].average);
                }
            });

            res.status(200).json({err: false, items: portalData});
        });

    });
}