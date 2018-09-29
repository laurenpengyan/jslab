window.onload = py_newWinLinks; // Calls the py_newWinLinks function when the window finishes loading.

/*
Onload event handler that calls a function name py_newWinLinks
TO cycles through all the links on the page and to see if any of the
links include a class of py_newWin. If so, when the link is clicked, the
function calls the py_newWindow function.
*/
function py_newWinLinks() {
    // Cycle through all the links on the page
    for (var i = 0; i < document.links.length; i++) {
        // To check if the link needs to open a new popup window by checking the class
        if (document.links[i].className == "py_newWin") {
            // Set the link's callback so that when clicked, show the link content in the pop up window
            document.links[i].onclick = py_newWindow;
        }
    }
}

function py_newWindow() {
    var mpadWindow = window.open(this.href, "makeupWindow", "width=500,height=300,top=250,left=650");
    mpadWindow.focus();
    return false;
}