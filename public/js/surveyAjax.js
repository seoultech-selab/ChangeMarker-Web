async function checkSession() {
    $.ajax({
        type: 'get',
        url: '/survey/userInfo',
        success: function(res) {
            let userInfo = res.userInfo;

            if (userInfo == undefined || userInfo == null)
                return;
            
            document.getElementById("workerId").value = userInfo.workerId;

            let formJob = document.getElementById("form_job");
            let jobInputs = formJob.getElementsByTagName("input");
            let formJava = document.getElementById("form_java");
            let javaInputs = formJava.getElementsByTagName("input");

            for (let i = 0; i < jobInputs.length; i++) {
                if (jobInputs[i].value == userInfo.job) {
                    jobInputs[i].checked = true;
                    break;
                }
            }
            for (let i = 0; i < javaInputs.length; i++) {
                if (javaInputs[i].value == userInfo.javaExperience) {
                    javaInputs[i].checked = true;
                    break;
                }
            }

            let prevButton = parent.document.getElementById('next_button');
            prevButton.disabled = false;
            prevButton.style.color = "#393E46";

            let checkExercise = parent.document.querySelector('#checkExercise');
            if (userInfo.status.startsWith('explain')) {
                checkExercise.value = userInfo.status.slice(-1);
            }
            else if (userInfo.status == 'started')
                checkExercise.value = 8;
            else if (userInfo.status == 'finished')
                checkExercise.value = 8;
        }
    });
}

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
                let nextButton = parent.document.getElementById('next_button');
                nextButton.style.color = "#393E46";
                nextButton.disabled = false;
                checkSession();
                swal("You already started your task before. Do you want to skip and directly jumps to the tasks?", {
                    buttons: {
                        cancel: "No. I want start tutorial again.",
                        catch: {
                            text: "I will skip.",
                            value: "catch"
                        }
                    }
                })
                .then((value) => {
                    switch (value)  {
                        case "cancel":
                            break;
                        case "catch":
                            linkSkipped();
                            break;
                    }
                });
            }
        } 
    });
}

function linkSkipped() {
    $.ajax({
        type: 'post',
        data: { workerId : document.getElementById("workerId").value },
        dataType: 'json',
        url: '/survey/userInfo/workerId',
        success: function(res) {
            let status = res.status;

            if (status == "started")
                parent.startProject();
            else if (status == "finished")
                parent.jumpFinish();
            else if (status.startsWith('explain')) {
                parent.jumpExplain(Number(status.slice(-1)));
            }
        }
    });
}