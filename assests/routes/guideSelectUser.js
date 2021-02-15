
//var obg = 'dfd';
(function ($) {
    $(document).ready(function () {
        function init() {
            getUsers().then(function (result) {
                let selectElem = $('#patientsIds');
                for (let i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].tamaringaId + "'>" + result[i].userName + "</option>");
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

        init();

        $('#patientsIds').change(function() {
            //add clear select here
            //$('#sessionsList').empty(); //test it
            let tamId = $(this).val();
            let UserName = $("#patientsIds option:selected").text();

            //------------getting the current sessions and putting them inside the select--------------

            getSession().then(function (result) {
                let userData = result
                let selectElem = $('#sessionsList').empty(); //also empty the select session list
                if(userData[0].researchList){

                for (let i = 0; i <= userData.length; i++) {

                    selectElem.append("<option disabled selected value='" + userData[0].researchList[i].researchId + "'>" + "Research ID: " + userData[0].researchList[i].researchId + "</option>");

                    for(let j = 0; j < userData[0].researchList[i].sessionList.length; j++) {
                        console.log("j is: " + j);
                        //console.log(userData[0].researchList[i].sessionList[j].sessionDate);
                        let d = new Date(userData[0].researchList[i].sessionList[j].sessionDate);
                        let usdDate = d.toUTCString();
                        let date = usdDate.slice(0, -4); //slice GMT from time
                        //console.log(date);

                        selectElem.append("<option value='"
                            + userData[0].researchList[i].sessionList[j].sessionNumber
                            + "'>" + "Session Number: "
                            + userData[0].researchList[i].sessionList[j].sessionNumber
                            + " &nbsp;&nbsp;&nbsp;" + date +"</option>");
                        }
                    }
                }
                else {
                    selectElem.append("<option disabled selected>" + "This user is not registered for any research" + "</option>");
                }

            }).catch(function (err) {
                console.log(err);
                return err;
            });

            $('#sessionsList').change(function() {
                //alert($(this).val());
                let selectedSession = $(this).val();
                console.log("Selected Session is: " + selectedSession);

            });


            // grabbing userdata by user id
            function getSession() {
                return new Promise(function (resolve, reject) {
                    let userData = [];
                    //console.log("tamID is: " + tamId);
                    $.get('/userSessions' + tamId , function (data) {
                        if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                        userData = data.items
                        resolve(userData);
                        console.log(userData);
                    });
                });
            }


            $('#enterSession').on("click", function (e) {
                alert("get session has been pressed!");
            });
            //alert("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
            //console.log("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
        });

    });
})(jQuery);


