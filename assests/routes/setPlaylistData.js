(function ($) {
    $(document).ready(function () {

        $('#send').on("click", function (e) {
            let inputsArr = ['#year', '#country', '#language'];
            for (const element of inputsArr) {
                if (!$(element).length) {
                    return $('#error').text("insert all the details");
                }
            }
            var recList = [];
            var year = $('#year'),
                country = $('#country'),
                language = $('#language');

            var playlistName = country.val() + language.val() + year.val();
            var searchTrack = {
                playlistName: playlistName,
                year: year.val(),
                country: country.val(),
                language: language.val(),
                createPlayList: true
            };

            var searchUrl = '/mb/track/recording';
            var postingSearchTrack = jQuery.post(searchUrl, searchTrack)
            postingSearchTrack.done(function (data) {
                console.log("data:", data.items);
                localStorage["PlaylistName"] = data.items;
                alert("The Playlist added to database");
                var pathname = "/showPlaylistTable"
                window.location.replace(pathname);
            });
    });
});
})
(jQuery);
