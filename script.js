const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Make the game responsive
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load sound effects
const popSound = new Audio("pop.mp3");

// Game Variables
let antibiotics = [];
let bacteria = [];
let score = 0;
let lives = 3;
let level = 1;

// Antibiotic Class
class Antibiotic {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 40;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y -= this.speed;
    }
}

// Bacteria Class
class Bacterium {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    move() {
        this.y += this.speed;
    }
}

// Handle Touch to Fire
canvas.addEventListener("touchstart", (event) => {
    let x = event.touches[0].clientX;
    antibiotics.push(new Antibiotic(x, canvas.height - 60));
});

// Spawn Bacteria
function spawnBacteria() {
    setInterval(() => {
        let x = Math.random() * canvas.width;
        let speed = Math.random() * 2 + 1 + level * 0.5;
        bacteria.push(new Bacterium(x, -20, speed));
    }, 1500);
}

// Collision Detection
function detectCollisions() {
    antibiotics.forEach((antibiotic, aIndex) => {
        bacteria.forEach((bacterium, bIndex) => {
            let dx = bacterium.x - (antibiotic.x + antibiotic.width / 2);
            let dy = bacterium.y - (antibiotic.y + antibiotic.height / 2);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bacterium.radius) {
                popSound.play();
                bacteria.splice(bIndex, 1);
                antibiotics.splice(aIndex, 1);
                score += 10;

                if (score % 50 === 0) level++; // Increase level
            }
        });
    });
}

// Check if bacteria reach bottom
function checkGameOver() {
    bacteria.forEach((bacterium, index) => {
        if (bacterium.y > canvas.height) {
            bacteria.splice(index, 1);
            lives--;
        }
    });

    if (lives <= 0) {
        alert("Game Over! Score: " + score);
        document.location.reload();
    }
}

// Update Game Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    antibiotics.forEach((antibiotic, index) => {
        antibiotic.move();
        antibiotic.draw();
        
        if (antibiotic.y < 0) antibiotics.splice(index, 1);
    });

    bacteria.forEach((bacterium, index) => {
        bacterium.move();
        bacterium.draw();
    });

    detectCollisions();
    checkGameOver();

    // Draw Score & Lives
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Lives: " + lives, canvas.width - 100, 30);
    ctx.fillText("Level: " + level, canvas.width / 2 - 40, 30);

    requestAnimationFrame(update);
}

// Start Game
spawnBacteria();
update();