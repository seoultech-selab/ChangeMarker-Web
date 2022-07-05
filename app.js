const express= require('express');
const https = require('https');
const app = express();

const fs = require('fs');
const options = {
    keys : fs.readFileSync('/ssl/key.pem'), // 개인키
    cert : fs.readFileSync('/ssl/crt.pem'), // 서버인증서
    ca : fs.readFileSync('/ssl/chain.pem'), // 루트체인
};

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('hello SecureSign Port:80\n');
}).listen(80);

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('hello SecureSign Port:443\n');
}).listen(443);

// const hostname = '0.0.0.0';
// const port = 3030;

// const server = http.createServer(app);

// server.listen(port, hostname, () => {
//     // console.log(`Server running at http://${hostname}:${port}`);
//     console.log("Server is running!");
// });

const indexRouter = require('./routes/index');

app.use('/', indexRouter);