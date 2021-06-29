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


                    let SongStatistics = {};

                    // Create an array with the research songs, songs occurrences and average rating
                    allUsersSongs.forEach(function (value) {
                        if(!SongStatistics[value.mbId]) {
                            SongStatistics[value.mbId] = {
                                sumScore: 0,
                                average: 0,
                                occurrences: 0,
                                sumOfRaters: 0,
                                language: value.language,
                                playlistName: value.playlistName,
                                counted: false
                            }
                        }
                        SongStatistics[value.mbId].occurrences++;
                        SongStatistics[value.mbId].sumScore += value.score || 0;
                        SongStatistics[value.mbId].language = value.language;
                        SongStatistics[value.mbId].playlistName = value.playlistName;
                        if(value.score > 0){
                            SongStatistics[value.mbId].sumOfRaters++;
                            SongStatistics[value.mbId].average = SongStatistics[value.mbId].sumScore / SongStatistics[value.mbId].sumOfRaters;
                        }
                    });

                    const songsSortedByAvg = Object.entries(SongStatistics).sort( (a,b) => {
                        return b[1].average-a[1].average
                    });

                    console.log(researchData);
                    // 1. NumberOfSongs = count number of song with rating != 0
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