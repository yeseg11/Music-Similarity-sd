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
                for (var i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].tamaringaId + "'>" + result[i].name + "</option>");
                }
            }).catch(function (err) {
                console.log(err);
                return err;
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
            var arr = ["#researchName", "#researchId", "#researchersIds", "#patientsIds", "#nursingHome", "#department", "#numberOfWeeks", "#meetingPerWeek", "#lengthOfSession", "#alguritem"];
            var mustInput = ["#researchName", "#researchId", "#researchersIds", "#patientsIds", "#nursingHome", "#numberOfWeeks", "#meetingPerWeek", "#alguritem"];
            for (const element of mustInput){
                if (!$(element).length){
                    console.log('Error');
                    alert(element,"is Empty, Please enter data.");
                    return $('#error').text(element,"is Empty, Please enter data.");
                }
            }
            var researchName = $('#researchName'),
                researchId = $('#researchId'),
                researchersIds = $('#researchersIds'),
                patientsIds = $('#patientsIds'),
                nursingHome = $('#nursingHome'),
                department = $('#department'),
                numberOfWeeks = $('#numberOfWeeks'),
                meetingPerWeek = $('#meetingPerWeek'),
                lengthOfSession = $('#lengthOfSession'),
                alguritem = $('#alguritem');


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
                        patientsIds: patientsIds.val(),
                        nursingHome: nursingHome.val(),
                        department: department.val(),
                        numberOfWeeks: numberOfWeeks.val(),
                        meetingPerWeek: meetingPerWeek.val(),
                        lengthOfSession: lengthOfSession.val(),
                        alguritem:alguritem.val()
                };

                var insertResearchUrl = '/insertResearch';
                var postingInsertResearch = $.post(insertResearchUrl, researchData);
                postingInsertResearch.done(function (data) {

                });
                alert("Research Created");
            });
        })
    });
})(jQuery);


