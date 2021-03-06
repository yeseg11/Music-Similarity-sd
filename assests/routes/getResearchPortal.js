let researchId = 1;
let pie;
let likedGraph;
let dislikedGraph;
let indiffGraph;
let likedGraphPl;
let dislikedGraphPl;
let indiffGraphPl;
let playlistAVGGraph;

(function ($) {

    $(document).ready(async function () {
        let researchesArr = [];

        researchesArr = await getResearchersByGroup();
        Object.values(researchesArr).forEach(research => {
            let menuItem = '<button onclick="displayResearch(' + research.researchId + ')" type = \'button\' class="btn btn-outline-info"';
            menuItem += '<i i class="fa fa-arrow-left m-l-7" aria-hidden="true"';
            menuItem += ' id="';
            menuItem += research.researchName;
            menuItem += '">' + research.researchName + '<';
            menuItem += '/i>';
            menuItem += '</button><br>';

            menuItem += '<br>';

            $("#researchMenu").append(menuItem);
        })


        await initResearchData();

        let sessionMenuItem = '<div class="rsStyle-bar-block" id=\'sessionMenuItem\'>';
        sessionMenuItem += '<a href="#" className="rsStyle-bar-item rsStyle-button rsStyle-padding rsStyle-grad-menu"><i className="fa fa-bullseye fa-fw"></i>::SESSIONMENUITEM::</a>';
        sessionMenuItem += '</div>';
    });

})(jQuery);



function initResearchData() {
    getResearchData().then(function (researchData) {
        $("#numberOfSongs").html(researchData.numberOfSongs.toString());
        $("#numberOfRatedSongs").html((researchData.NumberOfRatedSongs).toString());
        $("#numberOfPlaylists").html(researchData.numberOfPlaylists.toString());
        $("#numberOfGenres").html(researchData.numberOfGenres.toString());
        $("#mostRatedSong").html(researchData.mostRatedSongs[0]);
        $("#lowestRatedSong").html(researchData.mostRatedSongs[researchData.mostRatedSongs.length - 1]);
        $("#researchName").html(researchData.researchName);
        $("#researcher").html(researchData.researcherName + "<br>" + "ID: " + researchData.researcherId);
        $("#researchHeader").html(researchData.researchName);
        $("#mostRatedPlaylist").html(researchData.playlistsData[1][0]);
        $("#lowestRatedPlaylist").html(researchData.playlistsData[researchData.playlistsData.length - 1][0]);
        $("#mostRatedGenre").html(researchData.genreData[1][1].languageStr);
        $("#lowestRatedGenre").html(researchData.genreData[researchData.genreData.length - 1][1].languageStr);
        $("#mostRatedLang").html(researchData.languageData[1][1].languageStr);
        $("#lowestRatedLang").html(researchData.languageData[researchData.languageData.length - 1][1].languageStr);

        //Top 5 songs
        $("#topFirst").html("1. " + researchData.mostRatedSongs[0]);
        $("#topSecond").html("2. " + researchData.mostRatedSongs[1]);
        $("#topThird").html("3. " + researchData.mostRatedSongs[2]);
        $("#topFourth").html("4. " + researchData.mostRatedSongs[3]);
        $("#topFifth").html("5. " + researchData.mostRatedSongs[4]);
        $("#guideComment").html("");

        //display guide comments
        Object.values(researchData.sessionComments).forEach(user => {
            let sessionNum = 1;
            Object.values(user).forEach(session => {
                let startCommentExist = false;
                let endCommentExist = false;
                let songsCommentsExist = false;

                if(session.guideCommentStart !== "empty" && typeof session.guideCommentStart !== "undefined"){
                    startCommentExist = true;
                }

                if(session.guideCommentEnd !== "empty" && typeof session.guideCommentEnd !== "undefined"){
                    endCommentExist = true;
                }
                if(session.songsCommentsArr.length > 0){
                    songsCommentsExist = true;
                }

                    if(endCommentExist || startCommentExist || songsCommentsExist) { //if they are any comments, display the user title
                    let header = '<div className="card-body">';
                    header += '<h4 style="font-weight: bold; test-align: center; color: #712415;font-size: 30px">User: ' + session.userId + ', Session: ' + session.sessionNumber + '</h4>';
                    header += '<h5><b>General Session comments: </b></h5><ul></ul>';
                    $("#guideComment").append(header);
                }
                if(startCommentExist){ //add session start comment if exist
                    let startComment = '<i><b><ul><li>Comment on start: </li></b></i>' + session.guideCommentStart + '</div>';
                    $("#guideComment").append(startComment);
                }

                if(endCommentExist){//add session end comment if exist
                    let endComment =  '<i><b><ul><li>Comment on end: </li></b></i>' + session.guideCommentEnd + ' </div>';
                    $("#guideComment").append(endComment);
                }

                if(songsCommentsExist) { //add song comments if they exist
                    let SongComments = '<h5><b>Song comments: </b></h5><ul></ul>';
                    for (let j = 0; j < session.songsCommentsNames.length; j++) {
                        SongComments += '<li><i><b>Name: </b></i>' + session.songsCommentsNames[j] + '  <i><b><ul><li>comment: </b></i>' + session.songsCommentsArr[j] + '</li></ul></li>';
                    }
                    SongComments += '</ul>';
                    $("#guideComment").append(SongComments);
                }
                sessionNum++;
            })
        })


        //get graphs document elements
        const pieChart = document.getElementById("pie-chart").getContext("2d");
        const btx = document.getElementById("myChart").getContext("2d");
        const btx2 = document.getElementById("myChart2").getContext("2d");
        const btx3 = document.getElementById("myChart3").getContext("2d");
        const ctx = document.getElementById("myChart4").getContext("2d");
        const ctx2 = document.getElementById("myChart5").getContext("2d");
        const ctx3 = document.getElementById("myChart6").getContext("2d");
        const dtx = document.getElementById("myChart7").getContext("2d");

        //pie chart config
        pie = new Chart(pieChart, {
            type: 'pie',
            data: {
                labels: researchData.pieLables,
                datasets: [{
                    label: "Languages",
                    display: true,
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#4ab5b6", "#158a7d"],
                    data: researchData.pieData
                }]
            },
            options: {
                responsive: false,
                title: {
                    display: true,
                    text: 'songs'
                },
                hoverBorderColor: "black"
            }
        });


        //user graph config
        let usersLikedData = [];
        let usersUnLikedData = [];
        let usersIndiffData = [];

        let usersLikedDataPl = [];
        let usersUnLikedDataPl = [];
        let usersIndiffDataPl = [];
        let i = 0;

        //create datasets for users graphs
        Object.values(researchData.userStatistics).forEach(user => {
            i++;
            if (user.sessions) {
                let randomColor = random_rgba();
                    usersLikedData.push({
                        data2: user.sessions.ratingCounter,
                        data: user.sessions.ratingCounter,
                        label: "User " + i,
                        backgroundColor: randomColor,
                        borderColor: randomColor
                    });

                    usersUnLikedData.push({
                        data: user.sessions.unliked,
                        label: "User " + i,
                        backgroundColor: randomColor,
                        borderColor: randomColor
                    });

                    usersIndiffData.push({
                        data: user.sessions.indifferent,
                        label: "User " + i,
                        backgroundColor: randomColor,
                        borderColor: randomColor
                    });
            }
        })

        //create dataset for languages and genre graphs
        let stackNum = 0;
        Object.values(researchData.langGenreStatistics).forEach(playlist => {
            stackNum++;
            usersLikedDataPl.push({
                data: playlist.liked,
                label: playlist.languageStr,
                backgroundColor: random_rgba(),
                fill: false,
                stack: 'Stack ' + stackNum
            });
            usersUnLikedDataPl.push({
                data: playlist.unliked,
                label: playlist.languageStr,
                backgroundColor: random_rgba(),
                fill: false,
                stack: 'Stack ' + stackNum
            });

            usersIndiffDataPl.push({
                data: playlist.indifferent,
                label: playlist.languageStr,
                backgroundColor: random_rgba(),
                fill: false,
                stack: 'Stack ' + stackNum
            });
        })

        //create dataset for avg playlist graph
        const avgDataset = [{
            data: researchData.playlistsAVG.AVG,
            label: "Playlists and genres",
            backgroundColor: "DarkCyan",
            fill: true,
        }];

        //define graphs datasets and labels
        const sessionLable = Array.from({length: researchData.maxSessionLength}, (_, i) => "session: " + (i + 1));
        const usersLikedGraph = {
            labels: sessionLable,
            datasets: usersLikedData,
        };

        const usersUnlikedGraph = {
            labels: sessionLable,
            datasets: usersUnLikedData
        };

        const usersIndiffGraph = {
            labels: sessionLable,
            datasets: usersIndiffData
        };

        const usersLikedGraphPl = {
            labels: sessionLable,
            datasets: usersLikedDataPl,

        };

        const usersUnlikedGraphPl = {
            labels: sessionLable,
            datasets: usersUnLikedDataPl
        };

        const usersIndiffGraphPl = {
            labels: sessionLable,
            datasets: usersIndiffDataPl
        };

        const avgPlaylistGraph = {
            labels: researchData.playlistsAVG.playlistNames,
            datasets: avgDataset
        };
        let count = 0;
        //create graphs
        likedGraph = new Chart(btx, {
            type: 'line',
            data: usersLikedGraph,
            options: {
                // plugins: {
                //     tooltip: {
                //         callbacks: {
                //             label: function(context) {
                //                 var label = context.dataset.label || '';
                //                 if (label) {
                //                     label += ': ';
                //                 }
                //
                //                 if (context.parsed.y !== null) {
                //                     let indx = context.dataIndex;
                //                     label += context.parsed.y + " liked out of: " + context.dataset.data2[indx];
                //
                //
                //                     //label += context.parsed.y + " liked out of: " +  " counter: "  + ;
                //                     count++;
                //                 }
                //                 return label;
                //             }
                //         }
                //     }
                //
                // }
            }
        });



        dislikedGraph = new Chart(btx2, {
            type: 'line',
            data: usersUnlikedGraph,
            options: {}
        });

        indiffGraph = new Chart(btx3, {
            type: 'line',
            data: usersIndiffGraph,
            options: {}
        });



        likedGraphPl = new Chart(ctx, {
            type: 'bar',
            data: usersLikedGraphPl,
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });

        dislikedGraphPl = new Chart(ctx2, {
            type: 'bar',
            data: usersUnlikedGraphPl,
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });


        indiffGraphPl = new Chart(ctx3, {
            type: 'bar',
            data: usersIndiffGraphPl,
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });


        playlistAVGGraph = new Chart(dtx, {
            type: 'bar',
            data: avgPlaylistGraph,
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    }
                }
            }
        });

        //for creating random colors
        function random_rgba() {
            let x = Math.floor(Math.random() * 256);
            let y = 100+ Math.floor(Math.random() * 256);
            let z = 50+ Math.floor(Math.random() * 256);
            return "rgb(" + x + "," + y + "," + z + ")";
        }


    }).catch(function (err) {
        console.log(err);
        return err;
    });
}

function getResearchData() {
    return new Promise(function (resolve, reject) {
        $.post('researchPortalData/' + researchId, function (data) {
            if (!data || !data.items) return reject(Error("ERROR IN FIND LIST"));
            resolve(data.items);
        })
    });
}

function getResearchersByGroup() {
    return new Promise(function (resolve, reject) {
        let researchersList = [];
        let ResearchGroupId = localStorage["ResearchGroupId"];
        // console.log("ResearchGroupId",ResearchGroupId);
        $.get('/allresearches/'+ResearchGroupId.toString(), function (data) {
            if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
            console.log("data",data);
            researchersList = data.items
            resolve(researchersList);
        })
    });
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
async function displayResearch(newResearchId){
    researchId = newResearchId;
    if(pie)
        await pie.destroy();
    if(likedGraph)
        await likedGraph.destroy();
    if(dislikedGraph)
        await dislikedGraph.destroy();
    if(indiffGraph)
        await indiffGraph.destroy();
    if(likedGraphPl)
        await likedGraphPl.destroy();
    if(dislikedGraphPl)
        await dislikedGraphPl.destroy();
    if(indiffGraphPl)
        await indiffGraphPl.destroy();
    if(playlistAVGGraph)
        await playlistAVGGraph.destroy();
    initResearchData();
}


