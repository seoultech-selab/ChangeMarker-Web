const express= require('express');
const app =express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dbConfig = require('../db/db_info');

const sessionStore = new MySQLStore(dbConfig);

const tutorial = require('./tutorialRoute');
const main = require('./mainRoute');

router.use(
    session({
        secret: "secret key",
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    })
);

router.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
router.use('/src', express.static(path.join(__dirname, '../src')));
router.use('/public', express.static(path.join(__dirname, '../public')));
router.use('/views', express.static(path.join(__dirname, '../views')));

router.use('/', tutorial);
router.get('/v2', tutorial);
router.use('/', main);

const submit = require('./submitRoute');
const deleteRoute = require('./deleteRoute');
const check = require('./checkRoute');
const tutorialCheck = require('./tutorialCheckRoute');
const surveySubmit = require('./surveySubmitRoute');
const test = require('./test');
const userRoute = require('./userRoute');
const finishRoute = require('./finishRoute');

router.use('/submit', submit);
router.delete('/delete', deleteRoute);
router.use('/check', check);
router.use('/tutorialCheck', tutorialCheck);
router.use('/survey', surveySubmit);
router.use('/user', userRoute);
router.use('/finish', finishRoute);

// router.use('/finish', function(req, res, next) {
//     res.render('../views/finish.ejs', {
//         code : "Thank you for participating in the test."
//     });
// });

const { request } = require('http');

// router.use('/test', test);

module.exports = router;