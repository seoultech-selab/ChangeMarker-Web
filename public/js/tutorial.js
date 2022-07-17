async function prev() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    if (currentPage == 1)
        return;

    location.href = "/?page=" + (currentPage - 1);
}

async function next() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);
    let totalPage = Number(document.getElementById('total_page').innerHTML);

    if (currentPage == totalPage)
        return;

    location.href = "/?page=" + (currentPage + 1);
}

function startProject() {
    let form = document.createElement('form');
    document.body.appendChild(form);
    form.action = '/';
    form.method = "post";

    let input = document.createElement('input');
    form.appendChild(input);
    input.name = "fileNum";
    input.type = "hidden";
    input.value = "change001";
    form.submit();

    $.ajax({
        type: 'put',
        url: '/survey/userInfo',
        data: {status : 'started'},
        dataType : 'json',
        success: function(res) {}
      });
}

function jumpFinish() {
    location.href = '/finish';
}

function jumpExplain(num) {
    location.href = '/?page='+num;
}

let widthRatio=0.5, heightRatio=0.85, range=0.05;
let isEnable = 0;
let leftDiffY = new Array();
let rightDiffY = new Array();

function move_inner(e) {
    let left = document.getElementById("left");
    let right = document.getElementById("right")
    let relativeY = window.innerHeight * (heightRatio - 0.15) * 0.5;

    left.scrollTo(0, leftDiffY[e] - relativeY);
    right.scrollTo(0, rightDiffY[e] - relativeY);
}

function storeY() {
    let diffNum = document.getElementById("diffNum").value;
    for (let i = 0; i < diffNum; i++) {
        let leftY = document.getElementById("left").getBoundingClientRect().top;
        let target = document.getElementById("#l" + i).getBoundingClientRect().top;
        leftDiffY.push(target - leftY);

        let rightY = document.getElementById("right").getBoundingClientRect().top;
        target = document.getElementById("#r" + i).getBoundingClientRect().top
        rightDiffY.push(target - rightY);
    }
}

function checkSurvey() {
    let workerId = document.getElementById('workerId').value;
    if (workerId.length == 0) {
        swal("Please check the worker ID!");
    }
    else {
        surveySubmit();
    }
}

function initTutorial() {
    let checkExercise = Number(document.querySelector('#checkExercise').value);
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    if (currentPage >= checkExercise) {
        document.querySelector('#next_button').disabled = true;
    }

    if (currentPage == 1) {
        document.querySelector('#prev_button').disabled = true;
    }

    if (currentPage == 8) {
        document.querySelector('#next_button').disabled = true;
    }


    if (currentPage == 2) {
        $.ajax({
            type: 'get',
            url: '/user/surveyInfo',
            success: function(res) {
                initSurveyForm(res);
            }
        });
    }

    document.querySelector('#left');
            if (document.querySelector('#left').innerText == "")
                document.querySelector('#exercise_window').style.display = "none";
}

function initSurveyForm(survey) {
    document.getElementById("workerId").value = survey.workerId;

    let formJob = document.getElementById("form_job");
    let jobInputs = formJob.getElementsByTagName("input");
    let formJava = document.getElementById("form_java");
    let javaInputs = formJava.getElementsByTagName("input");

    for (let i = 0; i < jobInputs.length; i++) {
        if (jobInputs[i].value == survey.job) {
            jobInputs[i].checked = true;
            break;
        }
    }
    for (let i = 0; i < javaInputs.length; i++) {
        if (javaInputs[i].value == survey.java) {
            javaInputs[i].checked = true;
            break;
        }
    }
}