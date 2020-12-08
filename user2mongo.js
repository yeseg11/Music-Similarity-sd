
const mongoose = require('mongoose');
var Users = require('./models/users.js');
var db = require('./db');


var userSchema = new Users();
// name: String,
//     id: Number,
//     year: Number,
//     // age:Number,
//     country: String,
//     group: {},
// likes: {}
console.log('here');

// noinspection BadExpressionStatementJS

db().then(function() {
    //bulk = Users.collection.initializeOrderedBulkOp();
    userSchema.name = "av";
    userSchema.id = 2020;
    userSchema.year = 1989;
    userSchema.country = "US";
    //userSchema.save({ id: 2020 }, function (err) {});  // save new user to mongo
    //userSchema.find({id:2020},function (err, docs) {console.log(docs)} );
    // Users.update({id:2020},{id:202020},function (err, docs) {console.log(docs)} ); // update user in mongo
}).catch((err) => console.log(err));

// function getData(obj){
//     console.log("getData");
//     console.log(obj);
// };
