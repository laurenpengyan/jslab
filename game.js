function PaddleAttack() {

    // Get the canvas element from the HTML document. The canvas element is used to paint graphics on a web page.
    this.canvas = document.getElementById("ypGameCanvas");
    // This variable contains the 2 dimensional contexts from the canvas element.
    this.context = this.canvas.getContext("2d");

    // Ball size
    this.ballSize = 10;

    // Sets the ball's initial x and y coordinates
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;

    // Initialize the velocity of the ball.
    this.dx = 4;
    this.dy = -4;

    // Set board size
    this.bh = 15;
    this.bw = 140;
    //
    this.bx = (this.canvas.width - this.bw) / 2;
    // Variables used to detect the user's keyboard interaction.
    this.rightArrowDown = false;
    this.leftArrowDown = false;
    // Set number of blocks and set the blocks size.
    this.blockRowCount = 6;
    this.blockColumnCount = 3;
    this.blockWidth = 157;
    this.blockHeight = 30;
    // Set the block's padding and margin offsets.
    this.blockPadding = 8;
    this.blockOffsetTop = 30;
    this.blockOffsetLeft = 8;
    // Initialize the game variables
    this.player = '';
    this.point = 0;
    this.basePoint = 0;
    this.chances = 10;
    this.paused = false;
    this.level = 1;

    // Fetch the key/value pairs from the sessionStore object which stores the values in the window memory.
    // The sessionStorage object stores data for only one session unlike localStorage. Therefore these values will
    // only be set from sessionStorage if the user recently played at least one game. Otherwise the default values
    // will be used.

    // Set initial speed
    if (sessionStorage.getItem("game_speed")) {
        this.dx = parseInt(sessionStorage.getItem("game_speed"));
        this.dy = -this.dx;
    }

    // Set the initial point
    if (sessionStorage.getItem("game_point")) {
        this.basePoint = parseInt(sessionStorage.getItem("game_point"));
    }

    // Set the initial game level
    if (sessionStorage.getItem("game_level")) {
        this.level = parseInt(sessionStorage.getItem("game_level"));
    }

    // Nested for loop that initializes the block objects into a 2d array of blocks.
    this.blocks = [];
    for (var c = 0; c < this.blockColumnCount; c++) {
        // Initialize column blocks
        this.blocks[c] = [];
        for (var r = 0; r < this.blockRowCount; r++) {
            // Initialize the x and y to zero and status to one. Status of one means the block is still active
            // and should be displayed on the screen. Zero means the block has been destroyed from a collision and is
            // no longer active or displayed on the screen.
            this.blocks[c][r] = {
                x: 0,
                y: 0,
                status: 1
            };
        }
    }

    // Check which arrow key was pressed.
    // When a button pressed the value will remain true until the  user release's the key and the keyUpHandler is called.
    this.handleKeyDown = function (evt) {
        console.log(evt.keyCode);
        if (evt.keyCode == 39) {
            this.rightArrowDown = true;
        } else if (evt.keyCode == 37) {
            this.leftArrowDown = true;
        } else if (evt.keyCode == 32) {
            this.paused = !this.paused;
        }
    }.bind(this);

    // Check which arrow key was released.
    this.handleKeyUp = function (evt) {
        if (evt.keyCode == 39) {
            this.rightArrowDown = false;
        } else if (evt.keyCode == 37) {
            this.leftArrowDown = false;
        }
    }.bind(this);

    // Listener to detect mouse movement so that the user can also use the mouse to move the board instead of the arrow keys.
    this.handleMouseMove = function (evt) {
        var rx = evt.clientX - this.canvas.offsetLeft;
        if (rx > 0 && rx < this.canvas.width) {
            this.bx = rx - this.bw / 2;
        }
    }.bind(this);

    // Add listeners for key and mouse events.
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
    document.addEventListener("mousemove", this.handleMouseMove, false);

    this.checkCollision = function () {
        // Nested loop through the 2d array to check if a collision occurred with any of the remaining blocks.
        // Adjust point accordingly and check if game over scenario is reached.
        for (var c = 0; c < this.blockColumnCount; c++) {
            for (var r = 0; r < this.blockRowCount; r++) {
                var b = this.blocks[c][r];
                if (b.status == 1) {
                    // The x and y variables correspond to the ball's x and y location.
                    // Compare these with the block's (var b) x and y properties to see if there has been a collision.
                    // If there is a collision this next block of code will be executed.
                    if (this.x > b.x && this.x < b.x + this.blockWidth && this.y > b.y && this.y < b.y + this.blockHeight) {
                        // Make the ball speed faster.
                        this.dy = -this.dy;
                        // Set the block's status to zero and increase the user's point.
                        b.status = 0;
                        this.point++;
                        // Since the user receives one point for each block destroyed, if the user's point is equal to
                        // the total number of blocks then all the blocks must now be cleared and the game should reset
                        // and continue to the next level.
                        if (this.point == this.blockRowCount * this.blockColumnCount) {
                            this.dx = Math.abs(this.dx) + 2;
                            this.level++;
                            window.sessionStorage.setItem('game_status', 'WON');
                            window.sessionStorage.setItem('game_speed', Math.abs(this.dx));
                            window.sessionStorage.setItem('game_level', this.level);
                            window.sessionStorage.setItem('game_point', (this.basePoint + this.point));
                            alert("YOU WIN, CONGRATS! NEXT LEVEL " + this.level);
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }.bind(this);

    // Generate random color
    this.getColor = function () {
        var result = '#';

        var hc = '0123456789ABCDEF';
        for (var i = 0; i < 6; i++) {
            result += hc[Math.floor(Math.random() * 16)];
        }
        return result;
    };

    // Draw helper functions.
    // Every time when painting to the 2d canvas beginPath() must called first. After painting closePath().
    this.paintBall = function () {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.ballSize, 0, Math.PI * 2);
        this.context.fillStyle = this.getColor();
        this.context.fill();
        this.context.closePath();
    };

    this.paintPaddle = function () {
        this.context.beginPath();
        this.context.rect(this.bx, this.canvas.height - this.bh, this.bw, this.bh);
        this.context.fillStyle = this.getColor();
        this.context.fill();
        this.context.closePath();
    };

    this.paintBlocks = function () {
        for (var c = 0; c < this.blockColumnCount; c++) {
            for (var r = 0; r < this.blockRowCount; r++) {
                if (this.blocks[c][r].status == 1) {
                    // Multiple the blocks x and y coordinates by its respective row and column number
                    // so that it is painted to the correct location on the screen.
                    var blockX = (r * (this.blockWidth + this.blockPadding)) + this.blockOffsetLeft;
                    var blockY = (c * (this.blockHeight + this.blockPadding)) + this.blockOffsetTop;
                    // Set the block's x and y properties to check later for collision detection.
                    this.blocks[c][r].x = blockX;
                    this.blocks[c][r].y = blockY;

                    this.context.beginPath();
                    this.context.rect(blockX, blockY, this.blockWidth, this.blockHeight);

                    // Use random color: "#F5B6CD";
                    this.context.fillStyle = "#F5B6CD";

                    this.context.fill();
                    this.context.closePath();
                }
            }
        }
    };

    this.setContextStyle = function (font, fillStyle) {
        this.context.font = font;
        this.context.fillStyle = fillStyle;
    };

    this.paintName = function () {
        this.setContextStyle("18px Helvetica", "#E69F24");
        this.context.fillText('Player: ' + this.player, (this.canvas.width / 2) - 40, 20);
    };

    this.paintLevel = function () {
        this.setContextStyle("18px Helvetica", "#FF0000");
        this.context.fillText("Level: " + this.level, 8, 20);
    };

    this.paintPoint = function () {
        this.setContextStyle("18px Helvetica", "#246BE6");
        this.context.fillText("Point: " + (this.basePoint + this.point), 75, 20);
    };

    this.paintChances = function () {
        this.setContextStyle("18px Helvetica", "#E62499");
        this.context.fillText("Chances: " + this.chances, this.canvas.width - 105, 20);
    };

    this.paintMain = function () {
        if (!this.paused) {
            if (window.sessionStorage.getItem('player') == null) {
                this.player = prompt('Please enter your name:');
                window.sessionStorage.setItem('player', this.player);
            } else {
                this.player = window.sessionStorage.getItem('player');
            }

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.paintName();
            this.paintBlocks();
            this.paintBall();
            this.paintPaddle();
            this.paintLevel();
            this.paintPoint();
            this.paintChances();
            this.checkCollision();

            // collision of ball with top, bottom, right, left, and board
            if (this.x + this.dx > this.canvas.width - this.ballSize || this.x + this.dx < this.ballSize) { //bounce ball off right side OR left side
                this.dx = -this.dx;
            }

            if (this.y + this.dy < this.ballSize) { // handle ball bouncing off top
                this.dy = -this.dy;
            } else if (this.y + this.dy > this.canvas.height - this.ballSize) { // reached bottom (die) or bounce off board
                if (this.x > this.bx && this.x < this.bx + this.bw) { // bounce off board
                    this.dy = -this.dy;
                } else { // die
                    this.chances--;
                    if (this.chances === 0) {
                        sessionStorage.removeItem("game_speed");
                        sessionStorage.removeItem("game_point");
                        sessionStorage.removeItem("game_level");
                        sessionStorage.setItem("game_status", "LOST");
                        alert("You died. Game over.");
                        document.location.reload();
                    } else {
                        alert("You died");
                        this.x = this.canvas.width / 2;
                        this.y = this.canvas.height - 30;
                        this.bx = (this.canvas.width - this.bw) / 2;
                    }
                }
            }

            // next two sections control the variable that change, rather the shapes that move

            // If the user pressed the left or right arrows move the board. Also check to make sure the board does not leave the screen.
            if (this.rightArrowDown && this.bx < this.canvas.width - this.bw) {
                this.bx += 7;
            } else if (this.leftArrowDown && this.bx > 0) {
                this.bx -= 7;
            }

            this.x += this.dx;
            this.y += this.dy;
        }

        window.requestAnimationFrame(this.paintMain);
    }.bind(this);

}

// Call the paint function here first to start the recursion.
var app = new PaddleAttack();
app.paintMain();
