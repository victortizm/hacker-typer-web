// --------------------------------------------------------
// 1. FONDO MATRIX
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
    ctx.fillStyle = "#00ffff";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// --------------------------------------------------------
// 2. HACKER TYPER
// --------------------------------------------------------
const terminal = document.getElementById('terminal-output');
const win1 = document.getElementById('mini-window-1');
const win2 = document.getElementById('mini-window-2');
const win3 = document.getElementById('mini-window-3');
const asciiDisplay = document.getElementById('ascii-art-display');
const mathDisplay = document.getElementById('math-display');
const hackProgress = document.getElementById('hack-progress');
const hackedScreen = document.getElementById('hacked-screen');
const gameContainer = document.getElementById('game-container');

let keysPressed = 0;
let codeIndex = 0;
const maxKeys = 60; // 60 teclas para que empiece el juego

const fakeCode = `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n\n/* Kernel exploit */\ntypedef struct { char ip[16]; int port; } Target;\n\nvoid bypass_firewall(Target *t) {\n    printf("[*] Escaneando %s...\\n", t->ip);\n    for(int i=0; i<65535; i++) {\n        if(i == 443) printf("[+] Puerto abierto\\n");\n    }\n}\n\nint main() {\n    while(1) {\n        printf("Inyectando payload...\\n");\n        sleep(1);\n    }\n    return 0;\n}\n\n/* Derivadas e integrales */\ndouble f(double x) { return x*x + sin(x); }\ndouble df(double x) { return 2*x + cos(x); }\ndouble integrate(double a, double b) { return (b*b*b - a*a*a)/3.0; }\n\n// BOOM...\n`;

const asciiArts = [
`  <3 <3 <3\n <3       <3\n  <3     <3\n    <3 <3\n      <3`,
`    /\\\n   /  \\\n  |    |\n  |    |\n /|    |\\\n/_|____|_\\`
];

const mathFormulas = [
`∫ e^(-x^2) dx = √π/2`,
`d/dx [sin(x)cos(x)] = cos(2x)`,
`∇ × E = -∂B/∂t`,
`∑ (1/n^2) = π^2/6`,
`∮ F · dr = ∬ (∇ × F) · dS`,
`lim (1 + 1/x)^x = e`,
`∂²u/∂t² = c² ∇²u`
];

function typeCode(e) {
    // Si estamos en el juego o en la pantalla de hackeado, ignorar
    if (!gameContainer.classList.contains('hidden') || 
        !hackedScreen.classList.contains('hidden')) return;
    
    if (e.key === "Escape") { location.reload(); return; }
    if (e.key.length !== 1 && e.key !== "Enter") return;

    keysPressed++;

    for (let i = 0; i < 3; i++) {
        if (codeIndex >= fakeCode.length) codeIndex = 0;
        terminal.textContent += fakeCode[codeIndex];
        codeIndex++;
    }

    if (keysPressed === 10) win1.classList.remove('hidden');
    if (keysPressed === 20) win2.classList.remove('hidden');
    if (keysPressed === 30) win3.classList.remove('hidden');

    if (keysPressed > 10) {
        const artIndex = Math.floor((keysPressed - 10) / 8) % asciiArts.length;
        asciiDisplay.textContent = asciiArts[artIndex];
    }

    if (keysPressed > 20) {
        let percent = Math.min(((keysPressed - 20) / (maxKeys - 20)) * 100, 100);
        hackProgress.style.width = percent + "%";
    }

    if (keysPressed > 30) {
        const mathIndex = Math.floor((keysPressed - 30) / 6) % mathFormulas.length;
        mathDisplay.textContent = mathFormulas[mathIndex];
    }

    if (keysPressed >= maxKeys) {
        startGeometryDash();
    }
}

document.addEventListener('keydown', typeCode);

// --------------------------------------------------------
// 3. GEOMETRY DASH (Sin tiburón, muerte instantánea con triángulos)
// --------------------------------------------------------
const dashCanvas = document.getElementById('dashCanvas');
const dCtx = dashCanvas.getContext('2d');

let player, obstacles, dashScore, dashSpeed, dashActive, dashLoop;
let autoTypeInterval;

// Función para escribir código automáticamente en el fondo mientras juegas
function startAutoType() {
    autoTypeInterval = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            if (codeIndex >= fakeCode.length) codeIndex = 0;
            terminal.textContent += fakeCode[codeIndex];
            codeIndex++;
        }
        if (terminal.textContent.length > 2000) {
            terminal.textContent = terminal.textContent.slice(500);
        }
    }, 50);
}

function startGeometryDash() {
    win1.classList.add('hidden');
    win2.classList.add('hidden');
    win3.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    startAutoType(); 
    
    player = { x: 50, y: 320, size: 30, vy: 0, gravity: 0.8, jumpForce: -14, grounded: true };
    obstacles = [];
    dashScore = 0;
    dashSpeed = 8;
    dashActive = true;

    if (dashLoop) cancelAnimationFrame(dashLoop);
    updateDash();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (dashActive && player.grounded) {
            player.vy = player.jumpForce;
            player.grounded = false;
        }
    }
});

function updateDash() {
    if (!dashActive) return;
    dashScore += 5; 

    // Física del jugador
    player.vy += player.gravity;
    player.y += player.vy;
    if (player.y >= 320) {
        player.y = 320;
        player.vy = 0;
        player.grounded = true;
    }

    // Generar obstáculos (triángulos)
    if (Math.random() < 0.03) {
        obstacles.push({ x: 800, y: 330, width: 20, height: 20 });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= dashSpeed;
        
        // Colisión: Si toca el triángulo, muere inmediatamente
        if (player.x < obstacles[i].x + obstacles[i].width && 
            player.x + player.size > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height && 
            player.y + player.size > obstacles[i].y) {
            endDash(); // Activa la pantalla de HACKEADO
            return;
        }
        if (obstacles[i].x < -50) obstacles.splice(i, 1);
    }

    // Renderizado
    dCtx.clearRect(0, 0, 800, 400);
    dCtx.strokeStyle = "#00ffff";
    dCtx.beginPath(); dCtx.moveTo(0, 350); dCtx.lineTo(800, 350); dCtx.stroke();

    // Jugador
    dCtx.fillStyle = "#ffff00";
    dCtx.fillRect(player.x, player.y, player.size, player.size);

    // Triángulos
    dCtx.fillStyle = "#ff0000";
    obstacles.forEach(obs => {
        dCtx.beginPath();
        dCtx.moveTo(obs.x, obs.y + obs.height);
        dCtx.lineTo(obs.x + obs.width / 2, obs.y);
        dCtx.lineTo(obs.x + obs.width, obs.y + obs.height);
        dCtx.fill();
    });

    // Puntos
    dCtx.fillStyle = "#00ffff";
    dCtx.font = "20px monospace";
    dCtx.fillText("PUNTOS: " + dashScore, 650, 40);

    dashLoop = requestAnimationFrame(updateDash);
}

// Función que se ejecuta al morir
function endDash() {
    dashActive = false;
    clearInterval(autoTypeInterval);
    gameContainer.classList.add('hidden');
    hackedScreen.classList.remove('hidden'); // Muestra HACKEADO
}

// --------------------------------------------------------
// 4. REDIRECCIÓN AL JUEGO EXTERNO (Mata el 404 de raíz)
// --------------------------------------------------------
document.addEventListener('keydown', (e) => {
    // Si presionan Espacio en la pantalla de HACKEADO, redirigimos a la URL oficial
    if (e.code === 'Space' && !hackedScreen.classList.contains('hidden')) {
        window.location.href = "https://m-assault-fable.netlify.app";
    }
});