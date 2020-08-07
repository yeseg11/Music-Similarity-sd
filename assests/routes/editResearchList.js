(function ($) {
    $(document).ready(function () {

        function init() {

            getResarches().then(function (result) {
                var selectElem = $('#researchId');
                for (var i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].researchId + "'>" + result[i].researchName + "</option>");
                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getResarches() {
            return new Promise(function (resolve, reject) {
                var usersList, researchersList = [];
                $.get('/allresearches', function (data) {
                    if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                    usersList = data.items
                    resolve(usersList);
                });

            });
        }


        init();

        $('#send').on("click", function (e) {
            if ($('#researchId').val() === null) {
                alert("Please choose one of the users !! ");
                return $('#error').text("user not selected");
            }



            var researchId = $('#researchId');
            console.log(researchId.val())
            localStorage["ResearchId"] = researchId.val();
            var pathname = "/editResearchPage"
            window.location.replace(pathname);
        })

        $('#main').on("click", function (e) {
            localStorage["UserId"] = null;
        })

    });
})(jQuery);


