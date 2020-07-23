(function($) {
    $(document).ready(function() {
        // onclick="location.href='researches'
        $('#login').on("click", function(e) {

            if( $('#id').val().length === 0 || $('#password').val().length === 0)         // use this if you are using id to check
            {
                alert("Insert id and password!");
                return $('#error').text("insert id and password!");
            }
            else{
                var id = $('#id');
                var password = $('#password');
                var encryptedPass = CryptoJS.AES.encrypt(password.val(),'Password');
            }
            var html = '';
            $.get('/insertResearcher/' + id.val().toString()+'/'+encryptedPass, function(data) {
                if(!data || !data.items || !data.items.length) return  alert("Please Try again the system uploaded!");
                var pathname = "/adminMainPage"
                window.location.replace(pathname);
            });
        });
    });
})(jQuery);
