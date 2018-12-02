var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 15;
var x = canvas.width / 2;
var y = canvas.height;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 110;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 2;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var player = '';
var score = 0;
var baseScore = 0;
var lives = 30;


// Set initial speed
if (sessionStorage.getItem("game_speed")) {
    dx = sessionStorage.getItem("game_speed") + 2;
    dy = -dx; 
}

if (sessionStorage.getItem("game_score")) {
    baseScore = Number(sessionStorage.getItem("game_score"));
}


var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    // Initialize column bricks
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Add listeners for key and mouse events.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Check which arrow key was pressed.
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

// Check which arrow key was released.
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

// Prevent the paddle from leaving the canvas border. If it is at either side of the border only display half of the paddle.
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
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        window.sessionStorage.setItem('game_status', 'WON');
                        window.sessionStorage.setItem('game_speed', dx);
                        window.sessionStorage.setItem('game_score', (baseScore + score));

                        alert("YOU WIN, CONGRATS!");
                        
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw helper functions.
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
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
    ctx.fillStyle = "#246BE6";
    ctx.fillText('Player: ' + player, (canvas.width / 2) - 60, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#246BE6";
    ctx.fillText("Score: " + (baseScore + score), 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#E62499";
    ctx.fillText("Lives: " + lives, canvas.width - 70, 20);
}

// Recursive function to handle game logic until a base case is reached. 
function draw() {
    if (window.sessionStorage.getItem('player') == null) {
        player = prompt('Please enter your name:');
        window.sessionStorage.setItem('player', player);
    } else {
        player = window.sessionStorage.getItem('player');
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawName();
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                sessionStorage.removeItem("game_speed");
                sessionStorage.removeItem("game_score");
                sessionStorage.setItem("game_status", "LOST");
                
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    // Pass the draw function as the requestAnimationFrame callback.
    requestAnimationFrame(draw);
}

draw();