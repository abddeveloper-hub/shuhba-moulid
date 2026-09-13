/* ==========================================================================
   INTERACTIVE QUIZ ENGINE & LIVE SCOREBOARD
   Step-by-step Seerah quiz, timer, audio feedback, canvas certificate & leaderboard
   ========================================================================== */

class QuizEngine {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.participantName = '';
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.hasAnswered = false;
    this.userAnswers = [];
    this.initEventListeners();
  }

  initEventListeners() {
    const startBtn = document.getElementById('quiz-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.resetQuiz());
    }

    const downloadCertBtn = document.getElementById('download-cert-btn');
    if (downloadCertBtn) {
      downloadCertBtn.addEventListener('click', () => this.downloadCertificate());
    }

    const lbSearch = document.getElementById('leaderboard-search-input');
    if (lbSearch) {
      lbSearch.addEventListener('input', (e) => {
        this.renderScoreboard(e.target.value.toLowerCase().trim());
      });
    }
  }

  startQuiz() {
    const nameInput = document.getElementById('quiz-participant-name');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
      if (window.app) window.app.showToast('Please enter your name to begin the quiz.', 'warning');
      if (nameInput) nameInput.focus();
      return;
    }

    this.participantName = name;
    this.questions = window.dataStore.getQuizQuestions();

    if (!this.questions || this.questions.length === 0) {
      if (window.app) window.app.showToast('No quiz questions available.', 'error');
      return;
    }

    this.currentIndex = 0;
    this.score = 0;
    this.elapsedSeconds = 0;
    this.hasAnswered = false;
    this.userAnswers = [];

    // Switch view from welcome to active quiz screen
    document.getElementById('quiz-welcome-screen').style.display = 'none';
    document.getElementById('quiz-summary-screen').style.display = 'none';
    document.getElementById('quiz-active-screen').style.display = 'block';

    if (window.soundFx) window.soundFx.playClick();

    // Start Timer
    this.startTimer();
    this.renderQuestion();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const timerDisplay = document.getElementById('quiz-timer-display');
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = this.elapsedSeconds % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  renderQuestion() {
    this.hasAnswered = false;
    const q = this.questions[this.currentIndex];
    if (!q) return;

    // Progress
    const progressText = document.getElementById('quiz-progress-text');
    const progressFill = document.getElementById('quiz-progress-fill');
    const questionText = document.getElementById('quiz-question-text');
    const optionsList = document.getElementById('quiz-options-list');
    const explanationBox = document.getElementById('quiz-explanation-box');
    const nextBtn = document.getElementById('quiz-next-btn');

    const total = this.questions.length;
    const currentNum = this.currentIndex + 1;
    const percentage = Math.round((currentNum / total) * 100);

    if (progressText) progressText.textContent = `Question ${currentNum} of ${total}`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (questionText) questionText.textContent = q.question;
    if (explanationBox) explanationBox.style.display = 'none';
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = currentNum === total ? 'Complete Quiz & View Results →' : 'Next Question →';
    }

    const letters = ['A', 'B', 'C', 'D'];
    if (optionsList) {
      optionsList.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option-btn" onclick="window.quiz.selectOption(${i})">
          <span class="quiz-option-letter">${letters[i]}</span>
          <span class="quiz-option-text">${opt}</span>
        </button>
      `).join('');
    }
  }

  selectOption(selectedIndex) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    const optionButtons = document.querySelectorAll('.quiz-option-btn');

    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });

    if (isCorrect) {
      this.score++;
      if (window.soundFx) window.soundFx.playSuccess();
    } else {
      if (window.soundFx) window.soundFx.playError();
    }

    this.userAnswers.push({
      question: q.question,
      selected: selectedIndex,
      correct: q.correctIndex,
      isCorrect
    });

    // Show Explanation
    const explanationBox = document.getElementById('quiz-explanation-box');
    const explanationBody = document.getElementById('quiz-explanation-body');
    if (explanationBox && explanationBody) {
      explanationBody.textContent = q.explanation || 'Review the Seerah of the Prophet for deeper reflection on this event.';
      explanationBox.style.display = 'block';
    }

    // Show Next button
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  nextQuestion() {
    if (window.soundFx) window.soundFx.playClick();
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.stopTimer();

    const total = this.questions.length;
    const scorePct = Math.round((this.score / total) * 100);

    // Save to Leaderboard automatically
    window.dataStore.addLeaderboardEntry({
      name: this.participantName,
      score: scorePct,
      timeTaken: this.elapsedSeconds
    });

    // Play fanfare
    if (window.soundFx) window.soundFx.playFanfare();

    // Show Summary Screen
    document.getElementById('quiz-active-screen').style.display = 'none';
    document.getElementById('quiz-summary-screen').style.display = 'block';

    const scoreNum = document.getElementById('summary-score-num');
    const correctCount = document.getElementById('summary-correct-count');
    const timeTaken = document.getElementById('summary-time-taken');
    const participantDisplay = document.getElementById('summary-participant-name');

    if (scoreNum) scoreNum.textContent = `${scorePct}%`;
    if (correctCount) correctCount.textContent = `${this.score} / ${total}`;
    if (timeTaken) {
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = this.elapsedSeconds % 60;
      timeTaken.textContent = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;
    }
    if (participantDisplay) participantDisplay.textContent = this.participantName;

    // Draw Certificate on Canvas
    this.drawCertificate(scorePct);

    // Re-render scoreboard with new record
    this.renderScoreboard();

    if (window.app) window.app.showToast(`Congratulations ${this.participantName}! Your score has been added to the Leaderboard.`, 'success');
  }

  resetQuiz() {
    if (window.soundFx) window.soundFx.playClick();
    document.getElementById('quiz-summary-screen').style.display = 'none';
    document.getElementById('quiz-active-screen').style.display = 'none';
    document.getElementById('quiz-welcome-screen').style.display = 'block';
  }

  drawCertificate(scorePct) {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas size
    canvas.width = 1000;
    canvas.height = 650;

    // Background - Elegant warm parchment white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle border fill
    ctx.fillStyle = '#FAFBFC';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Outer Emerald Border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Inner Gold Decorative Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // Decorative Corner Motifs
    const drawCorner = (x, y) => {
      ctx.save();
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(42, 42);
    drawCorner(canvas.width - 42, 42);
    drawCorner(42, canvas.height - 42);
    drawCorner(canvas.width - 42, canvas.height - 42);

    // Arabic Header
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 28px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', canvas.width / 2, 85);

    // Subtitle
    ctx.fillStyle = '#D97706';
    ctx.font = '600 15px Plus Jakarta Sans, sans-serif';
    ctx.fillText('MAWLID CELEBRATION PORTAL 1446 AH', canvas.width / 2, 120);

    // Certificate Title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 36px Cinzel, serif';
    ctx.fillText('CERTIFICATE OF RECOGNITION', canvas.width / 2, 175);

    // Body lead
    ctx.fillStyle = '#4B5563';
    ctx.font = '400 16px Plus Jakarta Sans, sans-serif';
    ctx.fillText('This certificate is proudly awarded to', canvas.width / 2, 230);

    // Participant Name
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 38px Plus Jakarta Sans, sans-serif';
    ctx.fillText(this.participantName.toUpperCase(), canvas.width / 2, 290);

    // Line under name
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 310);
    ctx.lineTo(canvas.width / 2 + 250, 310);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#4B5563';
    ctx.font = '400 16px Plus Jakarta Sans, sans-serif';
    ctx.fillText('for successfully completing the Interactive Prophetic Seerah & Teachings Quiz', canvas.width / 2, 350);
    ctx.fillText(`achieving an outstanding score of ${scorePct}% in commemoration of Mawlid un-Nabi.`, canvas.width / 2, 380);

    // Golden Seal Emblem in Canvas
    const sealX = canvas.width / 2;
    const sealY = 460;
    ctx.save();
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
    ctx.fillText('MAWLID', sealX, sealY - 6);
    ctx.fillText('HONORS', sealX, sealY + 12);
    ctx.restore();

    // Signatures / Date
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // Date
    ctx.fillStyle = '#6B7280';
    ctx.font = '14px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${today}`, 100, 560);

    // Signature
    ctx.textAlign = 'right';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Dr. Tariq Al-Mansoor', canvas.width - 100, 555);
    ctx.fillStyle = '#6B7280';
    ctx.font = '13px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Director, Seerah Educational Board', canvas.width - 100, 575);

    // Signature line
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 320, 535);
    ctx.lineTo(canvas.width - 100, 535);
    ctx.stroke();
  }

  downloadCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    if (window.soundFx) window.soundFx.playClick();
    const link = document.createElement('a');
    link.download = `Mawlid_Certificate_${this.participantName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  renderScoreboard(filterQuery = '') {
    const tableBody = document.getElementById('scoreboard-table-body');
    if (!tableBody) return;

    let entries = window.dataStore.getLeaderboard();

    if (filterQuery) {
      entries = entries.filter(e => e.name.toLowerCase().includes(filterQuery));
    }

    if (entries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No participants found on the scoreboard. Take the quiz to be the first!
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = entries.map((entry, index) => {
      let rankClass = 'rank-other';
      let rankBadge = `${index + 1}`;
      if (index === 0) {
        rankClass = 'rank-1';
        rankBadge = '🥇';
      } else if (index === 1) {
        rankClass = 'rank-2';
        rankBadge = '🥈';
      } else if (index === 2) {
        rankClass = 'rank-3';
        rankBadge = '🥉';
      }

      const mins = Math.floor(entry.timeTaken / 60);
      const secs = entry.timeTaken % 60;
      const formattedTime = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;
      const initials = entry.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${rankBadge}</span></td>
          <td>
            <div class="participant-cell">
              <div class="participant-avatar">${initials}</div>
              <span style="font-weight: 700; color: var(--text-primary);">${entry.name}</span>
            </div>
          </td>
          <td><span class="score-pill">${entry.score}%</span></td>
          <td style="color: var(--text-secondary); font-weight: 500;">${formattedTime}</td>
          <td style="color: var(--text-muted); font-size: 0.85rem;">${entry.date || 'Recent'}</td>
        </tr>
      `;
    }).join('');
  }
}

window.quiz = new QuizEngine();
