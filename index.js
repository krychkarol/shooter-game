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
    };

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };
};

class Bullet {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
    };

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    };
};

class Enemy {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
    };

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    };
};

const player = new Player(playerX, playerY, 30, 'red');
const bullets = [];
const enemies = [];

function createEnemies() {
    setInterval(() => {
        const size = Math.random() * (40 - 5) + 5;
        let x;
        let y;
        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
        };
        const color = 'black';
        const angle = Math.atan2(playerY - y , playerX - x);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
        enemies.push(new Enemy(x, y, size, color, velocity));
    }, 1000);
};

function animation() {
    requestAnimationFrame(animation);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    bullets.forEach(bullet => {
        bullet.update();
    });
    enemies.forEach(enemy => {
        enemy.update();
    });
};

addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - playerY, e.clientX - playerX);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
    bullets.push(new Bullet(playerX, playerY, 10, 'yellow', velocity));
});

animation();
createEnemies();