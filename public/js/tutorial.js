function prevExplain() {
    var currentPage = Number(document.getElementById('current_page').innerHTML);
    var explainWindow = document.getElementById('explain_window');
    var exerciseWindow = document.getElementById('exercise_window');

    if (currentPage == 1) {
        alert("This is the first page.");
        return;
    }
    explainWindow.src = "/views/explain" + (currentPage - 1) + ".html";
    if ((currentPage - 1) >= 3 && (currentPage - 1) <= 6) {
        explainWindow.style.height = "50%";
        exerciseWindow.style.height = "49%";
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
    var checkExercise = Number(document.getElementById('checkExercise').value);
    var currentPage = Number(document.getElementById('current_page').innerHTML);

    if (checkExercise < currentPage) {
        alert('Please click the "Check!" button and confirm the codes.');
        return;
    }

    var totalPage = Number(document.getElementById('total_page').innerHTML);
    var explainWindow = document.getElementById('explain_window');
    var exerciseWindow = document.getElementById('exercise_window');
    var newPageNum = currentPage + 1;

    if (currentPage == totalPage) {
        alert("This is the last page.");
        return;
    }
    explainWindow.src = "/views/explain" + newPageNum + ".html";
    if (newPageNum >= 3 && newPageNum <= 6) {
        explainWindow.style.height = "50%";
        exerciseWindow.style.height = "49%";
        exerciseWindow.style.display = "block";
        exerciseWindow.src = "/views/explain_exercise" + newPageNum + ".html";
    }
    else {
        var totalPage = Number(document.getElementById('total_page').innerHTML);
        if (newPageNum == totalPage) {
            var startButton = document.getElementById('start_button');
            startButton.style.color = "#000";
            startButton.disabled = false;
        }
        explainWindow.style.height = "100%";
        exerciseWindow.style.display = "none";
    }
    document.getElementById('current_page').innerHTML = newPageNum;
}