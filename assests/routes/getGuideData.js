(function ($) {
    $(document).ready(function () {
        // onclick="location.href='researches'
        $('#login').on("click", function (e) {
			  console.log("# Guide login button pressed");
            if ($('#guideName').val().length === 0 || $('#password').val().length === 0) {
     
                alert("Insert Guide Name and password!");
                return $('#error').text("insert Guide Name and password!");
            } else {
                var userName = $('#guideName');
                var password = $('#password');
            }

            var guideData = {
                guideUserName: userName.val(),
                guidePassword: password.val(),
            };

            var loginResearcher = '/loginGuide';
            var postingInsertResearch = $.post(loginResearcher, guideData);
            postingInsertResearch.done(function (data) {
                console.log("Data", data);
                if (!data || !data.items || !data.items.length) 
					return alert("Error login in, please check you user name and password and try again");
                var pathname = "/guideMainPage"
                window.location.replace(pathname);
            });

        });
    });
})(jQuery);


