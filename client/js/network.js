const canvas = document.getElementById("network");
const graph = JSON.parse(localStorage.getItem("graphData"));
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const mouse = {
    x: null,
    y: null,
    radius: 120
};

canvas.addEventListener("mousemove", (e) => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

});

canvas.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});

class Particle {

    constructor() {

        this.reset();

        this.radius = 2.5;

    }

    reset() {

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
this.dx = (Math.random() - 0.5) * 1.2;
this.dy = (Math.random() - 0.5) * 1.2;

    }

    draw() {

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = "#14B8A6";

        ctx.shadowColor = "#14B8A6";
        ctx.shadowBlur = 10;

        ctx.fill();

        ctx.shadowBlur = 0;

    }

    update() {

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= 0 || this.x >= canvas.width)
            this.dx *= -1;

        if (this.y <= 0 || this.y >= canvas.height)
            this.dy *= -1;

        if (mouse.x !== null) {

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {

                this.x -= dx / 60;
                this.y -= dy / 60;

            }

        }

        this.draw();

    }

}

const particles = [];

const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {

    particles.push(new Particle());

}

function connectParticles() {

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 140) {

                let opacity = 1 - distance / 140;

                ctx.beginPath();

                ctx.moveTo(particles[i].x, particles[i].y);

                ctx.lineTo(particles[j].x, particles[j].y);

                ctx.strokeStyle = `rgba(20,184,166,${opacity * 0.35})`;

                ctx.lineWidth = 1;

                ctx.stroke();

            }

        }

    }

}

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {

        particle.update();

    });

    connectParticles();

    requestAnimationFrame(animate);

}

animate();