(function ($) {
    $(document).ready(function () {
        // console.log("here");
        $('#send').on("click", function (e) {
            let newData = ['#name','#id','#department','#medicalProfile','#countryAtTwenty','#countryOrigin', '#age','#languageOrigin','#languageAtTwenty','#yearOfImmigration','#Genre1Select','#Genre2Select','#nursingHome'];
            let inputsArr = ['#birthYear', '#name', '#id', '#department', '#countryAtTwenty','#countryOrigin', '#languageOrigin', '#languageAtTwenty'];
            for (const element of inputsArr) {
                // console.log(element,element.length);
                if (!$(element).length) {
                    // console.log("here3");
                    return $('#error').text("insert all the details");
                }
            }

            //the new user data
            var name = $('#name'),
                id = $('#id'),
                department = $('#department'),
                medicalProfile = $('#medicalProfile'),
                birthYear = $('#birthYear'),
                countryAtTwenty = $('#countryAtTwenty'),
                countryOrigin = $('#countryOrigin'),
                language1 = $('#languageOrigin'),
                language2 = $('#languageAtTwenty'),
                yearOfImmigration = $('#yearOfImmigration'),
                Genre1Select = $('#Genre1Select'),
                Genre2Select = $('#Genre2Select'),
                nursingHome = $('#nursingHome');


            //old user data
            // var age = $('#age'),
            //     countryAtTwenty = $('#countryAtTwenty'),
            //     countryOrigin = $('#countryOrigin'),
            //     name = $('#name'),
            //     id = $('#id'),
            //     language1 = $('#languageOrigin'),
            //     language2 = $('#languageAtTwenty');

            print(birthYear.val())
            if (!birthYear.val() || birthYear.val() == null || parseInt(birthYear.val()) < 1920 || parseInt(birthYear.val()) > (new Date()).getFullYear()) {
                //console.log('Error');
                alert("insert birth Year or birth Year between 1920 to this year");
                return $('#error').text("insert birth Year or birth Year between 1920 to this year");
            }
            if (countryAtTwenty.val() === "Select Country" || countryOrigin.val() === "Select Country") {
                //console.log('Error');
                alert("please select a country");
                return $('#error').text("please select a country");
            }
            if (language1.val() === "Select Language") {
                //console.log('Error');
                alert("please select a language");
                return $('#error').text("please select a language");
            }
            if (language2.val() === "Select Language") {
                //console.log('Error');
                alert("please select a language");
                return $('#error').text("please select a language");
            }
            if (!name.val()) {
                //console.log('Error');
                alert("please insert name");
                return $('#error').text("please insert name");
            }
            if (!id.val() /*|| ValidateID(id.val()) != 1*/) {
                console.log('Error');
                alert("please insert ID");
                return $('#error').text("please insert ID");
            }
            //HERE
            var yearTwenty = parseInt(birthYear.val()) + 20;
            // var yearTwenty = (new Date()).getFullYear() - parseInt(age.val()) + 20;
            //console.log(yearTwenty);
            if (!yearTwenty) {
                //console.log("error");
                $('#error').text("the year not calculate ");
                return;
            }
            var recList = [];
            var prom = new Promise(function (resolve, reject) {
                // do a thing, possibly async, then…
                //alert(age.val()+" "+country.val()+" "+name.val()+" "+id.val());
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
                        console.log("response: ",response.items[0]);
                        publicId = response.items[0] + 1;

                        var privateUser= {
                            name: name.val(),
                            tamaringaId: publicId,
                            privateId: id.val().toString(),
                            nursingHome: nursingHome.val(),
                        };

                        var publicUser = {
                            name: name.val(),
                            tamaringaId:publicId.toString(),
                            department: department.val(),
                            medicalProfile : medicalProfile.val(),
                            birthYear : parseInt(birthYear.val()),
                            yearAtTwenty: parseInt(yearTwenty),
                            languageOrigin : language1.val(),
                            languageAtTwenty : language2.val(),
                            countryAtTwenty: countryAtTwenty.val(),
                            countryOrigin: countryOrigin.val(),
                            yearOfImmigration : parseInt(yearOfImmigration.val()),
                            Genre1Select : Genre1Select.val(),
                            Genre2Select : Genre2Select.val(),
                            nursingHome : nursingHome.val(),
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
                    alert("user add");
                });
            });
        })
    });
})(jQuery);


// DEFINE RETURN VALUES


// function ValidateID(str)
// {
//     //INPUT VALIDATION
//     var R_ELEGAL_INPUT = -1;
//     var R_NOT_VALID = -2;
//     var R_VALID = 1;
//     // Just in case -> convert to string
//     var IDnum = String(str);
//
//     // Validate correct input
//     if ((IDnum.length > 9) || (IDnum.length < 5))
//         return R_ELEGAL_INPUT;
//     if (isNaN(IDnum))
//         return R_ELEGAL_INPUT;
//
//     // The number is too short - add leading 0000
//     if (IDnum.length < 9)
//     {
//         while(IDnum.length < 9)
//         {
//             IDnum = '0' + IDnum;
//         }
//     }
//
//     // CHECK THE ID NUMBER
//     var mone = 0, incNum;
//     for (var i=0; i < 9; i++)
//     {
//         incNum = Number(IDnum.charAt(i));
//         incNum *= (i%2)+1;
//         if (incNum > 9)
//             incNum -= 9;
//         mone += incNum;
//     }
//     if (mone%10 == 0)
//         return R_VALID;
//     else
//         return R_NOT_VALID;
// }
