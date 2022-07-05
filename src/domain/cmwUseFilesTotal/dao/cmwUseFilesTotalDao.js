const mysql = require('mysql');
const dao = require("../../../global/dao/dao")

const sqls = {
    selectOldCodeAndNewCodeByChangeId : "SELECT `old_code`, `new_code` FROM scd_benchmark.cmw_use_files_total WHERE `change_id`=?"
};

class CmwUseFilesTotalDao {
    selectOldCodeAndNewCodeByChangeId = (chagneId) => {
        return dao.sqlHandler(sqls.selectOldCodeAndNewCodeByChangeId, [chagneId]);
    }
}

module.exports = new CmwUseFilesTotalDao();