

(function ($) {
    $(document).ready(function () {
        //let researchId = $('#researchId').val;
        researchId = 1;
        researchId = 1;
        function initResearchData() {
            getResearchData().then(function (researchData) {
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

                Colors = {};
                Colors.names = {
                    black: "#000000",
                    blue: "#0000ff",
                    brown: "#a52a2a",
                    cyan: "#00ffff",
                    darkblue: "#00008b",
                    darkcyan: "#008b8b",
                    darkgrey: "#a9a9a9",
                    darkgreen: "#006400",
                    darkkhaki: "#bdb76b",
                    darkmagenta: "#8b008b",
                    darkolivegreen: "#556b2f",
                    darkorange: "#ff8c00",
                    darkorchid: "#9932cc",
                    darkred: "#8b0000",
                    darksalmon: "#e9967a",
                    darkviolet: "#9400d3",
                    fuchsia: "#ff00ff",
                    gold: "#ffd700",
                    green: "#008000",
                    indigo: "#4b0082",
                    khaki: "#f0e68c",
                    lightgreen: "#90ee90",
                    lime: "#00ff00",
                    magenta: "#ff00ff",
                    maroon: "#800000",
                    navy: "#000080",
                    olive: "#808000",
                    orange: "#ffa500",
                    pink: "#ffc0cb",
                    purple: "#800080",
                    violet: "#800080",
                    red: "#ff0000",
                    yellow: "#ffff00"
                };

                Colors.random = function() {
                    var result;
                    var count = 0;
                    for (var prop in this.names)
                        if (Math.random() < 1/++count)
                            result = prop;
                    return result;
                };

                $("#numberOfSongs").html(researchData.numberOfSongs.toString());
                $("#numberOfRatedSongs").html(researchData.NumberOfRatedSongs.toString());
                $("#numberOfPlaylists").html(researchData.numberOfPlaylists.toString());
                $("#numberOfGenres").html(researchData.numberOfGenres.toString());
                $("#mostRatedSong").html(researchData.mostRatedSongs[0]);
                $("#lowestRatedSong").html(researchData.mostRatedSongs[researchData.mostRatedSongs.length-1]);
                $("#researchName").html(researchData.researchName);

                $("#researcher").html(researchData.researcherName + "<br>" +"ID: " + researchData.researcherId);
                $("#researchHeader").html(researchData.researchName);
                $("#mostRatedPlaylist").html(researchData.playlistsData[1][0]);
                $("#lowestRatedPlaylist").html(researchData.playlistsData[researchData.playlistsData.length-1][0]);

                $("#mostRatedGenre").html(researchData.genreData[1][1].languageStr);
                $("#lowestRatedGenre").html(researchData.genreData[researchData.genreData.length-1][1].languageStr);

                $("#mostRatedLang").html(researchData.languageData[1][1].languageStr);
                $("#lowestRatedLang").html(researchData.languageData[researchData.languageData.length-1][1].languageStr);



                //Top 5 songs
                $("#topFirst").html("1. " + researchData.mostRatedSongs[0]);
                $("#topSecond").html("2. " + researchData.mostRatedSongs[1]);
                $("#topThird").html("3. " + researchData.mostRatedSongs[2]);
                $("#topFourth").html("4. " + researchData.mostRatedSongs[3]);
                $("#topFifth").html("5. " + researchData.mostRatedSongs[4]);


                let pieChart = document.getElementById("pie-chart").getContext("2d");

                new Chart(pieChart, {
                    type: 'pie',
                    data: {
                        labels: researchData.pieLables,
                        datasets: [{
                            label: "Languages",
                            display: true,
                            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#4ab5b6", "#158a7d"],
                            data: researchData.pieData
                        }]
                    },
                    options: {
                        responsive:false,
                        title: {
                            display: true,
                            text: 'songs'
                        },
                        hoverBorderColor: "black"
                    }
                });

                let usersLikedData = [];
                let usersUnLikedData = [];
                let usersIndiffData = [];

                let usersLikedDataPl = [];
                let usersUnLikedDataPl = [];
                let usersIndiffDataPl = [];
                let i = 0;
                Object.values(researchData.userStatistics).forEach(user => {
                    i++;
                    if (user.sessions) {
                        usersLikedData.push({
                            data: user.sessions.liked,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });
                        usersUnLikedData.push({
                            data: user.sessions.unliked,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });

                        usersIndiffData.push({
                            data: user.sessions.indifferent,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });

                        usersLikedDataPl.push({
                            data: user.sessions.liked,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });
                        usersUnLikedDataPl.push({
                            data: user.sessions.unliked,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });

                        usersIndiffDataPl.push({
                            data: user.sessions.indifferent,
                            label: "User " + i,
                            borderColor: random_rgba(),
                            fill: false
                        });

                }
                })




                let usersLikedGraph = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersLikedData
                };

                let usersUnlikedGraph = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersUnLikedData
                };

                let usersIndiffGraph = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersIndiffData
                };

                let usersLikedGraphPl = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersLikedDataPl
                };

                let usersUnlikedGraphPl = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersUnLikedDataPl
                };

                let usersIndiffGraphPl = {
                    labels: Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1)),
                    datasets: usersIndiffDataPl
                };


                let btx = document.getElementById("myChart").getContext("2d");
                let btx2 = document.getElementById("myChart2").getContext("2d");
                let btx3 = document.getElementById("myChart3").getContext("2d");
                let ctx = document.getElementById("myChart4").getContext("2d");
                let ctx2 = document.getElementById("myChart5").getContext("2d");
                let ctx3 = document.getElementById("myChart6").getContext("2d");
                let dtx = document.getElementById("myChart7").getContext("2d");

                new Chart(btx, {
                    type: 'line',
                    data: usersLikedGraph,
                    options: {
                        title: {
                            display: true,
                            text: 'liked Graph'
                        }
                    }
                });

                new Chart(btx2, {
                    type: 'line',
                    data: usersUnlikedGraph,
                    options: {
                        title: {
                            display: true,
                            text: 'unliked Graph'
                        }
                    }
                });

                new Chart(btx3, {
                    type: 'line',
                    data: usersIndiffGraph,
                    options: {
                    title: {
                        display: true,
                        text: 'Indifferent Graph'
                    }
                    }
                });

                new Chart(ctx, {
                    type: 'line',
                    data: usersLikedGraphPl,
                    options: {
                        title: {
                            display: true,
                            text: 'liked Graph'
                        }
                    }
                });

                new Chart(ctx2, {
                    type: 'line',
                    data: usersUnlikedGraphPl,
                    options: {
                        title: {
                            display: true,
                            text: 'unliked Graph'
                        }
                    }
                });

                new Chart(ctx3, {
                    type: 'line',
                    data: usersIndiffGraphPl,
                    options: {
                        title: {
                            display: true,
                            text: 'Indifferent Graph'
                        }
                    }
                });

                new Chart(dtx, {
                    type: 'line',
                    data: usersLikedGraph,
                    options: {
                        title: {
                            display: true,
                            text: 'liked Graph'
                        }
                    }
                });
                //console.log(researchData);

                function random_rgba() {
                    let o = Math.round, r = Math.random, s = 255;
                    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
                }

                function randomDarkRgbColor() {
                    const red = Math.floor(Math.random() * 256/2);
                    const green = Math.floor(Math.random() * 256/2);
                    const blue = Math.floor(Math.random() * 256/2);
                    return "rgb(" + red + ", " + green + ", " + blue + ")";
                }



            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }
        initResearchData();
        function getResearchData() {
            return new Promise(function (resolve, reject) {
                $.post('researchPortalData/'+ researchId, function (data) {
                    if (!data || !data.items) return reject(Error("ERROR IN FIND LIST"));
                    resolve(data.items);
                })
            });
        }

        let sessionMenuItem = '<div class="rsStyle-bar-block" id=\'sessionMenuItem\'>';
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