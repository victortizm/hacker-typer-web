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
// HACKEO MAS RÁPIDO: Solo 60 teclas en lugar de 100
const maxKeys = 60;

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
    if (!gameContainer.classList.contains('hidden') || 
        !hackedScreen.classList.contains('hidden') || 
        !metalslugContainer.classList.contains('hidden')) return;
    
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
// 3. GEOMETRY DASH + TIBURÓN ASCII
// --------------------------------------------------------
const dashCanvas = document.getElementById('dashCanvas');
const dCtx = dashCanvas.getContext('2d');
const hackedTitle = document.querySelector('#hacked-screen h1');

let player, obstacles, dashScore, dashSpeed, dashActive, sharkActive, dashLoop;
let autoTypeInterval;

// Tiburón en ASCII art mirando hacia la izquierda
const sharkASCII = [
    "       __",
    "      / _)",
    ".-^^^-/ /",
    " __/   /",
    "<__.|_|-|_|"
];

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
    
    // FÍSICA CORREGIDA: El jugador ahora descansa exactamente sobre el suelo (y=320 + size 30 = 350)
    player = { x: 50, y: 320, size: 30, vy: 0, gravity: 0.8, jumpForce: -14, grounded: true };
    obstacles = [];
    dashScore = 0;
    dashSpeed = 8;
    dashActive = true;
    sharkActive = false;

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

    player.vy += player.gravity;
    player.y += player.vy;
    if (player.y >= 320) {
        player.y = 320;
        player.vy = 0;
        player.grounded = true;
    }

    if (Math.random() < 0.03 && !sharkActive) {
        obstacles.push({ x: 800, y: 330, width: 20, height: 20 }); // Pinchos en el suelo (y=330, height=20 -> tope 350)
    }

    if (dashScore >= 2000 && !sharkActive) {
        sharkActive = true;
        dashSpeed = 15; 
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= dashSpeed;
        
        // COLISIÓN MEJORADA CON LOS PINCHOS
        if (player.x < obstacles[i].x + obstacles[i].width && 
            player.x + player.size > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height && 
            player.y + player.size > obstacles[i].y) {
            endDash();
            return;
        }
        if (obstacles[i].x < -50) obstacles.splice(i, 1);
    }

    // El tiburón va más lento para que se sienta la persecución
    let sharkPosX = 800 - (dashScore - 2000) * 0.6;
    if (sharkActive && sharkPosX < player.x + player.size) {
        endDash();
        return;
    }

    dCtx.clearRect(0, 0, 800, 400);
    dCtx.strokeStyle = "#00ffff";
    dCtx.beginPath(); dCtx.moveTo(0, 350); dCtx.lineTo(800, 350); dCtx.stroke();

    // Dibujar Jugador
    dCtx.fillStyle = "#ffff00";
    dCtx.fillRect(player.x, player.y, player.size, player.size);

    // Dibujar Pinchos
    dCtx.fillStyle = "#ff0000";
    obstacles.forEach(obs => {
        dCtx.beginPath();
        dCtx.moveTo(obs.x, obs.y + obs.height);
        dCtx.lineTo(obs.x + obs.width / 2, obs.y);
        dCtx.lineTo(obs.x + obs.width, obs.y + obs.height);
        dCtx.fill();
    });

    // Dibujar Tiburón ASCII
    if (sharkActive) {
        dCtx.fillStyle = "#ff0000";
        dCtx.font = "18px monospace";
        for (let i = 0; i < sharkASCII.length; i++) {
            dCtx.fillText(sharkASCII[i], sharkPosX, 260 + i * 18);
        }
        dCtx.font = "20px monospace";
        dCtx.fillText("¡EL TIBURÓN SE ACERCA!", 200, 40);
    }

    dCtx.fillStyle = "#00ffff";
    dCtx.font = "20px monospace";
    dCtx.fillText("PUNTOS: " + dashScore, 650, 40);

    dashLoop = requestAnimationFrame(updateDash);
}

function endDash() {
    dashActive = false;
    clearInterval(autoTypeInterval);
    gameContainer.classList.add('hidden');
    hackedScreen.classList.remove('hidden');
}

// --------------------------------------------------------
// 4. METAL SLUG INTEGRADO
// --------------------------------------------------------
const metalslugContainer = document.getElementById('metalslug-container');
const msCanvas = document.getElementById('metalslugCanvas');
const msCtx = msCanvas.getContext('2d');

let msActive = false;
let msPlayer, msBullets, msEnemies, msScore, msLoop;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !hackedScreen.classList.contains('hidden')) {
        hackedScreen.classList.add('hidden');
        metalslugContainer.classList.remove('hidden');
        startMetalSlug();
    }
});

function startMetalSlug() {
    msActive = true;
    msPlayer = { x: 50, y: 180, size: 30, speed: 20 };
    msBullets = [];
    msEnemies = [];
    msScore = 0;
    updateMetalSlug();
}

document.addEventListener('keydown', (e) => {
    if (!msActive) return;
    if (e.key === 'ArrowUp') msPlayer.y = Math.max(0, msPlayer.y - msPlayer.speed);
    if (e.key === 'ArrowDown') msPlayer.y = Math.min(400 - msPlayer.size, msPlayer.y + msPlayer.speed);
    if (e.code === 'Space') {
        e.preventDefault();
        msBullets.push({ x: msPlayer.x + msPlayer.size, y: msPlayer.y + msPlayer.size/2, speed: 15 });
    }
});

function updateMetalSlug() {
    if (!msActive) return;

    if (Math.random() < 0.03) {
        msEnemies.push({ x: 800, y: Math.random() * 350, size: 30, speed: 6 });
    }

    for (let i = msBullets.length - 1; i >= 0; i--) {
        msBullets[i].x += msBullets[i].speed;
        if (msBullets[i].x > 800) msBullets.splice(i, 1);
    }

    for (let i = msEnemies.length - 1; i >= 0; i--) {
        msEnemies[i].x -= msEnemies[i].speed;
        
        if (msEnemies[i].x < msPlayer.x + msPlayer.size && msEnemies[i].x + msEnemies[i].size > msPlayer.x &&
            msEnemies[i].y < msPlayer.y + msPlayer.size && msEnemies[i].y + msEnemies[i].size > msPlayer.y) {
            msActive = false;
            alert("¡MISIÓN FALLIDA! El enemigo te atrapó.\nPresiona OK para reiniciar todo el hackeo.");
            location.reload();
            return;
        }

        for (let j = msBullets.length - 1; j >= 0; j--) {
            if (msBullets[j].x < msEnemies[i].x + msEnemies[i].size && msBullets[j].x > msEnemies[i].x &&
                msBullets[j].y < msEnemies[i].y + msEnemies[i].size && msBullets[j].y > msEnemies[i].y) {
                msEnemies.splice(i, 1);
                msBullets.splice(j, 1);
                msScore += 100;
                break;
            }
        }
    }

    msCtx.fillStyle = "#000";
    msCtx.fillRect(0, 0, 800, 400);

    msCtx.fillStyle = "#00ffff";
    msCtx.fillRect(msPlayer.x, msPlayer.y, msPlayer.size, msPlayer.size);

    msCtx.fillStyle = "#ffff00";
    msBullets.forEach(b => msCtx.fillRect(b.x, b.y, 15, 5));

    msCtx.fillStyle = "#ff0000";
    msEnemies.forEach(e => msCtx.fillRect(e.x, e.y, e.size, e.size));

    msCtx.fillStyle = "#fff";
    msCtx.font = "20px monospace";
    msCtx.fillText("SCORE: " + msScore, 650, 40);
    msCtx.fillText("FLECHAS: Mover | ESPACIO: Disparar", 20, 40);

    msLoop = requestAnimationFrame(updateMetalSlug);
}