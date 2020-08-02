(function ($) {
    $(document).ready(function () {

        var templateSahow = "";

        function init() {

            getResearchers().then(function (result1) {
                console.log("result1: ",result1[0].researchersIds);
                var templateSahow  = '';
                for (var i = 0; i < result1.length; i++) {
                    if (result1[i].researchersIds.length > 1){
                        // for (var j = 0; j < result1[i].researchersIds.length; j++) {
                        //     templateSahow += '<tr>';
                        //     templateSahow += '<th >'+result1[i].researchName+'</th>';
                        //     templateSahow += '<th >'+result1[i].researchId+'</th>'; //'<th>::ResearchId:::</th>';
                        //     templateSahow += '<th >'+result1[i].nursingHome+'</th>'; //'<th>::NursingHome:::</th>';
                        //     templateSahow += '<th >'+result1[i].department+'</th>'; //'<th>::Department:::</th>';
                        //     templateSahow += '<th >'+result1[i].numberOfWeeks+'</th>'; //'<th>::NumberOfWeeks:::</th>';
                        //     templateSahow += '<th >'+result1[i].meetingPerWeek+'</th>'; //'<th>::MeetingPerWeek:::</th>';
                        //     templateSahow += '<th >'+result1[i].lengthOfSession+'</th>'; //'<th>::Length of session:::</th>';
                        //     templateSahow += '<th >'+result1[i].alguritem+'</th>'; //'<th>::Algoritem:::</th>';
                        //     templateSahow += /*'<th >'+result1[0].researchName+'</th>';*/ '<th><button style="color: blue"><b> Press Here </b></button></th>';
                        //     templateSahow += '</tr>';
                        // }
                    }
                    else {
                        templateSahow += '<tr>';
                        templateSahow += '<th >'+result1[i].researchName+'</th>';
                        templateSahow += '<th >'+result1[i].researchId+'</th>'; //'<th>::ResearchId:::</th>';
                        templateSahow += '<th >'+result1[i].nursingHome+'</th>'; //'<th>::NursingHome:::</th>';
                        templateSahow += '<th >'+result1[i].department+'</th>'; //'<th>::Department:::</th>';
                        templateSahow += '<th >'+result1[i].numberOfWeeks+'</th>'; //'<th>::NumberOfWeeks:::</th>';
                        templateSahow += '<th >'+result1[i].meetingPerWeek+'</th>'; //'<th>::MeetingPerWeek:::</th>';
                        templateSahow += '<th >'+result1[i].lengthOfSession+'</th>'; //'<th>::Length of session:::</th>';
                        templateSahow += '<th >'+result1[i].alguritem+'</th>'; //'<th>::Algoritem:::</th>';
                        templateSahow += /*'<th >'+result1[0].researchName+'</th>';*/ '<th><button style="color: blue"><b> Press Here </b></button></th>';
                        templateSahow += '</tr>';
                    }

                    // templateSahow+=("<option value='" + result1[i].researcherId + "'>" + result1[i].researcherName + "</option>");


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


