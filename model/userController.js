/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const user = require('./user');
const bCrypt = require('bcrypt');

const statusCode = require('./statusCode');

const hashCount = () => {
    "use strict";
    return Math.floor(Math.random() * (xConfig.crypto.MaxPasswordIterations - xConfig.crypto.MinPasswordIterations))
        + xConfig.crypto.MinPasswordIterations;
};

const comparePassword = (realPassword, password) => {
    "use strict";
    return new Promise((resolve, reject) => {
        bCrypt.compare(realPassword, password, function (err, valid) {
            if (err) reject(err);
            else resolve(valid);
        });
    });
};

user.createUser = (name, email, password) => {
    return new Promise((resolve, reject) => resolve())
        .then(() => {
        // console.log("nk");
            "use strict";
            if (password.length < xConfig.crypto.MinPasswordLength)
                throw statusCode.PasswordShort;
            if (password.length > xConfig.crypto.MaxPasswordLength)
                throw statusCode.PasswordLong;
        }).then(() => {

            return user
                .find( { email : email } )
                .then((users) => {
                    console.log(email);
                    "use strict";
                    if (users && users.length > 0)
                        throw statusCode.UserAlreadyExists;
                    return bCrypt.genSalt(hashCount())
                        .then((salt) => bCrypt.hash(password, salt))
                        .then((hash) => {
                            return user
                                .create({
                                    name : name,
                                    email : email,
                                    password : hash
                                });
                        })
                        .catch((e) => {
                            "use strict";
                            console.log(e);
                            throw statusCode.InternalError;
                        });
                });
        });
};

user.getUser = (email, throwOnNull = false) => {
    return user
        .findOne({ email : email })
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        }).then((user) => {
            "use strict";
            if (!user && throwOnNull)
                throw statusCode.UserDoesNotExists;
            return user;
        });
};

user.getUserByID = (id, throwOnNull = false) => {
    return user
        .findById(id)
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        }).then((user) => {
            "use strict";
            if (!user && throwOnNull)
                throw statusCode.UserDoesNotExists;
            return user;
        })
};

user.authorise = (email, password) => {
    "use strict";
    return user.getUser(email, true)
        .then((user) => {
            return comparePassword(password, user.password)
                .then((validity) => {
                    if (!validity)
                        throw statusCode.Unauthorized;
                    return user;
                });
        })
};

module.exports = user;