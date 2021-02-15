(function ($) {
    $(document).ready(function () {
        let titleBlock = $('#titleBlock');
        let songBlocks = $('#songBlocks');
        let body = $('#songBlock');
        let footerBlock = $('#footerBlock');

        let header = '<span class="contact100-form-title">';
        header += 'Session Playlist';
        header += '</span>';
        header += '<span style="background:lightgray; font-size: 150%; text-align: center;"\n' + 'class="wrap-contact100-form-btn"><b>Name: </b>Israel Israeli&emsp;&emsp;&emsp;<b>Session: </b> 12/01/2021</span>\n'

        let songBlock = '<div class="container-section-space">';
        songBlock += '<div class="container-section">';
        songBlock += '<div>';
        songBlock += '<span style=" text-align: center" class="class=label-input100"><b>Artist Name - Song name</b></br></span>';
        songBlock += '<span class="class=label-input100">Rate song</span>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="Joyful">😆</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happy">😀</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Indifferent" id ="Indifferent">😐</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="Sad">🙁</button>';
        songBlock += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySad">😟</button>';
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
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Joyful" id ="Joyful3">😆</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="happy" id ="happy3">😀</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="like" id ="Angry3">😐</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="Sad" id ="Sad3">🙁</button>';
        footer += '<button style="font-size: 200%; text-align: center;" class="buttonDes" type="button" onclick="" name="verySad" id ="verySad3">😟</button>';
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
        footer += '<div class="contact100-back-bgbtn"></div>';
        footer += '<button id=\'main\' type=\'button\' class="contact100-back-btn" onclick="location.href=\'/guideMainPage\'">';
        footer += '<i class="fa fa-arrow-left m-l-7" aria-hidden="true"></i>';
        footer += '</button>';
        footer += '</div>';
        footer += '</div>';


        //injection function here...

    });
})(jQuery);

