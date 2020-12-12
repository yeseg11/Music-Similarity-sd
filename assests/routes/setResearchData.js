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
                //console.log(result)
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
                patientsIds = $('#patientsIds').val(),
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
                console.log("patientsIds",patientsIds);
                console.log("patientsIds.length",patientsIds.length);
                for (var i = 0; i < patientsIds.length;) {
                    console.log("i",i);
                    var waitProm = new Promise(function (resolve, reject) {
                        console.log("waitProm resolve",resolve);
                        setTimeout( function() {
                            console.log("i:",i);
                        },3000);
                        resolve(i++);
                    }).then(function (response) {
                        if (response < patientsIds.length){
                            console.log("ii response",response);
                            console.log("patientsIds[i]",patientsIds[response]);
                            $.get('/user/' + patientsIds[response], function (data) {
                                 let items = data.items[0];
                                // console.log("data.items[0]: ",data.items[0]);
                                tamaringaId = items.tamaringaId;
                                yearAtTwenty = items.yearAtTwenty;
                                countryAtTwenty = items.countryAtTwenty;
                                countryOrigin = items.countryOrigin;
                                languageOrigin = items.languageOrigin;
                                languageAtTwenty = items.languageAtTwenty;
                                yearOfImmigration = items.yearOfImmigration;
                                group = items.group;

                            }).then(function (response) {
                                console.log("response: ",response);
                                var recList = [];
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
                                }).then(function (response2) {
                                    // console.log(response.items);
                                    // check if we have a playlist for the user
                                    // var decade = "";
                                    var decade = [];
                                    if (parseInt(yearAtTwenty) <1950 && parseInt(yearAtTwenty) >= 1940){ //50's
                                        //decade = "40";
                                        decade = ["40","50"];
                                    }
                                    if (parseInt(yearAtTwenty) <1960 && parseInt(yearAtTwenty) >= 1950){ //50's
                                        //decade = "50";
                                        decade = ["50","60"];
                                    }
                                    else if (parseInt(yearAtTwenty) <1970 && parseInt(yearAtTwenty) >= 1960){
                                        // decade = "60";
                                        decade = ["60","70"];
                                    }//60's
                                    else if (parseInt(yearAtTwenty) <1980 && parseInt(yearAtTwenty) >= 1970){
                                        // decade = "70";
                                        decade = ["70","80"];
                                    }//70's
                                    else if (parseInt(yearAtTwenty) <1990 && parseInt(yearAtTwenty) >= 1980){
                                        // decade = "80";
                                        decade = ["80","90"];
                                    }//80's
                                    else if (parseInt(yearAtTwenty) <2000 && parseInt(yearAtTwenty) >= 1990){
                                        // decade = "90";
                                        decade = ["90","00"];
                                    }//90's
                                    else if (parseInt(yearAtTwenty) <2010 && parseInt(yearAtTwenty) >= 2000){
                                        // decade = "00";
                                        decade = ["00","10"];
                                    }//00's
                                    else if (parseInt(yearAtTwenty) <2020 && parseInt(yearAtTwenty) >= 2010){
                                        // decade = "10";
                                        decade = ["10"];
                                    }//10's
                                    else {
                                        return alert("the decade didnt found");
                                    }
                                    var playlistNames = [];
                                    for (var i = 0 ; i < decade.length ; i++){
                                        playlistNames.push(countryAtTwenty + decade[i] + "DEC");
                                    }

                                    var playlistData = {
                                        name: playlistNames
                                    };
                                    var checkDecadePlaylistUrl = '/getDecadePlaylist';
                                    var checkDecadePlaylist = $.post(checkDecadePlaylistUrl, playlistData);
                                    checkDecadePlaylist.done(function (data) {
                                        if (data.err){alert("Error in find data")}
                                        if (!data.items.length > 0){
                                            playlistName = countryAtTwenty + languageAtTwenty + yearAtTwenty;
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
                                        }
                                        console.log("response.items[0].tamaringaId: ",response.items[0].tamaringaId);
                                        console.log("response2: ",response2);
                                        console.log("tamaringaId: ",tamaringaId);
                                        var userData = {
                                            tamaringaId: response.items[0].tamaringaId,
                                            playlists: playlistNames,
                                            researchId: researchId.val(),
                                            maxSessionNum: numberOfWeeks.val() * meetingPerWeek.val(),
                                            sessionList: null
                                        };
                                        console.log("userData ",userData);
                                        var getPlaylistLink = '/updateUserDataCollection';
                                        var postingInsertResearch = $.post(getPlaylistLink, userData);
                                        postingInsertResearch.done(function (data) {
                                            if (!data.items.length > 0){
                                                console.log("User Data created ");
                                            }
                                            else {
                                                console.log("User Data was not created ");
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    });

                }//for ended



                var researchData = {
                        researchName: researchName.val(),
                        researchId: researchId.val(),
                        researchersIds: researchersIds.val(),
                        researchGroupId : researchGroupId.val(),
                        description : description.val(),
                        patientsIds: patientsIds,
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

function updateUserData(i) {
    setTimeout(function () {
        console.log("Hello " + i);
    }, 3000);
}
