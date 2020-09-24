(function ($) {
    $(document).ready(function () {

        var titleElem = $('#title');
        titleElem.append("<span>" + " " + localStorage["PlaylistName"] + "</span>")

        var templateSahow = "";

        function init() {

            getRecords().then(function (result1) {
                console.log("result1: ",result1);
                // console.log(result1.length);
                var templateSahow  = '';
                for (var i = 0; i < result1.length; i++) {
                    templateSahow += '<tr>';
                    templateSahow += '<td >'+result1[i].title+'</td>';
                    templateSahow += '<td >'+result1[i].artistName+'</td>'; //'<th>::ResearchId:::</th>';
                    templateSahow += '<td >'+result1[i].country+'</td>'; //'<th>::NursingHome:::</th>';
                    templateSahow += '<td >'+result1[i].year+'</td>'; //'<th>::Department:::</th>';
                    templateSahow += '<td >'+result1[i].language+'</td>'; //'<th>::NumberOfWeeks:::</th>';
                    templateSahow += '<td >'+result1[i].mbId+'</td>'; //'<th>::MeetingPerWeek:::</th>';
                    templateSahow += '<td >'+result1[i].youtube.videoId+'</td>'; //'<th>::Length of session:::</th>';
                    templateSahow += '<td >'+result1[i].genre+'</td>'; //'<th>::algorithm:::</th>';
                    // <button class="buttonDes" type="button" onclick="f2('::userid::','::data::',4)" name="like" id ="like">
                    // templateSahow += '<td>'+ '<button id="showUsers" onclick="saveClickedResearch(\':::researchId:::\')" style="color: blue">' + '<b> Press Here </b></button></td>';
                    templateSahow += '</tr>';
                    templateSahow = templateSahow.replace(':::researchId:::', result1[i].researchId);
                }
                html += templateSahow
                tableWrapper.html(html);
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getRecords() {
            return new Promise(function (resolve, reject) {
                var recordsList = [];
                var playlistName = localStorage["PlaylistName"]
                // console.log("ResearchGroupId",ResearchGroupId);
                $.get('/playlistRecords/' + playlistName.toString(), function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    // console.log("data",data);
                    recordsList = data.items[0].records
                    resolve(recordsList);
                })
            });
        }


        init();

        var tableWrapper = $('#tableWrapper');

        var html = '<tr style="font-weight: bold;">' ;
        html +='<th style="font-weight: bold;">Record Title</th>\n' ;
        html +='<th>Artist</th>\n' ;
        html +='<th>Country</th>\n' ;
        html +='<th>Year</th>\n' ;
        html +='<th>Language</th>\n' ;
        html +='<th>mbId</th>\n' ;
        html +='<th>Youtube Id</th>\n' ;
        html +='<th>Genre</th>\n' ;
        html +='\n' ;
        html +='\n' ;
        html +='</tr>' ;

        html += templateSahow
        tableWrapper.html(html);

    });

})(jQuery);



