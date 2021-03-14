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
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="rating(this.name)" name="verySad" id ="verySad">😟</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="rating(this.name)" name="Sad" id ="Sad">🙁</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="rating(this.name)" name="Indifferent" id ="Indifferent">😐</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="rating(this.name)" name="happy" id ="happy">🙂</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="rating(this.name)" name="Joyful" id ="Joyful">😀</button>';
        songBlock += '</div>';
        songBlock += '<div class="wrap-input100 validate-input" data-validate="Name is required">';
        songBlock += '<input id=\'songComment\' class="input100" type="text" name=\'songComment\' placeholder="Song comment">';
        songBlock += '</div>';
        songBlock += '<div class="container-contact100-form-btn">';
        songBlock += '<div class="wrap-contact100-form-btn">';
        songBlock += '<div class="contact100-form-bgbtn"></div>';
        songBlock += '<button type="button" id=\'send\' onclick="CommentFunc" class="contact100-form-btn">';
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




        // FOR GENERAL SESSION RATING AT THE END TOF THE SESSION
        let footer = '<div class="container-section-space">';
        footer += '<div class="container-section">';
        footer += '<div align="center" style="background:lightgray; font-size: 150%; text-align: center;" class="wrap-contact100-form-btn">';
        footer += '<span style=" text-align: center" class="class=label-input100"><b>General Session Rating</b></br></span>';
        footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySadGen">😟</button>';
        footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="SadGen">🙁</button>';
        footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="like" id ="IndifferentGen">😐</button>';
        footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happyGen">🙂</button>';
        footer += '<button style="font-size: 135%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="JoyfulGen">😀</button>';
        footer += '</div>';
        footer += '</br>';
        footer += '<div class="wrap-input100 validate-input" data-validate="Name is required">';
        footer += '<input id=\'sessionComment\' class="input100" type="text" name=\'sessionComment\' placeholder="Session comment">';
        footer += '</div>';
        footer += '<div class="container-contact100-form-btn">';
        footer += '<div class="wrap-contact100-form-btn">';
        footer += '<div class="contact100-form-bgbtn"></div>';
        footer += '<button type="button" id=\'commentSessionButton\' onclick="commentSession()" class="contact100-form-btn">';
        footer += '<span>';
        footer += 'Save';
        footer += '</span>';
        footer += '</button>';
        footer += '</div>';
        footer += '</div>';
        footer += '</div>';
        //footer += '</div>';
        footer += '<div class="container-contact100-back-btn">';
        footer += '<div class="wrap-contact100-back-btn">';
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
                for(let r = 0; r < songs.length; r++){
                    let currentMbId = songs[r].mbId;
                    let record = await getRecord(currentMbId);
                    let recordArtist = record.items[0].artist[0].name;
                    let recordTitle = record.items[0].title;
                    let recordYear = record.items[0].year;
                    let commentWithIndex = "songComment" + r;


                    let newBlock = songBlock
                        .replace("ArtistName", recordArtist)
                        .replace("SongName", recordTitle)
                        .replace("SongYear", recordYear)
                        .replace("songComment", commentWithIndex)
                        .replace("CommentFunc", "commentSong(" + r + ")");


                    sessionHtml +=  newBlock;


                    // console.log("loop: currentMbId: " + currentMbId1);
                    // console.log("record1 is:" + record1.items[0]);
                    // console.log(record);
                    // console.log("artists = " + recordArtist);
                    // console.log("title = " + recordTitle);
                    // console.log("artists = " + recordArtist1);
                    // console.log("title = " + recordTitle1);

                }

                if(songs.length !== 0) {
                    sessionHtml += footer;
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
                    console.log("data func2 is: " + JSON.stringify(data.items));
                    console.log("status is: " + status);
                });
            }
            catch(error){
                return null;
            }
        }






    });
})

(jQuery);

function commentSong(index) {

    let commentID = "songComment" + index;
    let inputValue = "";
    inputValue += document.getElementById(commentID).value;

    //call post here...
    alert("Current song comment is:" + inputValue);
}

function commentSession() {
    let SessionInputValue = "";
    SessionInputValue += document.getElementById("sessionComment").value;

    //call post here...
    alert("Current session comment is:" + SessionInputValue);
}

function rating(status){

    //call post here...
    alert("Current rating is:" + status);
}