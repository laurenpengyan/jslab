// Declare the array of all the words.
var buzzwords = new Array ("Tokyo",
	"Shinjuku",
	"Asakusa",
	"Harajuku",
	"Ginza",
	"Uneo",
	"Ikebukuro",
	"Akasaka",
	"Nikko",
	"kamakura",
	"Atami",
	"Fujiyama",
	"Aomori",
	"Tsuruoka",
	"Hiraizumi",
	"Nagoya",
	"Nagano",
	"Ogaya",
	"Kusatsu",
	"Sapporo",
	"Hakodate",
	"Toyako",
	"Onuma",
	"Kyoto",
	"Otsu",
	"Iseshi",
	"Kumano",
	"Nara",
	"Sakurai",
	"Hiroshima",
	"Miyajima",
	"Takamatsu",
	"Fukuoka",
	"Kirishima",
	"Kuryume",
	"Saga",
	"Beppu",
	"Kikuchi",
	"Hachiman-kogen",
	"Kogoshima"
);

/*
 Array for used words.  
 The maximum length is the all the words possible.
 */
var usedWords = new Array(buzzwords.length);

// Initialize for a new game.
function py_initAll() {
	// Check if the browser support the script
	if (document.getElementById) {
		// Set onclick event handler of reload element to anotherCard method
		document.getElementById("reload").onclick = anotherCard;

		// Create new card
		newCard();
	}
	// if false,pops up an alert
	else {
		alert("Sorry, your browser doesn't support this script");
	}
}


// Create new card for the game.
function newCard() {
	for (var i=0; i<24; i++) {
		// Set the words for the square of i
		setSquare(i);
	}
}

function setSquare(thisSquare) {
	// Pick the unused random word from the array of words
	do {
		var randomWord = Math.floor(Math.random() * buzzwords.length);
	}
	while (usedWords[randomWord]);

	// Mark the word as used
	usedWords[randomWord] = true;
	
	// Set picked word to this square and set initial style and eventhandler
	var currSquare = "square" + thisSquare;

	document.getElementById(currSquare).innerHTML = buzzwords[randomWord];
	document.getElementById(currSquare).className = "";
	// Set onmousedown event handler of this square to toggleColor method
	document.getElementById(currSquare).onmousedown = toggleColor;
}

// Reset all cards when reload is clicked
function anotherCard() {
	// Mark all used words as unused
	for (var i=0; i<buzzwords.length; i++) {
		usedWords[i] = false;
	}

	// Set new cards
	newCard();
	return false;
}

// Toggle the style(background) of the clicked square
function toggleColor(evt) {
	// Get the source square
	if (evt) {
		var thisSquare = evt.target;
	}
	else {
		var thisSquare = window.event.srcElement;
	}

	// Toggle the style
	if (thisSquare.className == "") {
		thisSquare.className = "pickedBG";
	}
	else {
		thisSquare.className = "";
	}

	// Check if game is won
	checkWin();
}

// Check if current squares setting has won
function checkWin() {
	var winningOption = -1;
	var setSquares = 0;
	var winners = new Array(31,992,15360,507904,541729,557328,1083458,2162820,4329736,8519745,8659472,16252928);

	// Get the current square setting by checking all the squares
	for (var i=0; i<24; i++) {
		var currSquare = "square" + i;
		if (document.getElementById(currSquare).className != "") {
			document.getElementById(currSquare).className = "pickedBG";
			setSquares = setSquares | Math.pow(2,i);
		}
	}

	// Check against all the winning patterns
	for (var i=0; i<winners.length; i++) {
		if ((winners[i] & setSquares) == winners[i]) {
			winningOption = i;
		}
	}

	// Set if the game has won
	if (winningOption > -1) {
		for (var i=0; i<24; i++) {
			if (winners[winningOption] & Math.pow(2,i)) {
				currSquare = "square" + i;
				document.getElementById(currSquare).className = "winningBG";
			}
		}
	}
}
