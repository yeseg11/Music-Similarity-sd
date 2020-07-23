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
            var mustInput = ["#researchGroupName", "#researchGroupId", "#researchGroupPassword", "#researchersIds"];
            for (const element of mustInput){
                if (!$(element).length){
                    console.log('Error');
                    alert(element,"is Empty, Please enter data.");
                    return $('#error').text(element,"is Empty, Please enter data.");
                }
            }

            var researchGroupName = $('#researchGroupName'),
                researchGroupId = $('#researchGroupId'),
                researchGroupPassword = $('#researchGroupPassword'),
                researchersIds = $('#researchersIds');


            var prom = new Promise(function (resolve, reject) {

                var encryptedPass = CryptoJS.AES.encrypt(researchGroupPassword.val(),'Password');

                var researchGroup = {
                    researchGroupName: researchGroupName.val(),
                    researchGroupId: researchGroupId.val(),
                    researchGroupPassword: encryptedPass.toString(),
                    researchersIds: researchersIds.val()
                };
                console.log(researchGroup);
                var insertResearchUrl = '/insertResearchGroup';
                var postingInsertResearch = $.post(insertResearchUrl, researchGroup);
                postingInsertResearch.done(function (data) {

                });
                alert("Research Group Created");
            });
        })
    });
})(jQuery);


