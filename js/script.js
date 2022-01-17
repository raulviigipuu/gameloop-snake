"use strict";

const ID = {
    canvas: 'canvas',
    score: 'score',
    fps: 'fps'
}

const VAL = {
    board: {
        borderColor: 'black',
        backgroundColor: 'white'
    },
    snake: {
        color: 'lightblue',
        borderColor: 'darkblue'
    },
    food: {
        color: 'lightgreen',
        borderColor: 'darkgreen'
    },
    keys: {
        left: 37,
        right: 39,
        up: 38,
        down: 40
    }
}

// ELEMENTS
let canvas;
let context;
let labelScore;
let labelFps;

// DATA
let score = 0;
let fps = 0;
let acc = 0;
let speed = 0.05;
let snakeBody = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
];
let snakeDirection = {
    x: 10,
    y: 0,
    changing: false
}

let food = {
    x: 0,
    y: 0
}

// fps calculations
let secondsPassed = 0;
let oldTimestamp = 0;

// INIT
window.onload = init;

function init() {

    console.log("init");
    canvas = document.getElementById(ID.canvas);
    context = canvas.getContext('2d');
    labelScore = document.getElementById(ID.score);
    labelFps = document.getElementById(ID.fps);

    generateFood();
    window.requestAnimationFrame(gameLoop);
}

// EVENTS
document.addEventListener("keydown", changeDirection);


function gameLoop(timestamp) {
    if (gameEnded()) return;

    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timestamp - oldTimestamp) / 1000;
    oldTimestamp = timestamp;
    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    labelFps.innerHTML = fps;

    if (acc > 0.1) {
        snakeDirection.changing = false;
    }

    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

function update() {
    if (acc > 0.1) {
        acc = 0;
        moveSnake();
    }
    acc += secondsPassed;
}

function moveSnake() {
    const head = { x: snakeBody[0].x + snakeDirection.x, y: snakeBody[0].y + snakeDirection.y };
    // Add the new head to the beginning of snake body
    snakeBody.unshift(head);
    const hasEatenFood = snakeBody[0].x === food.x && snakeBody[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        labelScore.innerHTML = score;
        generateFood();
    } else {
        // Remove the last part of snake body
        snakeBody.pop();
    }
}

function draw() {
    clear();
    drawFood();
    drawSnake();
}

function drawFood() {
    context.fillStyle = VAL.food.color;
    context.strokestyle = VAL.food.borderColor;
    context.fillRect(food.x, food.y, 10, 10);
    context.strokeRect(food.x, food.y, 10, 10);
}

function drawSnake() {
    snakeBody.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {

    context.fillStyle = VAL.snake.color;
    context.strokestyle = VAL.snake.borderColor;
    context.fillRect(snakePart.x, snakePart.y, 10, 10);
    context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {

    // Prevent the snake from reversing
    if (snakeDirection.changing) return;
    snakeDirection.changing = true;
    const keyPressed = event.keyCode;
    const goingUp = snakeDirection.y === -10;
    const goingDown = snakeDirection.y === 10;
    const goingRight = snakeDirection.x === 10;
    const goingLeft = snakeDirection.x === -10;
    if (keyPressed === VAL.keys.left && !goingRight) {
        snakeDirection.x = -10;
        snakeDirection.y = 0;
    }
    if (keyPressed === VAL.keys.up && !goingDown) {
        snakeDirection.x = 0;
        snakeDirection.y = -10;
    }
    if (keyPressed === VAL.keys.right && !goingLeft) {
        snakeDirection.x = 10;
        snakeDirection.y = 0;
    }
    if (keyPressed === VAL.keys.down && !goingUp) {
        snakeDirection.x = 0;
        snakeDirection.y = 10;
    }
}

function randomNumber(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
    food.x = randomNumber(0, canvas.width - 10);
    food.y = randomNumber(0, canvas.height - 10);
    // if the new food location is where the snake currently is, generate a new food location
    snakeBody.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x == food.x && part.y == food.y;
        if (hasEaten) generateFood();
    });
}

function clear() {
    context.fillStyle = VAL.board.backgroundColor;
    context.strokestyle = VAL.board.borderColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function gameEnded() {
    for (let i = 4; i < snakeBody.length; i++) {
        if (snakeBody[i].x === snakeBody[0].x && snakeBody[i].y === snakeBody[0].y) return true
    }
    if (score === 1000) {
        console.log("win");
        return true;
    }
    const hitLeftWall = snakeBody[0].x < 0;
    const hitRightWall = snakeBody[0].x > canvas.width - 10;
    const hitToptWall = snakeBody[0].y < 0;
    const hitBottomWall = snakeBody[0].y > canvas.height - 10;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}
