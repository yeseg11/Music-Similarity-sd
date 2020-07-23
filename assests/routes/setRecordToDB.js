(function ($) {
    $(document).ready(function () {

        $('#send').on("click", function (e) {
            console.log("here")
            var arr = ["#mbId","#title","#year","#artistName","#language","#country","#lyrics","#genre"];
            var mustInput = ["#title","#artistName","#year","#country","#language","#mbId","#youtubeId","#youtubeViews"];

            for (const element of mustInput){

                if (!$(element).length){
                    console.log('Error');
                    alert(element,"is Empty, Please enter data.");
                    return $('#error').text(element,"is Empty, Please enter data.");
                }
            }

            var artistName = $('#artistName'),
                title = $('#title'),
                year = $('#year'),
                country = $('#country'),
                language = $('#language'),
                mbId = $('#mbId'),
                youtubeId = $('#youtubeId'),
                youtubeViews = $('#youtubeViews');


            var genre = "";
            if ($('#Genre1Select').length){
                genre = $('#Genre1Select');
            }

            var lyrics = "";
            if ($('#lyrics').length){
                lyrics = $('#lyrics');
            }


            var recList = [];
            var prom = new Promise(function (resolve, reject) {
                // do a thing, possibly async, then…
                console.log('genre: ',genre.val());
                alert(artistName.val()+" "+title.val()+" "+year.val()+" "+country.val()+" "+language.val()+" "+mbId.val()+" "+youtubeId.val()+" "+youtubeViews.val());
                var recordData = {
                    mbId: mbId.val(),
                    title: title.val(),
                    year: year.val(),
                    artistName: artistName.val(), // NEED TO BE JUST THE ARTIST NAME !!
                    language: language.val(),
                    country: country.val(),
                    lyrics: lyrics.val(),
                    genre: genre.val(),
                    youtube: JSON.stringify({
                        videoId: youtubeId.val(),
                        views: youtubeViews.val()
                    })
                };

                //private users
                var setRecordUrl = '/insertRecord';
                var postingPrivate = $.post(setRecordUrl, recordData).then(function (data) {
                });
                postingPrivate.done(function (data) {
                });

            });
        })
    });
})(jQuery);
