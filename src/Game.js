import Player from './entities/Player.js';
import Gift from './entities/Gift.js';
import Obstacle from './entities/Obstacle.js';
import SnowParticles from './effects/SnowParticles.js';
import InputHandler from './utils/InputHandler.js';

export default class Game {
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

        // Callbacks
        this.onGameOver = null;
        this.onScoreUpdate = null;

        this.lastTime = 0;
    }

    start() {
        this.score = 0;
        this.gameOver = false;
        this.gifts = [];
        this.obstacles = [];
        this.player = new Player(this); // Reset player
        this.animate(0);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score);
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
            // Shrink hitbox slightly for obstacles to be fair
            const hitbox = {
                x: obstacle.x + 10,
                y: obstacle.y + 10,
                width: obstacle.width - 20,
                height: obstacle.height - 10
            };

            if (this.checkCollision(this.player, hitbox)) {
                this.gameOver = true;
                if (this.onGameOver) this.onGameOver(this.score);
            }
        });

        this.obstacles = this.obstacles.filter(o => !o.markedForDeletion);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background
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
