(function ($) {
    $(document).ready(function () {
        function init() {


            getPlaylists().then(function (result) {
                var selectElem = $('#playlistIds');
                console.log('result: ',result);
                for (var i = 0; i < result.length; i++) {
                    selectElem.append("<option value='" + result[i].name + "'>" + result[i].name + "</option>");
                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getPlaylists() {
            return new Promise(function (resolve, reject) {
                var usersList, researchersList = [];
                $.post('/allPlaylists', function (data) {
                    if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                    playlistList = data.items
                    resolve(playlistList);
                });

            });
        }


        init();

        $('#send').on("click", function (e) {
            if ($('#playlistIds').val() === null) {
                alert("Please choose one playlist !! ");
                return $('#error').text("playlist not selected");
            }

            var playlistId = $('#playlistIds');
            console.log(playlistId.val())
            localStorage["PlaylistName"] = playlistId.val();
            var pathname = "/newManualPlaylist";
            window.location.replace(pathname);
        })

        $('#main').on("click", function (e) {
            localStorage["PlaylistName"] = null;
        })

    });
})(jQuery);


