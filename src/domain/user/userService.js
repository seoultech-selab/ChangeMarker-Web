const userDao = require("./userDao");

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
}

module.exports = new UserService();