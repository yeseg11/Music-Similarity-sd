let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let PlayList = require('../../models/playlist.js');
let GlobalRating = require('../../models/globalRating');

//add test flag and test the first session
//take the names from the Word document

let NumSongsForLanguage = 12; //need to edit to support the new config file
//let NumSongsForPlaylist
let NumSongsForGenre = 4;//	"				"				"
let SESSIONSONGLIMIT = 20;
const GLOBALRATINGAVG = 3;
const TESTFIRSTSESSION = false;

module.exports = async function (req, res, next) {  
		if (!req || !req.body) return res.sendStatus(400); //if the request is empty, return it
		if (req.body.userName === undefined || req.body.userPassword === undefined) //check for isEmpty
			return next(new Error('User name or Password is missing'));
	
	try{
		const user = await getUser(req.body); // getting the user from PublicUsers collection ///// pass the body only
		const userData = await getUserData(user); //getting the user data from UserDatas collection //pass only the user id, not the all user
		const firstLogin = sessionChecker(userData); //return true for first session, reject if exceeded session limit //don't pass all of the user data, only the research array
		const mapPlaylistData = getPlaylistsNames(userData);

		let session;
		if (firstLogin || TESTFIRSTSESSION) {
			session = await startFirstSession(mapPlaylistData);
		}
		else {
				session = await nonInitialSession(mapPlaylistData, userData);
		}
		const logAnEntrance = await logEntrance(user); // if everything went well, log an entrance
		const newUserData = await updateUserData(session, firstLogin, userData);
		const userAndData = user;
		user.data = userData;
		user.playlists = session.map(x => {
			const filterDocs = x.map(docs => {
				return docs._doc;
			});

			const currentName = x.name;
			return [[{
				name: currentName,
				records: Object.values(filterDocs)
			}]]
		}).flat();

		res.status(200).json({err: false, items: [user]});
	}
	
	catch(err){
		next(err);
	}
 }


//grab the user from PublicUsers collection
function getUser(req){
	return new Promise(function(resolve,reject) {
		PublicUsers.find({
			userName: req.userName.toString(),
			password: req.userPassword.toString()
		}).exec(function (err, docs) {
			if (err || !docs.length) {
				reject(new Error('Invalid user!'));
			}
			else {
				resolve(docs[0].toObject());
			}
		})
	})
}

//greab  the user data from UserDatas collection
function getUserData(user){
	return new Promise(function(resolve,reject) {
        UserData.find({tamaringaId: user.tamaringaId.toString()})
            .exec(function (err, userDataDocs) {
                if(err || !userDataDocs.length) 
					reject(new Error('Error: No userData available!'));
                else if(userDataDocs[0].researchList === null) reject(new Error('Can not Enter, Please add the user to research!'));
				else{
				user.data = userDataDocs[0].toObject();
				resolve(user.data);
				}
		})
	})
}

// Check if it's the first session and if the user has exceded the max number of sessions
function sessionChecker(userData){
	//add a research check(if the research is null)
	userData.firstTime = userData.researchList.filter(x=>x.sessionList == null ? 0:x.sessionList).length !== 0?false:true;
		if (userData.researchList[0].sessionList != null){
			if(userData.researchList[0].maxSessionNum === (userData.researchList[0].sessionList.length )){
				return new Error('Error: User exceeded the max number of sessions!');
			}
		}
		return userData.firstTime;
}




//define an object for each playlist with the name and number of songs
function getPlaylistsNames(user){
		let playlistData = user.playlists.firstLanguage.playlists;
		const songPerPlaylist1 = Math.floor(NumSongsForLanguage / playlistData.length);

		playlistData = playlistData.map(x => {
			return {
				name: x,
				songs: songPerPlaylist1
			}
		});

		if(user.playlists.secondLanguage.language !== null || user.playlists.secondLanguage.language !== "empty") {
			let playlistDataSec = user.playlists.secondLanguage.playlists;
			const songPerPlaylistSec = Math.floor(NumSongsForLanguage / playlistDataSec.length);
			playlistDataSec = playlistDataSec.map(x => {
				return {
					name: x,
					songs: songPerPlaylistSec
				}
			});

			playlistData = playlistData.concat(playlistDataSec);
		}

		if(user.playlists.genrePlaylists !== null) {
			let playlistDataGen = user.playlists.genrePlaylists;
			playlistDataGen = playlistDataGen.map(x => {
				return {
					name: x,
					songs: NumSongsForGenre
				}
			});
			playlistData = playlistData.concat(playlistDataGen);
		}


	return playlistData;
}



// at the first session, returning an array with random songs from all of the user's playlists
async function startFirstSession(mapPlaylistData) {
try{
	return new Promise(function (resolve, reject) {
		const playlistNames = mapPlaylistData.map(function(playlist) {
			return playlist.name;
		})
		PlayList.find({name : {$in : playlistNames}}).exec((err, playLists) => {
			if(err || !playLists.length)
				reject(new Error('Error getting playlist'));

			const records = playLists.map(x => {
				const currentPl = mapPlaylistData.find(element => {
					return element.name === x.name
				});

				const songLimit = currentPl.songs;
				const currentRecords = [];
				currentRecords.name = x.name;
				let firstSong = true;
				while(currentRecords.length < songLimit) {
					let record = x._doc.records[Math.floor(Math.random() * x._doc.records.length)];
					record._doc.playlistName = x.name;
					record._doc.score = 0;

					if((currentRecords.flat().filter(resultRec => record._doc.mbId === resultRec._doc.mbId)).length === 0 || firstSong === true){
						currentRecords.push(record);
						firstSong = false;
					}
				}
				return currentRecords;
			});


			resolve(records)
		})
	})
}

catch(err){
	return err;
	}
}

//after the first session, this function will be used
async function nonInitialSession(mapPlaylistData, userData) {

	//get songs from previous sessions with like score of 3-5
	let mbidLiked = userData.researchList[0].sessionList.map(x=>{
		return x.songs
			.filter(s=>s.score >= 4 && s.score <= 5)
			.map(s=> s.mbId)
	}).reduce(function(o, v, i, arr){
		for(let i=0; i < v.length; i++){
			if(o.indexOf(v[i]) != -1) continue;
			o.push(v[i]);
		}
		return o;
	}, []).sort(() => Math.random() - 0.5);

	// low rating songs
	const mbidUnLiked = userData.researchList[0].sessionList.map(x=>{
		return x.songs
			.filter(song => song.score > 0 && song.score <= 3)
			.map(s=> s.mbId)
	}).reduce(function(o, v, i, arr){
		for(let i=0; i < v.length; i++){
			if(o.indexOf(v[i]) !== -1) continue;
			o.push(v[i]);
		}
		return o;
	}, []);

	const unlikedPlaylists = userData.researchList[0].sessionList.map(x=>{
		return x.songs
			.map(s=> s.playlistName)
	}).reduce(function(o, v, i, arr){
		for(let i=0; i < v.length; i++){
			if(o.indexOf(v[i]) !== -1) continue;
			if(v[i]) {
				o.push(v[i]);
			}
		}
		return o;
	}, []);

	mbidLiked = mbidLiked.filter(songs => mbidUnLiked.indexOf(songs) === -1);
	const playlistNames = mapPlaylistData.map(function(playlist) {
		return playlist.name;
	})

	const globalSongs =  await getGlobalRatings(playlistNames);

	try{
		return new Promise(function (resolve, reject) {
			PlayList.find({name : {$in : playlistNames}}).exec((err, playLists) => {

				let records = playLists.map(x => {
					const currentPl = mapPlaylistData.find(element => {
						return element.name === x.name;
					});

					const songLimit = currentPl.songs;
					let records = x._doc.records;
					const playlistName = x._doc.name;
					const currentGlobal = globalSongs.filter(song => song.playlist === playlistName).map(name => name.mbId);

					//combine liked songs with global liked songs and randomize
					const likedAndGlobal = mbidLiked.concat(currentGlobal.filter((item) => mbidLiked.indexOf(item) < 0)).sort(() => Math.random() - 0.5);

					//pushing the liked and global songs
					records = records.filter(function(element) {
						return likedAndGlobal.includes(element._doc.mbId);
					});

					let result = Array.from(records.flat(0));
					result.name = playlistName;

					//filling the blanks of the playlist's slots(up to playlist songLimit) with random new songs
					for(let i = 0; i < x._doc.records.length; i++) {
						if(result.length === songLimit)
							break;

						let record = x._doc.records[i]; //Math.floor(Math.random() * x._doc.records.length)
						record._doc.playlistName = x.name;
						record._doc.score = 0;
						let flatResult = result.flat();

						//filter duplicate songs
						const checkDup = flatResult.filter(resultRec => record._doc.mbId === resultRec._doc.mbId)

						//check if record is a low rated song
						const removeUnliked = mbidUnLiked.indexOf(record._doc.mbId);

						if(checkDup.length === 0 && removeUnliked === -1)
							result.push(record);

					}
						return result;
				});

				//randomize playlists
				records.sort(() => Math.random() - 0.5);
				resolve(records)
			})
		})
	}

	catch(err){
		return err;
	}
}

function getGlobalRatings(playlistNames){
	return new Promise(function(resolve,reject) {
		GlobalRating.find({'playlists.name' : {$in : playlistNames}})
			.lean().exec(function (err, songs) {
				if(err || !songs)
					reject(new Error('Problem getting global playlists'));
				else if(songs === null)
					reject(new Error('can\'t register enterace'));
				else{
					let flatSongs = songs.map(docs => {
						return docs.playlists["0"].records;
					}).flat().filter(song => song.ratingAvg >= GLOBALRATINGAVG);

					resolve(flatSongs);
				}
			})
	})
}


function updateUserData(session, firstLogin, userData) {
	const sessionSongs = session.flat().map(x => {
		return x._doc;
	});


	let data = {};
	data['$push'] = {
		'researchList.0.sessionList': {
			sessionNumber: (!userData.researchList[0].sessionList.length) ? 1 : userData.researchList[0].sessionList.length + 1,
			sessionDate: new Date(),
			songs: sessionSongs
		}
	}

	UserData.findOneAndUpdate({_id:  userData._id}, data).exec((err, result)=>{ //edit
		if(err) return next(err);
	})

	return data;
}
	
// if everything went well, log an entrance
function logEntrance(user){
	return new Promise(function(resolve,reject) {
		PublicUsers.findOneAndUpdate({_id: user._id}, {$inc: {'entrance': 1}})
		.exec(function (err, entranceData) {
			if(err || !entranceData)
				reject(new Error('Problem register entrance'));
			else if(entranceData === null) reject(new Error('can\'t register enterace'));
			else{
				resolve(entranceData);
			}
		})	
	})
}

