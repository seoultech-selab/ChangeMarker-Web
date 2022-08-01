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
        success: function(res) {
            location.href = getPathname() + '/finish';
        }
    });
}