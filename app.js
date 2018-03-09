/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const express = require('express');
const flash = require('express-flash');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const cookieParser = require('cookie-parser');
var cons = require('consolidate');

const api = require('./routes/api');
const login = require('./routes/login');
const pay = require('./routes/pay');

const app = express();

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(session({
    secret : xConfig.crypto.SessionKey,
    resave : false,
    saveUninitialized : true,
    cookie : { secure : true }
}));
app.use(flash());app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api);
app.use('/login', login);
app.use('/pay', pay);

app.use(function (req, res, next) {
    const err = new Error('Not Found ' + req.originalUrl);
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.baseResponse = req.app.get('NODE_ENV') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;