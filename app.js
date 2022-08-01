const express= require('express');
const http = require('http');
const https = require('https')
const app = express();

const fs = require('fs');
const options = {
    key : fs.readFileSync('./ssl/private.key'), // 개인키
    cert : fs.readFileSync('./ssl/certificate.crt'), // 서버인증서
    ca : fs.readFileSync('./ssl/ca_bundle.crt'), // 루트체인
};

const indexRouter = require('./routes/index');
const emailRouter = require('./routes/indexEmail');

app.use('/', indexRouter);
app.use('/mturk', indexRouter);
app.use('/marker', emailRouter);

http.createServer(app).listen(3000);
https.createServer(options, app).listen(3001);