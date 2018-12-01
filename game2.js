window.onload = function(){
    var canvas = document.getElementById('board');
    var context = canvas.getContext('2d');
    var hasStarted = false;
    var brickWidth = 60;
    var brickMargin = 10;
    var playerBaseLine = 50;
    var ballRadius = 10;
    var lives = [];
    var bricks = [];
    var boardWidth;
    var boardHeight;
    var objects;
    var ball;
    var player;
    var frictionHandler;
    var gameLoopHandler;

    canvas.width = 1024;
    canvas.height = 576;

    boardHeight = canvas.height - 50;
    boardWidth = canvas.width;

    // Talking about closures, anything that was declared outside of a function is accessible by it.
    function resetContextStyle(){
      context.fillStyle = 'black';
      context.strokeStyle = 'black';
    }

    function removeFrom(array, index){
      objects.splice(objects.indexOf(array[index]), 1);
      array.splice(index, 1);
    }

    function createBall(){
      return {
        x: boardWidth / 2,
        y: boardHeight - playerBaseLine,
        radius: ballRadius,
        speedx: 0,
        speedy: 0,
        // Talking about attaching functions to objects and using "this"
        render: function(){
          context.beginPath();
          context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          context.fill();
        },
        checkWallCollision: function(axis, boundry){
          // Talking about objects as dictionaries
          if(this[axis] + this.radius >= boundry){
            this[axis] = boundry - this.radius;
            this['speed' + axis] = -this['speed' + axis];
          }
          else if(this[axis] - this.radius <= 0){
            this[axis] = this.radius;
            this['speed' + axis] = -this['speed' + axis];
          }
        },
        checkCollision: function(object){
          function between(center, range, min, max){
            return (center - range >= min && center - range <= max) ||
                   (center + range >= min && center + range <= max);
          }

          // Check that either the top or bottom part of the ball are between the top and bottom of the player.
          // And that the left and right of the ball are between the left and right of the player.
          if(between(this.y, this.radius, object.top(), object.bottom()) &&
             between(this.x, this.radius, object.left(), object.right())){
               var normalizedSpeedX = Math.floor((this.x - object.x) * 20 / (this.radius + object.width / 2));

               // Talking about calling functions on objects.
               this.setSpeed(normalizedSpeedX, -this.speedy);
               object.collidedWithBall();
          }
        },
        update: function(){
          if(!hasStarted)
            return;

          this.x += this.speedx;
          this.y += this.speedy;

          if(this.y - this.radius * 2 > boardHeight - playerBaseLine){
            removeFrom(lives, lives.length - 1);

            if(lives.length !== 0){
              resetPlayerAndBall(lives.length);
            }
            else{
              alert('Game Over');
              init();
            }
          }

          this.checkWallCollision('x', boardWidth);
          this.checkWallCollision('y', boardHeight);

          // Talking about context, and what happens to callbacks and their context.
          var actualBall = this;

          objects.forEach(function(object){
            // Talking about the equality operator
            if(object !== actualBall && object.isInBoard){
              actualBall.checkCollision(object);
            }
          });

          if(bricks.length === 0){
            alert('You won!');
          }
        },
        setSpeed: function(x, y){
          this.speedx = x;
          this.speedy = y;
        }
      };
    }

    function createPlayer() {
      return {
        x: boardWidth / 2,
        y: boardHeight - (playerBaseLine - ballRadius),
        width: 100,
        height: 10,
        speedX: 0,
        isInBoard: true,
        render: function(){
          context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        },
        bottom: function(){
          return this.y + this.height;
        },
        top: function(){
          return this.y;
        },
        left: function(){
          return this.x - this.width / 2;
        },
        right: function(){
          return this.x + this.width / 2;
        },
        update: function(){
          this.x += this.speedX;

          if(this.x + this.width / 2 >= boardWidth){
            this.x = boardWidth - this.width / 2;
            this.setSpeed(0);
          }

          if(this.x - this.width / 2 <= 0){
            this.x = this.width / 2;
            this.setSpeed(0);
          }
        },
        setSpeed: function(x){
          if(x !== 0){
            var direction = Math.abs(x)/x;
            this.speedX = Math.floor(Math.min(Math.abs(x), 35)) * direction;
          }
          else{
            this.speedX = 0;
          }
        },
        collidedWithBall: function(){ }
      };
    }

    function createBrick(x, y){
      return {
          R: Math.floor(Math.random() * 255),
          G: Math.floor(Math.random() * 255),
          B: Math.floor(Math.random() * 255),
          x: x,
          y: y,
          width: 60,
          height: 20,
          isInBoard: true,
          bottom: function(){
            return this.y + this.height;
          },
          top: function(){
            return this.y;
          },
          left: function(){
            return this.x - this.width / 2;
          },
          right: function(){
            return this.x + this.width / 2;
          },
          render: function(){
            var R = Math.floor(Math.random() * 255);
            var G = Math.floor(Math.random() * 255);
            var B = Math.floor(Math.random() * 255);
            var randomizeColor = false;

            if(randomizeColor){
              context.fillStyle = 'rgb(' + R + ',' + G + ',' + B + ')';
            }
            else {
              context.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ')';
            }

            context.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
            resetContextStyle();
          },
          collidedWithBall: function(){
            removeFrom(bricks, bricks.indexOf(this));
          },
          update: function(){}
      };
    }

    function createHeart(x){
      return {
        x: x,
        y: boardHeight + 10,
        isInBoard: false,
        currentHue: 0,
        render: function(){

          // Just for fun, nothing special here.
          var paddedHue = '00'.substring(0, 2 - (this.currentHue + '').length) + this.currentHue
          var redHue = '#ff' + paddedHue + paddedHue;
          this.currentHue = (this.currentHue + 4) % 60;

          // Talking about arrays and multi-dimensional arrays are just arrays within arrays.
          var pixels = [['white', 'black', 'black', 'white', 'white', 'white', 'black', 'black', 'white'],
                        ['black', redHue, redHue, 'black', 'white', 'black', redHue, redHue, 'black'],
                        ['black', redHue, redHue, redHue, 'black', redHue, redHue, redHue, 'black'],
                        ['black', redHue, redHue, redHue, redHue, redHue, redHue, redHue, 'black'],
                        ['white', 'black', redHue, redHue, redHue, redHue, redHue, 'black', 'white'],
                        ['white', 'white', 'black', redHue, redHue, redHue, 'black', 'white', 'white'],
                        ['white', 'white', 'white', 'black', redHue, 'black', 'white', 'white', 'white'],
                        ['white', 'white', 'white', 'white', 'black', 'white', 'white', 'white', 'white']];
          var heart = this;
          pixels.forEach(function(row, rowIndex){
            row.forEach(function(pixelColor, columnIndex){
              context.fillStyle = pixelColor;
              context.fillRect(heart.x + (columnIndex * 5), heart.y + (rowIndex * 5), 5, 5);
            });
          });

          resetContextStyle();
        },
        update: function(){}
      };
    }

    function clearCanvas(){
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      resetContextStyle();
      context.strokeRect(0, 0, boardWidth, boardHeight);
    }

    function refresh(){
      clearCanvas();
      objects.forEach(function(object){
        object.render();
        object.update();
      });
    }

    function clearFrictionHandler(){
      clearInterval(frictionHandler);
      frictionHandler = undefined;
    }

    // Talking about objects as dictionaries - continue.
    // Since it's a dictionary, a number is also acceptable.
    var actions = {
      // Left (37 - Right arrow)
      37: function(){
        if(hasStarted){
          player.setSpeed(player.speedX - 8);
          clearFrictionHandler();
        }
      },
      // Right (39 - Right arrow)
      39: function(){
        if(hasStarted){
          player.setSpeed(player.speedX + 8);
          clearFrictionHandler();
        }
      },
      // Start game (13 - Enter)
      13: function(){
        if(!hasStarted){
          ball.setSpeed(0, -10);
          hasStarted = true;
        }
      }
    };

    // 32 - Space
    actions[32] = actions[13];

    // Talking about event driven development
    window.addEventListener('keydown', function(event){
        // Talking about "truthy" and "falsy" values and return value from logical operators
        (actions[event.keyCode] || function(){})();
    });

    window.addEventListener('keyup', function(){
        if(!frictionHandler){
          frictionHandler = setInterval(function(){
            if(player.speedX === 0){
              clearFrictionHandler();
              return;
            }
            player.setSpeed(player.speedX > 0 ? player.speedX - 1 : player.speedX + 1);
          }, 5);
        }
    });

    function addBricks(){
        for(var brickIndex = 1; brickIndex < 75; brickIndex++){
          var x = -60 + (brickIndex * (brickWidth + brickMargin)) % boardWidth;

          // Making sure that the brick doesn't exceed the board.
          if(x < brickWidth + brickMargin || boardWidth - x < brickWidth + brickMargin){
            continue;
          }

          var y = 60 + Math.floor((brickIndex * (brickWidth + brickMargin)) / boardWidth) * 30;

          // Talking about arrays, continue - they can act like queues with push/pop functions.
          bricks.push(createBrick(x, y));
          objects.push(bricks[bricks.length - 1]);
        }
    }

    // Talking about function parameters and overloading
    function resetPlayerAndBall(numberOfLives){
      hasStarted = false;
      numberOfLives = numberOfLives || 3;
      ball = createBall();
      player = createPlayer();

      // Talking about arrays, continue - the opposite of pop/push.
      objects.shift();
      objects.shift();
      objects.unshift(player);
      objects.unshift(ball);

      while(lives.length > 0){
        removeFrom(lives, 0);
      }

      for (var life = 0; life < numberOfLives; life++) {
        lives.push(createHeart(life * 50));
        objects.push(lives[lives.length - 1]);
      }
    }

    function init(){
      ball = createBall();
      player = createPlayer();

      // Placeholders for the player and ball.
      objects = [{}, {}];
      resetPlayerAndBall();
      addBricks();

      if (gameLoopHandler){
        clearInterval(gameLoopHandler);
      }

      // Talking about using functions as objects, it's basically a pointer object to a function.
      // Also talking about the event loop and one thread and a-synchronicity
      gameLoopHandler = setInterval(refresh, 40);
    }

    init();
}