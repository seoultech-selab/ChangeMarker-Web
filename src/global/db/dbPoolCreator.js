const mysql = require('mysql');
const connectionSetting = require('../../../db/db_info');

module.exports = (function () {
    let dbPool;
    const initiate = async () => {
        return await mysql.createPool(connectionSetting)
    }
    return {
        getPool: async function () {
            if (!dbPool) {
                dbPool = await initiate();
                return dbPool
            }
            else return dbPool;
        }
    }
})();