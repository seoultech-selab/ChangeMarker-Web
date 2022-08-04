function oneScriptSubmit(data) {
    $.ajax({
        type: 'post',
        url: getPathname() + '/submit',
        data: data,
        dataType: 'json',
        success: function(res) {
            // confirmScript();
            // console.log(res.message);
        }
    });
}
