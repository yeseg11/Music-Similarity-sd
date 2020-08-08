(function ($) {
    $(document).ready(function () {

        var templateSahow = "";

        function init() {

            getUsersByResearch().then(function (result1) {
                // console.log("result1: ", result1);
                var templateSahow = '<tbody>';
                for (var i = 0; i < result1.length; i++) {
                    templateSahow += '<tr>';
                    templateSahow += '<td >' + result1[i].name + '</td>';
                    templateSahow += '<td >' + result1[i].tamaringaId + '</td>'; //'<th>::ResearchId:::</th>';
                    templateSahow += '<td >' + result1[i].nursingHome + '</td>'; //'<th>::NursingHome:::</th>';
                    templateSahow += '<td >' + result1[i].department + '</td>'; //'<th>::Department:::</th>';
                    templateSahow += '<td >' + result1[i].birthYear + '</td>'; //'<th>::NumberOfWeeks:::</th>';
                    templateSahow += '<td >' + result1[i].yearAtTwenty + '</td>'; //'<th>::MeetingPerWeek:::</th>';
                    templateSahow += '<td >' + result1[i].countryAtTwenty + '</td>'; //'<th>::Length of session:::</th>';
                    templateSahow += '<td >' + result1[i].countryOrigin + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].languageOrigin + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].languageAtTwenty + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].yearOfImmigration + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].Genre1Select + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].Genre2Select + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].entrance + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td >' + result1[i].group + '</td>'; //'<th>::algorithm:::</th>';
                    templateSahow += '<td>'+ '<button id="showPrivateId" onclick="showPrivateId(\':::userId:::\')" style="color: blue">' + '<b> Press Here </b></button></td>';
                    templateSahow += '<td>'+ '<button id="showPrivateId" onclick="showPrivateId(\':::userId:::\')" style="color: blue">' + '<b> Delete </b></button></td>';

                    templateSahow += '</tr>';
                    templateSahow = templateSahow.replace(':::userId:::', result1[i].tamaringaId);
                }
                templateSahow += '</tbody>';
                html += templateSahow
                tableWrapper.html(html);
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getUsersByResearch() {
            return new Promise(function (resolve, reject) {
                var usersList = [];
                var researchId = localStorage["ResearchId"];
                // console.log("ResearchGroupId",ResearchGroupId);
                $.get('/userByResearch/' + researchId.toString(), function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    // console.log("data", data);
                    let usersList = data.items;
                    resolve(usersList);
                })
            });
        }


        init();


        var tableWrapper = $('#tableWrapper');

        var html = '<thead><tr>';
        html += '<th>User name</th>';
        html += '<th>Tamaringa Id</th>';
        html += '<th>Nursing Home</th>\n';
        html += '<th>Department</th>\n';
        html += '<th>Birth Year</th>\n';
        html += '<th>Year At Twenty</th>\n';
        html += '<th>Country At Twenty</th>\n';
        html += '<th>Origin Country</th>\n';
        html += '<th>Origin language</th>\n';
        html += '<th>Language At Twenty</th>\n';
        html += '<th>Year Of Immigration</th>\n';
        html += '<th>Genre1</th>\n';
        html += '<th>Genre2</th>\n';
        html += '<th>Entrance</th>\n';
        html += '<th>Group</th>\n';
        html += '<th>Private Id</th>\n';
        html += '<th>Delete User</th>\n';
        html += '\n';
        html += '\n';
        html += '</tr></thead>';


        html += templateSahow
        // html += experienceShow.replace('::videoId::', videoId).replace('::name::', title + ' - ' + artist).replace('::link::',videoId).replace('::userid::',id.val().toString()).replace('::data::',mbid);
        // html = html.replace(new RegExp ('::userid::','g'),id.val().toString()).replace(new RegExp('::data::','g'),mbid).replace('::ent::',entrance.toString());

        tableWrapper.html(html);


        $('#send').on("click", function (e) {

        });
    });
})(jQuery);

function showPrivateId(tamaringaId){
    console.log(tamaringaId);

    $.get('/privateUser/' + tamaringaId.toString(), function (data) {
        if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
        alert("The Private Id is: " + data.items);
    })

    // var pathname = "/usersList"
    // window.location.replace(pathname);
}
