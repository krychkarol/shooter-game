const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const playerX = canvas.width / 2;
const playerY = canvas.height / 2;

//colors
const playerColor = 'rgb(154, 247, 255)';
const bulletColor = 'rgb(179, 249, 255)';
const backgroundColor = 'rgba(0, 0, 0, 0.3)';

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

const player = new Player(playerX, playerY, 20, playerColor);
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
        //enemy random color
        const color = `hsl(${Math.random() * 360}, 75%, 50%)`;
        const angle = Math.atan2(playerY - y , playerX - x);
        const speed = 1;
        const velocity = {
            //speed of enemies
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        enemies.push(new Enemy(x, y, size, color, velocity));
    }, 1000);
};

let animationFrameId;
function animation() {
    animationFrameId = requestAnimationFrame(animation);
    //background style
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    bullets.forEach((bullet, bulletIndex) => {
        bullet.update();
        //remove bullets
        if( bullet.x + bullet.size < 0              ||
            bullet.x - bullet.size > canvas.width   ||
            bullet.y + bullet.size < 0              ||
            bullet.y - bullet.size > canvas.height) {
                setTimeout(() => {
                    bullets.splice(bulletIndex, 1);
                }, 0);
           };
    });
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        //hit player
        const distance = Math.hypot(playerX - enemy.x, playerY - enemy.y);
        if(distance - player.size - enemy.size < 1) {
            cancelAnimationFrame(animationFrameId);
        }
        //hit enemy
        bullets.forEach((bullet, bulletIndex) => {
            const distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if(distance - bullet.size - enemy.size < 1) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                }, 0);
            };
        });
    });
};

addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - playerY, e.clientX - playerX);
    const speed = 2;
    const velocity = {
        //speed of bullets
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    };
    bullets.push(new Bullet(playerX, playerY, 5, bulletColor, velocity));
});

animation();
createEnemies();