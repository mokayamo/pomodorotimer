class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25分
        this.breakTime = 5 * 60; // 5分
        this.currentMode = 'work';
        this.isRunning = false;
        this.timer = null;
        this.animationFrame = null;
    }

    initialize() {
        this.updateDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetTimer());
        document.getElementById('work-time').addEventListener('change', (e) => {
            this.workTime = parseInt(e.target.value) * 60;
            if (!this.isRunning) this.updateDisplay();
        });
        document.getElementById('break-time').addEventListener('change', (e) => {
            this.breakTime = parseInt(e.target.value) * 60;
            if (!this.isRunning) this.updateDisplay();
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        document.getElementById('start-btn').textContent = '停止';
        
        this.timer = setInterval(() => {
            if (this.currentMode === 'work') {
                if (this.workTime > 0) {
                    this.workTime--;
                } else {
                    this.workTime = parseInt(document.getElementById('work-time').value) * 60;
                    this.currentMode = 'break';
                    this.playSound();
                    this.updateMode();
                }
            } else {
                if (this.breakTime > 0) {
                    this.breakTime--;
                } else {
                    this.breakTime = parseInt(document.getElementById('break-time').value) * 60;
                    this.currentMode = 'work';
                    this.playSound();
                    this.updateMode();
                }
            }
            this.updateDisplay();
            this.updateProgress();
        }, 1000);
    }

    stopTimer() {
        this.isRunning = false;
        document.getElementById('start-btn').textContent = '開始';
        clearInterval(this.timer);
        cancelAnimationFrame(this.animationFrame);
    }

    resetTimer() {
        this.stopTimer();
        this.workTime = parseInt(document.getElementById('work-time').value) * 60;
        this.breakTime = parseInt(document.getElementById('break-time').value) * 60;
        this.currentMode = 'work';
        this.updateDisplay();
        this.updateMode();
    }

    updateDisplay() {
        const time = this.currentMode === 'work' ? this.workTime : this.breakTime;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const display = document.getElementById('time-display');
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateMode() {
        const modeText = document.getElementById('mode-text');
        const modeCircle = document.querySelector('.mode-circle');
        
        if (this.currentMode === 'work') {
            modeText.textContent = '作業中';
            modeText.style.color = '#6C63FF';
            modeCircle.style.background = '#6C63FF';
        } else {
            modeText.textContent = '休憩中';
            modeText.style.color = '#FF6B6B';
            modeCircle.style.background = '#FF6B6B';
        }
    }

    updateProgress() {
        const totalSeconds = this.currentMode === 'work' ? parseInt(document.getElementById('work-time').value) * 60 : parseInt(document.getElementById('break-time').value) * 60;
        const remainingSeconds = this.currentMode === 'work' ? this.workTime : this.breakTime;
        const progress = (remainingSeconds / totalSeconds) * 100;
        
        const timeCircle = document.querySelector('.time-circle');
        timeCircle.style.background = `conic-gradient(
            var(--gradient-start) 0%,
            var(--gradient-end) ${progress}%,
            var(--accent-color) ${progress}%,
            var(--gradient-start) 100%
        )`;
    }

    playSound() {
        const audio = new Audio('https://notificationsounds.com/soundfiles/33d7894e82d944929305450e2930964e/file-sounds-1112-notify.mp3');
        audio.play();
    }
}

// タイマーの初期化
const timer = new PomodoroTimer();
timer.initialize();
