// Fecha en que comenzo 💕
const fechaInicio = new Date("2025-05-01");
setInterval(() => {
    const ahora = new Date();
    // Normalizamos las horas a medianoche (00:00)
    const inicio = new Date(
        fechaInicio.getFullYear(), 
        fechaInicio.getMonth(), 
        fechaInicio.getDate()
    );
    const hoy = new Date(
        ahora.getFullYear(), 
        ahora.getMonth(), 
        ahora.getDate()
    );
    const diferencia = hoy - inicio;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    document.getElementById("timer").innerHTML = dias;
}, 1000);

// Musica
const audio = document.getElementById("bg-music");
const btn = document.getElementById("play-btn");
audio.volume = 0.8;
audio.addEventListener('play',  () => btn.classList.add('playing'));
audio.addEventListener('pause', () => btn.classList.remove('playing'));
btn.addEventListener('click', async () => {
    try {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    } catch (e) {
        console.warn('No se pudo reproducir:', e);
    }
});

// Seleccionamos los textos que quieres que "bailen"
const texts = document.querySelectorAll(".beat-text");

// Beat
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

// Iniciar visualizer automáticamente al cargar la página
window.addEventListener("load", () => {
  startVisualizer();
  audio.play().catch(e => console.warn('No se pudo reproducir automáticamente:', e));
});