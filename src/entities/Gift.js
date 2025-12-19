export default class Gift {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height - this.height);
        this.speedX = -5; // Moves left
        this.markedForDeletion = false;

        // Random color for variety
        const colors = ['#e17055', '#0984e3', '#00b894', '#6c5ce7'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX - (this.game.score * 0.05); // Speed up slightly as score increases

        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Ribbon
        ctx.fillStyle = '#ffeaa7';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y, 10, this.height);
        ctx.fillRect(this.x, this.y + this.height / 2 - 5, this.width, 10);

        ctx.restore();
    }
}
