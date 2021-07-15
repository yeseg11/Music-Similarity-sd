(function ($) {
    $(document).ready(function () {
        //let researchId = $('#researchId').val;
        researchId = 1;
        researchId = 1;

        function initResearchData() {
            getResearchData().then(function (researchData) {
                $("#numberOfSongs").html(researchData.numberOfSongs.toString());
                $("#numberOfRatedSongs").html(researchData.NumberOfRatedSongs.toString());
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
                new Chart(pieChart, {
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
                            data: user.sessions.liked,
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
                            borderColor:randomColor
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
                const sessionLable = Array.from({length: researchData.userStatistics.maxSessionLength}, (_, i) => "session: " + (i + 1));
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

                //create graphs
                new Chart(btx, {
                    type: 'line',
                    data: usersLikedGraph,
                    options: {
                        plugins: {
                            tooltips: {
                                enabled: false
                            }
                        }
                    }
                });

                new Chart(btx2, {
                    type: 'line',
                    data: usersUnlikedGraph,
                    options: {}
                });

                new Chart(btx3, {
                    type: 'line',
                    data: usersIndiffGraph,
                    options: {}
                });

                new Chart(ctx, {
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

                new Chart(ctx2, {
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

                new Chart(ctx3, {
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


                new Chart(dtx, {
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

        initResearchData();

        function getResearchData() {
            return new Promise(function (resolve, reject) {
                $.post('researchPortalData/' + researchId, function (data) {
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
