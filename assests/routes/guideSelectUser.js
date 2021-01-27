
//var obg = 'dfd';
(function ($) {
    $(document).ready(function () {
        function init() {
            getUsers().then(function (result) {
                var selectElem = $('#patientsIds');
                for (var i = 0; i < result.length; i++) {
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
            $('#sessionsList').empty(); //test it
            var tamId = $(this).val();
            var UserName = $("#patientsIds option:selected" ).text();

            //------------getting the current sessions and putting them inside the select--------------

            getSession().then(function (result) {
                var userData = result
                var selectElem = $('#sessionsList');
                if(userData[0].researchList){
                for (var i = 0; i <= userData.length; i++) {

                    selectElem.append("<option disabled selected value='" + userData[0].researchList[i].researchId + "'>" + "Research ID: " + userData[0].researchList[i].researchId + "</option>");

                    for(var j = 0; j < userData[0].researchList[i].sessionList.length; j++) {
                        //console.log(userData[0].researchList[i].sessionList[j].sessionDate);
                        var d = new Date(userData[0].researchList[i].sessionList[j].sessionDate);
                        var usdDate = d.toUTCString();
                        var date = usdDate.slice(0, -4); //slice GMT from time
                        console.log(date);

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

            // grabbing userdata by user id
            function getSession() {
                return new Promise(function (resolve, reject) {
                    var userData = [];
                    //console.log("tamID is: " + tamId);
                    $.get('/userSessions' + tamId , function (data) {
                        if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                        userData = data.items
                        resolve(userData);
                        //console.log(userData);
                    });
                });
            }

            //alert("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
            //console.log("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
        });

    });
})(jQuery);


