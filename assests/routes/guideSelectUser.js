let selectedData;
let sessionDate;
let sessionAndResearch;
let researchID;

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
            let tamId = $(this).val();
            let UserName = $("#patientsIds option:selected").text();

            //------------getting the current sessions and putting them inside the select--------------

            getUserData().then(function (result) {
                let userData = result
                let selectElem = $('#sessionsList').empty();
                if(userData[0].researchList){

                for (let i = 0; i <= userData.length; i++) {

                    selectElem.append("<option disabled selected value='" + userData[0].researchList[i].researchId + "'>" + "Research ID: " + userData[0].researchList[i].researchId + "</option>");
                    this.researchID = userData[0].researchList[i].researchId;


                    for(let j = 0; j < userData[0].researchList[i].sessionList.length; j++) {
                        //console.log(userData[0].researchList[i].sessionList[j]);
                        let d = new Date(userData[0].researchList[i].sessionList[j].sessionDate);
                        let usdDate = d.toUTCString();
                        let date = usdDate.slice(0, -4); //slice GMT from time
                        sessionDate = date;
                        //console.log(date);

                        selectElem.append("<option value='"
                            + userData[0].researchList[i].sessionList[j].sessionNumber + 'R' + this.researchID
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
                sessionAndResearch = $(this).val();
                console.log("Session and research are: " + sessionAndResearch);

            });


            // grabbing userdata by user id
            function getUserData() {
                return new Promise(function (resolve, reject) {
                    let userData = [];
                    //console.log("tamID is: " + tamId);
                    $.get('/userSessions' + tamId , function (data) {
                        if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                        userData = data.items;
                        selectedData = data.items;
                        //console.log("data is" + data[0] + "data.items is:" + data.items);

                        resolve(selectedData);

                    });
                });
            }



            console.log("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
        });

    });
})(jQuery);


