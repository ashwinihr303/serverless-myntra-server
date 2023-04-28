'use strict';
var fs = require('fs');
var logger = function(err,req,res,next){
if(err){
    fs.appendFile('ErrorLogger.txt',err.stack+"\n",function(err){
        if(err){
            console.log("Error occured while logging error to file.");
        }
    });
    res.status(500);
    res.json({"message":err.message});
}
} 
module.exports = logger;