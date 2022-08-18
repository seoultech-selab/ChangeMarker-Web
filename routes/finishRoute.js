const express = require('express');
const router = express.Router();

const userService = require('../src/domain/user/userService');
const scriptsWebService = require('../src/domain/scripts_web/scriptsWebService');


router.get('/check', async function(req, res, next) {
    let user = await userService.getByWorkerId(req.session.workerId);
    let scripts = await scriptsWebService.getByUserCode(user.userCode);

    let changeIdSet = new Set();

    for (var script of scripts) {
        changeIdSet.add(script.chaingId);
    }

    if (changeIdSet.size != 5) {
        res.status(400).send(); return;
    }

    if (user.status == 'started') {
        await userService.putStatusByWorkerId('finished', user.workerId);
        res.status(200).send(); return;
    }
    else if (user.status == 'finished') {
        res.status(200).send(); return;
    }
    else {
        res.status(500).send(); return;
    }
});

router.get('/', async function(req, res, next) {

    let user = await userService.getByWorkerId(req.session.workerId);

    if (user.status == 'finished') {
        let view = '../views/finish.ejs';
        //In case worker_id is an email.
        if(user.workerId.includes('@')) {
            view = '../views/finish_email.ejs';
        }
        res.render(view, {
            code : user.userCode
        });
    }
    else {
        res.status(500).send();
    }
});

module.exports = router;