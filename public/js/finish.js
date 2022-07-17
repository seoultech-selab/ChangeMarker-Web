function finishAll() {
    $.ajax({
        type: 'get',
        url: '/finish/check',
        success: function(res) {
            location.href = '/finish';
        }
    });
}