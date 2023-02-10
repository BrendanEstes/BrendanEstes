const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 7;
var ballSpeed = 5;

context.font = "100px serif";
var butncnt = 0;

//set and display initial score as 0
var player1 = 0;
var player2 = 0;
document.getElementById("player1Score").innerHTML = player1;
document.getElementById("player2Score").innerHTML = player2;

const leftPaddle = {
  // start in the middle of the game on the left side
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const rightPaddle = {
  // start in the middle of the game on the right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const ball = {
  // start in the middle of the game
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dx: ballSpeed,
  dy: -ballSpeed
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // move paddles by their velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // prevent paddles from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  }
  else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  }
  else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  // draw paddles
  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // move ball by its velocity
  ball.x += ball.dx;
  ball.y += ball.dy;

  // prevent ball from going through walls by changing its velocity
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  }
  else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  // reset ball if it goes past paddle (but only if we haven't already done so)
  if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;

	
	// increases player score if ball goes past paddle of opposite player
	if (ball.dx > 0) {
	  player1++;
	  document.getElementById("player1Score").innerHTML = player1;
	}

	if (ball.dx < 0) {
	  player2++;
	  document.getElementById("player2Score").innerHTML = player2;
	}


    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);
  }

  // check to see if ball collides with paddle. if they do change x velocity
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = leftPaddle.x + leftPaddle.width;
  }
  else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = rightPaddle.x - ball.width;
  }

  // draw ball
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw dotted line down the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }


  // make right paddle move by itself like a computer player
  if (rightPaddle.y != ball.y) { // move paddle to the location of the ball
    rightPaddle.dy += ball.dy;
  }
 
  // end the game, display play again button
  if (player1 >= 7 || player2 >= 7) {
    gamereset = false;
    context.fillText("Game  Over", (canvas.width / 2 - grid / 2) - 255,(canvas.height / 2));

    const button = document.createElement('button');
    button.id = "button-1";
    button.innerText = 'Click To Play Again';
    
    // make button appear
    if (butncnt == 0) {
      var divElem = document.createElement('div');
      divElem.setAttribute('style', 'text-align:center;');
      divElem.appendChild(button);
      document.body.appendChild(divElem);
      butncnt += 1
    }
    

    // reset ball and paddle position
    ball.x = canvas.width / 2;
    ball.dx = 0;
    ball.y = canvas.height / 2;
    ball.dy = 0;
    leftPaddle.y = canvas.height / 2;
    rightPaddle.y = canvas.height / 2;

    button.addEventListener('click', () => { // reset the game
      while (gamereset == false) {
        // clear game over text
        context.clearRect ( (canvas.width / 2 - grid / 2) - 250, (canvas.height / 2) , 400 , 100 );
        // set scores back to zero
        player1 = 0;
        player2 = 0;
        // reset ball and paddle position
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        leftPaddle.y = canvas.height / 2;
        rightPaddle.y = canvas.height / 2;
        ball.dx = ballSpeed;
        ball.dy = -ballSpeed;

        gamereset = true;

        // remove button from screen when playing again
        document.getElementById("button-1").remove();
        butncnt = 0;
      }
     
    })
    

    
  }
} // end of loop function




// listen to keyboard events to move the paddles
document.addEventListener('keydown', function(e) {

  // up arrow key
  // if (e.which === 38) {
  //   rightPaddle.dy = -paddleSpeed;
  // }
  // // down arrow key
  // else if (e.which === 40) {
  //   rightPaddle.dy = paddleSpeed;
  // }

  // w key
  if (e.which === 87) {
    leftPaddle.dy = -paddleSpeed;
  }
  // a key
  else if (e.which === 83) {
    leftPaddle.dy = paddleSpeed;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function(e) {
  // if (e.which === 38 || e.which === 40) {
  //   rightPaddle.dy = 0;
  // }

  if (e.which === 83 || e.which === 87) {
    leftPaddle.dy = 0;
  }
});


// start the game
requestAnimationFrame(loop);
