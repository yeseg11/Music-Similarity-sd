(function($) {
    $(document).ready(function() {

        // var countries = $('#countySel');
        // $.each(Object.keys(isoCountries), function(i, item) {
        //     console.log(item, isoCountries[item])
        //     countries.append($('<option>', {
        //         value: isoCountries[item],
        //         text: item
        //     }));
        // });

        var musicWrapper = $('#musicWrapper');

        var template  = '<div class="wrap-input100 input100-select">';
            template += '<span id="::videoId:::" class="label-input100"></span>';
            template += '<div id="demo"></div>';
            template += '<span class="focus-input100">::name::</span>';
            template += '<iframe width="560" height="315" src="http://www.youtube.com/embed/::link::"></iframe>';
            template += '</div>';


        $('#send').on("click", function(e) {
            if( $('#age').length && $('#countySel').length )         // use this if you are using id to check
            {
                var age = $('#age'),
                    country = $('#countySel');
            }
            else{
                return $('#error').text("insert age or select country");
            }
            //console.log(country.val());
                if (!age.val() || age.val() == null || parseInt(age.val()) <30 || parseInt(age.val()) > 120 || country.val() === "Select Country"){
                    console.log('Error');

                    return $('#error').text("insert age or age bigger then 30 or select country");
                }





            var yearTwenty = (new Date()).getFullYear() - parseInt(age.val()) + 20;
            console.log(yearTwenty);
                if (!yearTwenty){
                    console.log("error");
                    $('#error').text("the year not calculate ");
                    return ;
                }


            musicWrapper.html('<h3><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading</h3>');
            $.get('/mb/track/recording/' + yearTwenty + '/' + country.val(), function(data) {
               console.log(data.items);
                if(!data || !data.items || !data.items.length) return musicWrapper.html('<h3>Please rephrase search</h3>');
                var html = '';
                for (var i = 0; i < 10; i++) {
                    var rec = data.items[i];
                    // mbid = rec.mbid;
                    var videoId = (rec && rec.youtube && rec.youtube.videoId) ? rec.youtube.videoId : '';
                    //console.log(videoId);
                    var title = (rec && rec.title)? rec.title: '';
                    var artist = (rec && rec.artist && rec.artist[0] && rec.artist[0].name)? rec.artist[0].name : '';

                    html += template.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId);
                }

                $('#title').html("Your Music: "+yearTwenty + ',' + country.val());
                //console.log(data);
                musicWrapper.html(html);
            })



        })
    });
})(jQuery);