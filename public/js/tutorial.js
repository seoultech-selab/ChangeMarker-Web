function getPathname() {
    let pathname = location.pathname;
    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }
    return pathname;
}

async function prev() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    if (currentPage == 1)
        return;

    location.href = getPathname() + "/?page=" + (currentPage - 1);
}

async function next() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);
    let totalPage = Number(document.getElementById('total_page').innerHTML);

    if (currentPage == totalPage)
        return;

    if (page == 3 || page == 4) {
        updateCheckExercise();
    }

    location.href = getPathname() + "/?page=" + (currentPage + 1);
}

async function prev_email() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    if (currentPage == 1)
        return;

    location.href = "/marker/?page=" + (currentPage - 1);
}

async function next_email() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);
    let totalPage = Number(document.getElementById('total_page').innerHTML);

    if (currentPage == totalPage)
        return;

    location.href = "/marker/?page=" + (currentPage + 1);
}

function startProject() {
    let form = document.createElement('form');
    document.body.appendChild(form);
    form.action = getPathname() + '/';
    form.method = "post";

    /* pageMove.js > moveTutorial() 과 연관됨 */
    let pageCheck = document.querySelector("#page").dataset.value;
    //console.log(pageCheck);
    localStorage.setItem("page", pageCheck);

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
    location.href = getPathname() + '/finish';
}

function jumpExplain(num) {
    location.href = getPathname() + '/?page='+num;
}

let widthRatio=0.5, heightRatio=0.85, range=0.05;
let isEnable = 0;
let leftDiffY = new Array();
let rightDiffY = new Array();

function move_inner(e) {
    let left = document.getElementById("left");
    let right = document.getElementById("right")
    let relativeY = document.querySelector("section#section").clientHeight * (heightRatio - 0.15) * 0.5;

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

function checkSurveyEmail() {
    let workerId = document.getElementById('workerId').value;
    let regexEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    if (workerId.length == 0) {
        swal("Please enter your e-mail address.");
    }

    if (workerId.match(regexEmail) == null) {
        swal("Please check the e-mail address!");
    } 
    else {
        surveySubmit();
    }
}

function initTutorial() {
    let checkExercise = Number(document.querySelector('#checkExercise').value);
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    if (currentPage == 1) {
        document.querySelector('#prev_button').disabled = true;
        document.querySelector('#next_button').disabled = true;
    }

    if (currentPage == 5) {
        document.querySelector('#next_button').disabled = true;
    }

    storeY();


    if (currentPage == 1) {
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