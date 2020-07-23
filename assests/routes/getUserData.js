(function($) {
    $(document).ready(function() {
        const SONGSDISPLAYED = 10;
        var musicWrapper = $('#musicWrapper');
        /**
         *  @NAME template,experienceShow: add the video and the vote buttons to screen (HTML)
         *
         *
         */
        var template  = '<div class="wrap-input100 input100-select">';
        template += '<span id="::videoId:::" class="label-input100"></span>';
        template += '<div id="demo"></div>';
        template += '<span class="focus-input100">::name::</span>';
        template += '<iframe width="560" height="315" src="http://www.youtube.com/embed/::link::"></iframe>';
        template += '<div id = "buttons">';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',1)" name="like" id ="like"><img src="../images/btn/1.png" name="like"/></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',2)" name="like" id ="like"><img src="../images/btn/2.png" name="like"/></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',3)" name="like" id ="like"><img src="../images/btn/3.png" name="like"/></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',4)" name="like" id ="like"><img src="../images/btn/4.png" name="like"/></button>';
        template += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',5)" name="like" id ="like"><img src="../images/btn/5.png" name="like"/></button>';
        template += '';
        template += '</div>';
        template += '</div>';



        var experienceShow  = '<div class="wrap-input100 input100-select">';
        experienceShow += '<span id="::videoId:::" class="label-input100"></span>';
        experienceShow += '<div id="demo"></div>';
        experienceShow += '<span class="focus-input100">::name::</span>';
        experienceShow += '<iframe width="560" height="315" src="http://www.youtube.com/embed/::link::"></iframe>';
        experienceShow += '<div id = "buttons">';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',1)" name="like" id ="like"><img src="../images/btn/1.png" name="like"/></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',2)" name="like" id ="like"><img src="../images/btn/2.png" name="like"/></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',3)" name="like" id ="like"><img src="../images/btn/3.png" name="like"/></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',4)" name="like" id ="like"><img src="../images/btn/4.png" name="like"/></button>';
        experienceShow += '<button class="buttonDes" type="button" onclick="f2(\'::userid::\',\'::data::\',5)" name="like" id ="like"><img src="../images/btn/5.png" name="like"/></button>';
        experienceShow += '';
        experienceShow += '</div>';
        experienceShow += '</div>';


        // onclick="location.href='researches'
        $('#login').on("click", function(e) {
            console.log("LOG - IN Pressed");
            if( $('#id').val().length === 0 || $('#password').val().length === 0)         // use this if you are using id to check
            {
                alert("Insert id and password!");
                return $('#error').text("insert id and password!");
            }
            else{
                var id = $('#id');
                var password = $('#password');
                var encryptedPass = CryptoJS.AES.encrypt(password.val(),'Password');
            }
            $.get('/user/' + id.val().toString()+'/'+encryptedPass, function(data) {
                console.log("LOG - IN ");
                if(!data || !data.items || !data.items.length) return musicWrapper.html('<h3>Please rephrase search</h3>');
                var entrance = data.items[0].entrance;
                if (entrance === 0) //first time
                {
                    entrance++;
                    addEnterens(id.val().toString(),entrance);
                    var year = data.items[0].yearAtTwenty;
                    var country = data.items[0].countryAtTwenty;
                    musicWrapper.html('<h3><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading</h3>');
                    var playListName = data.items[0].group.toString();

                    console.log(data.items[0]);
                    $.get('/playList/' + playListName, function(data) {
                        //console.log(data.items[0].records.length);
                        //return;
                        if(!data || !data.items || !data.items.length || !data.items[0] || data.items[0].records.length < 1 ) return musicWrapper.html('<h3>Please rephrase search</h3>');
                        var rec = data.items[0].records; // build the playlist and check don't have double songs.
                        var html = '';
                        var playarr =[];
                        var i,j = 0;
                        var flag1,flag2 = true;
                        var s =  SONGSDISPLAYED;
                        for (i=0 ;i < s ; i++ ){
                            flag2 = true;
                            while (flag2){
                                flag1 = true;
                                var k = Math.floor((Math.random() * Object.keys(rec).length));
                                //console.log(k);
                                for (j = 0 ; j < i;j++)
                                {
                                    if(playarr[j] === k){
                                        flag1 = false;
                                    }
                                }
                                if(flag1)
                                {
                                    playarr[i]=k;
                                    flag2 = false;
                                }
                            }
                        }
                        //console.log("playarr ",playarr);
                        for (i = 0; i < playarr.length; i++) {  //show the playlist songs .
                            var place = playarr[i];
                            var item = rec[place];
                            // console.log("item:",item);
                            var mbid = (item && item.mbId) ? item.mbId : '';
                            var videoId = (item && item.youtube && item.youtube.videoId) ? item.youtube.videoId : '';
                            var title = (item && item.title)? item.title: '';
                            var artist = (item && item.artistName )? item.artistName : '';
                            html += template.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
                            html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid);
                        }
                        $('#title').html("Your Music: "+ year + ',' + country);
                        window.scrollBy(0, 500);
                        musicWrapper.html(html);
                        addEnterens(id.val().toString(),1);
                    });
                }
                else {
                    entrance++;
                    addEnterens(id.val().toString(),entrance);
                    console.log("data.items[0]",data.items[0]);
                    var year2 = data.items[0].yearAtTwenty;
                    var country2 = data.items[0].countryAtTwenty;
                    //console.log(entrance);
                    musicWrapper.html('<h3><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>Loading</h3>');
                    var playListName = data.items[0].group.toString();
                    //var topUser= [];
                    $.get('/playList/' + playListName+"/"+id.val().toString(), function(data) {

                        //console.log("top :"+data.items[0].index+" "+data.items[0].vote+" "+data.items[0].mbid);
                        //console.log(data.items[0]);
                        var html = '';
                        var UserSize = 4;
                        var recSize = 4;
                        var notEarSize = 2;
                        //console.log(data.items[0].notEar.length);
                        if (data.items[0].topUser.length < UserSize )
                        {
                            notEarSize += UserSize - data.items[0].topUser.length;
                            UserSize = data.items[0].topUser.length;
                        }
                        if (!data.items[0].recSongs){
                            //console.log("h1");
                            recSize = 0;
                            notEarSize += 4;
                        }
                        else if (data.items[0].recSongs.length < recSize )
                        {
                            //console.log(data.items[0].recSongs);
                            recSize = data.items[0].recSongs.length;
                        }
                        if (!data.items[0].notEar ){
                            notEarSize = 0;
                            UserSize+=2;
                        }
                        else if (data.items[0].notEar.length < notEarSize )
                        {
                            notEarSize = data.items[0].notEar.length;
                            UserSize += SONGSDISPLAYED -(UserSize + recSize + notEarSize);
                        }
                       // console.log("a: ",UserSize,recSize,notEarSize);


                        var topUser = [];
                        for(var i = 0 ; i < UserSize ; i++) //get the top of the user songs
                        {
                            topUser.push(data.items[0].topUser[i]);
                            // var item = data.items[0].topUser[i];
                            // var mbid = (item && item.mbid) ? item.mbid : '';
                            // var videoId = (item && item.videoId) ? item.videoId : '';
                            // //console.log(videoId);
                            // var title = (item && item.title)? item.title: '';
                            // var artist = (item && item.artist && item.artist)? item.artist : '';
                            // html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
                            // html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid);
                            // $('#title').html("Your Music: "+year + ',' + country);
                        }

                        for(var i = 0 ; i < recSize ; i++)      //find the best songs from the recommended user and check double songs
                        {
                            var item = data.items[0].recSongs[i];
                            //console.log(item.index);
                            var ind = parseInt(item.index);
                            var flag = false;
                            for (var j = 0 ; j < topUser.length ; j++)
                            {
                                if (topUser[j].index == ind){
                                    //var item = data.items[0].recSongs[i];
                                    //console.log(item);
                                    //console.log("index: "+ topUser[j].index + " ind: "+ind);
                                    flag = true;
                                    recSize++;
                                }
                            }
                            if (!flag){
                                var item = data.items[0].recSongs[i];
                                topUser.push(item);
                                // var mbid = (item && item.mbid) ? item.mbid : '';
                                // var videoId = (item && item.videoId) ? item.videoId : '';
                                // //console.log(videoId);
                                // var title = (item && item.title)? item.title: '';
                                // var artist = (item && item.artist && item.artist)? item.artist : '';
                                // html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
                                // html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid);
                            }
                        }

                        //console.log(notEarSize);


                        for(var i = 0 ; i < notEarSize ; i++) //add the Not Ear songs in playlist of the user .
                        {
                            var item = data.items[0].notEar[i];
                            //console.log(item);
                            var ind = item.index;
                            var flag = false;
                            for (var j = 0 ; j < topUser.length ; j++)
                            {
                                if (topUser[j].index == ind){
                                    //var item = data.items[0].recSongs[i];
                                    //console.log(item);
                                    //console.log("index: "+ topUser[j].index + " ind: "+ind);
                                    flag = true;
                                    recSize++;
                                }
                            }
                            if (!flag){
                                var item = data.items[0].notEar[i];
                                topUser.push(item);
                                // var mbid = (item && item.mbid) ? item.mbid : '';
                                // var videoId = (item && item.videoId) ? item.videoId : '';
                                // //console.log(videoId);
                                // var title = (item && item.title)? item.title: '';
                                // var artist = (item && item.artist && item.artist)? item.artist : '';
                                // html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
                                // html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid);
                            }
                        }
                        //console.log(entrance);
                        for (var i = 0 ; i < topUser.length ; i ++)
                        {
                            var item = topUser[i];
                            //console.log(item);
                            var mbid = (item && item.mbid) ? item.mbid : '';
                            var videoId = (item && item.videoId) ? item.videoId : '';
                            //console.log(videoId);
                            var title = (item && item.title)? item.title: '';
                            var artist = (item && item.artist && item.artist)? item.artist : '';
                            html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
                            html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid).replace('::ent::',entrance.toString());
                            $('#title').html("Your Music: "+year2 + ',' + country2);
                        }

                        window.scrollBy(0, 500);
                        musicWrapper.html(html);

                        //console.log("top user: "+topUser);
                    });

                }
            });
        });


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


function f2(id,mbid,n) {
    $.get('/user/' + id.toString(), function(data) {

        if (n <=0 || !n || n>5)
            n = 0;
        if (!data.items ){
            return Error;
        }

        var obj =  {
            tamaringaId: id.toString(),
            group:data.items[0].group,
            songs: JSON.stringify({
                id: id.toString(),
                mbid: mbid,
                vote: n
            })
        };
        var $form = $( this );
        //console.log($form);
        var url = $form.attr("action");
        url= "selection/"+id.toString();
        var posting = $.post(url,obj);
        //console.log("url: "+url);
        alert("vote add");
        posting.done(function(data) {
            //console.log("data:"+data);
        });
    });
    $.get('/user/' + id.toString(), function(data) {
        // console.log(data.items[0].enterens);
        if (data.items[0].entrance === 0){
            addEnterens(data.items[0].tamaringaId,1);
        }

    });

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
function addEnterens(id,entrance) {

    $.get('/user/' + id, function(data) {

        var enter = entrance;

        if (data.items[0].songs.length == 0 )
        {
            enter = 0;
        }
        if (!data.items ){
            return Error;
        }
        var obj =  {
            tamaringaId: id.toString(),
            entrance: enter
        };
        var $form = $( this );
        // //console.log($form);
        var url = $form.attr("action");
        url= "users/"+id.toString();
        var posting = $.post(url,obj);
        //console.log("url: "+url);
        // alert("vote add");
         posting.done(function(data) {
        //     //console.log("data:"+data);
         });
    });
}
