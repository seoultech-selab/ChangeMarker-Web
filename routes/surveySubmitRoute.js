const express = require('express');
const router = express.Router();

const userService = require('../src/domain/user/userService');

router.get('/userInfo', async function(req, res, next) {
    let value = await userService.getBySession(req.session);
    res.status(200).send({userInfo : value});
});

router.post('/userInfo/workerId', async function(req, res, next) {
    let value = await userService.getStatusByWorkerid(req.body.workerId);
    res.status(200).send(value);
});

router.put('/userInfo', async function(req, res, next) {
    let value = await userService.getStatusByWorkerid(req.session.workerId);
    if (value.status == 'finished') {
        res.status(200).send(); return;
    }
    await userService.putStatusByWorkerId(req.body.status, req.session.workerId);
    res.status(200).send();
});

router.post('/', async function(req, res, next) {
    req.session.workerId = req.body.workerId;

    let workerId = req.body.workerId;
    let job = req.body.job;
    let javaExperience = req.body.java;

    let user = await userService.getByWorkerId(workerId);

    let ret = new Object();

    if (user != null) {
        ret.status = user.status;
        ret.revisit = true;
    }
    else {
        await userService.postUser(workerId, job, javaExperience);
        ret.status = 'tutorial004';
        ret.revisit = false;
    }

    res.status(200).send(ret);
});

module.exports = router;