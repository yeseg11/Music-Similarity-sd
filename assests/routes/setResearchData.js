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


        function ajaxAwait(resourceUrl, method, playlistData){
            return  new Promise(function (resolve, reject) {
                $[method](resourceUrl ,{ playlistData,
                }).done(function (data) {

                    if (data.err){
                        reject(data);
                    }
                    else{
                        resolve(data);
                    }
                });
            });
        }

        $('#send').on("click", async function (e) {
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

            var users = $.post('/users', {patientsIds}, async function (usersData){
                console.log(usersData);
                usersData = usersData.items;
                for(let i = 0; i < usersData.length; i ++) {
                    tamaringaId = usersData[i].tamaringaId;
                    yearAtTwenty = usersData[i].yearAtTwenty;
                    countryAtTwenty = usersData[i].countryAtTwenty;
                    countryOrigin = usersData[i].countryOrigin;
                    languageOrigin = usersData[i].languageOrigin;
                    firstLangAtTwenty = usersData[i].firstLangAtTwenty;
                    secondLangAtTwenty = usersData[i].secondLangAtTwenty;
                    yearOfImmigration = usersData[i].yearOfImmigration;
                    group = usersData[i].group;
                    birthYear = usersData[i].birthYear;

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


                    let postingData = {
                        firstLangAtTwenty: firstLangAtTwenty,
                        secondLangAtTwenty: secondLangAtTwenty,
                        decade: decade,
                        countryAtTwenty: countryAtTwenty,
                        yearAtTwenty: yearAtTwenty,
                        researchId: researchId,
                        meetingPerWeek: meetingPerWeek,
                        numberOfWeeks: numberOfWeeks
                    }

                    let firstPlaylistNames = [];
                    let secondPlaylistNames = [];
                    let onePlaylistLang1 = false;
                    let onePlaylistLang2 = false;


                    if (postingData.firstLangAtTwenty === "arame"){
                        lang1 = "ARAME99DC";
                        if(firstPlaylistNames.indexOf(lang1) === -1){
                            firstPlaylistNames.push(lang1);
                            onePlaylistLang1 = true;
                        }
                    }

                    else if (postingData.secondLangAtTwenty === "arame"){
                        lang2 = "ARAME99DC";
                        if(secondPlaylistNames.indexOf(lang2) === -1) {
                            secondPlaylistNames.push(lang2);
                            onePlaylistLang2 = false;
                        }
                    }

                    else if (postingData.firstLangAtTwenty === "arana") {
                        lang1 = "ARANA99DC"
                        if(firstPlaylistNames.indexOf(lang1) === -1){
                            firstPlaylistNames.push(lang1);
                            onePlaylistLang1 = true;
                        }
                    }

                    else if (postingData.secondLangAtTwenty === "arana") {
                        lang2 = "ARANA99DC"
                        if(secondPlaylistNames.indexOf(lang2) === -1) {
                            secondPlaylistNames.push(lang2);
                            onePlaylistLang2 = true;
                        }
                    }

                    else if (postingData.firstLangAtTwenty === "spa") {
                        lang1 = "SPA99DC"
                        if(firstPlaylistNames.indexOf(lang1) === -1){
                            firstPlaylistNames.push(lang1);
                            onePlaylistLang1 = true;
                        }
                    }

                    else if (postingData.secondLangAtTwenty === "spa") {
                        lang2 = "SPA99DC"
                        if(secondPlaylistNames.indexOf(lang2) === -1) {
                            secondPlaylistNames.push(lang2);
                            onePlaylistLang2 = true;
                        }
                    }
                    let numOfPlaylist = postingData.decade.length;

                    for (let i = 0 ; i < numOfPlaylist ; i++){
                        let lang1 = postingData.firstLangAtTwenty.toUpperCase();
                        let lang2 = postingData.secondLangAtTwenty.toUpperCase();

                        if (postingData.firstLangAtTwenty === "rus" || postingData.firstLangAtTwenty === "lit" || postingData.firstLangAtTwenty === "lav"){
                            lang1 = "RUS";
                            firstPlaylistNames.push(lang1 + postingData.decade[i] + "DC");
                        }
                        else if (postingData.secondLangAtTwenty === "rus" || postingData.secondLangAtTwenty === "lit" || postingData.secondLangAtTwenty === "lav"){
                            lang2 = "RUS";
                            secondPlaylistNames.push(lang2 + postingData.decade[i] + "DC");
                        }


                        if((firstPlaylistNames.indexOf(lang1 + postingData.decade[i] + "DC") === -1) && !onePlaylistLang1) {
                            firstPlaylistNames.push(lang1 + postingData.decade[i] + "DC");
                        }

                        if((secondPlaylistNames.indexOf(lang2 + postingData.decade[i] + "DC") === -1) && !onePlaylistLang2 && lang2 !== "EMPTY") {
                            secondPlaylistNames.push(lang2 + postingData.decade[i] + "DC");
                        }

                    }

                    let playlistData1 = {
                        name: firstPlaylistNames
                    };

                    let playlistData2 = {
                        name: secondPlaylistNames
                    };

                    console.log("Getting decade playlists...");

                    await ajaxAwait('/getDecadePlaylist', "post", playlistData1);
                    await ajaxAwait('/getDecadePlaylist', "post", playlistData2);


                    let userData = {
                        tamaringaId: tamaringaId,
                        firstPlaylists: firstPlaylistNames,
                        secondPlaylists: secondPlaylistNames,
                        researchId: postingData.researchId.val(),
                        firstLangAtTwenty: postingData.firstLangAtTwenty,
                        secondLangAtTwenty: postingData.secondLangAtTwenty,
                        maxSessionNum: postingData.numberOfWeeks.val() * postingData.meetingPerWeek.val(),
                        sessionList: null
                    };
                    const getPlaylistLink = '/updateUserDataCollection';
                    await ajaxAwait(getPlaylistLink, "post", userData);
                    console.log("amir...the camel");

                }

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
                    algorithm:algorithm.val()
                };

                var insertResearchUrl = '/insertResearch';
                await ajaxAwait(insertResearchUrl, "post", researchData);
                alert("Research Created '\n' The research Id is: " + researchId.val() +"\n Please wait a few seconds till the page will go back");
                var pathname = "/researchGroupMainPage"
                window.location.replace(pathname);
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