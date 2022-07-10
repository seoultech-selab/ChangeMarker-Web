const { user } = require("../../../db/db_info");
const dao = require("../../global/dao/dao");

const sqls = {
    findByWorkerId : "SELECT * FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
    updateByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `job` = ?, `java_experience` = ? WHERE (`user_code` = ?)",
    updateStatusByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ? WHERE (`user_code` = ?)",
    findStatusByWorkerId : "SELECT `status` FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
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
}

module.exports = new UserDao();