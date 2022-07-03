function scriptSubmit() {
    if (confirm("Are you sure?\nYou cannot change again.")) {
        if (getCheck() == 0) {
            let scripts = new Array();
            let table = document.getElementById("edit_scripts");
            let trs = table.children[0].children;
            let code = document.getElementById("userCode").value;
            let current = document.getElementById("current").value;

            for (let i = 1; i < trs.length; i++) {
                let script = new Object();
                script.user_code = code;
                script.type = trs[i].children[0].innerText;
                script.old_code = trs[i].children[1].innerText;
                script.line_number_old = trs[i].children[2].innerText;
                script.new_code = trs[i].children[3].innerText;
                script.line_number_new = trs[i].children[4].innerText;
                script.change_id = current;
                scripts.push(script);
            }

            let form = document.createElement('form');
            document.body.appendChild(form);
            form.action = window.location.href + "/submit";
            form.method = "post";

            let input = document.createElement('input');
            form.appendChild(input);
            input.name = "scripts";
            input.type = "hidden";
            input.value = JSON.stringify(scripts);
            form.submit();

        } else {
            GenController(0);
        }
    } else {
    }
}