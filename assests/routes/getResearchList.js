(function ($) {
    $(document).ready(function () {

        var templateSahow = "";

        function init() {

            getResearchers().then(function (result1) {
                console.log("result1: ",result1);
                console.log(result1.length);
                var templateSahow  = '';
                for (var i = 0; i < result1.length; i++) {
                    templateSahow += '<tr>';
                    templateSahow += '<td >'+result1[i].researchName+'</td>';
                    templateSahow += '<td >'+result1[i].researchId+'</td>'; //'<th>::ResearchId:::</th>';
                    templateSahow += '<td >'+result1[i].nursingHome+'</td>'; //'<th>::NursingHome:::</th>';
                    templateSahow += '<td >'+result1[i].department+'</td>'; //'<th>::Department:::</th>';
                    templateSahow += '<td >'+result1[i].numberOfWeeks+'</td>'; //'<th>::NumberOfWeeks:::</th>';
                    templateSahow += '<td >'+result1[i].meetingPerWeek+'</td>'; //'<th>::MeetingPerWeek:::</th>';
                    templateSahow += '<td >'+result1[i].lengthOfSession+'</td>'; //'<th>::Length of session:::</th>';
                    templateSahow += '<td >'+result1[i].algorithm+'</td>'; //'<th>::algorithm:::</th>';
                    // <button class="buttonDes" type="button" onclick="f2('::userid::','::data::',4)" name="like" id ="like">
                    templateSahow += '<td>'+ '<button id="showUsers" onclick="saveClickedResearch(\':::researchId:::\')" style="color: blue">' + '<b> Press Here </b></button></td>';
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

        function getResearchers() {
            return new Promise(function (resolve, reject) {
                var researchersList = [];
                var ResearchGroupId = localStorage["ResearchGroupId"];
                // console.log("ResearchGroupId",ResearchGroupId);
                $.get('/allresearches/'+ResearchGroupId.toString(), function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    console.log("data",data);
                    researchersList = data.items
                    resolve(researchersList);
                })
            });
        }



        init();



        var tableWrapper = $('#tableWrapper');

        var html = '<tr style="font-weight: bold;">' ;
        html +='<th style="font-weight: bold;">Research Name</th>\n' ;
        html +='<th>Research Id</th>\n' ;
        html +='<th>Nursing Home</th>\n' ;
        html +='<th>Department</th>\n' ;
        html +='<th>Number of weeks</th>\n' ;
        html +='<th>Meeting per week</th>\n' ;
        html +='<th>Length of session</th>\n' ;
        html +='<th>Algoritem</th>\n' ;
        html +='<th>Patients</th>\n' ;
        html +='\n' ;
        html +='\n' ;
        html +='</tr>' ;







        html += templateSahow
        // html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
        // html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid).replace('::ent::',entrance.toString());

        tableWrapper.html(html);



        $('#send').on("click", function (e) {

        });
    });
})(jQuery);


function saveClickedResearch(Id){
    console.log(Id);
    localStorage["ResearchId"] = Id;
    console.log(localStorage["ResearchId"]);
    var pathname = "/usersList"
    window.location.replace(pathname);
}
