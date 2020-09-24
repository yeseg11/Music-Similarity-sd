(function ($) {
    $(document).ready(function () {
        // console.log("here");
        var titleElem = $('#title');
        titleElem.append("<span>" + " " + localStorage["PlaylistName"] + "</span>")

        $('#search').on("click", function (e) {
            var selectElem1 = $('#recordList');

            //the new user data
            var recordName = $('#recordName'),
                year = $('#year'),
                country = $('#country'),
                language = $('#language');

            var searchTrack= {
                recordName: recordName.val(),
                year: year.val(),
                country: country.val(),
                language: language.val()
            };

            var searchUrl = '/mb/track';
            var postingSearchTrack = $.post(searchUrl, searchTrack).then(function (data) {
                console.log("track data1:",data.items);
                var selectElem1 = $('#recordList');
                for (var i = 0; i < data.items.length; i++) {
                    selectElem1.append("<option value='" + data.items[i].mbId + "'>" + data.items[i].title +' - '+ data.items[i].artist[0].name + ' - ' + data.items[i].country + ' - '+ data.items[i].year+ "</option>");
                }
            });





        });



        $('#send').on("click", function (e) {

            var recordList = $('#recordList');
            console.log("recordList: ", recordList);
            console.log("recordList.val: ", recordList.val());
            if (recordList.val() && recordList.val().length === 0){
                alert("Please Choose a song before you add it to playlist")
                return $('#error').text("insert all the details");
            }

            var addTrack= {
                mbId: recordList.val().toString(),
                playlistName: localStorage["PlaylistName"]
            };

            var playlisthUrl = '/addSongToPlaylist';
            var postingpPlaylisthName = $.post(playlisthUrl, addTrack).then(function (data) {
                console.log("data1:",data);
                // if (data.items != null){
                //     localStorage["PlaylistName"] = playlistName.val();
                //     var pathname = "/newManualPlaylist"
                //     window.location.replace(pathname);
                // }
            });


        });

        //showPlaylist
        $('#showPlaylist').on("click", function (e) {
            var pathname = "/showPlaylistTable"
                window.location.replace(pathname);
        });
    });
})(jQuery);

