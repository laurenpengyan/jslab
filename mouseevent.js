
document.onmousemove = moveHandler; 

function moveHandler(evt) {
	//If the user has IE, the event needs to be initialized
	if (!evt) {
		evt = window.event;
	}
	//Else call function animateEyes and pass the coordinate X and Y of the cursor
	animateEyes(evt.clientX, evt.clientY);
}

function animateEyes(xPos, yPos) {
	//Assign variable to the ids of the images
	var rightEye = document.getElementById("rEye");
	var leftEye = document.getElementById("lEye");
	var rightEyeball = document.getElementById("rDot").style;
	var leftEyeball = document.getElementById("lDot").style;

	//Call the function newEyeballPos to change the position of the images based on the cursor position
	leftEyeball.left = newEyeballPos(xPos, leftEye.offsetLeft);
	leftEyeball.top = newEyeballPos(yPos, leftEye.offsetTop);
	rightEyeball.left = newEyeballPos(xPos, rightEye.offsetLeft);
	rightEyeball.top = newEyeballPos(yPos, rightEye.offsetTop);

	//function to get the new coordinates of the eyes.
	function newEyeballPos(currPos, eyePos) {
		return Math.min(Math.max(currPos, eyePos + 3), eyePos + 10) + "px";
	}
}

//Initialize a variable at 0
var x = 0;

//Everytime the mouse go outside of the image, the variable x increase by 1.
function myLeaveFunction() {
	document.getElementById("demo3").innerHTML = x += 1;

}
