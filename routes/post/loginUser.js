let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let PlayList = require('../../models/playlist.js');

//add test flag and test the first session
//take the names from the Word document

let NumSongsForLanguage = 3; //need to edit to support the new config file
let NumSongsForGenre = 2;//	"				"				"
let SESSIONSONGLIMIT = 20;
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
		if(user.playlists.secondLanguage.language !== null || user.playlists.secondLanguage.language !== "empty") {
			playlistData = playlistData.concat(user.playlists.secondLanguage.playlists);
		}

		if(user.playlists.genrePlaylists !== null) {
			playlistData = playlistData.concat(user.playlists.genrePlaylists);
		}


	return playlistData.map(x => {
		return {
			name: x,
			songs: (x.length === 3) ? NumSongsForGenre : NumSongsForLanguage
		}
	});
}



// at the first session, returning an array with random songs from all of the user's playlists
async function startFirstSession(mapPlaylistData) {
try{
	return new Promise(function (resolve, reject) {
		const playlistNames = mapPlaylistData.map(function(playlist) {
			return playlist.name;
		})
		PlayList.find({name : {$in : playlistNames}}).exec((err, playLists) => {
			const records = playLists.map(x => {
				const currentPl = mapPlaylistData.find(element => {
					return element.name === x.name
				});

				const songLimit = currentPl.songs;
				const currentRecords = [];
				currentRecords.name = x.name;
				while(currentRecords.length < songLimit) {
					let record = x._doc.records[Math.floor(Math.random() * x._doc.records.length)];
					record._doc.playlistName = x.name;
					record._doc.score = 0;

					// if(!currentRecords.filter(x=> currentRecords.mbId.toString() === record.mbId.toString()))
						currentRecords.push(record);

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

	// const mbidLiked = userData.researchList[0].sessionList.map(x=> { // liked songs
	// 	return x.songs.filter(song => song.score > 3 && song.score <= 5)
	// }).flat();

	const mbidLiked = userData.researchList[0].sessionList.map(x=>{
		return x.songs
			.filter(s=>s.score >= 3 && s.score <= 5)
			.map(s=> s.mbId)
	}).reduce(function(o, v, i, arr){
		for(let i=0; i < v.length; i++){
			if(o.indexOf(v[i]) != -1) continue;
			o.push(v[i]);
		}
		return o;
	}, []);

	const mbidUnLiked = userData.researchList[0].sessionList.map(x=>{ // unliked songs
		return x.songs.filter(song => song.score > 0 && song.score <= 3)
	}).flat();
	
	
	try{
		return new Promise(function (resolve, reject) {
			const playlistNames = mapPlaylistData.map(function(playlist) {
				return playlist.name;
			})

			//get playlists names
			PlayList.find({name : {$in : playlistNames}}).exec((err, playLists) => {

				const records = playLists.map(x => {
					const currentPl = mapPlaylistData.find(element => {
						return element.name === x.name;
					});

					const songLimit = currentPl.songs;
					let records = x._doc.records;
					const playlistName = x._doc.name;

					//pushing the liked songs
					records = records.filter(function(element) {
						return mbidLiked.includes(element._doc.mbId);
					});

					let result = Array.from(records.flat(0));
					result.name = playlistName;

					//filling the blanks of the playlist's slots(up to playlist songLimit) with random new songs
					while(result.length < songLimit){
						let record = x._doc.records[Math.floor(Math.random() * x._doc.records.length)];
						record._doc.playlistName = x.name;
						record._doc.score = 0;
						// if(!currentRecords.filter(x=> currentRecords.mbId.toString() === record.mbId.toString()))
						result.push(record);
					}
						return result;
				});

				resolve(records)
			})
		})
	}

	catch(err){
		return err;
	}
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
	
// if everything went well, log an entrace
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




// for(let i = 0; i < currentPl.songs;i++) {
// 	const playlist = currentPl[i];
// 	if(!playlist || !playlist.records || !playlist.records.length)
// 		continue;
// 	for(let j = 0; j < playlist.records.length; j++) {
// 		const record = playlist.records[j];
// 		if(!record)
// 			continue;
// 		if(mbidLiked.indexOf(record.mbId) != -1 && !likedPlaylist.records.find( x => x.mbId == record.mbId))
// 			likedPlaylist.records.push(record);
// 	}
// }