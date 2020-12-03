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

        $('#send').on("click", function (e) {
            if ($('#patientsIds').val() === null) {
                alert("Please choose one of the users !! ");
                return $('#error').text("user not selected");
            }



            var patientId = $('#patientsIds');
            console.log(patientId.val())
            localStorage["UserId"] = patientId.val();
            var pathname = "/editUserPage"
            window.location.replace(pathname);
        })

        $('#main').on("click", function (e) {
            localStorage["UserId"] = null;
        })

    });
})(jQuery);


