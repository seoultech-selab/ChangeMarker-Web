function prevExplain() {
    let currentPage = Number(document.getElementById('current_page').innerHTML);
    let explainWindow = document.getElementById('explain_window');
    let exerciseWindow = document.getElementById('exercise_window');
    let checkExercise = Number(document.getElementById('checkExercise').value);
    
    if (checkExercise + 1 >= currentPage) {
        let nextButton = document.getElementById('next_button');
        nextButton.style.color = "#393E46";
        nextButton.disabled = false;
    }

    if (currentPage == 2) {
        let prevButton = document.getElementById('prev_button');
        prevButton.style.color = "#d7d7d8";
        prevButton.disabled = true;
    }
    explainWindow.src = "/views/explain" + (currentPage - 1) + ".html";
    if ((currentPage - 1) >= 4 && (currentPage - 1) <= 7) {
        explainWindow.style.height = "39%";
        exerciseWindow.style.height = "60%";
        exerciseWindow.style.display = "block";
        exerciseWindow.src = "/views/explain_exercise" + (currentPage - 1) + ".html";
    }
    else {
        explainWindow.style.height = "100%";
        exerciseWindow.style.display = "none";
    }
    document.getElementById('current_page').innerHTML = currentPage - 1;
}

function nextExplain() {
    let checkExercise = Number(document.getElementById('checkExercise').value);
    let currentPage = Number(document.getElementById('current_page').innerHTML);

    let prevButton = document.getElementById('prev_button');
    prevButton.style.color = "#393E46";
    prevButton.disabled = false;
    
    if (checkExercise <= currentPage) {
        let nextButton = document.getElementById('next_button');
        nextButton.style.color = "#d7d7d8";
        nextButton.disabled = true;
    }

    let totalPage = Number(document.getElementById('total_page').innerHTML);
    let explainWindow = document.getElementById('explain_window');
    let exerciseWindow = document.getElementById('exercise_window');
    let newPageNum = currentPage + 1;

    if (currentPage == totalPage) {
        swal("This is the last page.");
        return;
    }
    explainWindow.src = "/views/explain" + newPageNum + ".html";
    if (newPageNum >= 4 && newPageNum <= 7) {
        explainWindow.style.height = "39%";
        exerciseWindow.style.height = "60%";
        exerciseWindow.style.display = "block";
        exerciseWindow.src = "/views/explain_exercise" + newPageNum + ".html";
    }
    else {
        let totalPage = Number(document.getElementById('total_page').innerHTML);
        explainWindow.style.height = "100%";
        exerciseWindow.style.display = "none";
    }
    document.getElementById('current_page').innerHTML = newPageNum;
}

function startProject() {
    let form = document.createElement('form');
    document.body.appendChild(form);
    form.action = window.location.href;
    form.method = "post";

    let input = document.createElement('input');
    form.appendChild(input);
    input.name = "fileNum";
    input.type = "hidden";
    input.value = "change001";
    form.submit();
}