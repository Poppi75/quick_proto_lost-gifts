// Classes definitions

class InputHandler {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false
        };

        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.code)) {
                this.keys[e.code] = false;
            }
        });
    }

    isDown(key) {
        return this.keys[key];
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 60;
        this.x = 50;
        this.y = this.game.height / 2;
        this.vy = 0;
        this.speed = 0.8; // Was 0.5 - snappier movement
        this.maxSpeed = 10; // Was 8
        this.friction = 0.95;
        this.angle = 0;
    }

    update(input) {
        if (input.isDown('ArrowUp')) {
            this.vy -= this.speed;
        } else if (input.isDown('ArrowDown')) {
            this.vy += this.speed;
        }

        this.vy *= this.friction;
        this.y += this.vy;

        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.y > this.game.height - this.height) {
            this.y = this.game.height - this.height;
            this.vy = 0;
        }

        this.angle = this.vy * 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle * Math.PI / 180);

        // --- Visuals: Santa & Reindeer ---

        // 1. Reins (connecting Reindeer to Sleigh)
        ctx.strokeStyle = '#a4b0be';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 5); // From Sleigh front
        ctx.lineTo(60, 10); // To Reindeer
        ctx.stroke();

        // 2. Reindeer (Simple Brown Shape)
        ctx.fillStyle = '#8d6e63'; // Brown
        // Body
        ctx.fillRect(50, 0, 40, 20);
        // Head
        ctx.fillRect(80, -10, 15, 15);
        // Legs
        ctx.fillRect(50, 20, 5, 15); // Back leg
        ctx.fillRect(80, 20, 5, 15); // Front leg
        // Red Nose (Rudolph)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(95, -5, 3, 0, Math.PI * 2);
        ctx.fill();

        // 3. Sleigh Body
        ctx.fillStyle = '#d63031'; // Sleigh Red
        // Main carriage
        ctx.fillRect(-this.width / 2, 0, 60, 30);
        // Back rest
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.quadraticCurveTo(-this.width / 2 - 10, -20, -10, 0);
        ctx.fill();

        // 4. Runners (Gold/Silver)
        ctx.strokeStyle = '#dfe6e9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 30);
        ctx.lineTo(20, 30);
        // Curve up at front
        ctx.quadraticCurveTo(35, 25, 40, 10);
        ctx.stroke();

        // 5. Santa
        // Face
        ctx.fillStyle = '#ffccaa';
        ctx.beginPath();
        ctx.arc(-10, -10, 8, 0, Math.PI * 2);
        ctx.fill();
        // Beard
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-10, -5, 8, 0, Math.PI);
        ctx.fill();
        // Hat
        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.moveTo(-18, -14);
        ctx.lineTo(-2, -14);
        ctx.lineTo(-10, -25);
        ctx.fill();
        // Pom pom
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-10, -25, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class SnowParticles {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.numberOfParticles = 100;
        this.init();
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.game.width,
            y: Math.random() * this.game.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 3 + 1
        };
    }

    update() {
        this.particles.forEach(p => {
            p.x -= p.speedX + 2;
            p.y += p.speedY;

            if (p.x < 0 || p.y > this.game.height) {
                p.x = Math.random() * this.game.width + this.game.width;
                p.y = -10;
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        this.particles.forEach(p => {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        });
        ctx.fill();
    }
}

class Gift {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);
        this.speedX = -5;
        this.markedForDeletion = false;

        const colors = ['#e17055', '#0984e3', '#00b894', '#6c5ce7'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX - (this.game.score * 0.05);

        // Check if gift missed (went off screen)
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
            this.game.triggerGameOver(); // Missed gift = Death
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#ffeaa7';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y, 10, this.height);
        ctx.fillRect(this.x, this.y + this.height / 2 - 5, this.width, 10);

        ctx.restore();
    }
}

class Obstacle {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 80;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);
        this.speedX = -5;
        this.markedForDeletion = false;
        this.color = '#2ecc71';
    }

    update() {
        this.x += this.speedX - (this.game.score * 0.1);

        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#634c3f';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + this.height, 10, 15);

        ctx.restore();
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            if (this.snow) this.snow.init();
        });

        this.input = new InputHandler();
        this.player = new Player(this);
        this.snow = new SnowParticles(this);

        this.gifts = [];
        this.obstacles = [];
        this.giftTimer = 0;
        this.giftInterval = 1000;
        this.obstacleTimer = 0;
        this.obstacleInterval = 2500;

        this.score = 0;
        this.gameOver = false;

        this.onGameOver = null;
        this.onScoreUpdate = null;

        this.lastTime = 0;
    }

    start() {
        this.score = 0;
        this.gameOver = false;
        this.gifts = [];
        this.obstacles = [];
        this.player = new Player(this);
        this.lastTime = performance.now();
        this.animate(this.lastTime);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
    }

    triggerGameOver() {
        if (!this.gameOver) {
            this.gameOver = true;
            if (this.onGameOver) this.onGameOver(this.score);
        }
    }

    update(deltaTime) {
        if (this.gameOver) return;

        this.player.update(this.input);
        this.snow.update();

        // Handle Gifts
        if (this.giftTimer > this.giftInterval) {
            this.gifts.push(new Gift(this));
            this.giftTimer = 0;
        } else {
            this.giftTimer += deltaTime;
        }

        this.gifts.forEach(gift => {
            gift.update();
            if (this.checkCollision(this.player, gift)) {
                gift.markedForDeletion = true;
                this.score++;
                if (this.onScoreUpdate) this.onScoreUpdate(this.score);
            }
        });

        this.gifts = this.gifts.filter(g => !g.markedForDeletion);

        // Handle Obstacles
        if (this.obstacleTimer > this.obstacleInterval) {
            this.obstacles.push(new Obstacle(this));
            this.obstacleTimer = 0;
        } else {
            this.obstacleTimer += deltaTime;
        }

        this.obstacles.forEach(obstacle => {
            obstacle.update();
            const hitbox = {
                x: obstacle.x + 10,
                y: obstacle.y + 10,
                width: obstacle.width - 20,
                height: obstacle.height - 10
            };

            if (this.checkCollision(this.player, hitbox)) {
                this.triggerGameOver();
            }
        });

        this.obstacles = this.obstacles.filter(o => !o.markedForDeletion);
    }

    // ... draw and animate methods match previous ...

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#2d3436';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(this.width, this.height - 50);
        this.ctx.lineTo(0, this.height - 20);
        this.ctx.fill();

        this.snow.draw(this.ctx);
        this.player.draw(this.ctx);
        this.gifts.forEach(gift => gift.draw(this.ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }

    animate(timeStamp) {
        if (this.gameOver) return;

        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.animate.bind(this));
    }
}

// Main initialization
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const game = new Game(canvas);

    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const scoreVal = document.getElementById('score');
    const finalScoreVal = document.getElementById('final-score');

    function onGameStart() {
        console.log("Game Starting...");
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        game.start();
    }

    function onGameOver(score) {
        console.log("Game Over. Score:", score);
        finalScoreVal.innerText = score;
        gameOverScreen.classList.remove('hidden');
    }

    if (startBtn) startBtn.addEventListener('click', onGameStart);
    if (restartBtn) restartBtn.addEventListener('click', onGameStart);

    game.onGameOver = onGameOver;
    game.onScoreUpdate = (score) => {
        scoreVal.innerText = score;
    };
});
