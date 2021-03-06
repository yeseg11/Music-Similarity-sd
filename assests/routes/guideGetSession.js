(function ($) {
    $(document).ready(function () {
        let titleBlock = '<div class="container-contact100">';
        let songBlocks = '';
        let body = '';
        let footerBlock = '';
        let curSession = '';
        let title = '<span class="contact100-form-title-mobile" >';
        title += 'Session Playlist';
        title += '</span>';
        title += '<span style="background:lightgray; font-size: 150%; text-align: center;"\n' + 'class="wrap-contact100-form-btn"><b>Name: ';
        let endTitle = '</b></br><b>Session: </b>';

        let songBlock = '<div class="container-section-space">';
        songBlock += '<div class="container-section">';
        songBlock += '<div style=" text-align: center;">';
        songBlock += '<span class="class=label-input100" style="font-size: 150%">ArtistName';
        songBlock += '<br>SongName</br>';
        songBlock += 'SongYear</br></span></span></br>';
        songBlock += '<span class="class=label-input100" style="font-size: 150%"><b>Rate song:</b></br></span>';
        songBlock += '<button style="font-size: 180%; text-align: center;" class="buttonDes" type="button" onclick="rating(\'::userid::\',\'::data::\',\'::playListName::\',1,\'::rateType::\')" name="verySad" id ="verySad">😟</button>';
        songBlock += '<button style="font-size: 180%; text-align: center;" class="buttonDes" type="button" onclick="rating(\'::userid::\',\'::data::\',\'::playListName::\',2,\'::rateType::\')" name="Sad" id ="Sad">🙁</button>';
        songBlock += '<button style="font-size: 180%; text-align: center;" class="buttonDes" type="button" onclick="rating(\'::userid::\',\'::data::\',\'::playListName::\',3,\'::rateType::\')" name="Indifferent" id ="Indifferent">😐</button>';
        songBlock += '<button style="font-size: 180%; text-align: center;" class="buttonDes" type="button" onclick="rating(\'::userid::\',\'::data::\',\'::playListName::\',4,\'::rateType::\')" name="happy" id ="happy">🙂</button>';
        songBlock += '<button style="font-size: 180%; text-align: center;" class="buttonDes" type="button" onclick="rating(\'::userid::\',\'::data::\',\'::playListName::\',5,\'::rateType::\')" name="Joyful" id ="Joyful">😀</button>';
        songBlock += '</div>';
        songBlock += '<div class="wrap-input100 validate-input" data-validate="Name is required">';
        songBlock += '<input id=\'::songComment::\' class="input100" type="text" name=\'songComment\' placeholder="Song comment">';
        songBlock += '</div>';
        songBlock += '<div class="container-contact100-form-btn">';
        songBlock += '<div class="wrap-contact100-form-btn">';
        songBlock += '<div class="contact100-form-bgbtn"></div>';
        songBlock += '<button type="button" id=\'send\' onclick="postComment(\'::userid::\',\'::mbid::\')" class="contact100-form-btn">';
        songBlock += '<span>';
        songBlock += 'Save';
        songBlock += '<i class="fa m-l-7" aria-hidden="true"></i>';
        songBlock += '</span>';
        songBlock += '</button>';
        songBlock += '</div>';
        songBlock += '</div>';
        songBlock += '</div>';
        songBlock += '</div></br>';

        let emptyBlock = '<div class="container-section-space">';
        emptyBlock += '<div class="container-section">';
        emptyBlock += '<div style=" text-align: center;">';
        emptyBlock += '<span class="class=label-input100" style="font-size: 150%"><b></br></br>No Songs found for this user session!</b></br></br></br></span>';
        emptyBlock += '</div>';
        emptyBlock += '<div class="container-contact100-form-btn">';
        emptyBlock += '<div class="wrap-contact100-form-btn">';
        emptyBlock += '<div class="contact100-form-bgbtn"></div>';;
        emptyBlock += '</div>';
        emptyBlock += '</div>';
        emptyBlock += '</div>';
        emptyBlock += '</div>';

        let commentStart = '<div class="wrap-input100 validate-input">';
        commentStart += '<textarea id=\'startString\' class="input100" style="text-align:right" name="Text1" cols="40" rows="2"  placeholder="מדריך\\מדריכה, אנא מלאו מצב בתחילת המפגש">value</textarea>'
        commentStart += '</div>';
        commentStart += '<div class="container-contact100-form-btn">';
        commentStart += '<div class="wrap-contact100-form-btn">';
        commentStart += '<div class="contact100-form-bgbtn"></div>';
        commentStart += '<button type="button" id=\'startComment\' onclick="postComment(\'::userid::\',\'start\')" class="contact100-form-btn">';
        commentStart += '<span>';
        commentStart += 'Save';
        commentStart += '</span>';
        commentStart += '</button>';
        commentStart += '</div>';
        commentStart += '&nbsp;&nbsp;';
        commentStart += '</div>';


        // FOR GENERAL SESSION RATING AT THE END TOF THE SESSION
        //let footer = '<div class="container-section-space">';
        // footer += '<div class="container-section">';
        // footer += '<div align="center" style="background:lightgray; font-size: 150%; text-align: center;" class="wrap-contact100-form-btn">';
        // footer += '<span style=" text-align: center" class="class=label-input100"><b>General Session Rating</b></br></span>';
        // footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySadGen">😟</button>';
        // footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="SadGen">🙁</button>';
        // footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="like" id ="IndifferentGen">😐</button>';
        // footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happyGen">🙂</button>';
        // footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="JoyfulGen">😀</button>';
        // footer += '</div>';
        // footer += '</br>';

        let footer = '<div class="wrap-input100 validate-input">';
        footer += '<textarea id=\'endString\' class="input100" style="text-align:right" name=\'sessionComment\' cols="40" rows="2" placeholder="מדריך\\מדריכה, אנא מלאו מצב בסוף המפגש">value</textarea>'
        footer += '</div>';
        footer += '<div class="container-contact100-form-btn">';
        footer += '<div class="wrap-contact100-form-btn">';
        footer += '<div class="contact100-form-bgbtn"></div>';
        footer += '<button type="button" id=\'endComment\' onclick="postComment(\'::userid::\',\'end\')" class="contact100-form-btn">';
        footer += '<span>';
        footer += 'שמור';
        footer += '</span>';
        footer += '</button>';
        footer += '</div>';
        footer += '&nbsp;&nbsp;';
        footer += '</div>';

        $('#enterSession').on("click", function (e) {
            $('#guideTitle').remove(); //remove user and session selection before injecting
            $('#mainDiv').remove();
            let sessionHtml = title
                + '\xa0' + selectedData[0].firstName
                + endTitle + sessionDate + '</span>';
            (async function(){
                let currentResearch = sessionAndResearch.split('R')[1];
                let currentSession = sessionAndResearch.split('R')[0];
                let songs = selectedData[0]
                    .researchList[currentResearch]
                    .sessionList[currentSession].songs; //

                if(songs.length === 0) {
                    sessionHtml +=  emptyBlock;
                }
                let startCom = selectedData[0]
                    .researchList[currentResearch]
                    .sessionList[currentSession].guideCommentStart
                let endCom = selectedData[0]
                    .researchList[currentResearch]
                    .sessionList[currentSession].guideCommentEnd
                //
                if(startCom){
                sessionHtml += commentStart.replace(new RegExp('::userid::', 'g'),selectedData.tamID.toString()).replace(new RegExp("value", 'g'),startCom);
                }
                else
                    sessionHtml += commentStart.replace(new RegExp('::userid::', 'g'),selectedData.tamID.toString()).replace(new RegExp("value", 'g'),"");

                for(let r = 0; r < songs.length; r++){
                    const currentMbId = songs[r].mbId;
                    const record = await getRecord(currentMbId);
                    const cleanMbid = currentMbId.replace(/([\/,"+'!?_])/g, "\\$1");
                    const recordArtist = record.items[0].artist[0].name;
                    const recordTitle = record.items[0].title;
                    const recordYear = record.items[0].year;
                    const playlistName = songs[r].playlistName;

                    let newBlock = songBlock
                        .replace("ArtistName", recordArtist)
                        .replace("SongName", recordTitle)
                        .replace("SongYear", recordYear)
                        .replace(new RegExp('::userid::', 'g'),selectedData.tamID.toString()).replace(new RegExp('::mbid::', 'g'),cleanMbid)
                        .replace(new RegExp('::songComment::', 'g'), cleanMbid)
                        .replace(new RegExp('::data::', 'g'), cleanMbid)
                        .replace(new RegExp('::playListName::', 'g'), playlistName)
                        .replace(new RegExp('::userid::', 'g'), selectedData.tamID)
                        .replace(new RegExp('::rateType::', 'g'), currentSession);

                    sessionHtml +=  newBlock;
                }

                if(songs.length !== 0) {
                    if(endCom) {
                        sessionHtml += footer.replace(new RegExp('::userid::', 'g'), selectedData.tamID.toString()).replace(new RegExp("value", 'g'),endCom);
                    }
                    else
                        sessionHtml += footer.replace(new RegExp('::userid::', 'g'),selectedData.tamID.toString()).replace(new RegExp("value", 'g'),"");
                }
                $('#selectedSession').html(sessionHtml).ready(function(){
                    $("html, body").animate({ scrollTop: 0 });
                    //console.log("Session and research are: " + sessionAndResearch);

                });
            })();
        });

        async function getRecord(currentMbId) {
            try{
                return await $.get('/mb/track/record/' + currentMbId, function (data, status) {
                    //if (!data || !data.items || !data.items.length) throw TypeError("ERROR IN FIND LIST");
                    //console.log("data func2 is: " + JSON.stringify(data.items));
                    //console.log("status is: " + status);
                });
            }
            catch(error){
                return null;
            }
        }

    });
})

(jQuery);



function rating(id, mbId, playlistName, score, rateType){
    let req =  $.post('selection/'+id, {mbId, playlistName, score, rateType});

    req.done(function(){
        alert('Thanks we recived your score')
    }).

    alert("Current rating is:" + status);
}

function postComment(id, type) {
    let comment = "";
    if(type === "start"){
        comment += document.getElementById("startString").value;
    }
    else if(type === "end"){
        comment += document.getElementById("endString").value;
    }

    else{
        comment += document.getElementById(type.replace(/([\/,"+'!?_])/g, "\\$1")).value;
    }
    //alert("comment is: " + comment + " type: " + type);
    let req =  $.post('sessionComments/'+id, {type, comment});

    req.done(function(){
        alert('התגובה נשמרה בהצלחה!');
    })
}
