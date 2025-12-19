export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 60;
        this.x = 50;
        this.y = this.game.height / 2;
        this.vy = 0;
        this.speed = 0.5; // Acceleration
        this.maxSpeed = 8;
        this.friction = 0.95;
        this.angle = 0;

        // Simple shape for now, replace with image/path later
        this.color = '#ffcc00';
    }

    update(input) {
        // Movement
        if (input.isDown('ArrowUp')) {
            this.vy -= this.speed;
        } else if (input.isDown('ArrowDown')) {
            this.vy += this.speed;
        }

        // Apply physics
        this.vy *= this.friction;
        this.y += this.vy;

        // Bounds
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.y > this.game.height - this.height) {
            this.y = this.game.height - this.height;
            this.vy = 0;
        }

        // Tilt effect
        this.angle = this.vy * 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle * Math.PI / 180);

        // Sleigh Body
        ctx.fillStyle = '#d63031'; // Sleigh Red
        ctx.fillRect(-this.width / 2, 0, this.width, this.height / 2);

        // Runners
        ctx.strokeStyle = '#b2bec3';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 2);
        ctx.lineTo(this.width / 2 + 20, this.height / 2);
        ctx.stroke();

        // Runner curve
        ctx.beginPath();
        ctx.arc(this.width / 2 + 20, this.height / 2 - 10, 10, Math.PI / 2, -Math.PI / 2, true);
        ctx.stroke();

        ctx.restore();
    }
}
