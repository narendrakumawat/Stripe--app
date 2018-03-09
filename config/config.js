/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const fs = require('fs');
const path= require('path');
let config = null;

if (process.env[ 'NODE_ENV' ] === "live") {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, './config_debug.json')));
    config.debugMode = false;
    config.dbConfig.url = process.env.MONGODB_URI || config.dbConfig.url;
    config.port = process.env.PORT || config.port;
}
else {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, './config_debug.json')));
    config.debugMode = true;
}

config.localIP = require('../src/ip')(config.port);
config.crypto.TokenKey = fs.readFileSync(path.join(__dirname, config.crypto.TokenKey));
config.crypto.SessionKey = fs.readFileSync(path.join(__dirname, config.crypto.SessionKey));
config.crypto.MinPasswordIterations = Math.max(1, config.crypto.MinPasswordIterations);
config.crypto.MaxPasswordIterations = Math.max(1, Math.min(99, config.crypto.MaxPasswordIterations));

require('./dbConnect')(`${config.dbConfig.url}/${config.dbConfig.db}`);

global.xConfig = config;
module.exports = config;