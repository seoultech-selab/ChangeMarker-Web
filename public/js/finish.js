function finishAll() {
    for (var i = 1; i <= 5; i++) {
        var buttonId = "file" + i;
        var rgb = document.getElementById(buttonId).style.backgroundColor;
        rgb = rgb.slice(4, -1);
        rgb = rgb.split(', ');
        if (Number(rgb[2]) != 71) {
            alert("Please check incorrect files.");
            return;
        }
    }

    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = '/finish';

    form.submit();
}