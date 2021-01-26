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
            var tamId = $(this).val();
            var UserName = $("#patientsIds option:selected" ).text();
            getSession();
//------------------------------------grab sessions here------------------------------------------
            function getSession() {
                return new Promise(function (resolve, reject) {
                    var researchList = [];
                    console.log("tamID is: " + tamId);
                    $.get('/userSessions' + tamId , function (data) { // create a function for getting the users sessions!
                        // $.get('/userSessions:' + tamId, function (data) { // create a function for getting the users sessions!

                        if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                        researchList = data.items
                        resolve(researchList);
                        console.log(data.items);
                    });
                });
            }
//------------------------------------------------------------------------------------------------

            alert("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
            console.log("UserName: " + UserName + "\nTamaringa ID is: " + tamId);
        });

        // function getSession() {
        //     return new Promise(function (resolve, reject) {
        //         var usersList, researchersList = [];
        //         $.get('/allusers', function (data) {
        //             if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
        //             usersList = data.items
        //             resolve(usersList);
        //         });
        //
        //     });
        // }
    });
})(jQuery);


