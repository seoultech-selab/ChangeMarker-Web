function getPathname() {
    let pathname = location.pathname;
    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }
    return pathname;
}

function finishAll() {
    $.ajax({
        type: 'get',
        url: getPathname() + '/finish/check',
        error: function(err) {
            swal(
                "There are parts you missed. Please check again.\n" + 
                "Tip: a box in the middle indicates a changed part"
            );
        },
        success: function(res) {
            location.href = getPathname() + '/finish';
        }
    });
}