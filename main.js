const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ballX = 30;
let ballY = 30;
let ballSpeedX = 6;
let ballSpeedY = 4;
let paddle1Y = 250;
let paddle2Y = 250;
let player1Score = 0;
let player2Score = 0;
const winningScore = 3;
let isWin = false;
const paddleHeight = 150;
const paddleThickness = 10;
  
let framesPerSecond = 30;

function mousePos(e){
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return{
    x: mouseX,
    y: mouseY
  }
}
canvas.addEventListener("mousemove", (e) =>{
  let mousePosition = mousePos(e);
  paddle1Y = mousePosition.y - paddleHeight / 2
})
canvas.addEventListener("mousedown", (e) =>{
  if(isWin){
    player1Score = 0;
    player2Score = 0;
    isWin = false;
  }
})
function drawNet(){
  for(i = 0; i < canvas.height; i+=40){
    colorRect(canvas.width/2-1, i, 2, 20, "white");
  }
}
function draw(){
  // 黑色背景
  colorRect(0, 0, canvas.width, canvas.height, "black");
  if (isWin){
    if(player1Score >= winningScore){
      ctx.fillStyle = "white";
      ctx.font = "20px 'Press Start 2P'";
      ctx.fillText("You Won!", canvas.width/2 , canvas.height/2)
    }else{
      ctx.fillStyle = "blue";
      ctx.font = "20px 'Press Start 2P'";
      ctx.fillText("Computer Won!", canvas.width/2 , canvas.height/2)
    }
    ctx.fillStyle = "white";
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("Click to continue", canvas.width/2, canvas.height-100)
    return;
  }
  // 網
  drawNet();
  // 球
  colorCircle(ballX, ballY, 10, "white");
  // 球拍
  colorRect(10, paddle1Y, paddleThickness, paddleHeight , "pink");
  colorRect(canvas.width - paddleThickness - 10, paddle2Y, paddleThickness, paddleHeight , "pink");
  // 玩家分數（靠左）
  ctx.fillStyle = "white";
  ctx.font = "15px 'Press Start 2P'";
  ctx.textAlign = "left";   // 從座標往右畫
  ctx.fillText(`Your Score: ${player1Score}`, 100, 100);
  // 電腦分數（靠右）
  ctx.fillStyle = "blue";
  ctx.textAlign = "right";  // 從座標往左畫
  ctx.fillText(`Computer Score: ${player2Score}`, canvas.width - 100, 100);
}
function ballReset(){
  if(player1Score >= winningScore || player2Score >= winningScore){
    // 原本是放在 reset 裡面，但我要顯示比數，所以改到另開新局才歸零比數
    // player1Score = 0;
    // player2Score = 0;
    isWin = true; 
  }
  ballSpeedX = -ballSpeedX ;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}
function move(){
  if (isWin){
    return;
  }

  computermove(); 
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if(ballX < 20 + paddleThickness){
    if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight){
      ballSpeedX = -ballSpeedX ;
      // 靠近邊緣反彈得越快，靠近中心反彈得越平
      // 打到球拍中心， deltaY = 0，垂直速度接近 0，球會直直飛
      // 打到球拍偏上：deltaY 為負，球往上斜飛
      // 打到球拍偏下：deltaY 為正，球往下斜飛
      let deltaY = ballY - (paddle1Y + (paddleHeight / 2))
      ballSpeedY = deltaY * 0.45;
    } else{
      player2Score ++; // 加分之後才reset
      ballReset();
    }
  }
  if(ballX > canvas.width - 20 - paddleThickness){
    if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight){
      ballSpeedX = -ballSpeedX ;
      let deltaY = ballY - (paddle2Y + (paddleHeight / 2))
      ballSpeedY = deltaY * 0.45;
    } else{
      player1Score ++; 
      ballReset();
    }
  }
  
  if(ballY > canvas.height || ballY < 0){
    ballSpeedY = -ballSpeedY ;
  }
  console.log(ballX, ballY);
}
function computermove(){
  const paddle2YCenter = paddle2Y + (paddleHeight / 2)
  // 如果球在拍子中心點的上下某個範圍之間，就不用移動
  if(ballY > paddle2YCenter + 40){
    paddle2Y += 10;
  }else if(ballY < paddle2YCenter - 40){
    paddle2Y -= 10;
  }
}
function colorRect(topX, leftY, width, height, color){
  ctx.fillStyle = color;
  ctx.fillRect (topX, leftY, width, height);
}

function colorCircle(centerX, centerY, radius, color){
  ctx.fillStyle = color;
  ctx.beginPath(); // 開始新的路徑
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true); // 定義一個圓
  ctx.fill(); // 填色，把它畫出來
}

setInterval(function(){
  draw();
  move();
}, 1000/ framesPerSecond);