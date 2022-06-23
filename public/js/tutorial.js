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
    if ((currentPage - 1) >= 3 && (currentPage - 1) <= 6) {
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
        alert("This is the last page.");
        return;
    }
    explainWindow.src = "/views/explain" + newPageNum + ".html";
    if (newPageNum >= 3 && newPageNum <= 6) {
        explainWindow.style.height = "39%";
        exerciseWindow.style.height = "60%";
        exerciseWindow.style.display = "block";
        exerciseWindow.src = "/views/explain_exercise" + newPageNum + ".html";
    }
    else {
        let totalPage = Number(document.getElementById('total_page').innerHTML);
        // if (newPageNum == totalPage) {
        //     let startButton = document.getElementById('start_button');
        //     startButton.style.color = "#000";
        //     startButton.disabled = false;
        // }
        explainWindow.style.height = "100%";
        exerciseWindow.style.display = "none";
    }
    document.getElementById('current_page').innerHTML = newPageNum;
}

function startProject() {
    let form = document.createElement('form');
    document.body.appendChild(form);
    form.action = "/";
    form.method = "post";

    let input = document.createElement('input');
    form.appendChild(input);
    input.name = "fileNum";
    input.type = "hidden";
    input.value = "change001";
    form.submit();
}