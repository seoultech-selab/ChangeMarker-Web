async function checkSession() {
    let lastPage = 5;
    $.ajax({
        type: 'get',
        url: getPathname() + '/survey/userInfo',
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
                checkExercise.value = lastPage;
            else if (userInfo.status == 'finished')
                checkExercise.value = lastPage;
        }
    });
}

function surveySubmit() {
    let formData = new Object();

    formData.workerId = document.getElementById("workerId").value;

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
        url: getPathname() + '/survey',
        data: formData,
        dataType: 'json',
        success: function(res) {
            let checkExercise = document.querySelector('#checkExercise')

            if (res.status == 'started' || res.status == 'finished')
                checkExercise.value = lastPage;
            else
                checkExercise.value = Number(res.status[res.status.length - 1]);
            
            let nextButton = parent.document.getElementById('next_button');
            nextButton.disabled = false;

            if (res.revisit) {
                if (res.status.startsWith('tutorial')) {
                    linkSkipped(res.status);
                }

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
                            linkSkipped(res.status);
                            break;
                    }
                });
            }
            else {
                linkSkipped("tutorial2");
            }
        }
    });
}

function linkSkipped(status) {
    if (status == "started")
            startProject();
    else if (status == "finished")
            jumpFinish();
    else if (status.startsWith('tutorial')) {
            jumpExplain(Number(status.slice(-1)));
    }
}