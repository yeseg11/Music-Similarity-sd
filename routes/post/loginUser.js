let PublicUsers = require('../../models/publicUsers.js');
let UserData = require('../../models/userData.js');
let PlayList = require('../../models/playlist.js');

//add test flag and test the first session
//take the names from the Word document

let NumSongsForLanguage = 3; //need to edit to support the new config file
let NumSongsForGenre = 2;//	"				"				"
const TESTFIRSTSESSION = true;

module.exports = async function (req, res, next) {  
		if (!req || !req.body) return res.sendStatus(400); //if the request is empty, return it
		if (req.body.userName === undefined || req.body.userPassword === undefined) //check for isEmpty
			return next(new Error('User name or Password is missing'));
	
	try{
		const user = await getUser(req); // getting the user from PublicUsers collection ///// pass the body only
		const userData = await getUserData(user); //getting the user data from UserDatas collection //pass only the user id, not the all user
		const firstLogin = sessionChecker(userData); //return true for first session, reject if exceeded session limit //don't pass all of the user data, only the research array
		const mapPlaylistData = getPlaylistsNames(userData);

		let session;
		if (firstLogin || TESTFIRSTSESSION) {
			session = await startFirstSession(mapPlaylistData);
		}
		else {
				session = await startSession(mapPlaylistData);
				const logAnEntrance = await logEntrance(user); // if everything went well, log an entrance
		}
		const logAnEntrance = await logEntrance(user); // if everything went well, log an entrance
		return session;
	}
	
	catch(err){
		next(err);
	}
 }


//grab the user from PublicUsers collection
function getUser(req){
	return new Promise(function(resolve,reject) {
		PublicUsers.find({
			userName: req.body.userName.toString(),
			password: req.body.userPassword.toString()
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
			//console.log("playlists ", playLists)
			const records = playLists.map(x => {
				const correntPl = mapPlaylistData.find(element => {
					return element.name === x.name
				});

				const songLimit = correntPl.songs;

				const currentRecords = [];
				while(currentRecords.length < songLimit) {
					const record = x._doc.records[Math.floor(Math.random() * x._doc.records.length)];
					currentRecords.push(record);
				}
				//console.log(x.name + " songs are: " + plSongs);
				return currentRecords;
			});
			const flatRecord = records.flat()
			//console.log("records: " + records);

			resolve(flatRecord)
		})

	})

}

catch(err){
	return err;
}
}


// function getUserData(user){
// 	return new Promise(function(resolve,reject) {
// 		UserData.find({tamaringaId: user.tamaringaId.toString()})
// 			.exec(function (err, userDataDocs) {
// 				if(err || !userDataDocs.length)
// 					reject(new Error('Error: No userData available!'));
// 				else if(userDataDocs[0].researchList === null) reject(new Error('Can not Enter, Please add the user to research!'));
// 				else{
// 					user.data = userDataDocs[0].toObject();
// 					resolve(user.data);
// 				}
// 			})
// 	})
// }



//after the first session, this function will be used
function startSession(mapPlaylistData) {
	
}

function updateUserData(mapPlaylistData) {
	
}
	
// if everything went well, log an entrace
function logEntrance(user){
	return new Promise(function(resolve,reject) {
		PublicUsers.findOneAndUpdate({_id: user._id}, {$inc: {'entrance': 1}})
		.exec(function (err, entranceData) {
			if(err || !entranceData.length) 
				reject(new Error('Problem register entrance'));
			else if(entranceData === null) reject(new Error('can\'t register enterace'));
			else{
				resolve(entranceData);
			}
		})	
	})
}
	
	
	//require playlist object by playlist names
	
	
	/* 	
            User.findOne({"username":req.body.username}, function(err,user) {
                if (err) {
                    reject(err)
                } else {
                    console.log("yaha b agyaaa");
                    var errorsArr = [];
                    errorsArr.push({"msg":"Username already been taken."});
                    resolve(errorsArr);
                } */





