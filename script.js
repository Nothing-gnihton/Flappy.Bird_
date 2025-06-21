const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let frames = 0;
let gameOver = false;
let score = 0;
let topScores = [];

const GRAVITY = 0.25;
const FLAP = -4.6;

let bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 30,
    velocity: 0,
    draw: function () {
        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    flap: function () {
        this.velocity = FLAP;
    },
    update: function () {
        this.velocity += GRAVITY;
        this.y += this.velocity;

        if (this.y + this.height >= canvas.height) {
            gameOver = true;
            updateTopScores();
            document.getElementById('restartButton').style.display = 'block';
        }
    }
};

let pipes = [];
let pipeGap = 120;
let pipeWidth = 50;
let pipeFrequency = 90;

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

function updatePipes() {
    if (frames % pipeFrequency === 0) {
        let topHeight = Math.floor(Math.random() * 200) + 50;
        pipes.push({ x: canvas.width, top: topHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipeWidth === bird.x) {
            score++;
        }

        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)) {
            gameOver = true;
            updateTopScores();
            document.getElementById('restartButton').style.display = 'block';
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateTopScores() {
    topScores.push(score);
    topScores.sort((a, b) => b - a);
    if (topScores.length > 3) topScores.pop();
    displayTopScores();
}

function displayTopScores() {
    const scoreList = document.getElementById('topScores');
    scoreList.innerHTML = '';
    topScores.forEach(s => {
        let li = document.createElement('li');
        li.textContent = s;
        scoreList.appendChild(li);
    });
}

function resetGame() {
    document.getElementById('restartButton').style.display = 'none';
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frames = 0;
    gameOver = false;
    animate();
}

document.addEventListener('keydown', () => {
    if (!gameOver) bird.flap();
});

document.addEventListener('click', () => {
    if (!gameOver) bird.flap();
});

document.getElementById('restartButton').addEventListener('click', () => {
    resetGame();
});

function animate() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    updatePipes();
    drawPipes();

    drawScore();

    frames++;
    requestAnimationFrame(animate);
}

resetGame();
