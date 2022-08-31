const canvas = document.getElementById('canvas');
const app = new PIXI.Application({
	width: 400,
	height: 300,
	view: canvas
});

let running = false;

let up = false;
let down = false;

const playerWidth = 5;
const playerHeight = 60;
const playerVelocity = 4;

function win(winner) {
	running = false;
	const message = winner === player ? 'You win!' : 'AI wins!';
	document.querySelector('.message').innerHTML =
		message + '<br /><button onclick="location.reload()">Restart</button>';
}

class Ball {
	constructor(size, velocity) {
		this.size = size;
		this.velocity = -velocity;
		this.verticalVelocity = 0;
		this.x = app.renderer.width / 2;
		this.y = app.renderer.height / 2;
		this.g = new PIXI.Graphics();
		app.stage.addChild(this.g);
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
		} else if (this.x > app.renderer.width) {
			win(player);
		}

		if (this.y <= 0 || this.y >= app.renderer.height) {
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
		this.g.clear();

		this.g.beginFill(0xffffff);
		this.g.drawCircle(this.x, this.y, this.size);
		this.g.endFill();
	}
}

class Player {
	constructor(width, height, velocity) {
		this.width = width;
		this.height = height;
		this.velocity = velocity;
		this.x = app.renderer.width / 5 - width;
		this.y = app.renderer.height / 2 - height / 2;
		this.g = new PIXI.Graphics();
		app.stage.addChild(this.g);
	}

	update() {
		if (up && this.y >= 0) {
			this.y -= this.velocity;
		}
		if (down && this.y + this.height <= app.renderer.height) {
			this.y += this.velocity;
		}
	}

	draw() {
		this.g.clear();

		this.g.beginFill(0xffffff);
		this.g.drawRect(this.x, this.y, this.width, this.height);
		this.g.endFill();
	}
}

class AI extends Player {
	constructor(width, height, velocity) {
		super(width, height, velocity);
		this.x = app.renderer.width - app.renderer.width / 5;
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
	if (!running) {
		running = true;
		document.querySelector('.message').innerText = '';
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

app.ticker.add(() => {
	if (running) {
		player.update();
		player.draw();

		ai.update();
		ai.draw();

		ball.update();
		ball.draw();
	}
});
