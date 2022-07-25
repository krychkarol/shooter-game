const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const playerX = canvas.width / 2;
const playerY = canvas.height / 2;

class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Bullet {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const player = new Player(playerX, playerY, 30, 'red');

const bullets = [];
const bullet = new Bullet(playerX, playerY, 10, 'yellow', {x: 1, y: 1});

function animation(){
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    bullets.forEach(bullet => {
        bullet.update()
    })
};

addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - playerY, e.clientX - playerX);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    bullets.push(new Bullet(playerX, playerY, 10, 'yellow', velocity))
});

animation();