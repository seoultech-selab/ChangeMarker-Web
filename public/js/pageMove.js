async function moveNext() {
    let fileCnt = Number($('#fileCnt').val()) + 1;
    if (fileCnt == 5) {
        swal("This is the last page.")
        return;
    }
    else {
        let form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = '/';
    
        let input = document.createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "fileCnt");
        input.setAttribute("value", fileCnt);
        
        form.appendChild(input);
        form.submit();
    }
}

async function movePrev() {
    let fileCnt = Number($('#fileCnt').val()) - 1;
    if (fileCnt < 0) {
        swal("This is the first page.")
        return;
    }
    else {
        let form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = '/';
    
        let input = document.createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "fileCnt");
        input.setAttribute("value", fileCnt);
        
        form.appendChild(input);
        form.submit();
    }
}

async function movePage(val) {
    let form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = '/';

    let input = document.createElement('input');
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "fileCnt");
    input.setAttribute("value", val - 1);
    
    form.appendChild(input);
    form.submit();
}