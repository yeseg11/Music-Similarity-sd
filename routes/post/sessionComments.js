let UserData = require('../../models/userData.js');

module.exports = async function (req, res, next) {    //call to getUserData.js , and request all the relevant data from DB
    if (!req.body) return res.sendStatus(400);

    const tamaringaId = req.params.userId;
    const commentString = req.body.comment;
    const stringType = req.body.type;

    if(!commentString) return next(new Error('Please type comment'));

    return UserData.findOne({tamaringaId}).exec((err, user)=>{
        if(err || !user) return next(err || new Error('Invalid user Id!'));

        const currentSessionIndex = user.researchList[0].sessionList.length -1;
        let currentSession = user.researchList[0].sessionList[parseInt(currentSessionIndex)];

        if(stringType === 'start') {
            console.log("post start");
            currentSession.guideCommentStart = commentString;
        }

        if(stringType === 'end') {
            currentSession.guideCommentEnd = commentString;
        }

        let update = {};

        const options = {"upsert": true};
        update['$set'] = {
            'researchList.0.sessionList': user.researchList[0].sessionList
        }


        UserData.findOneAndUpdate({_id:  user._id}, update, options).exec((err, result)=>{
            if(err) return next(err);
            //res.status(200).json({err: false})
        })

        res.status(200).json({err: false})
    });


}