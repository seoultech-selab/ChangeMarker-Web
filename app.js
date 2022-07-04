const express= require('express');
const http = require('http');
const app = express();

const hostname = '0.0.0.0';
const port = 3000;
// 117.17.198.111:3000

const server = http.createServer(app);

server.listen(port, hostname, () => {
    // console.log(`Server running at http://${hostname}:${port}`);
    console.log("Server is running!");
});

const indexRouter = require('./routes/index');

app.use('/', indexRouter);