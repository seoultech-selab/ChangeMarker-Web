function scriptSubmit() {
    if (confirm("Are you sure?\nYou cannot change again.")) {
        if (getCheck() == 0) {
            var scripts = new Array();
            var table = document.getElementById("edit_scripts");
            var trs = table.children[0].children;
            var code = document.getElementById("userCode").value;
            var current = document.getElementById("current").value;

            for (var i = 1; i < trs.length; i++) {
                var script = new Object();
                script.user_code = code;
                script.type = trs[i].children[0].innerText;
                script.old_code = trs[i].children[1].innerText;
                script.line_number_old = trs[i].children[2].innerText;
                script.new_code = trs[i].children[3].innerText;
                script.line_number_new = trs[i].children[4].innerText;
                script.change_id = current;
                scripts.push(script);
            }

            var form = document.createElement('form');
            document.body.appendChild(form);
            form.action = "/submit";
            form.method = "post";

            var input = document.createElement('input');
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