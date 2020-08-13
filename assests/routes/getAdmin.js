(function ($) {
    $(document).ready(function () {
        // onclick="location.href='researches'
        $('#login').on("click", function (e) {

            if ($('#id').val().length === 0 || $('#password').val().length === 0)         // use this if you are using id to check
            {
                alert("Insert id and password!");
                return $('#error').text("insert id and password!");
            } else {
                var id = $('#id');
                var password = $('#password');
            }

            var researcherData = {
                researcherId: id.val(),
                researcherPassword: password.val(),
            };

            var loginResearcher = '/loginResearcher';
            // console.log(researcherData);
            var postingInsertResearch = $.post(loginResearcher, researcherData);
            postingInsertResearch.done(function (data) {
                console.log("Data", data);
                if (!data || !data.items || !data.items.length) return alert("Please Try again the system uploaded!");
                var pathname = "/adminMainPage"
                window.location.replace(pathname);
            });

        });
    });
})(jQuery);
