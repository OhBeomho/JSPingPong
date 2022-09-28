const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let started = false
let gameOver = false

const playerWidth = 5
const playerHeight = 60
const playerVelocity = 4

class Ball {
	constructor(size, velocity) {
		this.size = size
		this.velocity = -velocity
		this.verticalVelocity = 0
		this.x = canvas.width / 2
		this.y = canvas.height / 2
	}

	update() {
		this.x += this.velocity
		this.y += this.verticalVelocity

		if (this.hitCheck(player) || this.hitCheck(ai)) {
			this.velocity = -this.velocity

			if (player.up || ai.up) this.verticalVelocity = -Math.abs(this.verticalVelocity * 2)
			else if (player.down || ai.down) this.verticalVelocity = Math.abs(this.verticalVelocity * 2)
			else this.verticalVelocity = Math.floor(Math.random() * 6) - 3

			if (this.verticalVelocity > 2.5) this.verticalVelocity = 2.5
			else if (this.verticalVelocity < -2.5) this.verticalVelocity = -2.5
		}

		if (this.x < 0) win(ai)
		else if (this.x > canvas.width) win(player)

		if (this.y <= 0 || this.y >= canvas.height) this.verticalVelocity = -this.verticalVelocity
	}

	hitCheck(target) {
		if (
			this.x + this.size > target.x &&
			target.x + target.width > this.x - this.size / 2 &&
			this.y > target.y &&
			target.y + target.height > this.y - this.size / 2
		) return true

		return false
	}

	draw() {
		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		ctx.fill()
	}
}

class Player {
	constructor(width, height, velocity) {
		this.width = width
		this.height = height
		this.velocity = velocity
		this.x = canvas.width / 5 - width
		this.y = canvas.height / 2 - height / 2
		this.up = this.down = false
	}

	update() {
		if (this.up && this.y >= 0) this.y -= this.velocity
		if (this.down && this.y + this.height <= canvas.height) this.y += this.velocity
	}

	draw() {
		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

class AI extends Player {
	constructor(width, height, velocity) {
		super(width, height, velocity)
		this.x = canvas.width - canvas.width / 5
		this.velocity = velocity - 1.7
		this.up = this.down = false
	}

	update() {
		if (this.y + this.height / 2 > ball.y && this.y >= 0) {
			this.y -= this.velocity
			this.up = true
		} else if (this.y + this.height / 2 < ball.y && this.y + this.height <= canvas.height) {
			this.y += this.velocity
			this.down = true
		} else this.up = this.down = false
	}
}

const player = new Player(playerWidth, playerHeight, playerVelocity)
const ai = new AI(playerWidth, playerHeight, playerVelocity)
const ball = new Ball(4, 3)

ctx.fillStyle = 'white'
ctx.font = '30px Segoe UI Black'
ctx.fillText('Press any key to start', 10, 30)
ctx.font = '20px Segoe UI Semibold'
ctx.fillText('A, D or Arrow up, Arrow down - Move', 10, 60)

window.addEventListener('keydown', (e) => {
	if (!started) {
		started = true
		animate()
	}

	if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') player.up = true
	else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') player.down = true
})
window.addEventListener('keyup', (e) => {
	if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') player.up = false
	else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') player.down = false
})

player.draw()
ai.draw()
ball.draw()

let gameLoop

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	player.update()
	player.draw()

	ai.update()
	ai.draw()

	ball.update()
	ball.draw()

	if (gameOver) return window.cancelAnimationFrame(gameLoop)

	gameLoop = window.requestAnimationFrame(animate)
}

function win(winner) {
	gameOver = true
	const message = winner === player ? 'You win!' : 'AI wins!'

	ctx.fillStyle = 'white'
	ctx.strokeStyle = 'black'

	ctx.font = '30px Segoe UI Black'
	ctx.fillText('GAME OVER', 10, 30)
	ctx.font = '20px Segoe UI Semibold'
	ctx.fillText(message, 10, 60)

	ctx.font = '30px Segoe UI Black'
	ctx.strokeText('GAME OVER', 10, 30)
	ctx.font = '20px Segoe UI Semibold'
	ctx.strokeText(message, 10, 60)

	const restartButton = document.createElement('button')
	restartButton.innerText = 'Restart'
	restartButton.addEventListener('click', () => location.reload())
	document.body.appendChild(restartButton)
}
