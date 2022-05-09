async function moveNext() {
    var fileCnt = Number($('#fileCnt').val()) + 1;
    if (fileCnt == 5) {
        alert("This is the last page.")
        return;
    }
    else {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = '/';
    
        var input = document.createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "fileCnt");
        input.setAttribute("value", fileCnt);
        
        form.appendChild(input);
        form.submit();
    }
}

async function movePrev() {
    var fileCnt = Number($('#fileCnt').val()) - 1;
    if (fileCnt < 0) {
        alert("This is the first page.")
        return;
    }
    else {
        var form = document.createElement('form');
        document.body.appendChild(form);
        form.method = 'post';
        form.action = '/';
    
        var input = document.createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "fileCnt");
        input.setAttribute("value", fileCnt);
        
        form.appendChild(input);
        form.submit();
    }
}

async function movePage(val) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = '/';

    var input = document.createElement('input');
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "fileCnt");
    input.setAttribute("value", val - 1);
    
    form.appendChild(input);
    form.submit();
}