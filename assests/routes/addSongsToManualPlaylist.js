(function ($) {
    $(document).ready(function () {
        // console.log("here");
        var titleElem = $('#title');
        titleElem.append("<span>" + " " + localStorage["PlaylistName"] + "</span>")

        $('#search').on("click", function (e) {
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
                // console.log("track data1:",data.items);
                var selectElem1 = $('#recordList');
                selectElem1.empty();
                for (var i = 0; i < data.items.length; i++) {
                    // console.log("track mbId:",data.items[i].mbId);
                    // console.log("track title:",data.items[i].title);
                    // console.log("track artist:",data.items[i].artist[0].name);
                    // console.log("track country:",data.items[i].country);
                    // console.log("track year:",data.items[i].year);
                    selectElem1.append("<option value='" + data.items[i].mbId + "'>" + data.items[i].title +' - '+ data.items[i].artist[0].name + ' - ' + data.items[i].country + ' - '+ data.items[i].year+ "</option>");
                }
            });


        });



        $('#send').on("click", function (e) {

            var recordList = $('#recordList');
            console.log("recordList: ", recordList);
            console.log("recordList.val: ", recordList.val());
            console.log("recordList.val: ", recordList.val().length);
            if (recordList.val() && recordList.val().length === 0){
                alert("Please Choose a song before you add it to playlist")
                return $('#error').text("insert all the details");
            }
            let mbIdArr = [];

            for (var j = 0; j < recordList.val().length; j++){
                console.log("recordList.val: ", recordList.val()[j]);
                mbIdArr.push(recordList.val()[j]);
            }

            var addTrack= {
                mbIdArr: mbIdArr,
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

