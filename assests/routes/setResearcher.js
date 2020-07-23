(function ($) {
    $(document).ready(function () {
        $('#send').on("click", function (e) {
            // console.log("here")
            var mustInput = ["#researcherName", "#researcherId", "#researcherPassword"];
            for (const element of mustInput){
                if (!$(element).length){
                    console.log('Error');
                    alert(element,"is Empty, Please enter data.");
                    return $('#error').text(element,"is Empty, Please enter data.");
                }
            }

            var researcherName = $('#researcherName'),
                researcherId = $('#researcherId'),
                researcherPassword = $('#researcherPassword'),
                isAdmin = $('#isAdmin');


            var prom = new Promise(function (resolve, reject) {

                var encryptedPass = CryptoJS.AES.encrypt(researcherPassword.val(),'Password');
                var admin = false;
                if (isAdmin.val() == "on"){
                    admin = true;
                }


                var researcherData = {
                    researcherName: researcherName.val(),
                    researcherId: researcherId.val(),
                    researcherPassword: encryptedPass.toString(),
                     isAdmin: admin
                };
                console.log(isAdmin);
                console.log(researcherData);
                var insertResearchUrl = '/insertResearcher';
                var postingInsertResearch = $.post(insertResearchUrl, researcherData);
                postingInsertResearch.done(function (data) {

                });
                alert("Research Group Created");
            });
        })
    });
})(jQuery);


