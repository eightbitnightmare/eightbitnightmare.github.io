document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bpmInput = document.getElementById('bpm');
    const keySelect = document.getElementById('key-select');
    const scaleSelect = document.getElementById('scale-select');
    const startStopBtn = document.getElementById('start-stop-btn');
    const noteDisplay = document.getElementById('note-display');
    const metronomeToggle = document.getElementById('metronome-toggle');
    const metronomeSound = document.getElementById('metronome-sound');

    // --- Musical Data ---
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const SCALES = {
        'Major': [0, 2, 4, 5, 7, 9, 11],
        'Minor': [0, 2, 3, 5, 7, 8, 10],
        'Major Pentatonic': [0, 2, 4, 7, 9],
        'Minor Pentatonic': [0, 3, 5, 7, 10],
        'Blues': [0, 3, 5, 6, 7, 10]
    };

    let trainingInterval = null;
    let currentScaleNotes = [];

    // --- Functions ---

    /**
     * Populates the dropdown select elements with keys and scales.
     */
    function populateSelectors() {
        NOTES.forEach(note => {
            const option = new Option(note, note);
            keySelect.add(option);
        });

        Object.keys(SCALES).forEach(scaleName => {
            const option = new Option(scaleName, scaleName);
            scaleSelect.add(option);
        });
    }

    /**
     * Generates the notes for the selected key and scale.
     */
    function generateScaleNotes() {
        const rootNote = keySelect.value;
        const scaleName = scaleSelect.value;
        const rootIndex = NOTES.indexOf(rootNote);
        const scaleIntervals = SCALES[scaleName];

        currentScaleNotes = scaleIntervals.map(interval => {
            return NOTES[(rootIndex + interval) % 12];
        });
    }

    /**
     * Picks a random note from the current scale and displays it.
     */
    function updateNote() {
        if (currentScaleNotes.length === 0) return;
        const randomIndex = Math.floor(Math.random() * currentScaleNotes.length);
        noteDisplay.textContent = currentScaleNotes[randomIndex];
    }
    
    /**
     * Executes on every beat of the metronome.
     */
    function tick() {
        // Play metronome sound if toggled on
        if (metronomeToggle.checked) {
            metronomeSound.currentTime = 0;
            metronomeSound.play().catch(error => console.error("Audio play failed:", error));
        }
        // Update the displayed note
        updateNote();
    }


    /**
     * Starts the training session.
     */
    function startTraining() {
        const bpm = parseInt(bpmInput.value, 10);
        if (isNaN(bpm) || bpm < 40) {
            alert("Please enter a valid BPM (40 or higher).");
            return;
        }

        const intervalMilliseconds = (60 / bpm) * 1000;
        
        generateScaleNotes();
        
        // Start the first beat immediately, then set the interval for subsequent beats.
        tick(); 
        trainingInterval = setInterval(tick, intervalMilliseconds);

        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.add('active');
    }

    /**
     * Stops the training session.
     */
    function stopTraining() {
        clearInterval(trainingInterval);
        trainingInterval = null;
        
        // Stop and reset the metronome sound
        metronomeSound.pause();
        metronomeSound.currentTime = 0;

        noteDisplay.textContent = '-';
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('active');
    }

    // --- Event Listeners ---

    startStopBtn.addEventListener('click', () => {
        if (trainingInterval) {
            stopTraining();
        } else {
            startTraining();
        }
    });

    // --- Initial Setup ---
    populateSelectors();
});
