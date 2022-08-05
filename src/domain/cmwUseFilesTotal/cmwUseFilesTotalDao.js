const dao = require("../../global/dao/dao");

const sqls = {
    selectOldCodeAndNewCodeByChangeId : "SELECT `old_code`, `new_code` FROM scd_benchmark.cmw_use_files_total WHERE `change_id`=?",
    findRandomChangeIdByGroup : "SELECT `change_id` FROM `scd_benchmark`.`cmw_use_files` WHERE `unique_group`=? order by rand() limit 1",
};

class CmwUseFilesTotalDao {
    selectOldCodeAndNewCodeByChangeId = (chagneId) => {
        return dao.sqlHandler(sqls.selectOldCodeAndNewCodeByChangeId, [chagneId]);
    }

    findRandomChangeIdByGroup = (group) => {
        return dao.sqlHandler(sqls.findRandomChangeIdByGroup, [group]);
    }
}

module.exports = new CmwUseFilesTotalDao();