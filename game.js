// Get the canvas element from the HTML document. The canvas element is used to paint graphics on a web page.
var canvas = document.getElementById("myCanvas");
// This variable contains the 2 dimensional contexts from the canvas element.
var ctx = canvas.getContext("2d");
// Set the ball radius.
var ballRadius = 10;
// Sets the ball's initial x and y coordinates
var x = canvas.width / 2;
var y = canvas.height - 30;
// Initialize the velocity of the ball.
var dx = 3;
var dy = -3;
// Set paddle size
var paddleHeight = 15;
var paddleWidth = 140;
//
var paddleX = (canvas.width - paddleWidth) / 2;
// Variables used to dectect the user's keyboard interaction.
var rightPressed = false;
var leftPressed = false;
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
var score = 0;
var baseScore = 0;
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

// Set the initial score
if (sessionStorage.getItem("game_score")) {
    baseScore = parseInt(sessionStorage.getItem("game_score"));
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
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 32) {
        paused = !paused;
    }
}

// Check which arrow key was released.
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

// Listener to dectect mouse movement so that the user can also use the mouse to move the paddle instead of the arrow keys.
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    // Nested loop through the 2d array to check if a collision occured with any of the remaining blocks.
    // Adjust score accordingly and check if game over scenario is reached.
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
                    // Set the block's status to zero and increase the user's score.
                    b.status = 0;
                    score++;
                    // Since the user receives one point for each block destroyed, if the user's score is equal to
                    // the total number of blocks then all the blocks must now be cleared and the game should reset
                    // and continue to the next level.
                    if (score == blockRowCount * blockColumnCount) {
                        dx = Math.abs(dx) + 2;
                        level++;
                        window.sessionStorage.setItem('game_status', 'WON');
                        window.sessionStorage.setItem('game_speed', Math.abs(dx));
                        window.sessionStorage.setItem('game_level', level);
                        window.sessionStorage.setItem('game_score', (baseScore + score));
                        alert("YOU WIN, CONGRATS! ONTO LEVEL " + level);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw helper functions.
// Everytime when painting to the 2d canvas beginPath() must called first. After painting closePath().
function paintBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#C6E624";
    ctx.fill();
    ctx.closePath();
}
function paintPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#24E6B9";
    ctx.fill();
    ctx.closePath();
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
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "#246BE6";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function paintName() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E69F24";
    ctx.fillText('Player: ' + player, (canvas.width / 2) - 40, 20);
}

function paintLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Level: " + level, 8, 20);
}

function paintScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#246BE6";
    ctx.fillText("Score: " + (baseScore + score), 75, 20);
}

function paintChances() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E62499";
    ctx.fillText("Chance: " + chances, canvas.width - 70, 20);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintName();
    paintBlocks();
    paintBall();
    paintPaddle();
    paintLevel();
    paintScore();
    paintChances();
    collisionDetection();

    // collision of ball with top, bottom, right, left, and paddle
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {  //bounce ball off right side OR left side
                
        dx = -dx;
    }

    if (y + dy < ballRadius) { // handle ball bouncing off top
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {  // reached botton (die) or bounce off paddle
        if (x > paddleX && x < paddleX + paddleWidth) {  // bounce off paddle
            dy = -dy;
        } else {  // die
            chances--;
            if (chances === 0) {
                sessionStorage.removeItem("game_speed");
                sessionStorage.removeItem("game_score");
                sessionStorage.removeItem("game_level");
                sessionStorage.setItem("game_status", "LOST");
                alert("You died. Game over.");
                document.location.reload();
            } else {
                alert("You died");
                x = canvas.width / 2;
                y = canvas.height - 30;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // next two sections control the variable that change, rather the shapres that move

    // If the user pressed the left or right arrows move the paddle. Also check to make sure the paddle does not leave the screen.
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
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
