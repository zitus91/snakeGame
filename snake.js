// Snake
let snakeX = 0;
let snakeY = 0;
let snakeTail = [];

// Food
let foodX = 0;
let foodY = 0;

//gameBoard
let gameBoard;
let context;
let blockSize = 10;
let w = 300/blockSize;
let h = 300/blockSize;
let score = 0;
let gameOver = false;
let gameStart = false;

// movement
let directionX = 0;
let directionY = 0;
let velocity = 10;
let refreshUpdate;

let message = document.querySelector('#message #board');
let eventBoard = document.querySelector('#event #board');

// StartGame
window.onload = () => {

    let canv = document.createElement('canvas');
    canv.id = 'gameBoard';
    document.body.appendChild(canv); // adds the canvas to the body element

    gameBoard = document.getElementById('gameBoard');
    context = gameBoard.getContext('2d');

    gameBoard.width = w * blockSize;
    gameBoard.height = h * blockSize;

    document.addEventListener('keydown', (e) => {
        changeDirection(e);
    });

    gameBoard.addEventListener('click', () => {
        if(!gameStart){
            gameStartEvent();
            logEvent(`Start game`);

        } else {
            gameStart = false;
            score = 0;
            logEvent(`Stop game`);

        }
    });

    refresh();
}

function refresh(){
    if(gameStart){
        clearInterval(refreshUpdate);
    }

    refreshUpdate = setInterval(() => { update() }, (1000/velocity));
}

function update(){

    // Clear screen
    createRect(0, 0, gameBoard.width, gameBoard.height)
    // drawGrid();

    if(!gameStart){
        createText('Game Ready', gameBoard.width / 2, gameBoard.height/2 - 25, 'center', 50);
        createText('Click to Start', (w*blockSize) / 2, gameBoard.height - 50, 'center');
        return
    }

    if(gameOver){
        createText('Game Over', gameBoard.width / 2, gameBoard.height/2 - 25, 'center', 50);
        createText(`Score : ${score}`, gameBoard.width / 2, gameBoard.height/2 + 25, 'center');
        createText(`Velocity : ${velocity}`, gameBoard.width / 2, gameBoard.height/2 + 50, 'center');
        createText('Click to Start Again', (w*blockSize) / 2, gameBoard.height - 50, 'center');

        return
    }

    // Update Score
    //createText(`Score : ${score}`, 30, 40);
    //createText(`Velocity : ${velocity}`, 30, 60);
    //createText(`Refresh : ${1000/velocity}`, 30, 80);

    // Create first Food
    createRect(foodX, foodY, blockSize, blockSize, 'lime');

    // quando mangia Food
    if(snakeX == foodX && snakeY == foodY){
        snakeTail.push([foodX, foodY]);
        score += 10;
        velocity += 1;
        refresh();
        spawnFood();
        logEvent(`| Mangia ==> X:${foodX} - Y:${foodY} |`);
    }

    // coda
    for(let i = snakeTail.length - 1; i > 0; i--){
        snakeTail[i] = snakeTail[i-1];
    }

    if(snakeTail.length){
        snakeTail[0] = [snakeX, snakeY];
    }

    // posizione
    snakeX += directionX * blockSize;
    snakeY += directionY * blockSize;

    // Tocco la coda
    for (let i = 0; i < snakeTail.length; i++){
        if(snakeX == snakeTail[i][0] && snakeY == snakeTail[i][1]){
            gameOverEvent();
            return;
        }
    }

    // tocco il muro
    if(snakeX < 0 || snakeX > w * blockSize || snakeY < 0 || snakeY > h * blockSize ){
        logMessage(`-----<br />Check Muro : <br />snakeX: ${snakeX}, <br />snakeY: ${snakeY}, <br />w * blockSize: ${w*blockSize}, <br />h * blockSize: ${h*blockSize}<br />-------`);
        gameOverEvent();
        return;
    }

    drawSnake();
}

function drawSnake(){

    //Stampo la Testa dello snake
    createRect(snakeX, snakeY, blockSize, blockSize, 'orange');

    //Stampo la Coda
    for(let i = 0; i < snakeTail.length; i++){
        createRect(snakeTail[i][0], snakeTail[i][1], blockSize, blockSize, 'lime');
    }
}

function gameStartEvent() {
    resetParam();
    spawnFood();
    gameOver = false;
    gameStart = true;
    refresh();
}

function gameOverEvent(){
    gameOver = true;
    logEvent(`Morte ==> snakeX : ${snakeX} --> snakeY : ${snakeY}`);
}


function changeDirection(e){
    switch (e.code) {
        case 'ArrowUp':
            directionX = 0;
            directionY = -1;
        break;

        case 'ArrowDown':
            directionX = 0;
            directionY = 1;
        break;

        case 'ArrowLeft':
            directionX = -1;
            directionY = 0;
        break;

        case 'ArrowRight':
            directionX = 1;
            directionY = 0;
        break;

        default:
            if(!gameStart){
                gameStartEvent();
            } else {
                gameStart = false;
                score = 0;
            }
        break;
    }

    // console.log(`X: ${directionX}, Y: ${directionY}`);
}

function spawnFood() {
    foodX = Math.floor(Math.random() * w) * blockSize;
    foodY = Math.floor(Math.random() * h) * blockSize;
}

function createRect(x,y,width,height,color="black"){
    context.fillStyle = color;
    context.fillRect(x,y,width,height);
}

function createText(text, x,y, textAlign = "start", fontSize = 20){
    context.fillStyle = 'lime';
    context.font = `${fontSize}px Roboto Mono`;
    context.textAlign = textAlign;
    context.fillText(text, x,y);
}

function resetParam(){
    directionX = 1;
    directionY = 0;
    snakeX = 0;
    snakeY = 0;
    velocity = 10;
    snakeTail = [];
}

function drawGrid(){

    let bw = w * blockSize;
    let bh = h * blockSize;
    let p = 0;

    for (var x = 0; x <= bw; x += blockSize) {
        context.moveTo(1 + x + p, p);
        context.lineTo(1 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += blockSize) {
        context.moveTo(p,  velocity + x + p);
        context.lineTo(bw + p,  velocity + x + p);
    }

    context.strokeStyle = "lime";
    context.stroke();
}

function logMessage(txt) {
    message.innerHTML += `<p>${txt}</p>`;
    message.scrollTop = message.scrollHeight;
}

function logEvent(txt) {
    eventBoard.innerHTML += `<p>${txt}</p>`;
    eventBoard.scrollTop = eventBoard.scrollHeight;
}