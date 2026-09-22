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
      if (window.app) window.app.showToast('No Seerah Challenge questions currently available. Please add questions via the Admin Control Center.', 'warning');
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

    // Canvas size (high-resolution 1000x650)
    canvas.width = 1000;
    canvas.height = 650;

    // 1. Authoritative Parchment Ground with Subtle Emerald Tone
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(0.5, '#f7f3e3');
    bgGrad.addColorStop(1, '#eee8d5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inner Deep Emerald Filigree Frame
    ctx.strokeStyle = '#0d2b1d';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 2. Ornate Double Gold Ribbon Hairline Border
    // Outer Antique Gold Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    // Mid Emerald Hairline
    ctx.strokeStyle = '#143d2b';
    ctx.lineWidth = 1;
    ctx.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

    // Inner Illuminated Gold Hairline
    ctx.strokeStyle = '#e8ca65';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Corner Cartouches & 8-Pointed Star Khatim Flourishes
    const drawCornerFlourish = (x, y, dx, dy) => {
      ctx.save();
      ctx.strokeStyle = '#d4af37';
      ctx.fillStyle = '#0d2b1d';
      ctx.lineWidth = 1.5;

      // Miniature corner diamond
      ctx.beginPath();
      ctx.moveTo(x, y - dy * 9);
      ctx.lineTo(x + dx * 9, y);
      ctx.lineTo(x, y + dy * 9);
      ctx.lineTo(x - dx * 9, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Corner bracket lines
      ctx.beginPath();
      ctx.moveTo(x + dx * 16, y);
      ctx.lineTo(x + dx * 30, y);
      ctx.moveTo(x, y + dy * 16);
      ctx.lineTo(x, y + dy * 30);
      ctx.stroke();

      ctx.restore();
    };

    drawCornerFlourish(40, 40, 1, 1);
    drawCornerFlourish(canvas.width - 40, 40, -1, 1);
    drawCornerFlourish(40, canvas.height - 40, 1, -1);
    drawCornerFlourish(canvas.width - 40, canvas.height - 40, -1, -1);

    // 3. Integrated Quranic Calligraphy Watermark in Center
    ctx.save();
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.font = '400 40px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillText('وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', canvas.width / 2, 335);
    ctx.restore();

    // 4. Bismillah Arabic Inscription
    ctx.fillStyle = '#0d2b1d';
    ctx.font = 'bold 26px Amiri, serif';
    ctx.textAlign = 'center';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', canvas.width / 2, 85);

    // 5. System Kicker
    ctx.fillStyle = '#997a15';
    ctx.font = '600 12px Outfit, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('NOOR & MAHABBA EVENT SYSTEM • 1446 AH', canvas.width / 2, 118);

    // 6. Certificate Title
    ctx.fillStyle = '#0d2b1d';
    ctx.font = '700 34px Cinzel, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('CERTIFICATE OF RECOGNITION', canvas.width / 2, 168);

    // Small Diamond Divider Under Title
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 140, 185);
    ctx.lineTo(canvas.width / 2 - 15, 185);
    ctx.moveTo(canvas.width / 2 + 15, 185);
    ctx.lineTo(canvas.width / 2 + 140, 185);
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = '10px Outfit, sans-serif';
    ctx.fillText('◆', canvas.width / 2, 188);

    // 7. Body Lead
    ctx.fillStyle = '#4d4635';
    ctx.font = '400 16px Outfit, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('This illuminated certificate of achievement is solemnly awarded to', canvas.width / 2, 230);

    // 8. Dynamic Candidate Name
    ctx.fillStyle = '#0d2b1d';
    ctx.font = '700 34px Cinzel, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(this.participantName.toUpperCase(), canvas.width / 2, 285);

    // Decorative Gold Underline
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 220, 305);
    ctx.lineTo(canvas.width / 2 + 220, 305);
    ctx.stroke();

    // Midpoint Diamond on Underline
    ctx.fillStyle = '#0d2b1d';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 305, 4, 0, Math.PI * 2);
    ctx.fill();

    // 9. Narrative of Completion
    ctx.fillStyle = '#36352a';
    ctx.font = '400 15px Outfit, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('for exemplary scholarship and precision demonstrated in the Sacred Seerah Challenge,', canvas.width / 2, 345);
    ctx.fillText(`achieving an honored accuracy rating of ${scorePct}% in commemoration of Mahabba Eve.`, canvas.width / 2, 372);

    // 10. Dynamic Illuminated Gold-Foil Circular Seal
    const sealX = canvas.width / 2;
    const sealY = 465;
    const radius = 46;

    ctx.save();
    // Radiant Amber Shadow
    ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
    ctx.shadowBlur = 18;

    // Foil Radial Gradient Fill
    const foilGrad = ctx.createRadialGradient(sealX - 10, sealY - 10, 5, sealX, sealY, radius);
    foilGrad.addColorStop(0, '#fdfbf7');
    foilGrad.addColorStop(0.35, '#f3e5ab');
    foilGrad.addColorStop(0.75, '#d4af37');
    foilGrad.addColorStop(1, '#997a15');
    ctx.fillStyle = foilGrad;

    ctx.beginPath();
    ctx.arc(sealX, sealY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Outer Deep Emerald Stamped Ring
    ctx.strokeStyle = '#0d2b1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, radius - 4, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Beaded Ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(sealX, sealY, radius - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Seal Typography
    ctx.fillStyle = '#0d2b1d';
    ctx.font = '700 9px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NOOR & MAHABBA', sealX, sealY - 14);

    ctx.font = '700 15px Cinzel, serif';
    ctx.fillText('★ 1446 ★', sealX, sealY + 4);

    ctx.font = '600 8.5px Outfit, sans-serif';
    ctx.fillText('HONORS COUNCIL', sealX, sealY + 18);

    // 11. Registry Date & Authenticated Signatures
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // Date (Left)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#4d4635';
    ctx.font = '500 13px Outfit, sans-serif';
    ctx.fillText(`Registry Date: ${today}`, 95, 570);

    ctx.font = '400 11px Outfit, sans-serif';
    ctx.fillStyle = '#99907c';
    ctx.fillText(`Token: NM-${Date.now().toString(36).toUpperCase()}`, 95, 588);

    // Signature (Right)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0d2b1d';
    ctx.font = '700 15px Cinzel, serif';
    ctx.fillText('Shaykh Dr. Tariq Al-Mansoor', canvas.width - 95, 565);

    ctx.fillStyle = '#4d4635';
    ctx.font = '400 12px Outfit, sans-serif';
    ctx.fillText('Chancellor, Academic Council of Seerah Studies', canvas.width - 95, 583);

    // Elegant Gold Signature Hairline
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 340, 545);
    ctx.lineTo(canvas.width - 95, 545);
    ctx.stroke();
  }

  downloadCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    if (window.soundFx) window.soundFx.playClick();
    const link = document.createElement('a');
    link.download = `Noor_Mahabba_Certificate_${this.participantName.replace(/\s+/g, '_')}.png`;
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
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--outline);">
            No participants currently recorded. Complete the Seerah Challenge to establish your honor!
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
      const formattedTime = `${mins > 0 ? mins + 'm ' : ''}${secs < 10 ? '0' : ''}${secs}s`;
      const initials = entry.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${rankBadge}</span></td>
          <td>
            <div class="participant-cell">
              <div class="participant-avatar">${initials}</div>
              <span style="font-weight: 600; color: var(--on-surface); font-family: var(--font-body);">${entry.name}</span>
            </div>
          </td>
          <td><span class="score-pill">${entry.score}%</span></td>
          <td style="color: var(--on-surface-variant); font-variant-numeric: tabular-nums; font-family: var(--font-sans); font-weight: 500;">${formattedTime}</td>
          <td style="color: var(--outline); font-size: 0.825rem;">${entry.date || 'Recent'}</td>
        </tr>
      `;
    }).join('');
  }
}

window.quiz = new QuizEngine();
