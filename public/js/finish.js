function finishAll() {
    // for (let i = 1; i <= 5; i++) {
    //     let buttonId = "file" + i;
    //     let rgb = document.getElementById(buttonId).style.backgroundColor;
    //     rgb = rgb.slice(4, -1);
    //     rgb = rgb.split(', ');
    //     if (Number(rgb[2]) != 71) {
    //         swal("Please check incorrect files.");
    //         return;
    //     }
    // }

    let form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    let href = window.location.href;
    if (href.endsWith('/'))
        form.action = href + 'finish';
    else
        form.action = href + '/finish';

    form.submit();
}