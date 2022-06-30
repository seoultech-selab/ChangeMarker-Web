function oneScriptSubmit(data) {
    $.ajax({
        type: 'post',
        url: '/submit',
        data: data,
        dataType: 'json',
        success: function(res) {
            // confirmScript();
            // console.log(res.message);
        }
    });
}
