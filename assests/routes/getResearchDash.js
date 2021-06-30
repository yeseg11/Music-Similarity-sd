(function ($) {
    $(document).ready(function () {
        //let researchId = $('#researchId').val;
        researchId = 3;

        function initResearchData() {
            getResearchData().then(function (researchData) {
                const researchName = researchData[0].researchName;
                const researchId = researchData[0].researchId;
                const researchGroup = researchData[0].researchGroupId;
                const nursingHome = researchData[0].nursingHome;
                const department = researchData[0].department;
                const description = researchData[0].description;
                const patientsIds = researchData[0].patientsIds;
                const numberOfWeek = researchData[0].numberOfWeeks;
                const meetingPerWeeks = researchData[0].meetingPerWeek;
                const lengthOfSession = researchData[0].lengthOfSession;
                let numberOfSongs = 0;
                let NumberOfRatedSongs = 0;





                let users = $.post('/usersData', {patientsIds}, async function (usersData){
                    usersData = usersData.items;

                    //every array item of researchData represent a user
                    const researchData = usersData.map(item =>{
                        return item.researchList.find(research => {
                            return research.researchId = researchId;
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

                    // let genreData = [
                    //     {
                    //         playlistName: "Classical/Traditional",
                    //         value: "cla",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    //     {
                    //         playlistName: "Yiddish",
                    //         value: "yid",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    //     {
                    //         playlistName: "Arabic",
                    //         value: "ara",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    //     {
                    //         playlistName: "Ladino",
                    //         value: "lad",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    //     {
                    //         playlistName: "Prayer Songs (Piyutim)",
                    //         value: "pra",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    //     {
                    //         playlistName: "Middle Eastern music",
                    //         value: "mid",
                    //         sumOfRaters: 0,
                    //         sumScore: 0,
                    //         average: 0,
                    //     },
                    // ];


                    let genreData = [];


                    // Create an array with the research songs, songs occurrences and average rating
                    allUsersSongs.forEach(function (value) {
                        let isGenre = false;
                        if(!songStatistics[value.mbId]) {
                            songStatistics[value.mbId] = { //add songs to songStatistics if he isn't there already
                                sumScore: 0,
                                average: 0,
                                occurrences: 0,
                                sumOfRaters: 0,
                                language: value.language,
                                playlistName: value.playlistName,
                            }
                            numberOfSongs++;
                        }

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
                                sumOfRaters: 0,
                                sumScore: 0,
                                average: 0,
                            }
                            genreData.length++;
                        }

                        if(!playlistsData[value.playlistName] && !isGenre){
                            playlistsData[value.playlistName] = {
                                playlistName: value.playlistName,
                                sumOfRaters: 0,
                                sumScore: 0,
                                average: 0,
                            }
                            playlistsData.length++;
                        }


                        songStatistics[value.mbId].occurrences++;
                        songStatistics[value.mbId].sumScore += value.score || 0;
                        songStatistics[value.mbId].language = value.language;
                        songStatistics[value.mbId].playlistName = value.playlistName;
                        if(value.score > 0){
                            if(!isGenre) {
                                playlistsData[value.playlistName].sumScore += value.score;
                                playlistsData[value.playlistName].sumOfRaters++;
                                playlistsData[value.playlistName].average = playlistsData[value.playlistName].sumScore / playlistsData[value.playlistName].sumOfRaters;
                            }

                            if(isGenre) {
                                genreData[value.playlistName].sumScore += value.score;
                                genreData[value.playlistName].sumOfRaters++;
                                genreData[value.playlistName].average = genreData[value.playlistName].sumScore / genreData[value.playlistName].sumOfRaters;
                            }

                            songStatistics[value.mbId].sumOfRaters++;
                            songStatistics[value.mbId].average = songStatistics[value.mbId].sumScore / songStatistics[value.mbId].sumOfRaters;
                            if(songStatistics[value.mbId].sumOfRaters === 1) { // count songs that rated when it a song has at least one rater
                                NumberOfRatedSongs++;
                            }
                        }
                    });

                    const songsSortedByAvg = Object.entries(songStatistics).sort( (a,b) => {
                        return b[1].average-a[1].average
                    });

                    //set html general research data
                    $("#numberOfSongs").html(numberOfSongs.toString());
                    $("#numberOfRatedSongs").html(NumberOfRatedSongs.toString());
                    $("#numberOfPlaylists").html(playlistsData.length.toString());
                    $("#mostRatedSong").html(songsSortedByAvg[0][0]);
                    $("#lowestRatedSong").html(songsSortedByAvg[songsSortedByAvg.length-1][0]);


                    console.log(researchData);
                    // 2. NumberOfPlaylists = count the number of playlists
                    // 3. NumberOfLikedSongs = count the number of songs with score >= 4
                    // 4. DislikedSongs = count the number of songs with score <=3
                    // 5. mostRatedPlaylist = the playlist with most rated songs
                    // 6. for each user - get the disliked songs and the liked songs

                });

            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }
        initResearchData();
        function getResearchData() {
            return new Promise(function (resolve, reject) {
                $.get('/research/' + researchId, function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    resolve(data.items);
                })
            });
        }



        $('#send').on("click", async function (e) {
            initResearchData();
            });



        var sessionMenuItem = '<div class="rsStyle-bar-block" id=\'sessionMenuItem\'>';
        sessionMenuItem += '<a href="#" className="rsStyle-bar-item rsStyle-button rsStyle-padding rsStyle-grad-menu"><i className="fa fa-bullseye fa-fw"></i>::SESSIONMENUITEM::</a>';
        sessionMenuItem += '</div>';
    });

})(jQuery);


// add async supoprt for ajax calls
function ajaxAwait(resourceUrl, method, playlistData){
    return  new Promise(function (resolve, reject) {
        $[method](resourceUrl ,{ playlistData,
        }).done(function (data) {
            if (data.err){
                reject(data);
            }
            else {
                resolve(data);
            }
        });
    });
}