function oneScriptDelete(data) {
    $.ajax({
        type: 'delete',
        url: getPathname() + '/delete',
        data: data,
        dataType: 'json',
        error: function (req, error) {
            swal("Unexpected error has occurred. Please try again.");
        },
        success: function(res) {
            // confirmScript();
            // console.log(res.message);
        }
    });
}
