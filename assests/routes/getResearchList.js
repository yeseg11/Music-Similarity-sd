(function ($) {
    $(document).ready(function () {

        var templateSahow = "";

        function init() {

            getResearchers().then(function (result1) {
                console.log("result1: ",result1);
                for (var i = 0; i < result1.length; i++) {
                    // templateSahow+=("<option value='" + result1[i].researcherId + "'>" + result1[i].researcherName + "</option>");

                    var templateSahow  = '<tr>';
                    templateSahow += '<th>::ResearchName:::</th>';
                    templateSahow += '<th>::ResearchId:::</th>';
                    templateSahow += '<th>::NursingHome:::</th>';
                    templateSahow += '<th>::Department:::</th>';
                    templateSahow += '<th>::NumberOfWeeks:::</th>';
                    templateSahow += '<th>::MeetingPerWeek:::</th>';
                    templateSahow += '<th>::Length of session:::</th>';
                    templateSahow += '<th>::Algoritem:::</th>';
                    templateSahow += '<th><button style="color: blue"><b> Press Here </b></button></th>';
                    templateSahow += '</tr>';

                }
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getResearchers() {
            return new Promise(function (resolve, reject) {
                var researchersList = [];
                var ResearchGroupId = localStorage["ResearchGroupId"];
                console.log("ResearchGroupId",ResearchGroupId);
                $.get('/allresearches/'+ResearchGroupId.toString(), function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));

                    // researchersList = data.items
                    // resolve(researchersList);
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


