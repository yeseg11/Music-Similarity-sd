(function ($) {
    $(document).ready(function () {

        $('#send').on("click", function (e) {
            let inputsArr = ['#playlistName'];
            for (const element of inputsArr) {
                if (!$(element).length) {
                    return $('#error').text("insert all the details");
                }
            }

            //the new user data
            var playlistName = $('#playlistName');

            var playlistNameData= {
                name : playlistName.val()
            };

            var playlisthUrl = '/ManualPlayListByName';
            var postingpPlaylisthName = $.post(playlisthUrl, playlistNameData).then(function (data) {
                // console.log("data1:",data);
                if (data.items != null){
                    localStorage["PlaylistName"] = playlistName.val();
                    var pathname = "/newManualPlaylist"
                    window.location.replace(pathname);
                }
            });


        });
        $('#main').on("click", function (e) {
            localStorage["PlaylistName"] = null;
        })
    });
})(jQuery);

