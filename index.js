import { Player } from './models/Player.js';
import { Bullet } from './models/Bullet.js';
import { Enemy } from './models/Enemy.js';
import { Explosion } from './models/Explosion.js';

import {playerColor, bulletColor, backgroundColor, canvas, ctx, scoreElement, scoreSummaryElement, startBtnElement, menuElement } from './settings.js';

//set 100% width & height
canvas.width = innerWidth;
canvas.height = innerHeight;

//set player position
const playerX = canvas.width / 2;
const playerY = canvas.height / 2;

//init
let player = new Player(playerX, playerY, 20, playerColor);
let bullets = [];
let enemies = [];
let explosions = [];
let score = 0;
let interval;
let animationFrameId;

//restart all variables
function initialize() {
    player = new Player(playerX, playerY, 20, playerColor);
    bullets = [];
    enemies = [];
    explosions = [];
    score = 0;
    scoreElement.innerHTML = score;
    scoreSummaryElement.innerHTML = score;
};

//create enemies
function createEnemies() {
    interval = setInterval(() => {
        //size 5 to 40
        const size = Math.random() * (40 - 5) + 5;
        let x;
        let y;
        //random create location
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
        //speed of enemies
        const speed = 1;
        const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        enemies.push(new Enemy(x, y, size, color, velocity));
    }, 1000);
};

//animation function
function animation() {
    animationFrameId = requestAnimationFrame(animation);
    //background style
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw player
    player.draw();
    //draw explosions
    explosions.forEach((explosion, explosionIndex) => {
        // update or remove explosions
        if(explosion.lifeTime <= 0) {
            explosions.splice(explosionIndex, 1);
        } else {
            explosion.update();            
        };
    });
    //draw bullets
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
    //draw enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        //distance enemy to player
        const distance = Math.hypot(playerX - enemy.x, playerY - enemy.y);
        //hit player - stop animation - game over
        if(distance - player.size - enemy.size < 1) {
            cancelAnimationFrame(animationFrameId);
            clearInterval(interval);
            menuElement.style.display = 'flex';
            scoreSummaryElement.innerHTML = score;
        }
        bullets.forEach((bullet, bulletIndex) => {
            //distance enemy to bullet
            const distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            //hit enemy
            if(distance - bullet.size - enemy.size < 1) {
                //add score
                score += 10;
                scoreElement.innerHTML = score;
                //create explosions on hit
                for(let i = 0; i < enemy.size; i++) {
                    explosions.push(new Explosion(
                        bullet.x,
                        bullet.y,
                        ((Math.random() * 2) * Math.ceil(enemy.size/5)),
                        enemy.color,
                        {
                            x: (Math.random() - 0.5) * 4,
                            y: (Math.random() - 0.5) * 4
                        }
                    ));
                };
                //remove enemy and bullet on hit
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                }, 0);
            };
        });
    });
};

//on click event - shoot bullet
addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - playerY, e.clientX - playerX);
    //speed of bullets
    const speed = 2;
    const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    };
    bullets.push(new Bullet(playerX, playerY, 5, bulletColor, velocity));
});

//start or restart game
startBtnElement.addEventListener('click', () => {
    initialize();
    animation();
    createEnemies();
    menuElement.style.display = 'none';
});