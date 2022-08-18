const scriptsWebDao = require("./ScriptsWebDao");

class ScriptsWebService {

    getByUserCode = async (user_Code) => {
        let rowData = await scriptsWebDao.findByUserCode(user_Code);
        
        let result = [];
        for (var row of rowData) {
            let value = new Object();

            value.chaingId = row.change_id;
            result.push(value);
        }

        return result;
    }
}

module.exports = new ScriptsWebService();