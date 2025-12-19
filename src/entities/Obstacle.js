export default class Obstacle {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 80;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);
        this.speedX = -5; // Same speed as gifts roughly, or faster?
        this.markedForDeletion = false;
        this.color = '#2ecc71'; // Tree Green
    }

    update() {
        this.x += this.speedX - (this.game.score * 0.1); // Speed up with score

        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;

        // Simple Triangle Tree
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Trunk
        ctx.fillStyle = '#634c3f'; // Brown
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + this.height, 10, 15);

        ctx.restore();
    }
}
