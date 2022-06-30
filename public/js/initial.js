function init() {
    document.getElementById("hr1").onmousedown = on_mouse_down_hr1;
    document.getElementById("hr1").onmouseover = on_mouse_over1;
    document.getElementById("hr1").onmouseout = on_mouse_out;

    document.getElementById("hr2").onmousedown = on_mouse_down_hr2;
    document.getElementById("hr2").onmouseover = on_mouse_over2;
    document.getElementById("hr2").onmouseout = on_mouse_out;
    document.onmouseup = on_mouse_up;
    document.onmousemove = on_mouse_move;
    window.onresize = window_on_resize;
    storeY();

    document.getElementById('left').onmouseup = storeSelectionLeft;
    document.getElementById('right').onmouseup = storeSelectionRight;
    document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
    document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
    document.addEventListener('click', handleClearContextMenu, false);
}