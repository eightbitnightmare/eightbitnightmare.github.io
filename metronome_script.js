const bpmInput = document.getElementById('bpm');
const beatsSelect = document.getElementById('beats');
const startStopButton = document.getElementById('startStop');
const visualizer = document.querySelector('.visualizer');
const highClick = document.getElementById('highClick');
const lowClick = document.getElementById('lowClick');

let bpm = parseInt(bpmInput.value);
let beatsPerBar = parseInt(beatsSelect.value);
let isPlaying = false;
let intervalId;
let beatCount = 0;

function playClick() {
    if (beatCount % beatsPerBar === 0) {
        highClick.currentTime = 0;
        highClick.play();
        visualizer.className = 'visualizer active-first';
    } else {
        lowClick.currentTime = 0;
        lowClick.play();
        visualizer.className = 'visualizer active';
    }
    setTimeout(() => {
        visualizer.className = 'visualizer';
    }, 100);
    beatCount++;
}

function startMetronome() {
    if (!intervalId) {
        const interval = 60000 / bpm;
        intervalId = setInterval(playClick, interval);
        isPlaying = true;
        startStopButton.textContent = 'Stop';
    }
}

function stopMetronome() {
    clearInterval(intervalId);
    intervalId = null;
    isPlaying = false;
    startStopButton.textContent = 'Start';
    beatCount = 0;
    visualizer.className = 'visualizer';
}

startStopButton.addEventListener('click', () => {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

bpmInput.addEventListener('input', () => {
    bpm = parseInt(bpmInput.value);
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
});

beatsSelect.addEventListener('change', () => {
    beatsPerBar = parseInt(beatsSelect.value);
    beatCount = 0; // Reset beat count on time signature change
});
