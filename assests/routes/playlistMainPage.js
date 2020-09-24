(function ($) {
    $(document).ready(function () {

        $('#send').on("click", function (e) {
            if ($('#playlistType').val() === null) {
                alert("Please choose one of the playlist type !! ");
                return $('#error').text("playlist type not selected");
            }
            else{
                var pathname = "";
                var playlistType = $('#playlistType').val();
                if (playlistType === "manual"){
                    pathname = "/createNewManualPlaylist"
                }
                else if (playlistType === "algorithm"){
                    pathname = "/newPlaylist"
                }
                window.location.replace(pathname);
            }
        })

    });
})(jQuery);


