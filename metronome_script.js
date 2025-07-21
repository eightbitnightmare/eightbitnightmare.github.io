const bpmInput = document.getElementById('bpm');
const beatsSelect = document.getElementById('beats');
const startStopButton = document.getElementById('startStop');
const beatTogglesContainer = document.getElementById('beatToggles');
const highClick = document.getElementById('highClick');
const lowClick = document.getElementById('lowClick');

let bpm = 80;
let beatsPerBar = 4;
let enabledBeats = [true, true, true, true]; // State for each beat
let isPlaying = false;
let intervalId = null;
let beatCount = 0;
let previousActiveToggle = null;

function renderBeatToggles() {
    beatTogglesContainer.innerHTML = ''; // Clear existing toggles
    for (let i = 0; i < beatsPerBar; i++) {
        const toggle = document.createElement('div');
        toggle.classList.add('beat-toggle');
        toggle.classList.add(i === 0 ? 'first-beat' : 'other-beat');
        if (!enabledBeats[i]) {
            toggle.classList.add('disabled');
        }
        toggle.dataset.index = i;
        
        toggle.addEventListener('click', () => {
            const index = parseInt(toggle.dataset.index);
            enabledBeats[index] = !enabledBeats[index];
            toggle.classList.toggle('disabled');
        });
        
        beatTogglesContainer.appendChild(toggle);
    }
}

function playClick() {
    const currentBeatIndex = beatCount % beatsPerBar;
    
    // De-activate previous toggle
    if (previousActiveToggle) {
        previousActiveToggle.classList.remove('active');
    }

    const currentToggle = beatTogglesContainer.children[currentBeatIndex];
    currentToggle.classList.add('active');
    previousActiveToggle = currentToggle;
    
    if (enabledBeats[currentBeatIndex]) {
        if (currentBeatIndex === 0) {
            highClick.currentTime = 0;
            highClick.play();
        } else {
            lowClick.currentTime = 0;
            lowClick.play();
        }
    }
    
    beatCount++;
}

function startMetronome() {
    bpm = parseInt(bpmInput.value);
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
    if (previousActiveToggle) {
        previousActiveToggle.classList.remove('active');
        previousActiveToggle = null;
    }
}

startStopButton.addEventListener('click', () => {
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

bpmInput.addEventListener('input', () => {
    if (isPlaying) {
        stopMetronome();
        startMetronome();
    }
});

beatsSelect.addEventListener('change', () => {
    beatsPerBar = parseInt(beatsSelect.value);
    // Reset enabledBeats array for the new time signature
    enabledBeats = Array(beatsPerBar).fill(true);
    if (isPlaying) stopMetronome();
    renderBeatToggles();
});

// Initial render
renderBeatToggles();
