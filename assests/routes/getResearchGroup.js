(function($) {
    $(document).ready(function() {
        // onclick="location.href='researches'
        $('#login').on("click", function(e) {
            console.log("Log-IN")
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
            var prom = new Promise(function (resolve, reject) {
                $.get('/insertResearchGroup/' + id.val().toString()+'/'+encryptedPass, function(data) {
                    if(!data || !data.items || !data.items.length) return  alert("Please Try again the system uploaded!");
                    var pathname = "/researchGroupMainPage"
                    localStorage["ResearchGroupId"] = id.val().toString();
                    window.location.replace(pathname);
                }).then(function (response) {
                    // console.log("response: ",response);
                    if(!data || !data.items || !data.items.length) return  alert("Please Try again the system uploade !");
                    var pathname = "/researchGroupMainPage"
                    window.location.replace(pathname);
                });
            });
        });
    });
})(jQuery);
