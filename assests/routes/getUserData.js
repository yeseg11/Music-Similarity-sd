(function ($) {
    $(document).ready(function () {
        const SONGSDISPLAYED = 10;
        var musicWrapper = $('#musicWrapper');
        /**
         *  @NAME template,experienceShow: add the video and the vote buttons to screen (HTML)
         *
         *
         */
        var template = '<div class="wrap-input100 input100-select">';
        template += '<span id="::videoId:::" class="label-input100"></span>';
        template += '<div id="demo"></div>';
        template += '<span class="focus-input100">::name::</span>';
        template += '<iframe width="1024" height="600" src="http://www.youtube.com/embed/::link::"></iframe>';
        template += '<div id = "buttons">';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',\'::playListName::\',1)" name="like" id ="like" ><img  src="../images/btn/Angry.png" name="like" title="Angry" /></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',\'::playListName::\',2)" name="like" id ="like"><img src="../images/btn/Sad.png" name="like" title="Sad" /></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',\'::playListName::\',3)" name="like" id ="like"><img src="../images/btn/Indifferent.png" name="like" title="Indifferent" /></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',\'::playListName::\',4)" name="like" id ="like"><img src="../images/btn/Relaxed.png" name="like" title="Relaxed" /></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',\'::playListName::\',5)" name="like" id ="like"><img src="../images/btn/Joyful.png" name="like" title="Joyful" /></button>';
        template += '';
        template += '</div>';
        template += '</div>';


        var experienceShow = '<div class="wrap-input100 input100-select" >';
        experienceShow += '<span id="::videoId:::" class="label-input100"></span>';
        experienceShow += '<div id="demo" style="width: 600px"></div>';
        experienceShow += '<span class="focus-input100">::name::</span>';
        experienceShow += '<iframe width="1000" height="1000" src="http://www.youtube.com/embed/::link::"></iframe>';
        experienceShow += '<div id = "buttons">';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',1)" name="like" id ="like"><img  src="../images/btn/Angry.png" name="like" title="Angry" /></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',2)" name="like" id ="like"><img src="../images/btn/Sad.png" name="like" title="Sad" /></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',3)" name="like" id ="like"><img src="../images/btn/Indifferent.png" name="like" title="Indifferent" /></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',4)" name="like" id ="like"><img src="../images/btn/Relaxed.png" name="like" title="Relaxed" /></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',5)" name="like" id ="like"><img src="../images/btn/Joyful.png" name="like" title="Joyful" /></button>';
        experienceShow += '';
        experienceShow += '</div>';
        experienceShow += '</div>';


        // onclick="location.href='researches'
        $('#login').on("click", function (e) {
            console.log("LOG - IN Pressed");
            if ($('#userName').val().length === 0 || $('#password').val().length === 0)         // use this if you are using id to check
            {
                alert("Insert id and password!");
                return $('#error').text("insert id and password!");
            } else {
                var userName = $('#userName');
                var password = $('#password');
            }

            var userData = {
                userName: userName.val(),
                userPassword: password.val(),
            };

            var loginUserPath = '/loginUser';
            // console.log(researcherData);
            var postingInsertResearch = $.post(loginUserPath, userData);
            postingInsertResearch
            .fail(function(data){
                if(data.responseJSON && data.responseJSON.message)
                    alert(data.responseJSON.message);
            })
            .done(function (data) {

                var user = data.items[0];
                //console.log("user",user)
                if(!user.playlists || !user.playlists.length) return alert("No playlist was defined for this user!");

                var html = '';

                let playlistFinal = [];
                let itemsExist = true;

                while(itemsExist) {
                    for (let i = 0; i < user.playlists.length; i++) {
                        user.playlists[i][0].records.forEach(song => {
                            const songIndex = Math.floor(Math.random() * user.playlists[i][0].records.length);
                            playlistFinal.push(user.playlists[i][0].records[songIndex]);
                            user.playlists[i][0].records.splice(songIndex, 1);

                            if (!user.playlists[i][0].records.length) {
                                user.playlists.splice(i, 1);
                            }
                        })
                    }
                    if (!user.playlists.length) {
                        itemsExist = false;
                    }
                }

                for(var i = 0; i < user.playlists.length; i++){
                    const playlist = user.playlists[i][0];
                    const records = playlist.records;

                    for(var r = 0; r < records.length; r++){
                        console.log(playlist.records[r])
                        const record = records[r];
                        const mbid = record.mbId ? record.mbId : '';
                        const cleanMbid = mbid.replace(/([\/,"+'!?_])/g, "\\$1");
                        const videoId = (record.youtube && record.youtube.videoId) ? record.youtube.videoId : '';
                        const title = (record.title) ? record.title : '';
                        const artist = (record.artistName) ? record.artistName : '';
                        const playlistName = playlist.name;
                        html += template
                                    .replace(new RegExp('::videoId::', 'g'), videoId)
                                    .replace(new RegExp('::name::', 'g'), title + ' - ' + artist)
                                    .replace(new RegExp('::link::', 'g'), videoId)
                                    .replace(new RegExp('::userid::', 'g'), user.tamaringaId.toString())
                                    .replace(new RegExp('::data::', 'g'), cleanMbid)
                                    .replace(new RegExp('::playListName::', 'g'), playlistName);

                        html = html
                                .replace(new RegExp('::userid::', 'g'), user.tamaringaId.toString())
                                .replace(new RegExp('::data::', 'g'), mbid);
                    }
                }

                // $('#title').html("Your Music: " + year + ',' + country);
                window.scrollBy(0, 500);
                musicWrapper.html(html);});
        })
    });
})(jQuery);

/** ----------------------------------------------------------------------------------
 * Update or Add the vote number.
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} mbid: Given song mbid
 * @PARAM {Number} n: vote number

 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList , userData}
 ---------------------------------------------------------------------------------- */


function f2(id, mbId, playlistName, score) {
    const rateType = "user";
    let req =  $.post('selection/'+id, {mbId, playlistName, score, rateType});

    req.done(function(){
        alert('Thanks we recived your score')
    })
}

/** ----------------------------------------------------------------------------------
 * Update the entrance times .
 *
 * @PARAM {String*} id: Given user id
 * @PARAM {String} entrance: entrance number.
 *
 * @RESPONSE {json}
 * @RESPONSE-SAMPLE {playList , userData}
 ---------------------------------------------------------------------------------- */
function addEntrance(id, entrance) {

    $.get('/user/' + id, function (data) {

        var enter = entrance;

        if (data.items[0].songs.length == 0) {
            enter = 0;
        }
        if (!data.items) {
            return Error;
        }
        var obj = {
            tamaringaId: id.toString(),
            entrance: enter
        };
        var $form = $(this);
        // //console.log($form);
        var url = $form.attr("action");
        url = "users/" + id.toString();
        var posting = $.post(url, obj);
        //console.log("url: "+url);
        // alert("vote add");
        posting.done(function (data) {
            //     //console.log("data:"+data);
        });
    });
}
