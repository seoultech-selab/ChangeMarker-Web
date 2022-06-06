function oneScriptDelete(data) {
    $.ajax({
        type: 'delete',
        url: '/delete',
        data: data,
        dataType: 'json',
        success: function(res) {
            confirmScript();
            // console.log(res.message);
        }
    });
}
