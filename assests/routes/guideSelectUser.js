let selectedData;
let sessionDate;
let sessionAndResearch;
let researchID;
let tamaringaId;

(($) => {
    $(document).ready(function () {
        function init() {
            return new Promise(function (resolve, reject) {
                let usersList, researchersList = [];
                $.get('/allusers', function (data) {
                    if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                    usersList = data.items
                    resolve(usersList);
                });

            }).then(function (result) {
                let selectElem = $('#patientsIds');
                for (let i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].tamaringaId + "'>" + result[i].userName + "</option>");
                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }


        init();

        $('#patientsIds').change(function() {
            let tamaringaId = $(this).val();
            let UserName = $("#patientsIds option:selected").text();

            //------------getting the current sessions and putting them inside the select--------------

            getUserData().then(function (result) {
                let userData = result
                let selectElem = $('#sessionsList').empty();
                if(userData[0].researchList){

                for (let i = 0; i <= userData.length; i++) {
                    if(userData[0].researchList[i].sessionList.length !==0){
                        selectElem.append("<option disabled selected value='" + userData[0].researchList[i].researchId + "'>" + "Research ID: " + userData[0].researchList[i].researchId + "</option>");
                    }
                    //this.researchID = userData[0].researchList[i].researchId;
                    this.researchID = i;


                    for(let sessionIndex = 0; sessionIndex < userData[0].researchList[i].sessionList.length; sessionIndex++) {
                        //console.log(userData[0].researchList[i].sessionList[j]);
                        let d = new Date(userData[0].researchList[i].sessionList[sessionIndex].sessionDate);
                        let usdDate = d.toUTCString();
                        let date = usdDate.slice(0, -4); //slice GMT from time
                        sessionDate = date;
                        //console.log(date);

                        selectElem.append("<option value='"
                            + sessionIndex + 'R' + this.researchID
                            + "'>" + "Session Number: "
                            + userData[0].researchList[i].sessionList[sessionIndex].sessionNumber
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

            $('#sessionsList').animate({ scrollTop: 0 }).change(function() { //check if animate works
                sessionAndResearch = $(this).val();
                console.log("Session and research are: " + sessionAndResearch);

            });


            // grabbing userdata by user id
            function getUserData() {
                return new Promise(function (resolve, reject) {
                    let userData = [];
                    //console.log("tamID is: " + tamaringaId);
                    $.get('/userSessions' + tamaringaId , function (data) {
                        if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                        userData = data.items;
                        data.items.tamID = tamaringaId;
                        selectedData = data.items;
                        //console.log("data is" + data[0] + "data.items is:" + data.items);

                        resolve(selectedData);

                    });
                });
            }



            console.log("UserName: " + UserName + "\nTamaringa ID is: " + tamaringaId);
        });

    });
})(jQuery);


