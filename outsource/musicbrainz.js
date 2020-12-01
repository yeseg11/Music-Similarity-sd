var debug = require('debug');
var request = require('request');
//send a request to musicbraintz for the year and return it .

exports.scrapt = getDataFromMB;
function getDataFromMB(options){ //get the data from MusicBrinz

   //console.log("url: "+options.url);
    return new Promise((resolve, reject) => {
    	if(!options || !options.url) return reject(new Error(`Missing url options for musicbrainz`)); //  send a http requst to get the data fromthe link
        request({
            'method': 'GET',
            'uri': options.url,
            'headers': {
                'User-Agent': 'MY IPHINE 7s ' + (+new Date()) // A hack to get into musicbrainz api
            }

        }, function(error, response, body) {
            // if (error) return reject(error);
            if (error || !response || !response.statusCode || response.statusCode !== 200) {
            	options.retry = options.retry || 0;
                options.retry++;
                //if (options.retry > 10) return reject(new Error('Check your ISP internet connection'));
                var nextRetry = (100000 * Math.random() + 10000 * Math.random() + 5000) * options.retry *1.5; //run in a random time to give the system time to make the download's betewen evry request
                return setTimeout(function() {
                	debug('app:musicbrainz')(`RETRY ${options.retry} in ${nextRetry} s. :: ${options.url}`);
                    getDataFromMB(options).then(resolve).catch(reject);
                }, nextRetry);
            }
            debug('app:musicbrainz')(`recived data from ${options.url}`); //show the url we get the data from him
            try {
                var data = JSON.parse(body);        //the data we get
                //console.log("data: "+data);
                return resolve({items: data, options: options});
            } catch (e) {
                return reject(e);
            }
        });
    })
}

exports.query = query;  //export the query function
function query(options){    //make the link we need with all the modolar data (year,limit, offset and type)
	if(!options || !options.query || ['ageYear'].indexOf(options.query) == -1) return Promise.reject(new Error(`mising query type!`));
    // if(!options || !options.country || ['country'].indexOf(options.country) == -1) return Promise.reject(new Error(`mising country type!`));
    // if(!options || !options.language || ['language'].indexOf(options.language) == -1) return Promise.reject(new Error(`mising language type!`));
    return new Promise((resolve, reject)=>{
		switch(options.query){
			case 'ageYear':
				return getDataFromMB({url: `https://musicbrainz.org/ws/2/${options.type}?query=reid:${options.reid}&limit=${options.limit || 100}&offset=${options.offset || 0}&fmt=json`}).then(resolve).catch(reject)
			    //http://musicbrainz.org/ws/2/release/?query=date:2019%20AND%20country:IL%20AND%20lang:heb&limit=10
                break;
		}

		return reject(new Error('what do you want ?? :)'));
	});
}
