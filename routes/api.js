/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const express = require('express');
const router = express.Router();

const auth = require('./auth');
router.get('/my', function(req, res, next) {
    res.render('index', { title: xConfig.appName });
});
router.use('/user', require('./user'));


module.exports = router;