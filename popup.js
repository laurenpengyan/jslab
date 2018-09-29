window.onload = py_newWinLinks;

function py_newWinLinks() {
	for (var i=0; i<document.links.length; i++) {
		if (document.links[i].className == "py_newWin") {
			document.links[i].onclick = py_newWindow;
		}
	}
}

function py_newWindow() {
	var mpadWindow = window.open(this.href,"makeupWindow","width=500,height=300,top=250,left=650");
	mpadWindow.focus();
	return false;
}
