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
const gameOverScreen = document.getElementById('game-over-screen');
const metalslugContainer = document.getElementById('metalslug-container');
const metalslugFrame = document.getElementById('metalslug-frame');

let keysPressed = 0;
let codeIndex = 0;
const maxKeys = 120; // Teclas necesarias para el "Game Over"

const fakeCode = `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n\n/* Kernel exploit */\ntypedef struct { char ip[16]; int port; } Target;\n\nvoid bypass_firewall(Target *t) {\n    printf("[*] Escaneando %s...\\n", t->ip);\n    for(int i=0; i<65535; i++) {\n        if(i == 443) printf("[+] Puerto abierto\\n");\n    }\n}\n\nint main() {\n    while(1) {\n        printf("Inyectando payload...\\n");\n        sleep(1);\n    }\n    return 0;\n}\n\n/* Derivadas e integrales */\ndouble f(double x) { return x*x + sin(x); }\ndouble df(double x) { return 2*x + cos(x); }\ndouble integrate(double a, double b) { return (b*b*b - a*a*a)/3.0; }\n\n// BOOM...\n`;

// ASCII Art: Corazón, Cohete, Bomba (en bucle)
const asciiArts = [
`  <3 <3 <3
 <3       <3
  <3     <3
    <3 <3
      <3`,
`    /\\
   /  \\
  |    |
  |    |
 /|    |\\
/_|____|_\\`,
`      ,--.
     /    \\
    |      |
    |      |
     \\    /
      '--'
     BOOM!`
];

// Fórmulas matemáticas complejas (para la ventana 3)
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
    if (!gameOverScreen.classList.contains('hidden') || !metalslugContainer.classList.contains('hidden')) return;
    
    if (e.key === "Escape") {
        location.reload();
        return;
    }

    if (e.key.length !== 1 && e.key !== "Enter") return;

    keysPressed++;

    // Escribir 3 caracteres por tecla
    for (let i = 0; i < 3; i++) {
        if (codeIndex >= fakeCode.length) codeIndex = 0;
        terminal.textContent += fakeCode[codeIndex];
        codeIndex++;
    }

    // Mostrar ventanas según progreso
    if (keysPressed === 20) win1.classList.remove('hidden');
    if (keysPressed === 40) win2.classList.remove('hidden');
    if (keysPressed === 60) win3.classList.remove('hidden');

    // Actualizar ASCII Art (Corazón → Cohete → Bomba en bucle)
    if (keysPressed > 20) {
        const artIndex = Math.floor((keysPressed - 20) / 15) % asciiArts.length;
        asciiDisplay.textContent = asciiArts[artIndex];
    }

    // Actualizar barra de progreso
    if (keysPressed > 40) {
        let percent = Math.min(((keysPressed - 40) / (maxKeys - 40)) * 100, 100);
        hackProgress.style.width = percent + "%";
    }

    // Actualizar fórmulas matemáticas
    if (keysPressed > 60) {
        const mathIndex = Math.floor((keysPressed - 60) / 10) % mathFormulas.length;
        mathDisplay.textContent = mathFormulas[mathIndex];
    }

    // Trigger Game Over
    if (keysPressed >= maxKeys) {
        showGameOver();
    }
}

function showGameOver() {
    terminal.textContent = ""; // Limpiar terminal
    win1.classList.add('hidden');
    win2.classList.add('hidden');
    win3.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Escuchar teclado
document.addEventListener('keydown', typeCode);

// Lógica para iniciar Metal Slug al presionar ESPACIO en Game Over
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOverScreen.classList.contains('hidden')) {
        gameOverScreen.classList.add('hidden');
        metalslugContainer.classList.remove('hidden');
        // Cargar el juego (carpeta 'metalslug' que debes descargar)
        metalslugFrame.src = "metalslug/index.html";
    }
});