(function ($) {
    $(document).ready(function () {
        let researchId = $('#researchId').val;

        function initResearchData() {
            getResearchData().then(function (researchData) {
                const researchName = researchData[0].researchName;
                const researchId = researchData[0].researchId;
                const researchGroup = researchData[0].researchGroupId;
                const nursingHome = researchData[0].nursingHome;
                const department = researchData[0].department;
                const description = researchData[0].description;
                const patientsIds = researchData[0].patientsIds;
                const numberOfWeek = researchData[0].numberOfWeeks;
                const meetingPerWeeks = researchData[0].meetingPerWeek;
                const lengthOfSession = researchData[0].lengthOfSession;
            }).catch(function (err) {
                console.log(err);
                return err;
            });
        }

        function getResearchData() {
            return new Promise(function (resolve, reject) {
                $.get('/research/' + researchId, function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    resolve(data.items);
                })
            });
        }
        var sessionMenuItem = '<div class="rsStyle-bar-block" id=\'sessionMenuItem\'>';
        sessionMenuItem += '<a href="#" className="rsStyle-bar-item rsStyle-button rsStyle-padding rsStyle-grad-menu"><i className="fa fa-bullseye fa-fw"></i>::SESSIONMENUITEM::</a>';
        sessionMenuItem += '</div>';
    });
})(jQuery);


// add async supoprt for ajax calls
function ajaxAwait(resourceUrl, method, playlistData){
    return  new Promise(function (resolve, reject) {
        $[method](resourceUrl ,{ playlistData,
        }).done(function (data) {
            if (data.err){
                reject(data);
            }
            else {
                resolve(data);
            }
        });
    });
}