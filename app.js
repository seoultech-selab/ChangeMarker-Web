const express= require('express');
const http = require('http');
const https = require('https')
const app = express();
var path = require('path');
var logger = require('morgan');

const fs = require('fs');
const options = {
    key : fs.readFileSync('./ssl/private.key'), // 개인키
    cert : fs.readFileSync('./ssl/certificate.crt'), // 서버인증서
    ca : fs.readFileSync('./ssl/ca_bundle.crt'), // 루트체인
};

const indexRouter = require('./routes/index');
const emailRouter = require('./routes/indexEmail');

app.use(logger('common'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.get('/', async function(req, res, next){
    res.render('../views/tutorials.ejs', { 
        page : 0,
        lhsTemplate : '',
        rhsTemplate : '',
        diffNum : 0,
        storedScripts : "",
        currentFileName: "tutorial000",
        checkExercise : 0,
        totalPage: 0
    });
});
app.use('/mturk', indexRouter);
app.use('/marker', emailRouter);

http.createServer(app).listen(3000);
https.createServer(options, app).listen(3001);