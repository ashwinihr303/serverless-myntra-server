'use strict';
const {MongoClient} = require('mongodb');
const url = "mongodb://localhost:27017/myntra_db";
var connection = {};
connection.getConnection = function(){
    return MongoClient.connect(url).then(function(database){
        console.log('Mongo server started at port 27017')
        return database.db();
    })
}
module.exports=connection;