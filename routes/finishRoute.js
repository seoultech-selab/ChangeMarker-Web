const express = require('express');
const router = express.Router();
const userService = require('../src/domain/user/userService');

router.get('/check', async function(req, res, next) {
    let user = await userService.getByWorkerId(req.session.workerId);

    if (user.status == 'started') {
        await userService.putStatusByWorkerId('finished', user.workerId);
        res.status(200).send();
    }
    else if (user.status == 'finished') {
        res.status(200).send();
    }
    else {
        res.status(500).send();
    }
});

router.get('/', async function(req, res, next) {

    let user = await userService.getByWorkerId(req.session.workerId);

    if (user.status == 'finished') {
        res.render('../views/finish.ejs', {
            code : user.userCode
        });
    }
    else {
        res.status(500).send();
    }
});

module.exports = router;