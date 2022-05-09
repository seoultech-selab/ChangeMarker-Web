var widthRatio=0.5, heightRatio=0.85, range=0.05;
var isEnable = 0;
var leftDiffY = new Array();
var rightDiffY = new Array();

function on_mouse_down_hr1() {
    isEnable = 1;
    return false;
}

function on_mouse_down_hr2() {
    isEnable = 2;
    return false;
}

function on_mouse_up() {
    isEnable = 0;
    return false;
}

function on_mouse_move() {
    if (isEnable == 1) {
        var tmp = event.clientX  / window.innerWidth;
        if (tmp > range && tmp < 1 - range) {
            widthRatio = tmp;
            document.getElementById("left").style.width = window.innerWidth * widthRatio - 20 + "px";
            document.getElementById("right").style.width = window.innerWidth * (1 - widthRatio) - 20 + "px";
        }
    } else if (isEnable == 2) {
        var tmp = event.clientY / window.innerHeight;
        if (tmp - 0.15 > range && tmp < 1 - range) {
            heightRatio = tmp;
            document.getElementById("section").style.height = window.innerHeight * heightRatio - 115 + "px";
            document.getElementById("footer").style.height = window.innerHeight * (1 - heightRatio) - 15 + "px";
        }
    }
}

function on_mouse_over1() {
    document.body.style.cursor = 'e-resize';
}

function on_mouse_over2() {
    document.body.style.cursor = 'n-resize';
}

function on_mouse_out() {
    document.body.style.cursor = 'default';
}

function window_on_resize() {
    document.getElementById("left").style.width = window.innerWidth * widthRatio - 20 + "px";
    document.getElementById("right").style.width = window.innerWidth * (1 - widthRatio) - 20 + "px";
    document.getElementById("section").style.height = window.innerHeight * heightRatio - 115 + "px";
    document.getElementById("footer").style.height = window.innerHeight * (1 - heightRatio) - 15 + "px";
}

function move_inner(e) {
    var left = document.getElementById("left");
    var right = document.getElementById("right")
    var relativeY = window.innerHeight * (heightRatio - 0.15) * 0.5;

    left.scrollTo(0, leftDiffY[e] - relativeY);
    right.scrollTo(0, rightDiffY[e] - relativeY);
}

function storeY() {
    var diffNum = document.getElementById("diffNum").value;
    for (var i = 0; i < diffNum; i++) {
        var leftY = document.getElementById("left").getBoundingClientRect().top;
        var target = document.getElementById("#l" + i).getBoundingClientRect().top;
        leftDiffY.push(target - leftY);

        var rightY = document.getElementById("right").getBoundingClientRect().top;
        target = document.getElementById("#r" + i).getBoundingClientRect().top
        rightDiffY.push(target - rightY);
    }
}