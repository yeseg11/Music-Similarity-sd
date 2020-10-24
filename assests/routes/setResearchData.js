(function ($) {
    $(document).ready(function () {

        var PLAYLISTSIZE = 50;



        function init() {

            getResearchers().then(function (result1) {
                var selectElem1 = $('#researchersIds');
                for (var i = 0; i < result1.length; i++) {
                    selectElem1.append("<option value='" + result1[i].researcherId + "'>" + result1[i].researcherName + "</option>");
                }

            }).catch(function (err) {
                console.log(err);
                return err;
            });

            getUsers().then(function (result) {
                var selectElem = $('#patientsIds');
                console.log(result)
                for (var i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].tamaringaId + "'>" + result[i].userName +' - '+ result[i].firstName + ' ' + result[i].lastName + "</option>");
                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });
            var ResearchGroupId = localStorage["ResearchGroupId"];
            $('#researchGroupId').val(ResearchGroupId.toString())

            getResearches().then(function (result1) {
                var researchId = result1;
                $('#researchId').val(result1 +1);
            }).catch(function (err) {
                console.log(err);
                return err;
            });

        }

        function getResearches() {
            return new Promise(function (resolve, reject) {
                var researcheGroups = [];
                $.get('/getResearchesSize', function (data) {
                    if (!data || !data.items ) return reject(Error("ERROR IN FIND LIST"));
                    researcheGroups = data.items;
                    resolve(researcheGroups);
                })
            });
        }

        function getUsers() {
            return new Promise(function (resolve, reject) {
                var usersList, researchersList = [];
                $.get('/allusers', function (data) {
                    if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                    usersList = data.items
                    resolve(usersList);
                });

            });
        }

        function getResearchers() {
            return new Promise(function (resolve, reject) {
                var researchersList = [];
                $.get('/allresearchers', function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    researchersList = data.items
                    resolve(researchersList);
                })
            });
        }



        init();

        $('#send').on("click", function (e) {
            // console.log("here")
            var arr = ["#researchName", "#researchId", "#researchersIds", "#patientsIds", "#nursingHome", "#department", "#numberOfWeeks", "#meetingPerWeek", "#lengthOfSession", "#algorithm"];
            var mustInput = ["#researchName", "#researchId", "#researchersIds", "#patientsIds", "#nursingHome", "#numberOfWeeks", "#meetingPerWeek", "#algorithm"];

            for (const element of mustInput) {
                // console.log("element", element)
                // console.log("element length", $(element).val().length)
                if ($(element).val().length < 1) {
                    var element2 = element.substr(1);
                    alert("Please fill the missing details in " + element2);
                    return $('#error').text("insert all the details");
                }
            }



            var researchName = $('#researchName'),
                researchId = $('#researchId'),
                researchersIds = $('#researchersIds'),
                researchGroupId = $('#researchGroupId'),
                description = $('#description'),
                patientsIds = $('#patientsIds'),
                nursingHome = $('#nursingHome'),
                department = $('#department'),
                numberOfWeeks = $('#numberOfWeeks'),
                meetingPerWeek = $('#meetingPerWeek'),
                lengthOfSession = $('#lengthOfSession'),
                algorithm = $('#algorithm');

            var tamaringaId = "";
            var yearAtTwenty = "";
            var countryAtTwenty = "";
            var countryOrigin = "";
            var languageOrigin = "";
            var languageAtTwenty = "";
            var yearOfImmigration = "";
            var group = "";

            //need to add to UserData the name of the new playlist.
            // add data to userData as a research: researchId = new researchId,maxSessionNum = new research maxSessionNum and sessionList = []



            var prom = new Promise(function (resolve, reject) {
                for (i = 0; i < patientsIds.length; i++) {
                    $.get('/user/' + patientsIds[i].value, function (data) {
                         let items = data.items[0];
                        console.log("data.items[0]: ",data.items[0]);
                        tamaringaId = items.tamaringaId;
                        yearAtTwenty = items.yearAtTwenty;
                        countryAtTwenty = items.countryAtTwenty;
                        countryOrigin = items.countryOrigin;
                        languageOrigin = items.languageOrigin;
                        languageAtTwenty = items.languageAtTwenty;
                        yearOfImmigration = items.yearOfImmigration;
                        group = items.group;

                    }).then(function (response) {
                        var recList = [];
                        // console.log("recList1",recList);
                        $.get('/mb/track/recording/' + yearAtTwenty + '/' + countryAtTwenty + '/' + languageAtTwenty, function (data) {
                            if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                            // console.log("list data",data);
                            var size = PLAYLISTSIZE;
                            if (data.items.length < size) {
                                size = data.items.length;
                            }
                            for (i = 0; i < size; i++) {
                                // console.log(data.items[i].artist[0].name);
                                recList.push({
                                    mbId: data.items[i].mbId,
                                    title: data.items[i].title,
                                    year: parseInt(data.items[i].year),
                                    artistName: data.items[i].artist[0].name,
                                    language: data.items[i].language,
                                    country: data.items[i].country,
                                    lyrics: data.items[i].lyrics,
                                    genre: data.items[i].genre,
                                    youtube: data.items[i].youtube,
                                    votes: []
                                });

                            }
                        }).then(function (response) {
                            // console.log(response.items);
                            var playlistName = countryAtTwenty + languageAtTwenty + yearAtTwenty;
                            var playlistData = {
                                name: playlistName,
                                year: yearAtTwenty,
                                country: countryAtTwenty,
                                language: languageAtTwenty,
                                records: JSON.stringify(recList)
                            };
                            var createPlaylistUrl = '/playList/createPlaylist';
                            var postingCreatePlaylist = $.post(createPlaylistUrl, playlistData);
                            postingCreatePlaylist.done(function (data) {
                            });


                            var userData = {
                                tamaringaId: tamaringaId,
                                playlists: playlistName,
                                researchId: researchId.val(),
                                maxSessionNum: numberOfWeeks.val() * meetingPerWeek.val(),
                                sessionList: null
                            };
                            console.log("UserData: ", userData);
                            var getPlaylistLink = '/updateUserDataCollection';
                            var postingInsertResearch = $.post(getPlaylistLink, userData);
                            postingInsertResearch.done(function (data) {
                                console.log("updateUserDataCollection: " ,data);
                            });
                        });
                    });


                }//for ended




                var researchData = {
                        researchName: researchName.val(),
                        researchId: researchId.val(),
                        researchersIds: researchersIds.val(),
                        researchGroupId : researchGroupId.val(),
                        description : description.val(),
                        patientsIds: patientsIds.val(),
                        nursingHome: nursingHome.val(),
                        department: department.val(),
                        numberOfWeeks: numberOfWeeks.val(),
                        meetingPerWeek: meetingPerWeek.val(),
                        lengthOfSession: lengthOfSession.val(),
                        algorithm:algorithm.val(),
                        // created: false
                };

                var insertResearchUrl = '/insertResearch';
                var postingInsertResearch = $.post(insertResearchUrl, researchData);
                postingInsertResearch.done(function (data) {
                    alert("Research Created '\n' The research Id is: " + researchId.val());
                    // var pathname = "/researchGroupMainPage"
                    // window.location.replace(pathname);
                });
                alert("Research Created '\n' The research Id is: " + researchId.val() +"\n Please wait a few seconds till the page will go back");
                // setTimeout(myFunction, 1000);
            });
        })

    });
})(jQuery);


function myFunction() {
    var pathname = "/researchGroupMainPage"
    window.location.replace(pathname);
}
