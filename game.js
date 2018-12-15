// Get the canvas element from the HTML document. The canvas element is used to paint graphics on a web page.
var canvas = document.getElementById("ypGameCanvas");
// This variable contains the 2 dimensional contexts from the canvas element.
var context = canvas.getContext("2d");

// Ball size
var ballSize = 10;

// Sets the ball's initial x and y coordinates
var x = canvas.width / 2;
var y = canvas.height - 30;

// Initialize the velocity of the ball.
var dx = 3;
var dy = -3;

// Set board size
var bh = 15;
var bw = 140;
//
var bx = (canvas.width - bw) / 2;
// Variables used to dectect the user's keyboard interaction.
var rightArrowDown = false;
var leftArrowDown = false;
// Set number of blocks and set the blocks size.
var blockRowCount = 8;
var blockColumnCount = 4;
var blockWidth = 115;
var blockHeight = 20;
// Set the block's padding and margin offsets.
var blockPadding = 8;
var blockOffsetTop = 30;
var blockOffsetLeft = 8;
// Initialize the game varialbes
var player = '';
var point = 0;
var basePoint = 0;
var chances = 30;
var paused = false;
var level = 1;

// Fetch the key/value pairs from the sessionStore object which stores the values in the window memory.
// The sessionStorage object stores data for only one session unlike localStorage. Therefore these values will
// only be set from sessionStorage if the user recently played at least one game. Otherwise the default values
// will be used.

// Set initial speed
if (sessionStorage.getItem("game_speed")) {
    dx = parseInt(sessionStorage.getItem("game_speed"));
    dy = -dx;
}

// Set the initial point
if (sessionStorage.getItem("game_point")) {
    basePoint = parseInt(sessionStorage.getItem("game_point"));
}

// Set the initial game level
if (sessionStorage.getItem("game_level")) {
    level = parseInt(sessionStorage.getItem("game_level"));
}

// Nested for loop that initializes the block objects into a 2d array of blocks.
var blocks = [];
for (var c = 0; c < blockColumnCount; c++) {
    // Initialize column blocks
    blocks[c] = [];
    for (var r = 0; r < blockRowCount; r++) {
        // Initialize the x and y to zero and status to one. Status of one means the block is still active
        // and should be displayed on the screen. Zero means the block has been desroyed from a collision and is
        // no longer active or displayed on the screen.
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Add listeners for key and mouse events.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Check which arrow key was pressed.
// When a button pressed the value will remain true until the  user release's the key and the keyUpHandler is called.
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightArrowDown = true;
    } else if (e.keyCode == 37) {
        leftArrowDown = true;
    } else if (e.keyCode == 32) {
        paused = !paused;
    }
}

// Check which arrow key was released.
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightArrowDown = false;
    } else if (e.keyCode == 37) {
        leftArrowDown = false;
    }
}

// Listener to dectect mouse movement so that the user can also use the mouse to move the board instead of the arrow keys.
function mouseMoveHandler(e) {
    var rx = e.clientX - canvas.offsetLeft;
    if (rx > 0 && rx < canvas.width) {
        bx = rx - bw / 2;
    }
}

function attackTest() {
    // Nested loop through the 2d array to check if a collision occured with any of the remaining blocks.
    // Adjust point accordingly and check if game over scenario is reached.
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            var b = blocks[c][r];
            if (b.status == 1) {
                // The x and y variables correspond to the ball's x and y location.
                // Compare these with the block's (var b) x and y properties to see if there has been a collision.
               // If there is a collision this next block of code will be executed.
                if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
                    // Make the ball speed faster?
                    dy = -dy;
                    // Set the block's status to zero and increase the user's point.
                    b.status = 0;
                    point++;
                    // Since the user receives one point for each block destroyed, if the user's point is equal to
                    // the total number of blocks then all the blocks must now be cleared and the game should reset
                    // and continue to the next level.
                    if (point == blockRowCount * blockColumnCount) {
                        dx = Math.abs(dx) + 2;
                        level++;
                        window.sessionStorage.setItem('game_status', 'WON');
                        window.sessionStorage.setItem('game_speed', Math.abs(dx));
                        window.sessionStorage.setItem('game_level', level);
                        window.sessionStorage.setItem('game_point', (basePoint + point));
                        alert("YOU WIN, CONGRATS! NEXT LEVEL " + level);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Generate random color
function getColor() {
    var result = '#';

    var hc = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        result += hc[Math.floor(Math.random() * 16)];
    }
    return result;
}

// Draw helper functions.
// Everytime when painting to the 2d canvas beginPath() must called first. After painting closePath().
function paintBall() {
    context.beginPath();
    context.arc(x, y, ballSize, 0, Math.PI * 2);
    context.fillStyle = getColor();
    context.fill();
    context.closePath();
}
function paintPaddle() {
    context.beginPath();
    context.rect(bx, canvas.height - bh, bw, bh);
    context.fillStyle = getColor();
    context.fill();
    context.closePath();
}
function paintBlocks() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status == 1) {
                // Multiple the blocks x and y coordinates by its respective row and column number
                // so that it is painted to the correct location on the screen.
                var blockX = (r * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (c * (blockHeight + blockPadding)) + blockOffsetTop;
                // Set the block's x and y properties to check later for collision detection.
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                context.beginPath();
                context.rect(blockX, blockY, blockWidth, blockHeight);
                // Use random color: "#F5B6CD";
                context.fillStyle = "#F5B6CD";
                context.fill();
                context.closePath();
            }
        }
    }
}

function setContextStyle(font, fillStyle) {
    context.font = font;
    context.fillStyle = fillStyle;
}

function paintName() {
    setContextStyle("18px Helvetica", "#E69F24");
    context.fillText('Player: ' + player, (canvas.width / 2) - 40, 20);
}

function paintLevel() {
    setContextStyle("18px Helvetica", "#FF0000");
    context.fillText("Level: " + level, 8, 20);
}

function paintPoint() {
    setContextStyle("18px Helvetica", "#246BE6");
    context.fillText("Point: " + (basePoint + point), 75, 20);
}

function paintChances() {
    setContextStyle("18px Helvetica", "#E62499");
    context.fillText("Chances: " + chances, canvas.width - 105, 20);
}

// Function to handle game logic until a base case is reached.
function paint() {
    if (!paused){
    if (window.sessionStorage.getItem('player') == null) {
        player = prompt('Please enter your name:');
        window.sessionStorage.setItem('player', player);
    } else {
        player = window.sessionStorage.getItem('player');
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    paintName();
    paintBlocks();
    paintBall();
    paintPaddle();
    paintLevel();
    paintPoint();
    paintChances();
    attackTest();

    // collision of ball with top, bottom, right, left, and board
        if (x + dx > canvas.width - ballSize || x + dx < ballSize) {  //bounce ball off right side OR left side
                
        dx = -dx;
    }

    if (y + dy < ballSize) { // handle ball bouncing off top
        dy = -dy;
    } else if (y + dy > canvas.height - ballSize) {  // reached botton (die) or bounce off board
        if (x > bx && x < bx + bw) {  // bounce off board
            dy = -dy;
        } else {  // die
            chances--;
            if (chances === 0) {
                sessionStorage.removeItem("game_speed");
                sessionStorage.removeItem("game_point");
                sessionStorage.removeItem("game_level");
                sessionStorage.setItem("game_status", "LOST");
                alert("You died. Game over.");
                document.location.reload();
            } else {
                alert("You died");
                x = canvas.width / 2;
                y = canvas.height - 30;
                bx = (canvas.width - bw) / 2;
            }
        }
    }

    // next two sections control the variable that change, rather the shapres that move

    // If the user pressed the left or right arrows move the board. Also check to make sure the board does not leave the screen.
    if (rightArrowDown && bx < canvas.width - bw) {
        bx += 7;
    } else if (leftArrowDown && bx > 0) {
        bx -= 7;
    }

    x += dx;
    y += dy;

}

    // Pass the paint function as the requestAnimationFrame callback.
    // This function is called everytime the browser screen is repainted.
    // By calling the requestAnimationFrame function within the paint function and passing the paint function
    // as its callback parameter a recursive loop is started that will not reach the base case until the
    //  user wins or loses the game.
    requestAnimationFrame(paint);
}

// Call the paint fuction here first to start the recursion.
paint();
