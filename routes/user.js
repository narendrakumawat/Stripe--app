/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('./auth');
const response = require('../model/response');
const statusCode = require('../model/statusCode');
const model = require('../model/model');

const generateToken = (user) => {
    "use strict";
    return jwt.sign({ userID : user._id.toString() }, xConfig.crypto.TokenKey, { expiresIn : xConfig.crypto.JwtExpiration * 60 * 60 });
};

router.post('/signup', function (req, res) {
    "use strict";
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name + " "+ email + " "  +password);
    return model.user.createUser(name, email, password)
        .then((user) => {
            let reply = response(statusCode.Ok);
            reply.body.token = generateToken(user);
            reply.body.userID = user._id.toString();
            reply.body.name = user.name;
            reply.body.email = user.email;

            res.json(reply);
        })
        .catch((e) => res.json(response(e)));
});
router.post('/signin', function (req, res) {
    "use strict";
    const email = req.body.email;
    const password = req.body.password;
    console.log( " "+ email + " "  +password);
    return model.user.authorise(email, password)
        .then((user) => {
            let reply = response(statusCode.Ok);
            reply.body.token = generateToken(user);
            reply.body.userID = user._id.toString();
            reply.body.name = user.name;
            reply.body.email = user.email;
            res.json(reply);
        })
        .catch((e) => res.json(response(e)));
});
module.exports = router;