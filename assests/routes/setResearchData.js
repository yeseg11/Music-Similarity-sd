(function ($) {
    $(document).ready(function () {

        const PLAYLISTSIZE = 50;

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


        //this function will be call twice if the user has selected a second language.
        function postPlaylistForLang(postingData) {
            var playlistNames = [];
            var recList = [];

            for (var i = 0 ; i < postingData.decade.length ; i++){
                var lang = postingData.langAtTwenty.toUpperCase();

                if (postingData.langAtTwenty === "rus" || postingData.langAtTwenty === "lit" || postingData.langAtTwenty === "lav"){
                    lang = "RUS"
                }

                playlistNames.push(lang + postingData.decade[i] + "DC");
            }

            var playlistData = {
                name: playlistNames
            };

            console.log("Getting decade playlists...");
            var checkDecadePlaylistUrl = '/getDecadePlaylist';
            var checkDecadePlaylist = $.post(checkDecadePlaylistUrl, playlistData);

            checkDecadePlaylist.done(function (data) {
                console.log("decade playlists done!  the data is: " + data);
                //console.log("data",data);
                if (data.err){
                    alert("Error in find data checkDecadePlaylist for " + postingData.langID)
                }

                if (!(data.items.length > 0)){
                    console.log("decade playlists empty! creating playlist...");
                    var playlistName = postingData.countryAtTwenty + postingData.langAtTwenty + postingData.yearAtTwenty;
                    console.log("playlistName is: " + playlistName);

                    var playlistData = {
                        name: playlistName,
                        year: postingData.yearAtTwenty,
                        country: postingData.countryAtTwenty,
                        language: postingData.langAtTwenty,
                        records: JSON.stringify(recList)
                    };
                    console.log("playlist data is: " + JSON.stringify(playlistData));
                    console.log("posting playlist data to /playList/createPlaylist...");

                    var createPlaylistUrl = '/playList/createPlaylist';
                    var postingCreatePlaylist = $.post(createPlaylistUrl, playlistData);
                    postingCreatePlaylist.done(function (data) {
                        console.log("DONE! - posting playlist data. The data is: " + data);
                    });
                    playlistNames =[playlistName]
                    console.log("playlistNames for " + postingData.langID + " " + playlistNames);
                }
                console.log("language before userdata" + postingData.langAtTwenty);
                var userData = {
                    tamaringaId: postingData.response.items[0].tamaringaId,
                    playlists: playlistNames,
                    researchId: postingData.researchId.val(),
                    langAtTwenty: postingData.langAtTwenty,
                    maxSessionNum: postingData.numberOfWeeks.val() * postingData.meetingPerWeek.val(),
                    sessionList: null
                };
                console.log("userData for" + postingData.langID + " " + userData);
                var getPlaylistLink = '/updateUserDataCollection';
                var postingInsertResearch = $.post(getPlaylistLink, userData);
                postingInsertResearch.done(function (data) {
                    if (!data.items.length > 0){
                        console.log("User Data for " + postingData.langID + "created ");
                    }
                    else {
                        console.log("User Data for " + postingData.langID + "was not created ");
                    }
                });
            });
        }

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
            var firstLangAtTwenty = "";
            var secondLangAtTwenty = "";
            var yearOfImmigration = "";
            var group = "";

            var prom = new Promise(function (resolve, reject) {

                Promise.all(patientsIds.map(patientsId=>{
                    return new Promise((res, rej)=>{
                        // insert logic foreach id here on done return res()
                        console.log(patientsId)
                        //run patient by patient

                        $.get('/user/' + patientsId, function (data) {
                            let items = data.items[0];
                            //console.log("data: ",data);

                            tamaringaId = items.tamaringaId;
                            yearAtTwenty = items.yearAtTwenty;
                            countryAtTwenty = items.countryAtTwenty;
                            countryOrigin = items.countryOrigin;
                            languageOrigin = items.languageOrigin;
                            firstLangAtTwenty = items.firstLangAtTwenty;
                            secondLangAtTwenty = items.secondLangAtTwenty;
                            yearOfImmigration = items.yearOfImmigration;
                            group = items.group;

                        }).then(function (response) {
                            console.log("response1:",response);
                            yearAtTwenty = response.items[0].yearAtTwenty;
                            firstLangAtTwenty = response.items[0].firstLangAtTwenty;
                            secondLangAtTwenty = response.items[0].secondLangAtTwenty;
                            birthYear = response.items[0].birthYear;
                            // console.log("birthYear:",birthYear);
                            // console.log("yearAtTwenty:",yearAtTwenty);
                            // console.log("languageAtTwenty:",languageAtTwenty);
                            // return;
                            //var recList = [];
                            //********** check if we have a playlist for the user
                            var decade = [];
                            if (parseInt(birthYear) >1920 && parseInt(birthYear) <= 1940){ //50's
                                //decade = "40";
                                decade = ["30","40","50","60"];
                                console.log("decade:",decade);
                            }
                            else if (parseInt(birthYear) <1950 && parseInt(birthYear) >= 1940){ //50's
                                //decade = "40";
                                decade = ["40","50","60"];
                                console.log("decade:",decade);
                            }
                            else if (parseInt(birthYear) <1960 && parseInt(birthYear) >= 1950){ //50's
                                //decade = "50";
                                decade = ["50","60","70"];
                                console.log("decade:",decade);
                            }
                            else if (parseInt(birthYear) <1970 && parseInt(birthYear) >= 1960){
                                // decade = "60";
                                decade = ["60","70","80"];
                                console.log("decade:",decade);
                            }//60's
                            else if (parseInt(birthYear) <1980 && parseInt(birthYear) >= 1970){
                                // decade = "70";
                                decade = ["70","80","90"];
                                console.log("decade:",decade);
                            }//70's
                            else if (parseInt(birthYear) <1990 && parseInt(birthYear) >= 1980){
                                // decade = "80";
                                decade = ["80","90"];
                                console.log("decade:",decade);
                            }//80's
                            else if (parseInt(birthYear) <2000 && parseInt(birthYear) >= 1990){
                                // decade = "90";
                                decade = ["90","00"];
                                console.log("decade:",decade);
                            }//90's
                            else if (parseInt(birthYear) <2010 && parseInt(birthYear) >= 2000){
                                // decade = "00";
                                decade = ["00","10"];
                            }//00's
                            else if (parseInt(birthYear) <2020 && parseInt(birthYear) >= 2010){
                                // decade = "10";
                                decade = ["10"];
                            }//10's
                            else {
                                return alert("the decade didnt found");
                            }

                            let onlyOneLang = false;
                            if(firstLangAtTwenty.toUpperCase() === secondLangAtTwenty.toUpperCase() || secondLangAtTwenty === "empty")
                                onlyOneLang = true;


                            let langID1 = "first language";
                            let landID2 = "second language";

                            var postingData = {
                                langAtTwenty: firstLangAtTwenty,
                                decade: decade,
                                langID: langID1,
                                countryAtTwenty: countryAtTwenty,
                                yearAtTwenty: yearAtTwenty,
                                response: response,
                                researchId: researchId,
                                meetingPerWeek: meetingPerWeek,
                                numberOfWeeks: numberOfWeeks
                            }

                            var postingData2 = {
                                langAtTwenty: secondLangAtTwenty,
                                decade: decade,
                                langID: landID2,
                                countryAtTwenty: countryAtTwenty,
                                yearAtTwenty: yearAtTwenty,
                                response: response,
                                researchId: researchId,
                                meetingPerWeek: meetingPerWeek,
                                numberOfWeeks: numberOfWeeks
                            }


                            async function createPl() {
                                try {
                                    const res = await postPlaylistForLang(postingData);
                                    if(!onlyOneLang){
                                        const res2 = await postPlaylistForLang(postingData2);
                                    }

                                } catch(err) {
                                    console.log(err);
                                }
                            }

                            const res = createPl();
                        });
                        res();
                    })
                }))
                    .then(()=>{
                        // continue logic, done all the patients run
                        alert("Creating User data... Please wait for 5-10 seconds and press OK")
                    })
                    .catch(e=>console.log(e))

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
                    //console.log("create a research...");
                    alert("Research Created '\n' The research Id is: " + researchId.val());
                    // var pathname = "/researchGroupMainPage"
                    // window.location.replace(pathname);
                });
                alert("Research Created '\n' The research Id is: " + researchId.val() +"\n Please wait a few seconds till the page will go back");
                setTimeout(myFunction, 1000);
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