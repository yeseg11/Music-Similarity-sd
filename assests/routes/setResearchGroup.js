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

            getResearcheGroupsSize().then(function (result1) {
                var researchGroupId = $('#researchGroupId');
                researchGroupId.val(result1 + 1);
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

        function getResearcheGroupsSize() {
            return new Promise(function (resolve, reject) {
                var researcheGroups = [];
                $.get('/getResearcheGroupsSize', function (data) {
                    if (!data || !data.items ) return reject(Error("ERROR IN FIND LIST"));
                    researcheGroups = data.items;
                    resolve(researcheGroups);
                })
            });
        }

        init();

        $('#send').on("click", function (e) {
            // console.log("here")
            var mustInput = ["#researchGroupName", "#researchGroupId", "#researchGroupPassword", "#researchersIds"];
            for (const element of mustInput) {
                console.log("element", element)
                console.log("element length", $(element).val().length)
                if ($(element).val().length < 1) {
                    var element2 = element.substr(1);
                    alert("Please fill the missing details in " + element2);
                    return $('#error').text("insert all the details");
                }
            }

            var researchGroupName = $('#researchGroupName'),
                researchGroupId = $('#researchGroupId'),
                researchGroupPassword = $('#researchGroupPassword'),
                description = $('#description'),
                researchersIds = $('#researchersIds');


            var prom = new Promise(function (resolve, reject) {

                var encryptedPass = CryptoJS.AES.encrypt(researchGroupPassword.val(),'Password');

                var researchGroup = {
                    researchGroupName: researchGroupName.val(),
                    researchGroupId: researchGroupId.val(),
                    researchGroupPassword: encryptedPass.toString(),
                    description : description.val(),
                    researchersIds: researchersIds.val()
                };
                console.log(researchGroup);
                var insertResearchUrl = '/insertResearchGroup';
                var postingInsertResearch = $.post(insertResearchUrl, researchGroup);
                postingInsertResearch.done(function (data) {

                });
                alert("Research Group Created '\n' The id is:" + researchGroupId.val());
                var pathname = "/adminMainPage"
                window.location.replace(pathname);
            });
        })
    });
})(jQuery);


