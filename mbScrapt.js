var mb = require('./musicbrainz');
var fs = require('fs-extra');
let path = require('path');
var debug = require('debug');

//call to musicbrainz file and make folders's with json file's with 100 songs in each file for every year.


var toYear = process.env.toYear || (new Date).getFullYear(); //if we want to chose the years (from year 1989 , to year 1998)

var o = {                   //build object with the types of the data .
    query: 'ageYear',
    type: 'release/',
    country: 'IT',
    language: 'ita',
    date: process.env.year || (new Date).getFullYear(),
    limit: 100
};
debug('app:mb')(`going to scrapt ${o.date} to ${(new Date).getFullYear()}`); //show has what the year's
for (var year = o.date; year <= toYear; year++) {
    (function(y, oo) {
        oo.date = y;            // y = year
        setTimeout(function() {         //time for addind , if the add is to fast its can miss data .
            var dir = path.join(__dirname, 'new-mb-raw', y.toString());
            fs.ensureDir(dir).then(() => {
                oo.date = y;
                mb.query(oo).then(function(data) {
                    // console.log(data);
                    debug('app:musicbrainzScrpat')(`total of ${data.items.releases.length}/${parseInt(data.items.count)}`);
                    fs.writeFile(`./new-mb-raw/${y}/mb-0.json`, JSON.stringify(data.items.releases), function(err) { //write to file all the data from musicBrinz
                        if (err) {
                            console.error('Crap happens', err);
                            return process.exit(0);
                        }
                        debug('app:write')(`wrote item to temp file ${y}, 0`);
                        var pages = Math.ceil(parseInt(data.items.count) / data.items.releases.length); // get the numbers of pages, in each file max 100 songs
                        var promesies = [];
                        for (var i = 1; i <= pages; i++) {
                            (function(i, opt) {
                                opt.offset = data.items.releases.length * i;          //update the offset number
                                //console.log("y: ",y);
                                fs.pathExists(`./new-mb-raw/${y}/mb-${i}.json`, (err, exists) => {
                                    if (!exists) {
                                        opt.date = y;
                                        opt.offset += data.items.releases.length * i;
                                        console.log("opt.offset: ",opt.offset);
                                        promesies.push(mb.query(opt).then(data => {
                                            console.log("Data: ",data.items);
                                            fs.writeFile(

                                                `./new-mb-raw/${y}/mb-${i}.json`,   //add to folder mb-raw/"year"/mb-"page number" if nut exists
                                                JSON.stringify(data.items.releases),
                                                function(err) {
                                                    debug('app:write')(`wrote item to temp file ${y}, ${i}`);
                                                    if (err) return Promise.reject(err);
                                                    return Promise.resolve();
                                                });

                                        }))
                                    }
                                })



                            })(i, oo)

                        }
                        Promise.all(promesies).then(() => console.log).catch((err) => {
                            console.log(err);
                        })
                    })
                })
            })
        }, ((y - o.date) * 1000 + 3000));

    })(year, o);
}
