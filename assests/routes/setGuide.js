(function ($) {
    $(document).ready(function () {
        $('#send').on("click", function (e) { //on button press
            var mustInput = ["#guideName", "#guideId", "#guidePassword"];
            for (const element of mustInput){
                if (!$(element).length){ //checking the field is empty
                    console.log('Error');
                    alert(element,"is Empty, Please enter data.");
                    return $('#error').text(element,"is Empty, Please enter data.");
                }
            }

            var guideName = $('#guideName'),
                guideId = $('#guideId'),
                guidePassword = $('#guidePassword')

            var prom = new Promise(function (resolve, reject) {
                //create an object with the form's data
                var guideData = {
                    guideName: guideName.val(),
                    guideId: guideId.val(),
                    guidePassword: guidePassword.val().toString()
                };

                console.log(guideData);
                var insertGuideUrl = '/insertGuide';
                var postingInsertGuide = $.post(insertGuideUrl, guideData);
                postingInsertGuide.done(function (data) {

                });
                alert("a guide as been created '\n' The Guide's Id is:" + guideId.val());
                var pathname = "/adminMainPage"
                window.location.replace(pathname);
            });
        })
    });
})(jQuery);


