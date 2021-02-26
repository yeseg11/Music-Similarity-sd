(function ($) {
    $(document).ready(function () {
        let titleBlock = '';
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
        songBlock += '<div>';
        songBlock += '<span style=" text-align: center" class="class=label-input100"><b>ArtistName</b>';
        songBlock += '<br><b>SongName</b></br></span></br>';
        songBlock += '<span class="class=label-input100">Rate song:</br></span>';
        songBlock += '<button style="font-size: 115%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySad">😟</button>';
        songBlock += '<button style="font-size: 115%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="Sad">🙁</button>';
        songBlock += '<button style="font-size: 115%; text-align: center;" class="buttonDes" type="button" onclick="" name="Indifferent" id ="Indifferent">😐</button>';
        songBlock += '<button style="font-size: 115%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happy">😀</button>';
        songBlock += '<button style="font-size: 115%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="Joyful">😆</button>';
        songBlock += '</div>';
        songBlock += '<div class="wrap-input100 validate-input" data-validate="Name is required">';
        songBlock += '<input id=\'songComment\' class="input100" type="text" name=\'songComment\' placeholder="Song comment">';
        songBlock += '</div>';
        songBlock += '<div class="container-contact100-form-btn">';
        songBlock += '<div class="wrap-contact100-form-btn">';
        songBlock += '<div class="contact100-form-bgbtn"></div>';
        songBlock += '<button type="button" id=\'send\' class="contact100-form-btn">';
        songBlock += '<span>';
        songBlock += 'Save';
        songBlock += '<i class="fa m-l-7" aria-hidden="true"></i>';
        songBlock += '</span>';
        songBlock += '</button>';
        songBlock += '</div>';
        songBlock += '</div>';
        songBlock += '</div>';
        songBlock += '</div>';

        // FOR GENERAL SESSION RATING AT THE END TOF THE SESSION
        let footer = '<div class="container-section-space">';
        footer += '<div class="container-section">';
        footer += '<div align="center" style="background:lightgray; font-size: 150%; text-align: center;" class="wrap-contact100-form-btn">';
        footer += '<span style=" text-align: center" class="class=label-input100"><b>General Session Rating</b></br></span>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySadGen">😟</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="SadGen">🙁</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="like" id ="IndifferentGen">😐</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happyGen">😀</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="JoyfulGen">😆</button>';
        footer += '</div>';
        footer += '</br>';
        footer += '<div class="wrap-input100 validate-input" data-validate="Name is required">';
        footer += '<input id=\'songComment3\' class="input100" type="text" name=\'sessionComment\' placeholder="Session comment">';
        footer += '</div>';
        footer += '<div class="container-contact100-form-btn">';
        footer += '<div class="wrap-contact100-form-btn">';
        footer += '<div class="contact100-form-bgbtn"></div>';
        footer += '<button type="button" id=\'send3\' class="contact100-form-btn">';
        footer += '<span>';
        footer += 'Save';
        footer += '</span>';
        footer += '</button>';
        footer += '</div>';
        footer += '</div>';
        footer += '</div>';
        footer += '</div>';
        footer += '<div class="container-contact100-back-btn">';
        footer += '<div class="wrap-contact100-back-btn">';

        footer += '</div>';


        // function getRecord(testmbId) {
        //     return new Promise(function (resolve, reject) {
        //         //console.log("tamID is: " + tamId);
        //         $.get('/mb/track/record/' + testmbId , function (data) {
        //             console.log("data is: " + JSON.stringify(data.items));
        //             if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST")); //do i need it if i
        //             //console.log("data is" + data[0] + "data.items is:" + data.items);
        //
        //             resolve(data.items);
        //
        //         });
        //     });
        // }


        //needs to be reviewed!!!
        async function getRecord2(testmbId) {
                try{
                    return await $.get('/mb/track/record/' + testmbId , function (data) {
                        console.log("data func2 is: " + JSON.stringify(data.items));
                        //console.log("data is" + data[0] + "data.items is:" + data.items);
                    });
                }
                catch(error){
                    return null;
                }
        }



        $('#enterSession').on("click", function (e) {
            let currentResearch = sessionAndResearch.split('R')[1];
            let currentSession = sessionAndResearch.split('R')[0];
            let songs = selectedData[0]
                .researchList[currentResearch]
                .sessionList[currentSession].songs;

            // getting mbId from a session
            //let selectedSession = selectedData[0]
            //                 .researchList[currentResearch]
            //                 .sessionList[currentSession].songs[0].mbId;

            let testmbId = "6f6e5761-9b5a-47fd-9479-8c97ff732410";

            (async function(){
                let record = await getRecord2(testmbId);
                console.log(record);

                let recordArtist = record.items[0].artist[0].name;
                let recordTitle = record.items[0].title;

                console.log("artists = " + recordArtist);
                console.log("title = " + recordTitle);


                let newBlock = songBlock
                    .replace("ArtistName", recordArtist)
                    .replace("SongName", recordTitle);


                console.log("session number is:" + currentSession + ", Research number is: " + currentResearch);

                let sessionHtml = title
                    + '\xa0' + selectedData[0].firstName
                    + endTitle + sessionDate + '</span>'
                    + newBlock;

                //loop over songs here
                // for(let r = 0; r < songs.length; r++){
                //     const mbid = songs[r].mbId;
                //     const artist = '';
                //     const songTitle = '';
                // }


                sessionHtml += footer;
                $('#guideTitle').remove(); //remove user and session selection before injecting
                $('#mainDiv').remove();


                $('#selectedSession').html(sessionHtml).ready(function(){
                    $("html, body").animate({ scrollTop: 0 });
                    //console.log("Session and research are: " + sessionAndResearch);

                });

            })();


        });

    });
})(jQuery);

