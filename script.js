const canvas = document.getElementById('canvas');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');

let started = false;

let up = false;
let down = false;

const playerWidth = 5;
const playerHeight = 60;
const playerVelocity = 4;

class Ball {
	constructor(size, velocity) {
		this.size = size;
		this.velocity = -velocity;
		this.verticalVelocity = 0;
		this.x = canvasWidth / 2;
		this.y = canvasHeight / 2;
	}

	update() {
		this.x += this.velocity;
		this.y += this.verticalVelocity;

		if (this.hitCheck(player) || this.hitCheck(ai)) {
			this.velocity = -this.velocity;
			this.verticalVelocity = Math.floor(Math.random() * 6) - 3;
		}

		if (this.x < 0) {
			win(ai);
		} else if (this.x > canvasWidth) {
			win(player);
		}

		if (this.y <= 0 || this.y >= canvasHeight) {
			this.verticalVelocity = -this.verticalVelocity;
		}
	}

	hitCheck(target) {
		if (
			this.x + this.size > target.x &&
			target.x + target.width > this.x - this.size / 2 &&
			this.y > target.y &&
			target.y + target.height > this.y - this.size / 2
		) {
			return true;
		}

		return false;
	}

	draw() {
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}
}

class Player {
	constructor(width, height, velocity) {
		this.width = width;
		this.height = height;
		this.velocity = velocity;
		this.x = canvasWidth / 5 - width;
		this.y = canvasHeight / 2 - height / 2;
	}

	update() {
		if (up && this.y >= 0) {
			this.y -= this.velocity;
		}
		if (down && this.y + this.height <= canvasHeight) {
			this.y += this.velocity;
		}
	}

	draw() {
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

class AI extends Player {
	constructor(width, height, velocity) {
		super(width, height, velocity);
		this.x = canvasWidth - canvasWidth / 5;
		this.velocity = velocity - 1.7;
	}

	update() {
		if (this.y + this.height / 2 >= ball.y) {
			this.y -= this.velocity;
		} else {
			this.y += this.velocity;
		}
	}
}

const ball = new Ball(4, 3);
const player = new Player(playerWidth, playerHeight, playerVelocity);
const ai = new AI(playerWidth, playerHeight, playerVelocity);

window.addEventListener('keydown', (e) => {
	if (!started) {
		started = true;
		document.querySelector('.message').innerText = '';
		startGame();
	}

	if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
		up = true;
	} else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
		down = true;
	}
});
window.addEventListener('keyup', (e) => {
	if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
		up = false;
	} else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
		down = false;
	}
});

player.draw();
ai.draw();
ball.draw();

let gameLoop = null;

function startGame() {
	gameLoop = setInterval(() => {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		player.update();
		player.draw();

		ai.update();
		ai.draw();

		ball.update();
		ball.draw();
	}, 1);
}

function win(winner) {
	clearInterval(gameLoop);

	const message = winner === player ? 'You win!' : 'AI wins!';
	document.querySelector('.message').innerHTML =
		message + '<br /><button onclick="location.reload()">Restart</button>';
}
