function surveySubmit() {
    let formData = new Object();
    formData.user_code = document.getElementById("userCode").value;
    formData.workerId = document.getElementById("workerId").value;
    // formData.job = document.getElementById("job").value;
    let formJob = document.getElementById("form_job");
    let jobInputs = formJob.getElementsByTagName("input");
    let formJava = document.getElementById("form_java");
    let javaInputs = formJava.getElementsByTagName("input");
    for (let i = 0; i < jobInputs.length; i++) {
        if (jobInputs[i].checked) {
            formData.job = jobInputs[i].value;
            break;
        }
    }
    for (let i = 0; i < javaInputs.length; i++) {
        if (javaInputs[i].checked) {
            formData.java = javaInputs[i].value;
            break;
        }
    }
    $.ajax({
        type: 'post',
        url: '/survey',
        data: formData,
        dataType: 'json',
        success: function(res) {
            if (res.message == 'first') {
                let nextButton = parent.document.getElementById('next_button');
                nextButton.style.color = "#393E46";
                nextButton.disabled = false;
            }
            else {
                parent.startProject();
            }
        } 
    });
}
