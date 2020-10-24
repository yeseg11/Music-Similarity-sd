(function ($) {
    $(document).ready(function () {
        // console.log("here");

        var userId = localStorage["UserId"];
        // console.log("userId: ",userId);

        var oldEntrance = 0;
        var oldrecList = [];
        function init() {


            getUserData().then(function (result1) {
                // console.log("result1:",result1);
                var originalPublicId = result1[0].tamaringaId;

                $('#userName').val(result1[0].userName);
                $('#firstName').val(result1[0].firstName);
                $('#lastName').val(result1[0].lastName);
                $('#nursingHome').val(result1[0].nursingHome);
                $('#department').val(result1[0].department);
                $('#medicalProfile').val(result1[0].medicalProfile);
                $('#birthYear').val(result1[0].birthYear);
                $('#countryOrigin').val(result1[0].countryOrigin);
                $('#countryAtTwenty').val(result1[0].countryAtTwenty);
                $('#languageOrigin').val(result1[0].languageOrigin);
                $('#languageAtTwenty').val(result1[0].languageAtTwenty);
                $('#yearOfImmigration').val(result1[0].yearOfImmigration);
                $('#Genre1Select').val(result1[0].Genre1Select);
                $('#Genre2Select').val(result1[0].Genre2Select);
                oldEntrance = result1[0].entrance;
                oldrecList =  result1[0].recList;

            }).catch(function (err) {
                console.log(err);
                return err;
            });





        }

        function getUserData() {
            return new Promise(function (resolve, reject) {
                $.get('/user/' + userId, function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    // console.log(data.items)
                    resolve(data.items);
                })
            });
        }



        init();


        $('#send').on("click", function (e) {
            let inputsArr = ['#birthYear', '#userName', '#firstName', '#lastName', '#nursingHome', '#countryAtTwenty','#countryOrigin', '#languageOrigin', '#languageAtTwenty'];

            for (const element of inputsArr) {
                if ($(element).val().length <= 1) {
                    var element2 = element.substr(1);
                    alert("Please fill the missing details in " + element2);
                    return $('#error').text("insert all the details");
                }
            }


            //the new user data
            var userName = $('#userName'),
                firstName = $('#firstName'),
                lastName = $('#lastName'),
                password = $('#password'),
                nursingHome = $('#nursingHome'),
                department = $('#department'),
                medicalProfile = $('#medicalProfile'),
                birthYear = $('#birthYear'),
                countryOrigin = $('#countryOrigin'),
                countryAtTwenty = $('#countryAtTwenty'),
                languageOrigin = $('#languageOrigin'),
                languageAtTwenty = $('#languageAtTwenty'),
                yearOfImmigration = $('#yearOfImmigration'),
                Genre1Select = $('#Genre1Select'),
                Genre2Select = $('#Genre2Select');

            var yearTwenty = parseInt(birthYear.val()) + 20;
            // var yearTwenty = (new Date()).getFullYear() - parseInt(age.val()) + 20;
            if (!yearTwenty) {
                $('#error').text("the year not calculate");
                return;
            }
            var recList = [];
            var prom = new Promise(function (resolve, reject) {
                let publicId = userId;
                var privateUser = {
                    firstName: firstName.val(),
                    lastName: lastName.val(),
                    userName: userName.val(),
                    tamaringaId: publicId,
                    nursingHome: nursingHome.val(),
                };

                //var encryptedPass = CryptoJS.AES.encrypt(password.val(),'Password');


                var publicUser = {
                    firstName: firstName.val(),
                    lastName: lastName.val(),
                    userName: userName.val(),
                    tamaringaId:publicId.toString(),
                    password : password.val().toString(),
                    department: department.val(),
                    medicalProfile : medicalProfile.val(),
                    birthYear : parseInt(birthYear.val()),
                    yearAtTwenty: parseInt(yearTwenty),
                    languageOrigin : languageOrigin.val(),
                    languageAtTwenty : languageAtTwenty.val(),
                    countryAtTwenty: countryAtTwenty.val(),
                    countryOrigin: countryOrigin.val(),
                    yearOfImmigration : parseInt(yearOfImmigration.val()),
                    Genre1Select : Genre1Select.val(),
                    Genre2Select : Genre2Select.val(),
                    nursingHome : nursingHome.val(),
                    group: countryAtTwenty.val() + languageAtTwenty.val() +yearTwenty.toString(),
                    entrance: oldEntrance,
                    songs: JSON.stringify(oldrecList)
                };


                var userData= {
                    firstName: firstName.val(),
                    lastName: lastName.val(),
                    userName: userName.val(),
                    tamaringaId: publicId.toString(),
                };

                //userData
                var userDataUrl = '/updateUserData';
                var postingUserData = $.post(userDataUrl, userData).then(function (data) {
                    // console.log("userData:",data);
                });
                postingUserData.done(function (data) {
                });

                //private users
                var privateUrl = '/updatePrivateUsers';
                var postingPrivate = $.post(privateUrl, privateUser).then(function (data) {
                    // console.log("private user data:",data);
                });
                postingPrivate.done(function (data) {
                });
                //public users
                var publicUrl = '/insertPublicUsers';
                var postingPublic = $.post(publicUrl, publicUser);
                postingPublic.done(function (data) {
                    // console.log("public User data:",data);
                });


                alert("The User data changed '\n' The User Id is:" + publicId.toString());
                var pathname = "/adminMainPage"
                window.location.replace(pathname);
                localStorage["UserId"] = null;
            });
        })
        $('#main').on("click", function (e) {
            localStorage["UserId"] = null;
        })
    });
})(jQuery);
