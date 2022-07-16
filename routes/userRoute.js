const express = require('express');
const router = express.Router();
const userService = require('../src/domain/user/userService');

router.get("/surveyInfo", async function(req, res, next) {
    let workerId = req.session.workerId;
    
    if (workerId == null || workerId == undefined) {
        res.status(404).send(); return;
    }

    let user = await userService.getByWorkerId(workerId);

    if (user == null || user == undefined) {
        res.status(404).send(); return;
    }

    let ret = new Object();

    ret.workerId = workerId;
    ret.job = user.job;
    ret.java = user.javaExperience;
    ret.status = user.status;

    res.status(200).send(ret);
});

module.exports = router;