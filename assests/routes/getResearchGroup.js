(function($) {
    $(document).ready(function() {
        // onclick="location.href='researches'
        $('#login').on("click", function(e) {
            console.log("Log-IN");
            if( $('#researchGroupId').val().length === 0 || $('#researchGroupPassword').val().length === 0)         // use this if you are using id to check
            {
                alert("Insert id and password!");
                return $('#error').text("insert id and password!");
            }
            else{
                var id = $('#researchGroupId');
                var password = $('#researchGroupPassword');
                var encryptedPass = CryptoJS.AES.encrypt(password.val(),'Password');
            }
            // var prom = new Promise(function (resolve, reject) {

                var researcheGroupData = {
                    Id: id.val(),
                    Password: password.val(),
                };
                var loginResearchGroupData = '/loginResearchGroup';
                // console.log(researcherData);
                var postingfLoginResearchGroup = $.post(loginResearchGroupData, researcheGroupData);
                postingfLoginResearchGroup.done(function (data) {
                    // console.log("Data", data);
                    if (!data || !data.items || !data.items.length) return alert("Please Try again wrong Id or password!");
                    localStorage["ResearchGroupId"] = id.val().toString();
                    var pathname = "/researchGroupMainPage"
                    window.location.replace(pathname);
                });
        });
    });
})(jQuery);
