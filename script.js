const canvas = document.getElementById('canvas');
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
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
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
		} else if (this.x > canvas.width) {
			win(player);
		}

		if (this.y <= 0 || this.y >= canvas.height) {
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
		this.x = canvas.width / 5 - width;
		this.y = canvas.height / 2 - height / 2;
	}

	update() {
		if (up && this.y >= 0) {
			this.y -= this.velocity;
		}
		if (down && this.y + this.height <= canvas.height) {
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
		this.x = canvas.width - canvas.width / 5;
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

let gameLoop;

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	player.update();
	player.draw();

	ai.update();
	ai.draw();

	ball.update();
	ball.draw();

	if (document.querySelector('.message').innerHTML) {
		window.cancelAnimationFrame(gameLoop);
		return;
	}

	gameLoop = window.requestAnimationFrame(animate);
}

function startGame() {
	gameLoop = window.requestAnimationFrame(animate);
}

function win(winner) {
	const message = winner === player ? 'You win!' : 'AI wins!';
	document.querySelector('.message').innerHTML =
		message + '<br /><button onclick="location.reload()">Restart</button>';
}
