function confirmScript() {
    let diffNum = document.getElementById('current').value;
    let userCode = document.getElementById('userCode').value;
    let data = new Object();
    data.diffNum = diffNum;
    data.userCode = userCode;
    data = JSON.stringify(data);

    $.ajax({
        type: 'post',
        url: '/check',
        data: {data : data},
        dataType: 'json',
        success: function(res) {
            let buttonId = "file" + (res.fileCnt + 1);
            if (res.completed == 1) {
                document.getElementById(buttonId).style.backgroundColor = '#0dff47';
            }
            else if (res.completed == -1) {
                let buttonId = "file" + (res.fileCnt + 1);
                document.getElementById(buttonId).style.backgroundColor = '#fd6a78';
            }
            else {
                document.getElementById(buttonId).style.backgroundColor = '#f4f4f4';
            }
        }
    });
}