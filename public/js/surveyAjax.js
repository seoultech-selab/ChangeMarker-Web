function surveySubmit() {
    let formData = new Object();
    formData.user_code = document.getElementById("userCode").value;
    formData.workerId = document.getElementById("workerId").value;
    // formData.job = document.getElementById("job").value;
    let formJob = document.getElementById("form_job");
    console.log(formJob.getElementsByTagName("input"));
    let jobInputs = formJob.getElementsByTagName("input");
    for (let i = 0; i < jobInputs.length; i ++) {
        if (jobInputs[i].checked) {
            formData.job = jobInputs[i].value;
            break;
        }
    }
    $.ajax({
        type: 'post',
        url: '/survey',
        data: formData,
        dataType: 'json',
        success: function(res) {
            parent.startProject();
        } 
    });
}
