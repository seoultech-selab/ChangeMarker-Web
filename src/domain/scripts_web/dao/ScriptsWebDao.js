const mysql = require('mysql');
const dao = require("/src/global/dao/dao")

const sqls = {
    findByUserCodeAndChangeId : "SELECT * FROM `scd_benchmark`.`scripts_web` WHERE (`user_code` = ? AND `change_id` = ?)",
    deleteById : "DELETE FROM `scd_benchmark`.`scripts_web` WHERE (`id` = ?);",
    insertInto : "INSERT INTO `scd_benchmark`.`scripts_web` (`user_code`,`type`,`old_code`,`line_number_old`,`new_code`,`line_number_new`,`change_id`) VALUES (?, ?, ?, ?, ?, ?, ?);"
};

class ScriptsWebDao {
    findByUserCodeAndChangeId = (user_Code, changeId) => {
        return dao.sqlHandler(sqls.findByUserCode, [userCode, changeId]);
    }

    deleteById = id => {
        return dao.sqlHandler(sqls.deleteById, [id]);
    }

    insertInto = (userCode, type, oldCode, lineNumberOld, newCode, lineNumberNew) => {
        
    }
}

module.exports = new ScriptsWebDao();