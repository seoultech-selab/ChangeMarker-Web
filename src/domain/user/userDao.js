const dao = require("../../global/dao/dao");

const sqls = {
    findByWorkerId : "SELECT * FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
    updateByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `job` = ?, `java_experience` = ? WHERE (`user_code` = ?)",
    updateStatusByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ? WHERE (`user_code` = ?)",
    findStatusByWorkerId : "SELECT `status` FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
    save : "INSERT INTO `scd_benchmark`.`cmw_participants` (`user_code`, `worker_id`, `job`, `java_experience`, `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    findAllChangeIds : "SELECT `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5` FROM `scd_benchmark`.`cmw_participants`",
};

class UserDao {

    findByWorkerId = (workerId) => {
        return dao.sqlHandler(sqls.findByWorkerId, [workerId]);
    }

    updateByUserCode = (job, javaExperience, userCode) => {
        return dao.sqlHandler(sqls.updateByUserCode, [job, javaExperience, userCode]);
    }

    updateStatusByUserCode = (status, userCode) => {
        return dao.sqlHandler(sqls.updateStatusByUserCode, [status, userCode]);
    }

    findStatusByWorkerId = (workerId) => {
        return dao.sqlHandler(sqls.findStatusByWorkerId, [workerId]);
    }

    save = (userCode, workerId, job, javaExperience, changeId1, changeId2, changeId3, changeId4, changeId5, status) => {
        return dao.sqlHandler(sqls.save, [userCode, workerId, job, javaExperience, changeId1, changeId2, changeId3, changeId4, changeId5, status]);
    }

    findAllChangeIds = () => {
        return dao.sqlHandler(sqls.findAllChangeIds, []);
    }
}

module.exports = new UserDao();