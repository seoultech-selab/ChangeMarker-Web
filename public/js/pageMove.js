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
        form.action = window.location.href;
    
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
        form.action = window.location.href;
    
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
    form.action = window.location.href;

    let input = document.createElement('input');
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "fileCnt");
    input.setAttribute("value", val - 1);
    
    form.appendChild(input);
    form.submit();
}

function getPathname() {
    let pathname = location.pathname;
    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }
    return pathname;
}

async function moveTutorial() {
    let pathname = getPathname();
    let names = pathname.split("/");

    if (names.length <= 1)
        location.href = "/";
    else if (names[1] == "finish")
        location.href =  "/";
    else
        location.href = "/" + names[1];
}