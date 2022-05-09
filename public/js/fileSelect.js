const fs = require('fs');
const myers = require('myers-diff');

const baseDir = __dirname.slice(0, -10);

let useFileList = fs.readFileSync(baseDir + '/useFiles.txt', 'utf-8');
useFileList = useFileList.split('/');



module.exports.getFiles = function(filesObj) {
    var result = new Array();
    var diffNum = useFileList.length - filesObj.length;
    if (diffNum > 0) {
        var filesObjArray = new Array();
        for (var i = 0; i < filesObj.length; i++) {
            filesObjArray.push(filesObj[i].change_Id);
        }
        for (var i = 0; i < useFileList.length; i++){
            if (!(filesObjArray.includes(useFileList[i]))) {
                result.push(useFileList[i]);
            }
            if (result.length == 5)
                break;
        }
        var cnt = 0;
        while (result.length < 5) {
            result.push(filesObj[cnt].change_Id);
            cnt++;
        }
    } else {
        for (var i = 0; i < 5; i++) {
            result.push(filesObj[i].change_Id);
        }
    }

    return result;
}