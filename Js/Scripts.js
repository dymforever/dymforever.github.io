// Fecha en que comenzo 💕
const fechaInicio = new Date("2025-05-01");
const timerEl = document.getElementById("timer");

function actualizarDias() {
    const ahora = new Date();
    const inicio = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const diferencia = hoy - inicio;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    timerEl.innerHTML = dias;
}

// Llamada inicial inmediata
actualizarDias();

// Luego actualizar cada segundo
setInterval(actualizarDias, 1000);

// Musica
const audio = document.getElementById("bg-music");
const btn = document.getElementById("play-btn");
audio.volume = 0.8;

// Botón de play/pausa
btn.addEventListener('click', async () => {
    try {
        if (audio.paused) {
            await audio.play();
            btn.classList.add('playing'); // efecto visual opcional
            startVisualizer(); // iniciar visualizador al reproducir
        } else {
            audio.pause();
            btn.classList.remove('playing');
        }
    } catch (e) {
        console.warn('No se pudo reproducir:', e);
    }
});

// Visualizador de texto al ritmo de la música
const texts = document.querySelectorAll(".beat-text");
let audioCtx, analyser, source, dataArray;

function startVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        animate();
    }
}

function animate() {
    requestAnimationFrame(animate);
    analyser.getByteFrequencyData(dataArray);

    // Promedio de las frecuencias graves (0–30 aprox.)
    let bass = dataArray.slice(0, 30).reduce((a, b) => a + b, 0) / 30;

    // Normalizamos (0 a 1)
    let scale = 1 + bass / 450;
    texts.forEach(t => {
        t.style.transform = `scale(${scale})`;
    });
}