'use strict';
var express = require('express');
var router = express.Router();
const userRouter = require('./user/users');
router.use('/user',userRouter);

module.exports = router;