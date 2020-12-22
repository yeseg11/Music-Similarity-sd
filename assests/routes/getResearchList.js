(function ($) {
    $(document).ready(function () {

        var templateSahow = "";

        function init() {

            getResearchers().then(function (result1) {
                // console.log("result1: ",result1);
                // console.log(result1.length);
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



        $('#dwn-btn').on("click", function (e) {
            console.log("clicked");
            $.get('/allusers', function (data) {
                if (!data || !data.items || !data.items.length) reject(Error("ERROR IN FIND LIST"));
                console.log(data.items);
                var myJsonString = JSON.stringify(data.items);
                JSONToCSVConvertor(myJsonString, "Users Data", true);
            });
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


function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            if (index === "songs"){
                continue;
            }
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        console.log("arrData[i]: ",arrData[i]);
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (index === "songs"){
                continue;
            }
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
