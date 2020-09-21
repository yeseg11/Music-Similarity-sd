(function ($) {
    $(document).ready(function () {
        // console.log("here");
        $('#send').on("click", function (e) {
            let inputsArr = ['#year', '#country', '#language'];
            for (const element of inputsArr) {
                if (!$(element).length) {
                    return $('#error').text("insert all the details");
                }
            }

            //the new user data
            var year = $('#year'),
                country = $('#country'),
                language = $('#language');

            var recList = [];
            var prom = new Promise(function (resolve, reject) {
                var i = 0;
                $.get('/mb/track/recording/' + yearTwenty + '/' + countryAtTwenty.val(), function (data) {
                    if (!data || !data.items || !data.items.length) return reject(Error("ERROR IN FIND LIST"));
                    var size = 50;
                    if (data.items.length < size) {
                        size = data.items.length;
                    }
                    // console.log('data: ',data);
                    for (i = 0; i < size; i++) {
                        recList.push({
                            mbid: data.items[i].mbId,
                            title: data.items[i].title,
                            yearAtTwenty: parseInt(data.items[i].yearAtTwenty),
                            artist: data.items[i].artist,
                            country: data.items[i].countryAtTwenty,
                            youtube: data.items[i].youtube,
                        });

                    }
                    // console.log(recList.length);
                }).then(function (response) {
                    // console.log("Success!", response);
                    //console.log("recList!", recList);
                    let publicId = 0;
                    // console.log("publicId: ", publicId);
                    $.get('/publicId', function (data) {
                        // publicId = data.items[0] + 1;
                    }).then(function (response) {
                        console.log("response: ", response.items[0]);
                        publicId = response.items[0] + 1;

                        var privateUser = {
                            name: name.val(),
                            tamaringaId: publicId,
                            privateId: id.val().toString(),
                            nursingHome: nursingHome.val(),
                        };

                        var publicUser = {
                            name: name.val(),
                            tamaringaId: publicId.toString(),
                            department: department.val(),
                            medicalProfile: medicalProfile.val(),
                            birthYear: parseInt(birthYear.val()),
                            yearAtTwenty: parseInt(yearTwenty),
                            languageOrigin: language1.val(),
                            languageAtTwenty: language2.val(),
                            countryAtTwenty: countryAtTwenty.val(),
                            countryOrigin: countryOrigin.val(),
                            yearOfImmigration: parseInt(yearOfImmigration.val()),
                            Genre1Select: Genre1Select.val(),
                            Genre2Select: Genre2Select.val(),
                            nursingHome: nursingHome.val(),
                            group: countryAtTwenty.val() + yearTwenty.toString(),
                            entrance: 0,
                            records: JSON.stringify(recList)
                        };

                        //need to check how to update user when you

                        //private users
                        var privateUrl = '/insertPrivateUsers';
                        var postingPrivate = $.post(privateUrl, privateUser);
                        postingPrivate.done(function (data) {
                            // console.log("data:" + data);
                        });
                        //public users
                        var publicUrl = '/insertPublicUsers';
                        var postingPublic = $.post(publicUrl, publicUser);
                        postingPublic.done(function (data) {
                            // console.log("data:" + data);
                        });
                    });
                    // var obj = {
                    //     id: id.val().toString(),
                    //     age: parseInt(age.val()),
                    //     country: countryAtTwenty.val(),
                    //     entrance: 0,
                    //     name: name.val(),
                    //     language1: language1.val(),
                    //     language2: language2.val(),
                    //     year: parseInt(yearTwenty),
                    //     group: countryAtTwenty.val() + yearTwenty.toString(),
                    //     records: JSON.stringify(recList)
                    // };
                    // console.log(publicId);
                    alert("The Playlist added to database");
                    var pathname = "/adminMainPage"
                    window.location.replace(pathname);
                });
            });
        })
    });
})(jQuery);
