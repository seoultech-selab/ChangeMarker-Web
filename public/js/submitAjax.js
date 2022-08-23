function oneScriptSubmit(data, newRow) {
    $.ajax({
        type: 'post',
        url: getPathname() + '/submit',
        data: data,
        dataType: 'json',
        error: function (req, error) {
            swal("Unexpected error has occurred. Please try again.");
            let table = document.createElement("table");
            newRow?.parentNode.removeChild(newRow);
        },
        success: function(res) {
            // confirmScript();
            // console.log(res.message);
        }
    });
}
