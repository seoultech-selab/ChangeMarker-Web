const dao = require("../../global/dao/dao");

const sqls = {
    findByWorkerId : "SELECT * FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
    updateByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `job` = ?, `java_experience` = ? WHERE (`user_code` = ?)",
    updateStatusByUserCode : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ? WHERE (`user_code` = ?)",
    updateStatusByWorkerId : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ? WHERE (`worker_id` = ?)",
    updateCreateStatusByWorkerId : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ?, `created_at` = ? WHERE (`worker_id` = ?)",
    updateTutorialCompleteStatusByWorkerId : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ?, `tutorial_completed_at` = ? WHERE (`worker_id` = ?)",
    updateMarkerCompleteStatusByWorkerId : "UPDATE `scd_benchmark`.`cmw_participants` SET `status` = ?, `marker_completed_at` = ? WHERE (`worker_id` = ?)",
    findStatusByWorkerId : "SELECT `status` FROM `scd_benchmark`.`cmw_participants` WHERE `worker_id` = ?",
    save : "INSERT INTO `scd_benchmark`.`cmw_participants` (`user_code`, `worker_id`, `job`, `java_experience`, `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5`, `status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    findAllChangeIds : "SELECT `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5` FROM `scd_benchmark`.`cmw_participants`",
};

class UserDao {

    findByWorkerId = (workerId) => {
        return dao.sqlHandler(sqls.findByWorkerId, [workerId]);
    }

    updateByUserCode = (job, javaExperience, userCode) => {
        return dao.sqlHandler(sqls.updateByUserCode, [job, javaExperience, userCode]);
    }

    updateStatusByWorkerId = (status, workerId) => {
        console.log(status);

        if (status == "started")
            return this.updateTutorialCompleteStatusByWorkerId(status, workerId);
        else if (status == "finished")
            return this.updateMarkerCompleteStatusByWorkerId(status, workerId);
        else
            return dao.sqlHandler(sqls.updateStatusByWorkerId, [status, workerId]);
    }

    updateCreateStatusByWorkerId = (status, workerId) => {
        return dao.sqlHandler(sqls.updateCreateStatusByWorkerId, [status, Date.now(), workerId]);
    }

    updateTutorialCompleteStatusByWorkerId = (status, workerId) => {
        return dao.sqlHandler(sqls.updateTutorialCompleteStatusByWorkerId, [status, Date.now(), workerId]);
    }

    updateMarkerCompleteStatusByWorkerId = (status, workerId) => {
        return dao.sqlHandler(sqls.updateMarkerCompleteStatusByWorkerId, [status, Date.now(), workerId]);
    }

    findStatusByWorkerId = (workerId) => {
        return dao.sqlHandler(sqls.findStatusByWorkerId, [workerId]);
    }

    save = (userCode, workerId, job, javaExperience, changeId1, changeId2, changeId3, changeId4, changeId5, status) => {
        return dao.sqlHandler(sqls.save, [userCode, workerId, job, javaExperience, changeId1, changeId2, changeId3, changeId4, changeId5, status, Date.now()]);
    }

    findAllChangeIds = () => {
        return dao.sqlHandler(sqls.findAllChangeIds, []);
    }
}

module.exports = new UserDao();