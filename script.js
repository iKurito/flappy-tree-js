const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
// We will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "assets/flappy-tree.png";

//Game constants
const FLAP_SPEED = -3;
const TREE_WIDTH = 40;
const TREE_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Tree variables
let treeX = 50;
let treeY = 50;
let treeVelocity = 0;
let treeAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

// We add a bool variable, so we can check when flappy passes we increase
// the value
let scored = false;

// Lets us control the tree with the space key
document.body.onkeyup = function (e) {
	if (e.code == "Space") {
		treeVelocity = FLAP_SPEED;
	}
};

hideEndMenu();

// lets us restart the game if we hit game-over
document.getElementById("restart-button").addEventListener("click", function () {
	hideEndMenu();
	resetGame();
	loop();
});

function increaseScore() {
	// Increase now our counter when our flappy passes the pipes
	if (
		treeX > pipeX + PIPE_WIDTH &&
		(treeY < pipeY + PIPE_GAP || treeY + TREE_HEIGHT > pipeY + PIPE_GAP) &&
		!scored
	) {
		score++;
		scoreDiv.innerHTML = score;
		scored = true;
	}

	// Reset the flag, if tree passes the pipes
	if (treeX < pipeX + PIPE_WIDTH) {
		scored = false;
	}
}

function collisionCheck() {
	// Create bounding Boxes for the tree and the pipes

	const treeBox = {
		x: treeX,
		y: treeY,
		width: TREE_WIDTH,
		height: TREE_HEIGHT,
	};

	const topPipeBox = {
		x: pipeX,
		y: pipeY - PIPE_GAP + TREE_HEIGHT,
		width: PIPE_WIDTH,
		height: pipeY,
	};

	const bottomPipeBox = {
		x: pipeX,
		y: pipeY + PIPE_GAP + TREE_HEIGHT,
		width: PIPE_WIDTH,
		height: canvas.height - pipeY - PIPE_GAP,
	};

	// Check for collision with upper pipe box
	if (
		treeBox.x + treeBox.width > topPipeBox.x &&
		treeBox.x < topPipeBox.x + topPipeBox.width &&
		treeBox.y < topPipeBox.y
	) {
		return true;
	}

	// Check for collision with lower pipe box
	if (
		treeBox.x + treeBox.width > bottomPipeBox.x &&
		treeBox.x < bottomPipeBox.x + bottomPipeBox.width &&
		treeBox.y + treeBox.height > bottomPipeBox.y
	) {
		return true;
	}

	// Check if tree hits boundaries
	if (treeY < 0 || treeY + TREE_HEIGHT > canvas.height) {
		return true;
	}

	return false;
}

function hideEndMenu() {
	document.getElementById("end-menu").style.display = "none";
	gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
	document.getElementById("end-menu").style.display = "block";
	gameContainer.classList.add("backdrop-blur");
	document.getElementById("end-score").innerHTML = score;

	if (highScore < score) {
		highScore = score;
	}
	document.getElementById("best-score").innerHTML = highScore;
}

// We reset the values to the beginning so we start
// with the tree at the beginning
function resetGame() {
	treeX = 50;
	treeY = 50;
	treeVelocity = 0;
	treeAcceleration = 0.1;

	pipeX = 400;
	pipeY = canvas.height - 200;

	score = 0;
	document.getElementById("score-display").innerHTML = score;
}

function endGame() {
	showEndMenu();
}

function loop() {
	// After each iteration of the loop, "reset the ctx"
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Flappy Tree drawing
	ctx.drawImage(flappyImg, treeX, treeY);

	// Draw Pipes
	ctx.fillStyle = "#333";
	ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
	ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

	// So, in order to display our end-menu and terminate the game,
	// we would need to add a collisionCheck.
	// collisionCheck will return true if we have a collision, otherwise false.
	if (collisionCheck()) {
		endGame();
		return;
	}

	// Missed moving the pipes
	pipeX -= 1.5;
	// If the pipe moves out of the frame we need to reset the pipe
	if (pipeX < -50) {
		pipeX = 400;
		pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
	}

	// Apply gravity to the tree and let it move
	treeVelocity += treeAcceleration;
	treeY += treeVelocity;

	increaseScore();
	requestAnimationFrame(loop);
}

loop();
