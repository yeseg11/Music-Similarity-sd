(function ($) {
    $(document).ready(function () {
        // console.log("here");

        var researchId = localStorage["ResearchId"];
        console.log("researchId: ",researchId);

        // var oldEntrance = 0;
        // var oldrecList = [];
        function init() {


            getResearchData().then(function (result1) {
                $('#researchName').val(result1[0].researchName);
                $('#researchId').val(result1[0].researchId);
                $('#researchGroupId').val(result1[0].researchGroupId);
                // $('#researchersIds').val(result1[0].researchersIds);
                $('#nursingHome').val(result1[0].nursingHome);
                $('#department').val(result1[0].countryOrigin);
                $('#description').val(result1[0].description);
                // $('#patientsIds').val(result1[0].patientsIds);
                $('#numberOfWeeks').val(result1[0].numberOfWeeks);
                $('#meetingPerWeek').val(result1[0].meetingPerWeek);
                $('#lengthOfSession').val(result1[0].lengthOfSession);
                $('#algorithm').val(result1[0].algorithm);

                alert('Please Choose the researchers, patients and algorithm again ');

            }).catch(function (err) {
                console.log(err);
                return err;
            });

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
                for (var i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].tamaringaId + "'>" + result[i].name + "</option>");
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

        function getResearchData() {
            return new Promise(function (resolve, reject) {
                $.get('/research/' + researchId, function (data) {
                    // console.log("data: ",data);
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    // console.log(data.items)
                    resolve(data.items);
                })
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


            var yearAtTwenty = "";
            var countryAtTwenty = "";
            var countryOrigin = "";
            var languageOrigin = "";
            var languageAtTwenty = "";
            var yearOfImmigration = "";
            var group = "";

            var prom = new Promise(function (resolve, reject) {
                for (i = 0; i < patientsIds.length; i++) {
                    $.get('/user/' + patientsIds[i].value, function (data) {
                        console.log(data.items);
                        let items = data.items[0];
                        yearAtTwenty = items.yearAtTwenty;
                        countryAtTwenty = items.countryAtTwenty;
                        countryOrigin = items.countryOrigin;
                        languageOrigin = items.languageOrigin;
                        languageAtTwenty = items.languageAtTwenty;
                        yearOfImmigration = items.yearOfImmigration;
                        group = items.group;

                    }).then(function (response) {
                        var recList = [];
                        $.get('/mb/track/recording/' + yearAtTwenty + '/' + countryAtTwenty + '/' + languageAtTwenty, function (data) {
                            if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                            var size = PLAYLISTSIZE;
                            if (data.items.length < size) {
                                size = data.items.length;
                            }
                            for (i = 0; i < size; i++) {
                                console.log(data.items[i].artist[0].name);
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
                            var playlistData = {
                                name: countryAtTwenty + languageAtTwenty + yearAtTwenty,
                                year: yearAtTwenty,
                                country: countryAtTwenty,
                                language: languageAtTwenty,
                                records: JSON.stringify(recList)
                            };
                            var createPlaylistUrl = '/playList/createPlaylist';
                            var postingCreatePlaylist = $.post(createPlaylistUrl, playlistData);
                            postingCreatePlaylist.done(function (data) {
                            });
                        });
                    });

                }

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
                    algorithm:algorithm.val()
                };

                var insertResearchUrl = '/insertResearch';
                var postingInsertResearch = $.post(insertResearchUrl, researchData);
                postingInsertResearch.done(function (data) {

                });
                alert("Research Created '\n' The research Id is: " + researchId.val());
                var pathname = "/researchGroupMainPage"
                window.location.replace(pathname);
            });
        })
    });
})(jQuery);
