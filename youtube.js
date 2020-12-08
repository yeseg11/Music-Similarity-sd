// this file send the request for data from youtube and return him.

var y = require('youtube-node'); //use the youtube-node libery
var youTube = new y();

youTube.setKey('AIzaSyA0GBmqiXkEouLaSiGMu7ZIXLgoWD82LCE'); //Required a google developer key to use youtube api

exports.scrapt = function(options) {
    return new Promise(function(resolve, reject) {
        console.log("options.name: ", options.name);
        // console.log(youTube);
        youTube.search(options.name, 2, function(error, result) {
            console.log("result: ", result);
            if(!result || !result.items || !result.items[0] || !result.items[0].id || !result.items[0].id.videoId) return resolve({});
            var videoId = result.items[0].id.videoId.toString();   //get the videoId
            youTube.getById(videoId, function(error, result) {
                if (error || !result.items || !result.items[0] || !result.items[0].statistics) return reject(error || new Error(result));
                var viewCount = parseInt(result.items[0].statistics.viewCount); //get the viewCount
                if (!viewCount)
                    viewCount = 1 ;

                youTube.clearParams();
                youTube.clearParts();
                // videos?part=snippet&id=::id::&key=AIzaSyDXKEiZzKTDzYIaRUG63nK7dO-h5Yykfyk`


                youTube.addPart('id');

                youTube.addParam('part', 'snippet');
                youTube.addParam('id', videoId);

                youTube.request(youTube.getUrl('videos'), function(error, result) {
                    if (error || !result.items || !result.items[0]) return reject(error || new Error(result));
                    var tags = result.items[0].snippet.tags; //get the tags array
                    return resolve({ //return all the data from youtube API
                        videoId: videoId,
                        views: viewCount,
                        tags: tags
                    });

                });

            });

        })
    });
};
//AIzaSyA0GBmqiXkEouLaSiGMu7ZIXLgoWD82LCE
//AIzaSyA_LdnTSbjIB_A2Vib_4LVh80L7ygTkRuI
//AIzaSyCtqguJTYklaaJx5u6WYp4RqUQ5RxHghsc
