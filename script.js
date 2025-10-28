// Mode switching
const modeButtons = document.querySelectorAll('.mode-btn');
const countdownSection = document.getElementById('countdown-section');
const stopwatchSection = document.getElementById('stopwatch-section');

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        
        // Update active button
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Switch sections
        if (mode === 'countdown') {
            countdownSection.classList.remove('hidden');
            stopwatchSection.classList.add('hidden');
        } else {
            countdownSection.classList.add('hidden');
            stopwatchSection.classList.remove('hidden');
        }
    });
});

// ===== COUNTDOWN TIMER =====
let countdownInterval = null;
let countdownTimeLeft = 0;
let countdownTotalTime = 0;

const countdownDisplay = document.getElementById('countdown-display');
const countdownStartBtn = document.getElementById('countdown-start');
const countdownPauseBtn = document.getElementById('countdown-pause');
const countdownResetBtn = document.getElementById('countdown-reset');
const countdownProgress = document.getElementById('countdown-progress');

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

// Quick timer buttons
const quickButtons = document.querySelectorAll('.quick-btn');
quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const totalSeconds = parseInt(btn.dataset.time);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        hoursInput.value = hours;
        minutesInput.value = minutes;
        secondsInput.value = seconds;
        
        updateCountdownDisplay();
    });
});

// Input change listeners
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!countdownInterval) {
            updateCountdownDisplay();
        }
    });
});

function getCountdownInputTime() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

function updateCountdownDisplay() {
    const totalSeconds = countdownTimeLeft || getCountdownInputTime();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    countdownDisplay.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCountdownProgress() {
    if (countdownTotalTime > 0) {
        const progress = ((countdownTotalTime - countdownTimeLeft) / countdownTotalTime) * 100;
        countdownProgress.style.width = `${progress}%`;
    }
}

countdownStartBtn.addEventListener('click', () => {
    if (countdownTimeLeft === 0) {
        countdownTimeLeft = getCountdownInputTime();
        countdownTotalTime = countdownTimeLeft;
    }
    
    if (countdownTimeLeft === 0) {
        alert('Please set a time!');
        return;
    }
    
    countdownStartBtn.disabled = true;
    countdownPauseBtn.disabled = false;
    [hoursInput, minutesInput, secondsInput].forEach(input => input.disabled = true);
    
    countdownInterval = setInterval(() => {
        countdownTimeLeft--;
        updateCountdownDisplay();
        updateCountdownProgress();
        
        if (countdownTimeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            countdownComplete();
        }
    }, 1000);
});

countdownPauseBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
});

countdownResetBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownTimeLeft = 0;
    countdownTotalTime = 0;
    countdownProgress.style.width = '0%';
    
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
    [hoursInput, minutesInput, secondsInput].forEach(input => input.disabled = false);
    
    updateCountdownDisplay();
    countdownDisplay.classList.remove('completed');
});

function countdownComplete() {
    countdownDisplay.classList.add('completed');
    countdownStartBtn.disabled = false;
    countdownPauseBtn.disabled = true;
    [hoursInput, minutesInput, secondsInput].forEach(input => input.disabled = false);
    
    // Play notification sound
    playNotificationSound();
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
            body: 'Your countdown timer has finished.',
            icon: '⏰'
        });
    }
    
    // Reset for next use
    setTimeout(() => {
        countdownDisplay.classList.remove('completed');
    }, 1500);
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===== STOPWATCH =====
let stopwatchInterval = null;
let stopwatchTime = 0;
let lapCount = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const stopwatchStartBtn = document.getElementById('stopwatch-start');
const stopwatchPauseBtn = document.getElementById('stopwatch-pause');
const stopwatchResetBtn = document.getElementById('stopwatch-reset');
const stopwatchLapBtn = document.getElementById('stopwatch-lap');
const lapsContainer = document.getElementById('laps-container');

function formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchTime);
}

stopwatchStartBtn.addEventListener('click', () => {
    stopwatchStartBtn.disabled = true;
    stopwatchPauseBtn.disabled = false;
    stopwatchLapBtn.disabled = false;
    
    const startTime = Date.now() - stopwatchTime;
    
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 10);
});

stopwatchPauseBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    
    stopwatchStartBtn.disabled = false;
    stopwatchPauseBtn.disabled = true;
    stopwatchLapBtn.disabled = true;
});

stopwatchResetBtn.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    lapCount = 0;
    
    stopwatchStartBtn.disabled = false;
    stopwatchPauseBtn.disabled = true;
    stopwatchLapBtn.disabled = true;
    
    updateStopwatchDisplay();
    lapsContainer.innerHTML = '';
});

stopwatchLapBtn.addEventListener('click', () => {
    lapCount++;
    
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <strong>Lap ${lapCount}</strong>
        <span>${formatStopwatchTime(stopwatchTime)}</span>
    `;
    
    lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
});

// Audio notification function
function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Play a second beep
    setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
    }, 200);
}

// Initialize display
updateCountdownDisplay();
updateStopwatchDisplay();
