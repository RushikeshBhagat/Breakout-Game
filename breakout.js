var dx, dy; /* displacement at every dt */
var x, y; /* ball location */
var score = 0; /* # of walls you have cleaned */
var tries = 0; /* # of tries to clean the wall */
var count=0;/* # of bricks knocked off*/
var started = false; /* false means ready to kick the ball */
var ball, court, paddle, brick, msg;
var court_height, court_width, paddle_left;

var bricks = new Array(4); // rows of bricks
var colors = ["red", "blue", "yellow", "green"];

/* get an element by id */
function id(s) {
  return document.getElementById(s);
}

/* convert a string with px to an integer, eg "30px" -> 30 */
function pixels(pix) {
  pix = pix.replace("px", "");
  num = Number(pix);
  return num;
}

/* place the ball on top of the paddle */
function readyToKick() {
  x = pixels(paddle.style.left) + paddle.width / 2.0 - ball.width / 2.0;
  y = pixels(paddle.style.top) - 2 * ball.height;
  ball.style.left = x + "px";
  ball.style.top = y + "px";
}

/* paddle follows the mouse movement left-right */
function movePaddle(e) {
  var ox = e.pageX - court.getBoundingClientRect().left;
  paddle.style.left =
    ox < 0
      ? "0px"
      : ox > court_width - paddle.width
      ? court_width - paddle.width + "px"
      : ox + "px";
  if (!started) readyToKick();
}

function initialize() {
  court = id("court");
  ball = id("ball");
  paddle = id("paddle");
  wall = id("wall");
  msg = id("messages");
  brick = id("red");
  court_height = pixels(court.style.height);
  court_width = pixels(court.style.width);
  for (i = 0; i < 4; i++) {
    // each row has 20 bricks
    bricks[i] = new Array(20);
    var b = id(colors[i]);
    for (j = 0; j < 20; j++) {
      var x = b.cloneNode(true);
      bricks[i][j] = x;
      wall.appendChild(x);
    }
    b.style.visibility = "hidden";
    
  }
  //started = false;
  select = document.getElementById("level");
  

}

/* true if the ball at (x,y) hits the brick[i][j] */
function hits_a_brick(x, y, i, j) {
    let top = i * brick.height+200;
    let left = j * brick.width+90;
  return (
    x >= left && x <= left + brick.width && y >= top && y <= top + brick.height
  );
}

function startGame() {
  let randomAngle = randomInteger(45,135)
  dy = (randomAngle >= 0.5) ? (-1*(parseInt(select.options[select.selectedIndex].text)*3)) : parseInt(select.options[select.selectedIndex].text)*3
	dx = parseInt(select.options[select.selectedIndex].text)*3
  started = true
  breakoutLoop = setInterval(moveBall, 25)
  
}

function resetGame() {
  score=0;
  tries=0;
  level=1;
  document.getElementById("tries").innerHTML = tries
  document.getElementById("score").innerHTML = score
  document.getElementById("messages").innerHTML = ""
  select.options[select.selectedIndex].text = 1
  for (let a = 0; a < 4; a++){
    for (let b = 0; b < 20; b++){
          bricks[a][b].style.visibility="visible";
      } 
    }
    readyToKick()
  }



function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayBricks() {
  for (let a = 0; a < 4; a++){
    for (let b = 0; b < 20; b++){
          bricks[a][b].style.visibility="visible";
      } 
    }
}

function moveBall(){
  let Xcord = ball.getBoundingClientRect().left + dx
	let Ycord = ball.getBoundingClientRect().top + dy
  //paddle.x=paddle.x+paddle.width

	if(Xcord >= court.getBoundingClientRect().right){
		dx = -dx;
	}

  if(Xcord <= paddle.getBoundingClientRect().left+100 && Xcord >= paddle.getBoundingClientRect().right-100
   && Ycord >= paddle.getBoundingClientRect().top){
		dy = -dy; 
   
  }

	if(Xcord < court.getBoundingClientRect().left){
		dx = -dx;
	}

	if(Ycord > court.getBoundingClientRect().bottom-ball.height){
    tries=tries+1
    document.getElementById("tries").innerHTML = tries     
	  clearInterval(breakoutLoop)
    document.getElementById("messages").innerHTML = "Try again"
    started=false;
    readyToKick()
    
	}

	if(Ycord < court.getBoundingClientRect().top){
		dy = -dy;
	}

    for (let a = 0; a < 4; a++){
    for (let b = 0; b < 20; b++){
      if(bricks[a][b].style.visibility!="hidden"){
        if(hits_a_brick(Xcord,Ycord,a,b)){
          dy=-dy;
          bricks[a][b].style.visibility="hidden";
          console.log("hit")
              count=count+1
              if(count==80){
                score=score+1
                document.getElementById("score").innerHTML = score
                document.getElementById("messages").innerHTML = ""
                clearInterval(breakoutLoop)
                started=false;
                displayBricks()
                readyToKick()
              }
        }
      } 
    }
  }

	ball.style.left = parseInt(ball.style.left) + dx + "px";
	ball.style.top = parseInt(ball.style.top) + dy + "px";
 
}

