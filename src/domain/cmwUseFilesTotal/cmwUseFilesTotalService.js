const cmwUseFilesTotalDao = require('./cmwUseFilesTotalDao');

class CmwUseFilesTotalService {

    getAllChangeIdGroup = async () => {
        let rowData = await cmwUseFilesTotalDao.findAllChangeIdGroup();

        let value = []
        for (var data of rowData) {
            value.push({ 
                changeId : data.change_id, 
                group : data.unique_group 
            });
        }

        return value;
    }

    getRandomChangeIds = async () => {
        let groups = ['changes-group2', 'changes-group3', 'changes-group4', 'changes-group5', 'changes-group6'];

        let value = [];
        for (var group of groups) {
            let data = await this.getRandomChangeId(group);
            value.push(data);
        }

        return value;
    }

    getRandomChangeId = async (group) => {
        let rowData = await cmwUseFilesTotalDao.findRandomChangeIdByGroup(group);

        if (rowData.length != 1)
            return null;

        return rowData[0].change_id;
    }
}

module.exports = new CmwUseFilesTotalService();