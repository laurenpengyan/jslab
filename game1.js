//Get the canvas element from the HTML document. The canvas element is used to draw graphics on a web page.
var canvas = document.getElementById("myCanvas");
// This variable contains the 2 dimensional contexts from the canvas element.
var ctx = canvas.getContext("2d");
// Set the ball radius.
var ballRadius = 10;
// Set the game board size.
var x = canvas.width / 2;
var y = canvas.height - 30;
// Initialize the ball speed variables.
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
// Set number of bricks and set the bricks size.
var brickRowCount = 4;
var brickColumnCount = 2;
var brickWidth = 115;
var brickHeight = 20;
// Set the brick's padding and margin offsets.
var brickPadding = 8;
var brickOffsetTop = 30;
var brickOffsetLeft = 8;
// Initialize the game varialbes
var player = '';
var score = 0;
var baseScore = 0;
var lives = 30;
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

// Nested for loop that initializes the brick objects into a 2d array of bricks.
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    // Initialize column bricks
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        // Initialize the x and y to zero and status to one. Status of one means the brick is still active
        // and should be displayed on the screen. Zero means the brick has been desroyed from a collision and is
        // no longer active or displayed on the screen.
        bricks[c][r] = { x: 0, y: 0, status: 1 };
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
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                // The x and y variables correspond to the ball's x and y location.
                // Compare these with the brick's (var b) x and y properties to see if there has been a collision.
               // If there is a collision this next block of code will be executed.
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    // Make the ball speed faster?
                    dy = -dy;
                    // Set the brick's status to zero and increase the user's score.
                    b.status = 0;
                    score++;
                    // Since the user receives one point for each brick destroyed, if the user's score is equal to
                    // the total number of bricks then all the bricks must now be cleared and the game should reset
                    // and continue to the next level.
                    if (score == brickRowCount * brickColumnCount) {
                        dx = Math.abs(dx) + 3;
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
// Everytime when drawing to the 2d canvas beginPath() must called first. After drawing closePath().
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#C6E624";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#24E6B9";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                // Multiple the bricks x and y coordinates by its respective row and column number
                // so that it is drawn to the correct location on the screen.
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                // Set the brick's x and y properties to check later for collision detection.
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#246BE6";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawName() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E69F24";
    ctx.fillText('Player: ' + player, (canvas.width / 2) - 40, 20);
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Level: " + level, 8, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#246BE6";
    ctx.fillText("Score: " + (baseScore + score), 75, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E62499";
    ctx.fillText("Lives: " + lives, canvas.width - 70, 20);
}

function updateBall() {
  // Check to see if ball will hit left or right edge and reverse direction.
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
  }

  // Check to see if ball will hit top edge and reverse (bounce).
  if (y + dy < ballRadius) {
      dy = -dy;
  // Check if ball will go below bottom edge or hit paddle.
  } else if (y + dy > canvas.height - ballRadius) {
      // If ball hits paddle, change direction (bounce up).
      if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
      } else {
          // Ball missed. Lose life.
          lives--;

          // If all lives gone, end game.
          if (lives === 0) {
              sessionStorage.removeItem("game_speed");
              sessionStorage.removeItem("game_score");
              sessionStorage.removeItem("game_level");
              sessionStorage.setItem("game_status", "LOST");
              alert("You died. Game over.");
              document.location.reload();
          } else {
              // Tell the player they died and reset ball.
              alert("You died");
              x = canvas.width / 2;
              y = canvas.height - 30;
              paddleX = (canvas.width - paddleWidth) / 2;
          }
      }
  }

  // If pressing right and paddle not fully right then shift paddle right.
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
  // If pressing left and paddle not fully left then shift paddle left.
  } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
  }

  // Update ball position for next frame.
  x += dx;
  y += dy;
  console.log('dx, dy: ' + dx + ' - ' + dy);
}

// Get player name from storage, or prompt for name.
function checkPlayer() {
  if (window.sessionStorage.getItem('player') == null) {
      player = prompt('Please enter your name:');
      window.sessionStorage.setItem('player', player);
  } else {
      player = window.sessionStorage.getItem('player');
  }
}

// Draw game and update ball, bricks and collisions/bounces.
function updateGame() {
    if (!paused) {
      checkPlayer();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawName();
      drawBricks();
      drawBall();
      drawPaddle();
      drawLevel();
      drawScore();
      drawLives();
      collisionDetection();
      updateBall();
  }

    // Pass the draw function as the requestAnimationFrame callback.
    // This function is called everytime the browser screen is repainted.
    // By calling the requestAnimationFrame function within the draw function and passing the draw function
    // as its callback parameter a recursive loop is started that will not reach the base case until the
    //  user wins or loses the game.
    requestAnimationFrame(updateGame);
}

// Call the draw fuction here first to start the recursion.
updateGame();

