export default class SnowParticles {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.numberOfParticles = 100;
        this.init();
    }

    init() {
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
            p.x -= p.speedX + 2; // Move left with world
            p.y += p.speedY;

            if (p.x < 0 || p.y > this.game.height) {
                p.x = Math.random() * this.game.width + this.game.width; // Respawn right
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
