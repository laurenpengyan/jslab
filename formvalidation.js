window.onload = initForm;

function initForm() {
	document.forms[0].onsubmit = validForm;
	document.getElementById("sunroof").onclick = doorSet;
	document.getElementById("fourDoor").onclick = fourDoorSet;
	document.getElementById("withDependent").onclick = withDependentClick;
}

function validForm() {
	var allGood = true;
	var allTags = document.forms[0].getElementsByTagName("*");

	for (var i = 0; i < allTags.length; i++) {
		if (!validTag(allTags[i])) {
			allGood = false;
		}
	}
	return allGood;

	function validTag(thisTag) {
		var outClass = "";
		var allClasses = thisTag.className.split(" ");

		for (var j = 0; j < allClasses.length; j++) {
			outClass += validBasedOnClass(allClasses[j]) + " ";
		}

		thisTag.className = outClass;

		if (outClass.indexOf("invalid") > -1) {
			invalidLabel(thisTag.parentNode);
			thisTag.focus();
			if (thisTag.nodeName == "INPUT") {
				thisTag.select();
			}
			return false;
		}
		return true;

		function validBasedOnClass(thisClass) {
			var classBack = "";

			switch (thisClass) {
				case "":
				case "invalid":
					break;
				case "reqd":
					if (allGood && thisTag.value == "") {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				case "radio":
					if (allGood && !radioPicked(thisTag.name)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				case "isNum":
					if (allGood && !isNum(thisTag.value)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				case "isZip":
					if (allGood && !isZipRegEx(thisTag.value)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				case "email":
					if (allGood && !validEmailRegEx(thisTag.value)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				case "phone":
					if (allGood && !validPhoneRegEx(thisTag.value)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
					break;
				default:
					if (allGood && !crossCheck(thisTag, thisClass)) {
						classBack = "invalid ";
					}
					classBack += thisClass;
			}

			return classBack;

			function crossCheck(inTag, otherFieldID) {
				if (!document.getElementById(otherFieldID)) {
					return false;
				}
				return (inTag.value != "" || document.getElementById(otherFieldID).value != "");
			}

			function radioPicked(radioName) {
				var radioSet = document.forms[0][radioName];

				if (radioSet) {
					for (k = 0; k < radioSet.length; k++) {
						if (radioSet[k].checked) {
							return true;
						}
					}
				}
				return false;
			}

			function isNum(passedVal) {
				if (passedVal == "") {
					return false;
				}
				for (var k = 0; k < passedVal.length; k++) {
					if (passedVal.charAt(k) < "0") {
						return false;
					}
					if (passedVal.charAt(k) > "9") {
						return false;
					}
				}
				return true;
			}

			function isZip(inZip) {
				if (inZip == "") {
					return true;
				}
				return (isNum(inZip));
			}

			function isZipRegEx(inZip) {
				var re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
				return re.test(String(inZip));
			}

			function validEmail(email) {
				var invalidChars = " /:,;";
				if (email == "") {
					return false;
				}
				for (var k = 0; k < invalidChars.length; k++) {
					var badChar = invalidChars.charAt(k);
					if (email.indexOf(badChar) > -1) {
						return false;
					}
				}
				var atPos = email.indexOf("@", 1);
				if (email.indexOf("@", atPos + 1) != -1) {
					return false;
				}
				var periodPos = email.indexOf('.', atPos);
				if (periodPos == -1) {
					return false;
				}
				if (periodPos + 3 > email.length) {
					return false;
				}
				return true;
			}

			function validEmailRegEx(email) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(email).trim().toLowerCase());
			}

			function validPhoneRegEx(phone) {
				var re = /^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/;

				phone = phone.trim();
				return re.test(phone);
			}
		}
	}

	function invalidLabel(parentTag) {
		if (parentTag.nodeName == "LABEL") {
			parentTag.className += " invalid";
		}
	}
}

function doorSet() {
	if (this.checked) {
		document.getElementById("twoDoor").checked = true;
	}
}

function fourDoorSet() {
	var sunroof = document.getElementById("sunroof");

	if (sunroof.checked) {
		sunroof.checked = false;
	}
}

function withDependentClick() {
	var numDependents = document.getElementById("numDependents");

	if (this.checked) {
		numDependents.disabled = false;
		if (numDependents.value == "") {
			numDependents.value = "1";
		}
	} else {
		numDependents.disabled = true;
	}
}