const userDao = require("./userDao");
const cmwUseFilesTotalService = require('../cmwUseFilesTotal/cmwUseFilesTotalService');
const uuid = require('uuid');
const { findByWorkerId } = require("./userDao");

class UserService {
    getBySession = async (session) => {
        let rowData = await userDao.findByWorkerId(session.workerId);

        if (rowData.length < 1)
            return undefined;

        let value = new Object();
        value.workerId = rowData[0].worker_id;
        value.job = rowData[0].job;
        value.javaExperience = rowData[0].java_experience;
        value.changeId = [
            rowData[0].change_id1,
            rowData[0].change_id2,
            rowData[0].change_id3,
            rowData[0].change_id4,
            rowData[0].change_id5,
        ];
        value.status = rowData[0].status;

        return value;
    }

    putUserInfoByUserCode = async (job, javaExperience, userCode) => {
        return userDao.updateByUserCode(job, javaExperience, userCode);
    }

    putStatusByUserCode = async (status, userCode) => {
        return userDao.updateStatusByUserCode(status, userCode);
    }

    getStatusByWorkerid = async (workerId) => {
        let rowData = await userDao.findStatusByWorkerId(workerId);

        if (rowData.length != 1)
            return undefined;

        let value = new Object();
        value.status = rowData[0].status;

        return value;
    }

    getByWorkerId = async (workerId) => {
        let rowData = await userDao.findByWorkerId(workerId);

        if (rowData.length != 1)
            return null;

        let value = new Object();

        value.userCode = rowData[0].user_code;
        value.workerId = rowData[0].workerId;
        value.job = rowData[0].job;
        value.javaExperience = rowData[0].java_experience;
        value.changeId1 = rowData[0].change_id1;
        value.changeId2 = rowData[0].change_id2;
        value.changeId3 = rowData[0].change_id3;
        value.changeId4 = rowData[0].change_id4;
        value.changeId5 = rowData[0].change_id5;
        value.status = rowData[0].status;

        return value;
    }

    postUser = async (workerId, job, javaExperience) => {
        let user = await this.getByWorkerId(workerId);

        if (user != null || user  != undefined)
            return;

        let userCode = uuid.v4();
        let changeId1;
        let changeId2;
        let changeId3;
        let changeId4;
        let changeId5;
        let status = "tutorial4";

        [changeId1, changeId2, changeId3, changeId4, changeId5] = await cmwUseFilesTotalService.getRandomChangeIds();

        await userDao.save(userCode, workerId, job, javaExperience, changeId1, changeId2, changeId3, changeId4, changeId5, status);
    }
}

module.exports = new UserService();